import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/**
 * True only when a real Sanity project ID is present.
 * Pages render empty states instead of throwing when Sanity is not yet set up
 * (e.g. a fresh clone without .env.local). In production the env var must be set.
 */
const isSanityConfigured = Boolean(projectId);

export const client = createClient({
  // createClient requires a non-empty string; fall back to a valid placeholder
  // only for local dev without .env.local — production will always have the real ID.
  projectId: projectId ?? "unconfigured",
  dataset,
  apiVersion: "2026-05-07",
  // useCdn:false hits Sanity's API directly instead of the ~30-60 s edge cache.
  // Required because the humanReviewed gate must reflect a publish in seconds:
  // even after revalidateTag("sanity") clears the Next.js fetch cache, a CDN
  // hit would return stale data and the gate would not flip until the CDN
  // edge node refreshed (~60 s). Trade-off: slightly higher per-request
  // latency to Sanity. Acceptable at Panamares traffic; the on-demand
  // revalidation flow keeps user-facing pages cached at the Next.js layer.
  useCdn: false,
});

/**
 * Two-layer freshness model:
 *   1. Tag every query with "sanity" so /api/revalidate can call
 *      revalidateTag("sanity") on a Sanity webhook publish — clears the
 *      cache instantly across the whole catalog.
 *   2. Fallback `revalidate: 60` so even without the webhook (local dev,
 *      misconfigured Sanity webhook, etc.) content goes stale within a
 *      minute. Previously this was 3600 — the comment lied — which made
 *      humanReviewed gate flips invisible for up to an hour.
 */
export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  if (!isSanityConfigured) {
    // Return an empty result rather than crashing during local dev or CI preview
    // builds where NEXT_PUBLIC_SANITY_PROJECT_ID is not set.
    return [] as unknown as T;
  }
  return client.fetch<T>(query, params ?? {}, {
    next: {
      tags: ["sanity"],
      revalidate: 60,
    },
  });
}
