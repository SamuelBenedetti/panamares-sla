/**
 * PR-D — Wasi feature catalog seed.
 *
 * Run:
 *   node scripts/seed-features-catalog.mjs           # dry-run (default, no writes)
 *   node scripts/seed-features-catalog.mjs --write   # commit changes to dataset
 *
 * What it does
 * ────────────
 * Reads `src/lib/wasi-features-catalog.ts` (the starter set of features) and
 * upserts one `feature` document per entry in Sanity. Idempotent: each doc is
 * created with `_id: features-{slug}`, so re-runs patch the existing doc
 * instead of creating duplicates.
 *
 * Each feature is written with:
 *   - `name`     — the ES label (used for internal listing in the Studio)
 *   - `slug`     — { current: <slug> }
 *   - `wasiId`   — only when present in the catalog entry
 *   - `category` — "interna" | "externa"
 *   - `labelI18n` — internationalizedArrayString with one entry per language
 *                   ({ _key: "es", _type, value }, { _key: "en", _type, value })
 *
 * `_key === language` (per the internationalized-array plugin contract — same
 * rule as `migrate-sanity-i18n.mjs`).
 *
 * Auth
 * ────
 * Requires SANITY_TOKEN (or SANITY_WRITE_TOKEN) with write access to the
 * dataset. Add to .env.local. `--write` is required to actually patch.
 *
 * Safety
 * ──────
 * - Default is dry-run. Pass `--write` only after reviewing the diff log.
 * - Run against a non-production dataset first when one is available.
 *   Production runs require explicit Sam confirmation (per Phase 2 scope).
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(REPO_ROOT, ".env.local");
  if (!existsSync(envPath)) {
    console.error(`\n[seed-features] Missing ${envPath}\n`);
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
const token = process.env.SANITY_TOKEN ?? process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error("[seed-features] Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}

const args = process.argv.slice(2);
const isWrite = args.includes("--write");

if (isWrite && !token) {
  console.error(
    "[seed-features] --write requires SANITY_TOKEN or SANITY_WRITE_TOKEN in .env.local (write access).",
  );
  process.exit(1);
}

console.log(
  `[seed-features] projectId=${projectId} dataset=${dataset} mode=${
    isWrite ? "WRITE" : "dry-run"
  }\n`,
);

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token: isWrite ? token : undefined,
  useCdn: false,
});

// ── Load catalog from TS file ────────────────────────────────────────────────
// Same approach as migrate-sanity-i18n.mjs — small regex parse of the export
// since the file shape is fully under our control (no user input).
function parseCatalogFile(filePath, exportName) {
  const src = readFileSync(filePath, "utf8");
  const start = src.indexOf(`export const ${exportName}`);
  if (start === -1) {
    throw new Error(`[seed-features] Could not find export ${exportName} in ${filePath}`);
  }
  // Skip past the `=` so we don't catch `[]` from a TS type annotation
  // (e.g. `export const X: WasiFeatureEntry[] = [...]`).
  const eqIdx = src.indexOf("=", start);
  if (eqIdx === -1) {
    throw new Error(`[seed-features] Could not find '=' after export ${exportName}`);
  }
  const bracketStart = src.indexOf("[", eqIdx);
  let depth = 0;
  let i = bracketStart;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  const body = src.slice(bracketStart, i);
  // eslint-disable-next-line no-new-func
  const fn = new Function(`return (${body});`);
  return fn();
}

const catalog = parseCatalogFile(
  join(REPO_ROOT, "src/lib/wasi-features-catalog.ts"),
  "WASI_FEATURES_CATALOG",
);

console.log(`[seed-features] Loaded ${catalog.length} catalog entries.`);

// `sanity-plugin-internationalized-array` requires `_key === language`.
function intlString(entries) {
  return entries
    .filter(([, v]) => typeof v === "string" && v.length > 0)
    .map(([language, value]) => ({
      _key: language,
      _type: "internationalizedArrayStringValue",
      value,
    }));
}

// ── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  let created = 0;
  let patched = 0;
  let skipped = 0;

  for (const entry of catalog) {
    if (!entry.slug) {
      console.log(`  - <missing slug> → skip`);
      skipped++;
      continue;
    }
    const docId = `features-${entry.slug}`;
    const existing = await client.fetch(`*[_id == $id][0]{ _id, _rev }`, { id: docId });

    const labelI18n = intlString([
      ["es", entry.labels?.es],
      ["en", entry.labels?.en],
    ]);

    const docPayload = {
      _id: docId,
      _type: "feature",
      name: entry.labels?.es ?? entry.slug,
      slug: { _type: "slug", current: entry.slug },
      ...(typeof entry.wasiId === "number" && { wasiId: entry.wasiId }),
      category: entry.category,
      labelI18n,
    };

    if (existing) {
      console.log(
        `  ~ patch ${docId} (${entry.category}) → ES="${entry.labels?.es}" / EN="${entry.labels?.en}"`,
      );
      if (isWrite) {
        await client
          .patch(docId)
          .set({
            name: docPayload.name,
            slug: docPayload.slug,
            ...(typeof entry.wasiId === "number" && { wasiId: entry.wasiId }),
            category: entry.category,
            labelI18n,
          })
          .commit({ autoGenerateArrayKeys: false });
      }
      patched++;
    } else {
      console.log(
        `  + create ${docId} (${entry.category}) → ES="${entry.labels?.es}" / EN="${entry.labels?.en}"`,
      );
      if (isWrite) {
        await client.create(docPayload, { autoGenerateArrayKeys: false });
      }
      created++;
    }
  }

  console.log(
    `\n[seed-features] created=${created}, patched=${patched}, skipped=${skipped}, total=${catalog.length}`,
  );
  if (!isWrite) {
    console.log("[seed-features] Dry-run complete. Pass --write to commit.");
  }
}

seed().catch((err) => {
  console.error("[seed-features] FAILED:", err);
  process.exit(1);
});
