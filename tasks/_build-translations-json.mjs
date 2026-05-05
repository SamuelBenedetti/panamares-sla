/**
 * PR-J · Step 2b — Build `tasks/property-en-translations.json` from the
 * translations map (`tasks/_translations.mjs`) + the snapshot
 * (`tasks/property-content-to-translate.json`).
 *
 * For each entry in the snapshot:
 *   - If the entry has `needsTitleTranslation === false` AND
 *     `needsDescriptionTranslation === false`, skip entirely (already has EN).
 *   - Else, look up translations[id]:
 *       * If `titleEn` provided → include in output entry.
 *       * If `spansEn` provided → walk the snapshot's descriptionEs blocks/spans
 *         in document-order, replacing only the `text` field of each span with
 *         spansEn[i]. Preserve `_key`, `_type`, `marks`, `markDefs`, `style`,
 *         and any other fields exactly. The total span count MUST match
 *         spansEn.length, or we throw.
 *
 * Run: node tasks/_build-translations-json.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const snapshot = JSON.parse(
  readFileSync(join(REPO_ROOT, "tasks/property-content-to-translate.json"), "utf8")
);

const { translations } = await import("./_translations.mjs");

const output = [];
const errors = [];

for (const entry of snapshot) {
  const skipTitle = !entry.needsTitleTranslation;
  const skipDescription = !entry.needsDescriptionTranslation;
  if (skipTitle && skipDescription) continue;

  const tx = translations[entry.id];
  if (!tx) {
    errors.push(`Missing translation entry for ${entry.id} (${entry.slug})`);
    continue;
  }

  const out = { id: entry.id, slug: entry.slug };

  if (!skipTitle) {
    if (typeof tx.titleEn !== "string" || !tx.titleEn.length) {
      errors.push(`Missing titleEn for ${entry.id} (${entry.slug})`);
    } else {
      out.titleEn = tx.titleEn;
    }
  }

  if (!skipDescription) {
    if (!Array.isArray(tx.spansEn)) {
      errors.push(`Missing spansEn array for ${entry.id} (${entry.slug})`);
    } else {
      // Walk the original ES blocks, build EN copy with only span.text replaced.
      let spanIdx = 0;
      const enBlocks = entry.descriptionEs.map((block) => {
        const newBlock = { ...block };
        if (Array.isArray(block.children)) {
          newBlock.children = block.children.map((span) => {
            const newSpan = { ...span };
            if (span._type === "span") {
              if (spanIdx >= tx.spansEn.length) {
                errors.push(
                  `Span overflow for ${entry.id}: more spans in source than translations (idx=${spanIdx}, len=${tx.spansEn.length})`
                );
                return newSpan;
              }
              newSpan.text = tx.spansEn[spanIdx];
              spanIdx++;
            }
            return newSpan;
          });
        }
        return newBlock;
      });
      if (spanIdx !== tx.spansEn.length) {
        errors.push(
          `Span count mismatch for ${entry.id} (${entry.slug}): source=${spanIdx}, translations=${tx.spansEn.length}`
        );
      }
      out.descriptionEn = enBlocks;
    }
  }

  output.push(out);
}

if (errors.length) {
  console.error("[build] Errors:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

const outPath = join(REPO_ROOT, "tasks/property-en-translations.json");
writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n", "utf8");
console.log(`[build] Wrote ${output.length} entries to ${outPath}`);
console.log(`[build] (skipped ${snapshot.length - output.length} entries that already had EN content for both fields)`);
