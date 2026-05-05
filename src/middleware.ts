import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { VALID_CATEGORY_SLUGS } from "@/lib/categories";
import { VALID_NEIGHBORHOOD_SLUGS } from "@/lib/neighborhoods";

/**
 * Static ES paths (single segment under root) that are NOT category slugs but
 * are valid pages. Anything else single-segment that isn't a category falls
 * through to the catch-all 404.
 */
const STATIC_ES_PATHS = new Set([
  "sobre-nosotros",
  "contacto",
  "terminos",
  "privacidad",
  "buscar",
  "comparar",
  "agentes",
  "barrios",
  "guias",
  "propiedades-en-venta",
  "propiedades-en-alquiler",
]);

/**
 * Dynamic ES path prefixes (first segment) whose 2-segment paths are validated
 * by their own page.tsx with dynamicParams=false. Middleware lets them pass —
 * the page handler returns the right 404.
 */
const DYNAMIC_ES_PREFIXES = new Set([
  "barrios",
  "agentes",
  "propiedades",
  "guias",
]);

/**
 * Static EN paths and prefixes — already return correct 404 via existing
 * dynamicParams=false handlers under /en/**. Middleware skips validation here.
 */

/**
 * Slug used as the rewrite target when a path needs to return HTTP 404.
 * /barrios/[slug] uses dynamicParams=false and serves a real 404 status code
 * for slugs not in generateStaticParams — we exploit that to bypass the
 * status-code bug that affects /[category] and /[category]/[neighborhood].
 */
const FORCE_404_REWRITE = "/barrios/__force-404__";

/**
 * Returns true when the path should NOT be served and middleware should
 * rewrite to FORCE_404_REWRITE (which routes to /barrios/[slug] with an
 * unknown slug, returning a real HTTP 404).
 *
 * Rationale: Next.js 14.2.x emits HTTP 200 when notFound() is called from a
 * page that uses dynamicParams=false combined with a (site) route group whose
 * layout fetches data. The page renders not-found.tsx visually, but the
 * status header stays 200 — Googlebot reads it as a soft 404. Pre-validating
 * the slug at the edge and rewriting to a path where notFound() does emit a
 * real 404 bypasses the bug.
 */
function isInvalidEsPath(pathname: string): boolean {
  // Strip leading slash
  const path = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  if (path === "") return false; // homepage

  const segments = path.split("/");

  // /en/* paths — handled by EN page handlers, skip
  if (segments[0] === "en") return false;

  // /studio/* — Sanity Studio
  if (segments[0] === "studio") return false;

  // /api/* — handled by route handlers (matcher already excludes most, but be safe)
  if (segments[0] === "api") return false;

  if (segments.length === 1) {
    // /[X] — must be a category slug or known static page
    const seg0 = segments[0];
    if (STATIC_ES_PATHS.has(seg0)) return false;
    if (VALID_CATEGORY_SLUGS.has(seg0)) return false;
    if (DYNAMIC_ES_PREFIXES.has(seg0)) return false;
    return true; // unknown single-segment path → 404
  }

  if (segments.length === 2) {
    const [seg0, seg1] = segments;
    // /[category]/[neighborhood] — both segments must be valid
    if (VALID_CATEGORY_SLUGS.has(seg0)) {
      return !VALID_NEIGHBORHOOD_SLUGS.has(seg1);
    }
    // /barrios/[slug], /agentes/[slug], /propiedades/[slug], /guias/[slug]
    // — handler validates, skip middleware check
    if (DYNAMIC_ES_PREFIXES.has(seg0)) return false;
    // Anything else 2-segment under root that doesn't match → 404
    return true;
  }

  // 3+ segments under root — Next.js will return 404 naturally (no matching route)
  return false;
}

/**
 * Sets `x-pathname` on every request so server components (notably the root
 * layout) can read the request URL via `headers()` and pick the right locale.
 *
 * Also intercepts invalid ES root-level slugs (P0-06 hardening) and rewrites
 * to /_force-not-found to ensure HTTP 404 status code is emitted.
 */
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (isInvalidEsPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = FORCE_404_REWRITE;
    return NextResponse.rewrite(url);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  // Skip Next.js internals + static files. Run on every page route.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)"],
};
