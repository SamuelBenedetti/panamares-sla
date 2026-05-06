/**
 * Backfill ES i18n entries from legacy `title` / `description` fields.
 *
 * Run:           node scripts/backfill-i18n-es.mjs
 * Dry run:       node scripts/backfill-i18n-es.mjs --dry-run
 * Single doc:    node scripts/backfill-i18n-es.mjs --id=wasi-9836183
 *
 * Required env vars (.env.local):
 *   SANITY_WRITE_TOKEN
 *
 * What it does (idempotent):
 *   - For each property doc:
 *       if titleI18n has no entry with _key="es" (or its value is empty)
 *         AND legacy `title` is populated → push { _key: "es", value: title }
 *       same logic for descriptionI18n / description (PortableText)
 *   - Never touches `_key:"en"` entries (Igor's review work).
 *   - Never touches docs that already have non-empty es i18n.
 *
 * Safe to re-run anytime. Cero side effects en docs ya migrados.
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const DRY_RUN   = process.argv.includes("--dry-run");
const SINGLE_ID = process.argv.find(a => a.startsWith("--id="))?.split("=")[1];

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error("\n❌ Missing SANITY_WRITE_TOKEN in .env.local\n");
  process.exit(1);
}

const sanity = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk",
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production",
  token:      process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
  useCdn:     false,
});

function hasNonEmptyEntry(arr, key) {
  if (!Array.isArray(arr)) return false;
  const entry = arr.find(e => e?._key === key);
  if (!entry) return false;
  const v = entry.value;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v))      return v.length > 0;
  return false;
}

function isPortableText(v) {
  return Array.isArray(v) && v.length > 0 && v.every(b => b?._type === "block");
}

async function main() {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Backfill ES i18n  ${DRY_RUN ? "· DRY RUN (no writes)" : ""}${SINGLE_ID ? `  · ID=${SINGLE_ID}` : ""}`);
  console.log(`${"═".repeat(60)}\n`);

  // Skip drafts (drafts.*) — they're work-in-progress in Studio and modifying
  // them would step on Igor/Carlos's active edits. Backfill targets the
  // published version of the catalog, which is what the public site reads.
  const filter = SINGLE_ID
    ? `_type == "property" && _id == "${SINGLE_ID}"`
    : `_type == "property" && !(_id in path("drafts.**"))`;

  const docs = await sanity.fetch(
    `*[${filter}]{ _id, title, titleI18n, description, descriptionI18n }`
  );

  console.log(`📦 ${docs.length} propiedades evaluadas\n`);

  let migratedTitle = 0;
  let migratedDesc  = 0;
  let skipped = 0;
  let noLegacy = 0;
  let failed = 0;

  for (const doc of docs) {
    const patches = {};
    const reasons = [];

    // --- titleI18n[es] ---
    const titleEsExists = hasNonEmptyEntry(doc.titleI18n, "es");
    const hasLegacyTitle = typeof doc.title === "string" && doc.title.trim().length > 0;

    if (!titleEsExists && hasLegacyTitle) {
      const otherEntries = (doc.titleI18n ?? []).filter(e => e?._key !== "es");
      patches.titleI18n = [...otherEntries, { _key: "es", value: doc.title.trim() }];
      reasons.push("title→i18n[es]");
      migratedTitle++;
    }

    // --- descriptionI18n[es] ---
    const descEsExists  = hasNonEmptyEntry(doc.descriptionI18n, "es");
    const hasLegacyDesc = isPortableText(doc.description);

    if (!descEsExists && hasLegacyDesc) {
      const otherEntries = (doc.descriptionI18n ?? []).filter(e => e?._key !== "es");
      patches.descriptionI18n = [...otherEntries, { _key: "es", value: doc.description }];
      reasons.push("description→i18n[es]");
      migratedDesc++;
    }

    const label = `${doc._id.padEnd(28)}`;

    if (Object.keys(patches).length === 0) {
      if (!hasLegacyTitle && !hasLegacyDesc) {
        // Doc nuevo creado post-migración (sin legacy field). Igual no necesita backfill.
        noLegacy++;
      } else {
        skipped++;
      }
      console.log(`${label} ⏭  ${titleEsExists ? "title✓" : "—"}  ${descEsExists ? "desc✓" : "—"}`);
      continue;
    }

    try {
      if (!DRY_RUN) {
        await sanity.patch(doc._id).set(patches).commit({ visibility: "async" });
      }
      console.log(`${label} ✨ ${reasons.join(", ")}`);
    } catch (err) {
      console.log(`${label} ✗  ${err.message.slice(0, 60)}`);
      failed++;
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  if (DRY_RUN) console.log("  (DRY RUN — nothing was written)");
  console.log(`  ✨ Title migrated:        ${migratedTitle}`);
  console.log(`  ✨ Description migrated:  ${migratedDesc}`);
  console.log(`  ⏭  Already migrated:      ${skipped}`);
  console.log(`  ⏭  No legacy data:        ${noLegacy}`);
  console.log(`  ❌ Failed:                ${failed}`);
  console.log(`${"─".repeat(60)}\n`);
}

main().catch(err => {
  console.error("\n💥 Fatal:", err.message);
  process.exit(1);
});
