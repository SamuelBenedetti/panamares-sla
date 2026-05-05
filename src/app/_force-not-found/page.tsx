import { notFound } from "next/navigation";

/**
 * Internal-only route that immediately throws notFound().
 *
 * Why this exists: middleware.ts rewrites invalid root-level slugs (URLs that
 * would otherwise hit /[category] or /[category]/[neighborhood] and serve a
 * not-found page with HTTP 200) to this path. Calling notFound() here forces
 * Next.js to render the global not-found.tsx with the correct HTTP 404 status.
 */
export default function ForceNotFound(): never {
  notFound();
}
