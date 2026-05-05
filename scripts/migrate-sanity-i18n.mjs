/**
 * P0-05 Phase 2 PR-A — Sanity i18n migration script.
 *
 * Run:
 *   node scripts/migrate-sanity-i18n.mjs           # dry-run (default, no writes)
 *   node scripts/migrate-sanity-i18n.mjs --write   # commit changes to dataset
 *   node scripts/migrate-sanity-i18n.mjs --write --only=neighborhood
 *   node scripts/migrate-sanity-i18n.mjs --write --slug=punta-pacifica
 *
 * What it does
 * ────────────
 * For every published `neighborhood` document:
 *   - Read ES seoBlock from src/lib/copy/neighborhoods.es.ts (authoritative)
 *   - Read EN seoBlock from src/lib/copy/neighborhoods.en.ts (authoritative)
 *   - Patch the doc to set `seoBlockI18n` as an internationalizedArrayText
 *     with one entry per language { _key, _type, language, value }.
 *   - Set `humanReviewed: false` so EN renders with `noindex` until reviewed.
 *
 * For every published `agent` document:
 *   - Read ES role + bio from src/lib/copy/agentes.es.ts
 *   - Read EN role + bio from src/lib/copy/agentes.en.ts
 *   - Patch `roleI18n` (internationalizedArrayString) and `bioI18n`
 *     (internationalizedArrayPortableText). bio in our copy files is `string`
 *     today — store as a single PortableText block per language (placeholder
 *     when empty).
 *   - Set `humanReviewed: false`.
 *
 * The legacy `seoBlock`, `role`, `bio` fields are NOT removed in this PR (PR-B
 * switches the queries; PR-D removes legacy fields). The field is `hidden`
 * in the schema so editors don't see it.
 *
 * Auth
 * ────
 * Requires SANITY_TOKEN with write access to the dataset. Add to .env.local:
 *   SANITY_TOKEN="sk..."
 *
 * Safety
 * ──────
 * - Default is dry-run. Pass `--write` only after reviewing the diff log.
 * - Run against a NON-production dataset first if available
 *   (NEXT_PUBLIC_SANITY_DATASET=staging or similar). Production runs require
 *   explicit Sam confirmation per PR-A scope.
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { randomBytes } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(REPO_ROOT, ".env.local");
  if (!existsSync(envPath)) {
    console.error(`\n[migrate] Missing ${envPath}\n`);
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
  console.error("[migrate] Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}

// ── Args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isWrite = args.includes("--write");
const onlyArg = args.find((a) => a.startsWith("--only="));
const slugArg = args.find((a) => a.startsWith("--slug="));
const only = onlyArg ? onlyArg.split("=")[1] : null; // "neighborhood" | "agent"
const slugFilter = slugArg ? slugArg.split("=")[1] : null;

if (isWrite && !token) {
  console.error(
    "[migrate] --write requires SANITY_TOKEN or SANITY_WRITE_TOKEN in .env.local (write access)."
  );
  process.exit(1);
}

console.log(
  `[migrate] projectId=${projectId} dataset=${dataset} mode=${
    isWrite ? "WRITE" : "dry-run"
  }${only ? ` only=${only}` : ""}${slugFilter ? ` slug=${slugFilter}` : ""}\n`
);

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token: isWrite ? token : undefined,
  useCdn: false,
});

// ── Helpers ──────────────────────────────────────────────────────────────────
const newKey = () => randomBytes(6).toString("hex");

// `sanity-plugin-internationalized-array` requires `_key === language code`
// (e.g. "es", "en"). The Studio editor enforces this; queries and our
// `resolveI18n` helper rely on it. Do NOT use random keys here.
function intlString(entries) {
  return entries
    .filter(([, v]) => typeof v === "string" && v.length > 0)
    .map(([language, value]) => ({
      _key: language,
      _type: "internationalizedArrayStringValue",
      value,
    }));
}

function intlText(entries) {
  return entries
    .filter(([, v]) => typeof v === "string" && v.length > 0)
    .map(([language, value]) => ({
      _key: language,
      _type: "internationalizedArrayTextValue",
      value,
    }));
}

// PortableText i18n value: each language entry holds an array of PT blocks.
// The plugin registers a value type derived from the field name we passed
// in sanity.config.ts (`portableText`) → `internationalizedArrayPortableTextValue`.
function intlPortableText(entries) {
  return entries
    .filter(([, blocks]) => Array.isArray(blocks) && blocks.length > 0)
    .map(([language, blocks]) => ({
      _key: language,
      _type: "internationalizedArrayPortableTextValue",
      value: blocks,
    }));
}

function stringToPortableText(text) {
  if (!text || typeof text !== "string") return [];
  return [
    {
      _key: newKey(),
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: newKey(),
          _type: "span",
          marks: [],
          text,
        },
      ],
    },
  ];
}

// ── Load TS copy files via dynamic import ────────────────────────────────────
// The TS files are simple `export const X = { ... }` records — use `tsx`/ts-node
// would be heavy; instead we use a tiny regex parser scoped to the well-known
// shape generated by `extract-i18n-content.mjs`.
function parseCopyFile(filePath, exportName) {
  const src = readFileSync(filePath, "utf8");
  const start = src.indexOf(`export const ${exportName}`);
  if (start === -1) {
    throw new Error(`[migrate] Could not find export ${exportName} in ${filePath}`);
  }
  const braceStart = src.indexOf("{", start);
  // Walk braces.
  let depth = 0;
  let i = braceStart;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  const body = src.slice(braceStart, i);
  // Wrap as a JSON-ish block. The TS uses double-quoted strings and trailing
  // commas. We strip type annotations and `as const`.
  // Simpler approach: use a vm-style eval inside Function. Safe because we
  // own these files (they're committed code, not user input).
  // eslint-disable-next-line no-new-func
  const fn = new Function(`return (${body});`);
  return fn();
}

const neighborhoodsEs = parseCopyFile(
  join(REPO_ROOT, "src/lib/copy/neighborhoods.es.ts"),
  "neighborhoodsEs"
);
const neighborhoodsEn = parseCopyFile(
  join(REPO_ROOT, "src/lib/copy/neighborhoods.en.ts"),
  "neighborhoodsEn"
);
const agentesEs = parseCopyFile(
  join(REPO_ROOT, "src/lib/copy/agentes.es.ts"),
  "agentesEs"
);
const agentesEn = parseCopyFile(
  join(REPO_ROOT, "src/lib/copy/agentes.en.ts"),
  "agentesEn"
);

console.log(
  `[migrate] Loaded copy: ${Object.keys(neighborhoodsEs).length} neighborhoods (ES), ${
    Object.keys(neighborhoodsEn).length
  } (EN); ${Object.keys(agentesEs).length} agents (ES), ${
    Object.keys(agentesEn).length
  } (EN)`
);

// ── Migrate neighborhoods ────────────────────────────────────────────────────
async function migrateNeighborhoods() {
  console.log("\n[migrate] === neighborhoods ===");
  const docs = await client.fetch(
    `*[_type == "neighborhood" && !(_id in path("drafts.**"))]{ _id, _rev, "slug": slug.current, name, seoBlock, seoBlockI18n, humanReviewed }`
  );
  console.log(`[migrate] Found ${docs.length} neighborhood docs in dataset.`);

  let patched = 0;
  let skipped = 0;
  for (const doc of docs) {
    if (slugFilter && doc.slug !== slugFilter) continue;
    const es =
      neighborhoodsEs[doc.slug]?.seoBlock ??
      doc.seoBlock ??
      "";
    const en = neighborhoodsEn[doc.slug]?.seoBlock ?? "";

    if (!es && !en) {
      console.log(`  - ${doc.slug}: no copy in either lang → skip`);
      skipped++;
      continue;
    }

    const seoBlockI18n = intlText([
      ["es", es],
      ["en", en],
    ]);

    console.log(
      `  ✓ ${doc.slug} → ES ${es.length}c · EN ${en.length}c${
        doc.seoBlockI18n?.length ? " (overwriting existing i18n)" : ""
      }`
    );

    if (isWrite) {
      await client
        .patch(doc._id)
        .set({
          seoBlockI18n,
          humanReviewed:
            typeof doc.humanReviewed === "boolean" ? doc.humanReviewed : false,
        })
        .commit({ autoGenerateArrayKeys: false });
    }
    patched++;
  }
  console.log(
    `[migrate] neighborhoods: patched=${patched}, skipped=${skipped}, total=${docs.length}`
  );
}

// ── Migrate agents ───────────────────────────────────────────────────────────
async function migrateAgents() {
  console.log("\n[migrate] === agents ===");
  const docs = await client.fetch(
    `*[_type == "agent" && !(_id in path("drafts.**"))]{ _id, _rev, "slug": slug.current, name, role, bio, roleI18n, bioI18n, humanReviewed }`
  );
  console.log(`[migrate] Found ${docs.length} agent docs in dataset.`);

  let patched = 0;
  let skipped = 0;
  for (const doc of docs) {
    if (slugFilter && doc.slug !== slugFilter) continue;
    const esRole = agentesEs[doc.slug]?.role ?? doc.role ?? "";
    const enRole = agentesEn[doc.slug]?.role ?? "";
    const esBio = agentesEs[doc.slug]?.bio ?? "";
    const enBio = agentesEn[doc.slug]?.bio ?? "";

    if (!esRole && !enRole && !esBio && !enBio && !doc.bio?.length) {
      console.log(`  - ${doc.slug}: no copy in either lang → skip`);
      skipped++;
      continue;
    }

    const roleI18n = intlString([
      ["es", esRole],
      ["en", enRole],
    ]);

    // Bio: prefer ES PortableText already in Sanity for the ES side; build
    // EN as a simple block from the string copy. If neither exists for a
    // language, omit that entry.
    const bioBlocksEs = doc.bio?.length ? doc.bio : stringToPortableText(esBio);
    const bioBlocksEn = stringToPortableText(enBio);
    const bioI18n = intlPortableText([
      ["es", bioBlocksEs],
      ["en", bioBlocksEn],
    ]);

    console.log(
      `  ✓ ${doc.slug} → role ES "${esRole}" / EN "${enRole}" · bio ES ${bioBlocksEs.length} blocks / EN ${bioBlocksEn.length} blocks`
    );

    if (isWrite) {
      await client
        .patch(doc._id)
        .set({
          roleI18n,
          bioI18n,
          humanReviewed:
            typeof doc.humanReviewed === "boolean" ? doc.humanReviewed : false,
        })
        .commit({ autoGenerateArrayKeys: false });
    }
    patched++;
  }
  console.log(
    `[migrate] agents: patched=${patched}, skipped=${skipped}, total=${docs.length}`
  );
}

// ── Run ──────────────────────────────────────────────────────────────────────
async function main() {
  try {
    if (!only || only === "neighborhood") await migrateNeighborhoods();
    if (!only || only === "agent") await migrateAgents();
    console.log(
      `\n[migrate] Done${isWrite ? " (writes committed)" : " (dry-run; rerun with --write to commit)"}.`
    );
  } catch (err) {
    console.error("\n[migrate] Failed:", err);
    process.exit(1);
  }
}

main();
