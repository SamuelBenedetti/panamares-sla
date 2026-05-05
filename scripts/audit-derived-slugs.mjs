/**
 * PR-F: production-slug audit. Pulls every active property slug from Sanity,
 * runs `deriveEnSlug` against it, and asserts:
 *
 *   1. No derived slug contains BOTH a Spanish source token AND an English
 *      target token (would mean the regex bug — partial replacement).
 *   2. Round-trip: deriveEsSlugFromEn(deriveEnSlug(s)) === s for every slug.
 *
 * Also reports the unmappable-slug rate (slugs with no source tokens — derived
 * == ES). If this exceeds 5 %, surface a TODO to add a `slugEnOverride`
 * field on the property doc (per PR-F spec, out-of-scope for this PR).
 *
 * Run:
 *   node scripts/audit-derived-slugs.mjs
 *
 * Exits non-zero if any double-language slug or round-trip mismatch is found.
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const I18N_PATH = join(REPO_ROOT, "src", "lib", "i18n.ts");

// ── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(REPO_ROOT, ".env.local");
  if (!existsSync(envPath)) {
    console.error(`[audit-derived-slugs] Missing ${envPath}`);
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
  console.error("[audit-derived-slugs] Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ── Mirror the helper from src/lib/i18n.ts ───────────────────────────────────
function loadTokenMap() {
  const src = readFileSync(I18N_PATH, "utf8");
  const m = src.match(
    /const\s+PROPERTY_SLUG_TOKEN_MAP\s*:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\n\};/,
  );
  if (!m) {
    console.error("[audit-derived-slugs] Could not parse PROPERTY_SLUG_TOKEN_MAP from src/lib/i18n.ts.");
    process.exit(1);
  }
  const body = m[1];
  const map = {};
  const lineRe = /(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:\s*"([^"]+)"/g;
  for (const lm of body.matchAll(lineRe)) {
    const key = lm[1] ?? lm[2];
    map[key] = lm[3];
  }
  return map;
}

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

const ES_TO_EN = loadTokenMap();
const EN_TO_ES = Object.fromEntries(Object.entries(ES_TO_EN).map(([k, v]) => [v, k]));
const deriveEnSlug = (s) => applyTokenMap(s, ES_TO_EN);
const deriveEsSlugFromEn = (s) => applyTokenMap(s, EN_TO_ES);

// ── Pull slugs from Sanity ────────────────────────────────────────────────────
const slugs = await client.fetch(
  `*[_type == "property" && defined(slug.current)] { "slug": slug.current }`,
);

console.log(`[audit-derived-slugs] property docs: ${slugs.length}`);

// Strict ES-only tokens: keys whose target value differs from the key. These
// are the tokens that MUST have been replaced after `deriveEnSlug`. Identity
// pairs (e.g. `penthouses → penthouses`) are intentionally excluded — they
// look the same on both sides and would produce false positives.
const ES_ONLY_TOKENS = Object.fromEntries(
  Object.entries(ES_TO_EN).filter(([es, en]) => es !== en),
);

function containsEsOnlyToken(slug) {
  for (const token of Object.keys(ES_ONLY_TOKENS)) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(^|-)${escaped}(-|$)`);
    if (re.test(slug)) return token;
  }
  return null;
}

const partialReplacementSlugs = [];
const roundTripFailures = [];
let unmappableCount = 0;
const unmappableSlugs = [];

for (const { slug } of slugs) {
  const derivedEn = deriveEnSlug(slug);

  // Correctness: the derived EN slug must not contain any ES-only token
  // (identity tokens like `penthouses` are excluded — they're EN already).
  const lingering = containsEsOnlyToken(derivedEn);
  if (lingering) {
    partialReplacementSlugs.push({ es: slug, derived: derivedEn, lingering });
  }

  // Round-trip: ES → derive EN → derive ES → must equal original ES (only
  // for slugs whose ES form contains at least one mappable non-identity token).
  const roundTripped = deriveEsSlugFromEn(derivedEn);
  if (roundTripped !== slug) {
    roundTripFailures.push({ es: slug, derived: derivedEn, roundTripped });
  }

  if (derivedEn === slug) {
    unmappableCount += 1;
    unmappableSlugs.push(slug);
  }
}

const total = slugs.length;
const unmappableRate = total > 0 ? (unmappableCount / total) * 100 : 0;
console.log(
  `[audit-derived-slugs] unmappable (derived === ES, no token replaced): ${unmappableCount} / ${total} (${unmappableRate.toFixed(1)}%)`,
);
if (unmappableSlugs.length > 0 && unmappableSlugs.length <= 20) {
  console.log("[audit-derived-slugs] unmappable slugs:");
  for (const s of unmappableSlugs) console.log(`  - ${s}`);
} else if (unmappableSlugs.length > 20) {
  console.log("[audit-derived-slugs] unmappable slugs (first 20):");
  for (const s of unmappableSlugs.slice(0, 20)) console.log(`  - ${s}`);
}

if (unmappableRate > 5) {
  console.warn(
    `\n[audit-derived-slugs] ⚠ Unmappable rate ${unmappableRate.toFixed(1)}% > 5%.\n` +
      "  Consider adding `slugEnOverride` field on property doc (out of scope for PR-F).\n",
  );
}

if (partialReplacementSlugs.length > 0) {
  console.error(
    `\n[audit-derived-slugs] FAIL — ${partialReplacementSlugs.length} slug(s) with lingering ES-only token after derivation:`,
  );
  for (const d of partialReplacementSlugs) {
    console.error(`  ES:        ${d.es}`);
    console.error(`  Derived:   ${d.derived}`);
    console.error(`  Lingering: ${d.lingering}`);
  }
}

if (roundTripFailures.length > 0) {
  console.error(`\n[audit-derived-slugs] FAIL — ${roundTripFailures.length} round-trip failure(s):`);
  for (const r of roundTripFailures) {
    console.error(`  ES:           ${r.es}`);
    console.error(`  Derived EN:   ${r.derived}`);
    console.error(`  Round-tripped: ${r.roundTripped}`);
  }
}

if (partialReplacementSlugs.length > 0 || roundTripFailures.length > 0) {
  process.exit(1);
}

console.log("[audit-derived-slugs] OK ✓");
