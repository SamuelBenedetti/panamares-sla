/**
 * PR-J · Step 1 — Extract property ES content for translation.
 *
 * Run:
 *   node scripts/extract-property-content-for-translation.mjs
 *
 * What it does
 * ────────────
 * - Connects to Sanity (read-only, public CDN — no token required for published
 *   property docs).
 * - Fetches every published `property` doc with its slug and i18n fields.
 * - Writes `tasks/property-content-to-translate.json` — one entry per property
 *   with the ES title + description plus boolean flags marking whether each
 *   field needs translation (i.e. its EN counterpart is empty).
 *
 * Output shape
 * ────────────
 * [
 *   {
 *     "id": "wasi-9917253",
 *     "slug": "penthouses-en-venta-punta-pacifica-9917253",
 *     "titleEs": "...",
 *     "descriptionEs": [/* PortableText blocks */ /*],
 *     "needsTitleTranslation": true,
 *     "needsDescriptionTranslation": true
 *   }
 * ]
 *
 * Notes
 * ─────
 * - Read-only. No writes. No mutations. Safe to run repeatedly.
 * - Output is committed to the repo as a snapshot for audit.
 * - The translation step itself happens in the agent's context (LLM
 *   translation), not in this script.
 */

import { createClient } from "@sanity/client";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(REPO_ROOT, ".env.local");
  if (!existsSync(envPath)) {
    console.error(`\n[extract] Missing ${envPath}\n`);
    process.exit(1);
  }
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  console.error("[extract] Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}

console.log(`[extract] projectId=${projectId} dataset=${dataset} (read-only)`);

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-07",
  useCdn: false, // bypass CDN — we want the freshest state for the snapshot
});

function findEntry(arr, key) {
  if (!Array.isArray(arr)) return undefined;
  return arr.find((e) => e && e._key === key);
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isNonEmptyBlocks(v) {
  return Array.isArray(v) && v.length > 0;
}

async function main() {
  const docs = await client.fetch(
    `*[_type == "property" && !(_id in path("drafts.**"))]{
      _id,
      "slug": slug.current,
      titleI18n,
      descriptionI18n
    } | order(_id asc)`
  );

  console.log(`[extract] Found ${docs.length} published property docs.`);

  const entries = [];
  let alreadyHasEnTitle = 0;
  let alreadyHasEnDescription = 0;

  for (const doc of docs) {
    const titleEsEntry = findEntry(doc.titleI18n, "es");
    const titleEnEntry = findEntry(doc.titleI18n, "en");
    const descEsEntry = findEntry(doc.descriptionI18n, "es");
    const descEnEntry = findEntry(doc.descriptionI18n, "en");

    const titleEs = isNonEmptyString(titleEsEntry?.value) ? titleEsEntry.value : "";
    const descriptionEs = isNonEmptyBlocks(descEsEntry?.value) ? descEsEntry.value : [];

    const hasEnTitle = isNonEmptyString(titleEnEntry?.value);
    const hasEnDescription = isNonEmptyBlocks(descEnEntry?.value);
    if (hasEnTitle) alreadyHasEnTitle++;
    if (hasEnDescription) alreadyHasEnDescription++;

    entries.push({
      id: doc._id,
      slug: doc.slug ?? null,
      titleEs,
      descriptionEs,
      needsTitleTranslation: !hasEnTitle && isNonEmptyString(titleEs),
      needsDescriptionTranslation: !hasEnDescription && isNonEmptyBlocks(descriptionEs),
    });
  }

  // Stable order: by slug (falls back to id) for diff-friendly snapshots.
  entries.sort((a, b) => {
    const sa = a.slug ?? a.id;
    const sb = b.slug ?? b.id;
    return sa < sb ? -1 : sa > sb ? 1 : 0;
  });

  const tasksDir = join(REPO_ROOT, "tasks");
  if (!existsSync(tasksDir)) mkdirSync(tasksDir, { recursive: true });
  const outPath = join(tasksDir, "property-content-to-translate.json");
  writeFileSync(outPath, JSON.stringify(entries, null, 2) + "\n", "utf8");

  const needsTitle = entries.filter((e) => e.needsTitleTranslation).length;
  const needsDesc = entries.filter((e) => e.needsDescriptionTranslation).length;

  console.log(`[extract] Wrote ${entries.length} entries to ${outPath}`);
  console.log(
    `[extract] needsTitleTranslation=${needsTitle} (already have EN title: ${alreadyHasEnTitle})`
  );
  console.log(
    `[extract] needsDescriptionTranslation=${needsDesc} (already have EN description: ${alreadyHasEnDescription})`
  );
}

main().catch((err) => {
  console.error("\n[extract] Failed:", err);
  process.exit(1);
});
