/**
 * PR-J · Step 3 — Apply EN translations to Sanity property docs.
 *
 * Run:
 *   node scripts/apply-property-en-translations.mjs           # dry-run (default)
 *   node scripts/apply-property-en-translations.mjs --write   # commit changes
 *
 * What it does
 * ────────────
 * Reads `tasks/property-en-translations.json` (produced by the agent's
 * translation step) and patches each property doc in Sanity with EN entries
 * for `titleI18n` and/or `descriptionI18n`.
 *
 * Safety / idempotency
 * ────────────────────
 * - Default mode is dry-run. Pass `--write` only after reviewing the diff log.
 * - Before patching, fetches the current doc and **re-checks** whether
 *   `titleI18n.en` or `descriptionI18n.en` already has content. If so, that
 *   field is skipped for that property. Re-running --write after a successful
 *   apply produces 0 patches.
 * - **NEVER touches `humanReviewed`.** Stays at whatever value Sanity has
 *   (which is `false` after PR-C). Only Igor flips it after his review.
 * - Preserves any existing language entries (e.g. `es`) on the i18n arrays
 *   when patching — we only add/replace the `en` entry.
 * - PortableText structure is taken as-is from the JSON; we preserve the same
 *   `_key`/`_type`/`marks`/`markDefs`/`style` fields the snapshot had.
 *
 * Auth
 * ────
 * Requires SANITY_TOKEN or SANITY_WRITE_TOKEN with write access. Read from
 * `.env.local`. Dry-run does not require a token (read-only API).
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
    console.error(`\n[apply] Missing ${envPath}\n`);
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
const token = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_TOKEN;

if (!projectId) {
  console.error("[apply] Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}

// ── Args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isWrite = args.includes("--write");

if (isWrite && !token) {
  console.error(
    "[apply] --write requires SANITY_WRITE_TOKEN or SANITY_TOKEN in .env.local (write access)."
  );
  process.exit(1);
}

console.log(
  `[apply] projectId=${projectId} dataset=${dataset} mode=${isWrite ? "WRITE" : "dry-run"}\n`
);

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-07",
  token: isWrite ? token : undefined,
  useCdn: false,
});

// ── Helpers ──────────────────────────────────────────────────────────────────
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

function preview(s, max = 80) {
  if (typeof s !== "string") return String(s);
  if (s.length <= max) return s;
  return s.slice(0, max) + "…";
}

function previewBlocks(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return "(empty)";
  const firstSpan = blocks[0]?.children?.[0]?.text;
  return `${blocks.length} blocks · first span: "${preview(firstSpan, 60)}"`;
}

/**
 * Build the patch payload for a single property given the current doc state
 * and the proposed EN values. Returns either `null` (nothing to do) or an
 * object describing the patch.
 *
 * Preserves any existing non-`en` entries on the i18n arrays.
 */
function buildPatch(doc, proposed) {
  const patch = {};
  const skipNotes = [];

  if (typeof proposed.titleEn === "string") {
    const existingEn = findEntry(doc.titleI18n, "en")?.value;
    if (isNonEmptyString(existingEn)) {
      skipNotes.push(`title: already has EN ("${preview(existingEn, 40)}") — skipping`);
    } else {
      const others = (doc.titleI18n ?? []).filter((e) => e?._key !== "en");
      patch.titleI18n = [
        ...others,
        {
          _key: "en",
          _type: "internationalizedArrayStringValue",
          value: proposed.titleEn,
        },
      ];
    }
  }

  if (Array.isArray(proposed.descriptionEn)) {
    const existingEn = findEntry(doc.descriptionI18n, "en")?.value;
    if (isNonEmptyBlocks(existingEn)) {
      skipNotes.push(
        `description: already has EN (${existingEn.length} blocks) — skipping`
      );
    } else {
      const others = (doc.descriptionI18n ?? []).filter((e) => e?._key !== "en");
      patch.descriptionI18n = [
        ...others,
        {
          _key: "en",
          _type: "internationalizedArrayPortableTextValue",
          value: proposed.descriptionEn,
        },
      ];
    }
  }

  if (Object.keys(patch).length === 0) {
    return { patch: null, skipNotes };
  }
  return { patch, skipNotes };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const inputPath = join(REPO_ROOT, "tasks/property-en-translations.json");
  if (!existsSync(inputPath)) {
    console.error(`[apply] Missing input file: ${inputPath}`);
    process.exit(1);
  }
  const proposals = JSON.parse(readFileSync(inputPath, "utf8"));
  console.log(`[apply] Loaded ${proposals.length} translation entries.\n`);

  let willPatch = 0;
  let willSkip = 0;
  let totalSkipNotes = 0;

  for (const proposal of proposals) {
    const doc = await client.fetch(
      `*[_id == $id][0]{ _id, _rev, "slug": slug.current, titleI18n, descriptionI18n, humanReviewed }`,
      { id: proposal.id }
    );
    if (!doc) {
      console.warn(`  ! ${proposal.id}: doc not found in dataset, skipping`);
      willSkip++;
      continue;
    }

    const { patch, skipNotes } = buildPatch(doc, proposal);

    if (skipNotes.length) {
      totalSkipNotes += skipNotes.length;
    }

    if (!patch) {
      console.log(`  - ${doc.slug ?? doc._id}: no changes needed`);
      for (const note of skipNotes) console.log(`      ${note}`);
      willSkip++;
      continue;
    }

    const summary = [];
    if (patch.titleI18n) {
      const en = patch.titleI18n.find((e) => e._key === "en")?.value;
      summary.push(`title.en="${preview(en, 60)}"`);
    }
    if (patch.descriptionI18n) {
      const en = patch.descriptionI18n.find((e) => e._key === "en")?.value;
      summary.push(`description.en=${previewBlocks(en)}`);
    }
    console.log(`  ✓ ${doc.slug ?? doc._id}: ${summary.join(" · ")}`);
    for (const note of skipNotes) console.log(`      ${note}`);

    if (isWrite) {
      // Patch only the fields we computed. humanReviewed is intentionally
      // never set (not part of `patch`).
      await client.patch(doc._id).set(patch).commit({ autoGenerateArrayKeys: false });
    }
    willPatch++;
  }

  console.log("");
  console.log(
    `[apply] ${isWrite ? "Patched" : "Would patch"}: ${willPatch} · No-op: ${willSkip} · Field-level skip notes: ${totalSkipNotes}`
  );
  console.log(
    `[apply] humanReviewed is NEVER touched by this script. (verified: no patch payload in this run includes that key.)`
  );
  if (!isWrite) {
    console.log("[apply] Dry-run complete. Re-run with --write to commit.");
  } else {
    console.log("[apply] Writes committed.");
  }
}

main().catch((err) => {
  console.error("\n[apply] Failed:", err);
  process.exit(1);
});
