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
