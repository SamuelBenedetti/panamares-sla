/**
 * One-shot migration: decode HTML entities in existing Sanity property docs.
 *
 * Why this exists
 * ───────────────
 * PR #56 added `decodeHtmlEntities` to `scripts/sync-wasi.mjs` so future
 * Wasi-sourced text gets decoded at create-time. But `title` and
 * `descriptionI18n` are in HUMAN_FIELDS (Sanity-owned after seed), so the
 * regular sync deliberately won't patch them — Igor's edits would be
 * clobbered. That leaves a handful of pre-existing docs with literal
 * `&ndash;` (and possibly other entities) baked into their copy.
 *
 * This script does the cleanup, scoped to the entity-decoding fix only.
 * It is intentionally a one-shot: not part of the cron, not part of the sync.
 *
 * Run
 * ───
 *   node scripts/migrate-html-entities.mjs           # dry-run (default)
 *   node scripts/migrate-html-entities.mjs --apply   # commit changes
 *
 * Behavior
 * ────────
 *   • Scans ALL property docs (published + drafts) — defensive, not just the
 *     4 known. `title` (string) and `descriptionI18n[].value` (Portable Text
 *     blocks) are decoded per-span. Structure preserved.
 *   • Idempotent: decoded text has no `&xxx;` sequences, so re-runs are no-ops.
 *   • Pre-flight asserts dataset === "production" or "staging". Bails otherwise.
 *   • `--apply` is the only confirmation gate (no interactive prompt).
 *   • Token: read from `.env.local` via dotenv.
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { decodeHtmlEntities } from "./lib/decode-html-entities.mjs";

config({ path: ".env.local" });

const APPLY = process.argv.includes("--apply");

// ── Pre-flight ────────────────────────────────────────────────────────────────

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "2hojajwk";
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET   ?? "production";
const token     = process.env.SANITY_WRITE_TOKEN ?? process.env.SANITY_TOKEN;

if (dataset !== "production" && dataset !== "staging") {
  console.error(
    `[migrate] Unexpected Sanity dataset: "${dataset}". Refusing to run — set NEXT_PUBLIC_SANITY_DATASET explicitly.`
  );
  process.exit(1);
}

if (APPLY && !token) {
  console.error(
    "[migrate] --apply requires SANITY_WRITE_TOKEN (or SANITY_TOKEN) in .env.local with write access."
  );
  process.exit(1);
}

const sanity = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2023-01-01",
  useCdn: false,
});

console.log(
  `[migrate] projectId=${projectId} dataset=${dataset} mode=${APPLY ? "APPLY" : "dry-run"}`
);

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Walk a Portable Text array and apply `decodeHtmlEntities` to every span's
 * text. Returns a new array (deep-cloned) so the original is untouched, plus
 * a counter of how many entity replacements happened.
 *
 * Defensive: tolerates non-block entries (custom types) and missing children
 * by leaving them untouched.
 */
function decodePortableText(blocks) {
  if (!Array.isArray(blocks)) return { value: blocks, decoded: 0 };
  let decoded = 0;
  const next = blocks.map((block) => {
    if (!block || block._type !== "block" || !Array.isArray(block.children)) {
      return block;
    }
    const children = block.children.map((child) => {
      if (!child || child._type !== "span" || typeof child.text !== "string") {
        return child;
      }
      const newText = decodeHtmlEntities(child.text);
      if (newText !== child.text) {
        decoded += countEntityInstances(child.text);
      }
      return newText === child.text ? child : { ...child, text: newText };
    });
    return { ...block, children };
  });
  return { value: next, decoded };
}

/**
 * Count `&xxx;` instances in a string. Used for reporting only — counts
 * occurrences in the *original* text (pre-decode), so the dry-run log shows
 * "N entities decoded" matching what an eyeball scan would expect.
 *
 * Matches the same shape `decodeHtmlEntities` recognizes: named, hex numeric,
 * decimal numeric. Unknown named entities are still counted because the
 * decoder *would* attempt them (and leave intact if unknown — but for a
 * report, presence is what matters).
 */
function countEntityInstances(s) {
  if (!s) return 0;
  const named = s.match(/&[a-zA-Z][a-zA-Z0-9]*;/g) ?? [];
  const hex   = s.match(/&#[xX][0-9a-fA-F]+;/g) ?? [];
  const dec   = s.match(/&#\d+;/g) ?? [];
  // Filter named to only those the decoder knows — otherwise we over-report
  // by counting decoder-no-ops.
  const knownNamed = named.filter((m) => {
    const name = m.slice(1, -1).toLowerCase();
    return KNOWN_ENTITY_NAMES.has(name);
  });
  return knownNamed.length + hex.length + dec.length;
}

// Mirror of HTML_ENTITIES keys — kept inline to avoid exporting internals.
// If the source map grows, this set falls out of date and we'd under-count;
// safe failure mode (report shows fewer than actual, never more). The decode
// itself is unaffected because it imports directly from the lib module.
const KNOWN_ENTITY_NAMES = new Set([
  "ntilde", "aacute", "eacute", "iacute", "oacute", "uacute", "uuml",
  "amp", "lt", "gt", "quot", "apos", "nbsp",
  "ndash", "mdash", "hellip", "laquo", "raquo",
  "lsquo", "rsquo", "ldquo", "rdquo",
  "copy", "reg", "trade",
  "sup2", "sup3", "frac12", "frac14", "frac34",
  "deg", "times", "divide", "plusmn",
  "micro", "middot", "bull",
]);

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Fetch published + drafts. Sanity returns drafts under `drafts.<id>`; the
  // standard query picks up both when token has read access. We pin the
  // shape to just the fields we need.
  const docs = await sanity.fetch(
    `*[_type == "property"]{
      _id,
      _rev,
      title,
      descriptionI18n
    }`
  );

  console.log(`[migrate] Scanning ${docs.length} property docs (published + drafts)...\n`);

  const changes = [];
  let totalEntities = 0;

  for (const doc of docs) {
    const fieldChanges = [];
    let docEntityCount = 0;
    const patch = {};

    // ── title (plain string) ──
    if (typeof doc.title === "string") {
      const newTitle = decodeHtmlEntities(doc.title);
      if (newTitle !== doc.title) {
        const n = countEntityInstances(doc.title);
        fieldChanges.push(`title: ${n} entit${n === 1 ? "y" : "ies"}`);
        docEntityCount += n;
        patch.title = newTitle;
      }
    }

    // ── descriptionI18n (array of {_key, value: PortableText}) ──
    if (Array.isArray(doc.descriptionI18n)) {
      const newI18n = [];
      let i18nChanged = false;
      for (const entry of doc.descriptionI18n) {
        if (!entry || typeof entry !== "object") {
          newI18n.push(entry);
          continue;
        }
        const { value, decoded } = decodePortableText(entry.value);
        if (decoded > 0) {
          i18nChanged = true;
          fieldChanges.push(`descriptionI18n[${entry._key}]: ${decoded} entit${decoded === 1 ? "y" : "ies"}`);
          docEntityCount += decoded;
          newI18n.push({ ...entry, value });
        } else {
          newI18n.push(entry);
        }
      }
      if (i18nChanged) {
        patch.descriptionI18n = newI18n;
      }
    }

    if (fieldChanges.length > 0) {
      changes.push({ _id: doc._id, fieldChanges, docEntityCount, patch });
      totalEntities += docEntityCount;
    }
  }

  // ── Report ──
  if (changes.length === 0) {
    console.log("[migrate] No docs need fixing — nothing to do.\n");
    return;
  }

  console.log(`[migrate] ${changes.length} doc${changes.length === 1 ? "" : "s"} need${changes.length === 1 ? "s" : ""} fixing:\n`);
  for (const c of changes) {
    console.log(`  • ${c._id}`);
    for (const f of c.fieldChanges) {
      console.log(`      - ${f}`);
    }
  }
  console.log("");
  console.log(`[migrate] Summary: ${changes.length} doc${changes.length === 1 ? "" : "s"}, ${totalEntities} total entit${totalEntities === 1 ? "y" : "ies"} to decode.\n`);

  if (!APPLY) {
    console.log("[migrate] Dry-run. Re-run with --apply to commit.\n");
    return;
  }

  // ── Apply ──
  console.log("[migrate] Applying patches...\n");
  let fixed = 0;
  for (const c of changes) {
    try {
      await sanity.patch(c._id).set(c.patch).commit();
      console.log(`  ✓ Fixed ${c._id} (${c.docEntityCount} entit${c.docEntityCount === 1 ? "y" : "ies"} decoded across ${c.fieldChanges.length} field${c.fieldChanges.length === 1 ? "" : "s"})`);
      fixed += 1;
    } catch (err) {
      console.error(`  ✗ Failed ${c._id}: ${err.message}`);
    }
  }
  console.log("");
  console.log(`[migrate] Done. ${fixed}/${changes.length} doc${changes.length === 1 ? "" : "s"} fixed, ${totalEntities} total entit${totalEntities === 1 ? "y" : "ies"} decoded.\n`);
}

main().catch((err) => {
  console.error("[migrate] Fatal:", err);
  process.exit(1);
});
