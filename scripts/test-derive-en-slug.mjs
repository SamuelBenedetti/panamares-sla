/**
 * PR-F: runtime test for `deriveEnSlug` / `deriveEsSlugFromEn`.
 *
 * The repo has no Jest. This script reads the canonical token map from
 * `src/lib/i18n.ts` (single source of truth — DO NOT duplicate the map here)
 * and re-implements the boundary-anchored, longest-first replacement algorithm
 * in plain JS to assert the expected mappings.
 *
 * Run:
 *   node scripts/test-derive-en-slug.mjs
 *
 * Exits non-zero on any failed assertion. Run from CI / before commit.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const I18N_PATH = join(REPO_ROOT, "src", "lib", "i18n.ts");

// ── Parse PROPERTY_SLUG_TOKEN_MAP from the TS source ─────────────────────────
function loadTokenMap() {
  const src = readFileSync(I18N_PATH, "utf8");
  const m = src.match(
    /const\s+PROPERTY_SLUG_TOKEN_MAP\s*:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\n\};/,
  );
  if (!m) {
    console.error(
      "[test-derive-en-slug] Could not locate PROPERTY_SLUG_TOKEN_MAP in src/lib/i18n.ts.\n" +
        "If you renamed it or changed its declaration shape, update the regex above.",
    );
    process.exit(1);
  }
  const body = m[1];
  const map = {};
  // Match `key: "value"` or `"key": "value"` lines (TS allows bare keys when they are
  // valid identifiers; quoted keys are required for hyphenated tokens).
  const lineRe = /(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:\s*"([^"]+)"/g;
  for (const lm of body.matchAll(lineRe)) {
    const key = lm[1] ?? lm[2];
    map[key] = lm[3];
  }
  if (Object.keys(map).length === 0) {
    console.error("[test-derive-en-slug] Parsed token map is empty — regex needs review.");
    process.exit(1);
  }
  return map;
}

// ── Pure-JS reimplementation of `applyTokenMap` ──────────────────────────────
function applyTokenMap(slug, map) {
  let result = slug;
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const fromToken of sortedKeys) {
    const toToken = map[fromToken];
    const escaped = fromToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(^|-)${escaped}(-|$)`, "g");
    result = result.replace(re, `$1${toToken}$2`);
  }
  return result;
}

const PROPERTY_SLUG_TOKEN_MAP = loadTokenMap();
const PROPERTY_SLUG_TOKEN_MAP_REVERSE = Object.fromEntries(
  Object.entries(PROPERTY_SLUG_TOKEN_MAP).map(([es, en]) => [en, es]),
);

const deriveEnSlug = (s) => applyTokenMap(s, PROPERTY_SLUG_TOKEN_MAP);
const deriveEsSlugFromEn = (s) => applyTokenMap(s, PROPERTY_SLUG_TOKEN_MAP_REVERSE);

// ── Assertion table ──────────────────────────────────────────────────────────
const cases = [
  // Canonical type+transaction mappings.
  { fn: "en", in: "penthouses-en-venta-punta-pacifica-9917253",     out: "penthouses-for-sale-punta-pacifica-9917253" },
  { fn: "en", in: "apartamentos-en-alquiler-coco-del-mar-7190716",  out: "apartments-for-rent-coco-del-mar-7190716" },
  { fn: "en", in: "locales-comerciales-en-venta-albrook-9285570",   out: "commercial-spaces-for-sale-albrook-9285570" },
  { fn: "en", in: "casas-de-playa-en-venta-farallon-7196871",       out: "beach-houses-for-sale-farallon-7196871" },
  { fn: "en", in: "oficinas-en-venta-calle-50-7190738",             out: "offices-for-sale-calle-50-7190738" },
  { fn: "en", in: "casas-en-venta-david-7190749",                   out: "houses-for-sale-david-7190749" },
  { fn: "en", in: "apartaestudios-en-venta-bella-vista-7190716",    out: "studios-for-sale-bella-vista-7190716" },
  { fn: "en", in: "terrenos-en-venta-coco-del-mar-7220545",         out: "land-for-sale-coco-del-mar-7220545" },
  { fn: "en", in: "fincas-en-venta-anton-7190723",                  out: "farms-for-sale-anton-7190723" },
  { fn: "en", in: "penthouses-en-alquiler-marbella-9802473",        out: "penthouses-for-rent-marbella-9802473" },

  // Edge cases — proper-noun-only slugs (no mappable tokens, identity transform).
  { fn: "en", in: "casa-vista-mar-9999999",                         out: "casa-vista-mar-9999999" },
  { fn: "en", in: "some-custom-slug-1234",                          out: "some-custom-slug-1234" },

  // Adjacency edge cases — bare `en` is NOT a token; must not be rewritten.
  // "apartamentos-en-coronado-7777" — no `en-venta` / `en-alquiler` token, only `apartamentos` matches.
  { fn: "en", in: "apartamentos-en-coronado-7777",                  out: "apartments-en-coronado-7777" },
  // "casas-en-venta-en-coronado-8888" — `en-venta` must match the type+transaction
  // prefix; the trailing `-en-coronado` substring contains `-en-` as a connector
  // (not the start of `en-venta`/`en-alquiler`), so it stays unchanged.
  { fn: "en", in: "casas-en-venta-en-coronado-8888",                out: "houses-for-sale-en-coronado-8888" },

  // Idempotency — applying again is a no-op (already EN).
  { fn: "en", in: "penthouses-for-sale-punta-pacifica-9917253",     out: "penthouses-for-sale-punta-pacifica-9917253" },
  { fn: "en", in: "apartments-for-rent-coco-del-mar-7190716",       out: "apartments-for-rent-coco-del-mar-7190716" },

  // Reverse derivation.
  { fn: "es", in: "penthouses-for-sale-punta-pacifica-9917253",     out: "penthouses-en-venta-punta-pacifica-9917253" },
  { fn: "es", in: "apartments-for-rent-coco-del-mar-7190716",       out: "apartamentos-en-alquiler-coco-del-mar-7190716" },
  { fn: "es", in: "casa-vista-mar-9999999",                         out: "casa-vista-mar-9999999" },
  { fn: "es", in: "commercial-spaces-for-sale-albrook-9285570",     out: "locales-comerciales-en-venta-albrook-9285570" },
  { fn: "es", in: "beach-houses-for-sale-farallon-7196871",         out: "casas-de-playa-en-venta-farallon-7196871" },

  // Round-trip — derive EN then derive ES → original ES (for slugs with mappable tokens).
  { fn: "rt", in: "penthouses-en-venta-punta-pacifica-9917253",     out: "penthouses-en-venta-punta-pacifica-9917253" },
  { fn: "rt", in: "apartamentos-en-alquiler-coco-del-mar-7190716",  out: "apartamentos-en-alquiler-coco-del-mar-7190716" },
  { fn: "rt", in: "locales-comerciales-en-venta-albrook-9285570",   out: "locales-comerciales-en-venta-albrook-9285570" },
];

let passed = 0;
let failed = 0;
const failures = [];

for (const c of cases) {
  let actual;
  if (c.fn === "en") actual = deriveEnSlug(c.in);
  else if (c.fn === "es") actual = deriveEsSlugFromEn(c.in);
  else if (c.fn === "rt") actual = deriveEsSlugFromEn(deriveEnSlug(c.in));
  else throw new Error(`Unknown fn: ${c.fn}`);

  if (actual === c.out) {
    passed += 1;
  } else {
    failed += 1;
    failures.push({ ...c, actual });
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log(
  `[test-derive-en-slug] map size: ${Object.keys(PROPERTY_SLUG_TOKEN_MAP).length} tokens`,
);
console.log(`[test-derive-en-slug] cases: ${cases.length}, passed: ${passed}, failed: ${failed}`);

if (failed > 0) {
  console.error("\n[test-derive-en-slug] FAILURES:\n");
  for (const f of failures) {
    console.error(`  fn=${f.fn} in="${f.in}"`);
    console.error(`    expected: "${f.out}"`);
    console.error(`    actual:   "${f.actual}"`);
  }
  process.exit(1);
}

console.log("[test-derive-en-slug] OK ✓");
