// URL helpers for ES ↔ EN. Used by hreflang generation and the language switcher
// in PR3. The slug map below pairs every static ES path with its EN counterpart.
//
// Dynamic routes (`/propiedades/[slug]`, `/barrios/[slug]`, `/agentes/[slug]`,
// `/guias/[slug]`) keep their slug across locales; only the route prefix
// changes (e.g. `/propiedades/abc` → `/en/properties/abc`).
//
// Geo-type pages (`/<category>/<neighborhood>`) keep the neighborhood slug
// across locales and translate the category segment via the static slug map
// (`/apartamentos-en-venta/punta-pacifica` ↔ `/en/apartments-for-sale/punta-pacifica`).

import type { Locale } from "./copy/types";

export const DEFAULT_LOCALE: Locale = "es";

/** Static slug equivalents — ES path → EN path. */
export const SLUG_MAP_ES_TO_EN: Record<string, string> = {
  "/": "/en",
  "/sobre-nosotros": "/en/about",
  "/contacto": "/en/contact",
  "/terminos": "/en/terms",
  "/privacidad": "/en/privacy",
  "/barrios": "/en/neighborhoods",
  "/agentes": "/en/agents",
  "/propiedades-en-venta": "/en/properties-for-sale",
  "/propiedades-en-alquiler": "/en/properties-for-rent",
  "/buscar": "/en/search",
  "/apartamentos-en-venta": "/en/apartments-for-sale",
  "/apartamentos-en-alquiler": "/en/apartments-for-rent",
  "/casas-en-venta": "/en/houses-for-sale",
  "/casas-en-alquiler": "/en/houses-for-rent",
  "/penthouses-en-venta": "/en/penthouses-for-sale",
  "/penthouses-en-alquiler": "/en/penthouses-for-rent",
  "/apartaestudios-en-venta": "/en/studios-for-sale",
  "/oficinas-en-venta": "/en/offices-for-sale",
  "/oficinas-en-alquiler": "/en/offices-for-rent",
  "/locales-comerciales-en-venta": "/en/commercial-for-sale",
  "/locales-comerciales-en-alquiler": "/en/commercial-for-rent",
  "/terrenos-en-venta": "/en/land-for-sale",
  "/terrenos-en-alquiler": "/en/land-for-rent",
  "/casas-de-playa-en-venta": "/en/beach-houses-for-sale",
  "/casas-de-playa-en-alquiler": "/en/beach-houses-for-rent",
  "/edificios-en-venta": "/en/buildings-for-sale",
  "/fincas-en-venta": "/en/farms-for-sale",
  "/lotes-comerciales-en-venta": "/en/commercial-lots-for-sale",
};

/** Reverse map: EN path → ES path. Built at module load. */
export const SLUG_MAP_EN_TO_ES: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_MAP_ES_TO_EN).map(([es, en]) => [en, es]),
);

/** Strip a trailing slash unless the path is the root. */
function stripTrailingSlash(p: string): string {
  if (p === "/" || p === "/en" || p === "/en/") return p;
  return p.replace(/\/$/, "");
}

/**
 * Returns the EN equivalent for an ES path. Falls back to `null` if the path
 * isn't in the static slug map and isn't a recognised dynamic route.
 *
 * Dynamic routes:
 *   /propiedades/<slug> → /en/properties/<slug>
 *   /barrios/<slug>     → /en/neighborhoods/<slug>
 *   /agentes/<slug>     → /en/agents/<slug>
 *   /guias/<slug>       → /en/guides/<slug>
 */
export function getEnUrl(esPath: string): string | null {
  const path = stripTrailingSlash(esPath);

  if (SLUG_MAP_ES_TO_EN[path] !== undefined) {
    return SLUG_MAP_ES_TO_EN[path];
  }

  // Dynamic routes
  const propiedad = path.match(/^\/propiedades\/([^/]+)$/);
  if (propiedad) return `/en/properties/${propiedad[1]}`;

  const barrio = path.match(/^\/barrios\/([^/]+)$/);
  if (barrio) return `/en/neighborhoods/${barrio[1]}`;

  const agente = path.match(/^\/agentes\/([^/]+)$/);
  if (agente) return `/en/agents/${agente[1]}`;

  const guia = path.match(/^\/guias\/([^/]+)$/);
  if (guia) return `/en/guides/${guia[1]}`;

  // Geo-type: /<es-cat>/<nbh> → /en/<en-cat>/<nbh> when the category has an
  // EN counterpart in the static slug map. Neighborhood slug carries over.
  const geo = path.match(/^\/([^/]+)\/([^/]+)$/);
  if (geo) {
    const enCat = SLUG_MAP_ES_TO_EN[`/${geo[1]}`];
    if (enCat) return `${enCat}/${geo[2]}`;
  }

  return null;
}

/**
 * Returns the ES equivalent for an EN path. Falls back to `null` if the path
 * isn't in the static slug map and isn't a recognised dynamic route.
 */
export function getEsUrl(enPath: string): string | null {
  const path = stripTrailingSlash(enPath);

  if (SLUG_MAP_EN_TO_ES[path] !== undefined) {
    return SLUG_MAP_EN_TO_ES[path];
  }

  const property = path.match(/^\/en\/properties\/([^/]+)$/);
  if (property) return `/propiedades/${property[1]}`;

  const neighborhood = path.match(/^\/en\/neighborhoods\/([^/]+)$/);
  if (neighborhood) return `/barrios/${neighborhood[1]}`;

  const agent = path.match(/^\/en\/agents\/([^/]+)$/);
  if (agent) return `/agentes/${agent[1]}`;

  const guide = path.match(/^\/en\/guides\/([^/]+)$/);
  if (guide) return `/guias/${guide[1]}`;

  // Geo-type: /en/<en-cat>/<nbh> → /<es-cat>/<nbh> via the reverse slug map.
  const geo = path.match(/^\/en\/([^/]+)\/([^/]+)$/);
  if (geo) {
    const esCat = SLUG_MAP_EN_TO_ES[`/en/${geo[1]}`];
    if (esCat) return `${esCat}/${geo[2]}`;
  }

  return null;
}

/**
 * Per-token map for Spanish ↔ English property leaf slugs.
 *
 * Used by `deriveEnSlug()` / `deriveEsSlugFromEn()` to translate the
 * type-and-transaction prefix of a property slug (e.g. `penthouses-en-venta` →
 * `penthouses-for-sale`) without touching the proper-noun tail (the
 * neighborhood + Wasi numeric ID).
 *
 * Source of truth: this file. The runtime test (`scripts/test-derive-en-slug.mjs`)
 * and the production-slug audit (`scripts/audit-derived-slugs.mjs`) read the
 * literal below from this file as text and re-parse it — DO NOT duplicate the
 * map in the scripts. Add a token here and the scripts pick it up.
 *
 * Token boundary rules (enforced in `deriveEnSlug`):
 *   - A token matches when it is at the start of the slug or preceded by `-`,
 *     AND at the end of the slug or followed by `-`.
 *   - Multi-word tokens (containing `-`) are matched first because they are
 *     more specific. The replacement loop sorts keys longest-first.
 *   - `en-venta` is a token; bare `en` is NOT — we must not rewrite "Coronado"
 *     URLs that contain `-en-` as a connector.
 */
const PROPERTY_SLUG_TOKEN_MAP: Record<string, string> = {
  // Multi-word tokens (must match before single-word ones).
  "locales-comerciales": "commercial-spaces",
  "casas-de-playa": "beach-houses",
  // Type tokens.
  apartamentos: "apartments",
  apartaestudios: "studios",
  casas: "houses",
  penthouses: "penthouses",
  oficinas: "offices",
  terrenos: "land",
  fincas: "farms",
  // Transaction tokens.
  "en-venta": "for-sale",
  "en-alquiler": "for-rent",
};

/** Reverse map for `deriveEsSlugFromEn`. Built once at module load. */
const PROPERTY_SLUG_TOKEN_MAP_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(PROPERTY_SLUG_TOKEN_MAP).map(([es, en]) => [en, es]),
);

/**
 * Apply a token map to a hyphen-separated slug using boundary-anchored,
 * longest-first replacement. Pure function — no Sanity reads, no side effects.
 *
 * Algorithm:
 *   1. Sort the token-map keys longest-first.
 *   2. For each key, build a regex that matches the token only at a slug
 *      boundary: `(^|-)<token>(-|$)`. The capture groups are restored in the
 *      replacement to avoid eating adjacent hyphens.
 *   3. Apply replacements sequentially. A key matches at most once per pass
 *      (with /g) but consumes its boundary, so subsequent keys can still match
 *      the rest of the slug.
 *
 * Idempotent: applying the same map twice produces the same result, because
 * the source tokens (e.g. `en-venta`) are not present after the first pass.
 */
function applyTokenMap(slug: string, map: Record<string, string>): string {
  let result = slug;
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const fromToken of sortedKeys) {
    const toToken = map[fromToken];
    // Escape hyphens defensively even though they have no regex meaning here —
    // future-proofs the function against tokens with regex metacharacters.
    const escaped = fromToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(^|-)${escaped}(-|$)`, "g");
    result = result.replace(re, `$1${toToken}$2`);
  }
  return result;
}

/**
 * Derive an English property leaf slug from a Spanish one.
 *
 * Examples:
 *   "penthouses-en-venta-punta-pacifica-9917253"    → "penthouses-for-sale-punta-pacifica-9917253"
 *   "apartamentos-en-alquiler-coco-del-mar-7190716" → "apartments-for-rent-coco-del-mar-7190716"
 *   "locales-comerciales-en-venta-albrook-9285570"  → "commercial-spaces-for-sale-albrook-9285570"
 *   "casa-vista-mar-9999999"                        → "casa-vista-mar-9999999"  (identity — no mappable tokens)
 *
 * Notes:
 *   - Read-time only. Does NOT write to Sanity. The Wasi sync still pushes ES
 *     slugs as canonical; this helper renders the EN form on the EN side at
 *     request time.
 *   - Idempotent: `deriveEnSlug(deriveEnSlug(x)) === deriveEnSlug(x)`.
 *   - Slugs with no mappable tokens pass through unchanged (identity). Track
 *     these via `scripts/audit-derived-slugs.mjs`; if the unmappable rate
 *     exceeds 5 % we will add a `slugEnOverride` field on the property doc.
 */
export function deriveEnSlug(esSlug: string): string {
  return applyTokenMap(esSlug, PROPERTY_SLUG_TOKEN_MAP);
}

/**
 * Reverse of `deriveEnSlug`. Used by the EN route handler to look up the
 * canonical Sanity document (Sanity stores the ES slug) when the user hit an
 * EN-form URL. For slugs with no mappable EN tokens, this is identity.
 */
export function deriveEsSlugFromEn(enSlug: string): string {
  return applyTokenMap(enSlug, PROPERTY_SLUG_TOKEN_MAP_REVERSE);
}

/**
 * Localize a property `condition` field for display.
 *
 * Sanity stores `condition` as a Spanish enum (`"nuevo" | "usado"`). The
 * detail page renders it in an `uppercase` span, so unmapped values fall
 * through unchanged (uppercased by CSS). PR-H added EN mappings so the
 * EN side renders "NEW" / "USED" instead of "NUEVO" / "USADO".
 *
 * Lives here (not in the copy bundle) because the mapping is data-side
 * normalization, not user-text translation. Keep both arms aligned with
 * the Sanity enum if it grows (`schemas/property.ts`).
 */
const CONDITION_LABEL_MAP: Record<string, { es: string; en: string }> = {
  nuevo: { es: "NUEVO", en: "NEW" },
  usado: { es: "USADO", en: "USED" },
};

export function localizeConditionLabel(
  condition: string | undefined | null,
  locale: Locale,
): string {
  if (!condition) return "";
  const entry = CONDITION_LABEL_MAP[condition.toLowerCase()];
  if (!entry) return condition; // unknown value — let CSS uppercase handle it
  return entry[locale];
}

/** Detect locale from a pathname. Anything starting with `/en` is EN, else ES. */
export function getLocaleFromPath(path: string): Locale {
  return path === "/en" || path.startsWith("/en/") ? "en" : "es";
}

/**
 * Returns the locale-aware version of an ES-canonical path.
 * `localePath("/contacto/", "es")` → `"/contacto/"`
 * `localePath("/contacto/", "en")` → `"/en/contact/"`
 *
 * Used by Navbar, Footer, links inside shared components so the same component
 * code can render correct hrefs for either locale. Falls back to the original
 * path when there is no EN equivalent (rare — log if it happens).
 *
 * Trailing slashes on the input are preserved on the output.
 */
export function localePath(esPath: string, locale: Locale): string {
  if (locale === "es") return esPath;
  const hadTrailing = esPath.endsWith("/") && esPath !== "/";
  const stripped = hadTrailing ? esPath.replace(/\/$/, "") : esPath;
  const en = getEnUrl(stripped);
  if (en === null) return esPath;
  return hadTrailing ? `${en}/` : en;
}
