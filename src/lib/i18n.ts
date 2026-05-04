// URL helpers for ES ↔ EN. Used by hreflang generation and the language switcher
// in PR3. The slug map below pairs every static ES path with its EN counterpart.
//
// Dynamic routes (`/propiedad/[slug]`, `/barrios/[slug]`, `/agentes/[slug]`) are
// expected to keep their slug across locales; only the route prefix changes.

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
  "/propiedades-en-venta": "/en/for-sale",
  "/propiedades-en-alquiler": "/en/for-rent",
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
 *   /propiedad/<slug>   → /en/property/<slug>
 *   /barrios/<slug>     → /en/neighborhoods/<slug>
 *   /agentes/<slug>     → /en/agents/<slug>
 */
export function getEnUrl(esPath: string): string | null {
  const path = stripTrailingSlash(esPath);

  if (SLUG_MAP_ES_TO_EN[path] !== undefined) {
    return SLUG_MAP_ES_TO_EN[path];
  }

  // Dynamic routes
  const propiedad = path.match(/^\/propiedad\/([^/]+)$/);
  if (propiedad) return `/en/property/${propiedad[1]}`;

  const barrio = path.match(/^\/barrios\/([^/]+)$/);
  if (barrio) return `/en/neighborhoods/${barrio[1]}`;

  const agente = path.match(/^\/agentes\/([^/]+)$/);
  if (agente) return `/en/agents/${agente[1]}`;

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

  const property = path.match(/^\/en\/property\/([^/]+)$/);
  if (property) return `/propiedad/${property[1]}`;

  const neighborhood = path.match(/^\/en\/neighborhoods\/([^/]+)$/);
  if (neighborhood) return `/barrios/${neighborhood[1]}`;

  const agent = path.match(/^\/en\/agents\/([^/]+)$/);
  if (agent) return `/agentes/${agent[1]}`;

  return null;
}

/** Detect locale from a pathname. Anything starting with `/en` is EN, else ES. */
export function getLocaleFromPath(path: string): Locale {
  return path === "/en" || path.startsWith("/en/") ? "en" : "es";
}
