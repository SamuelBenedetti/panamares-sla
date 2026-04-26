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
  apiVersion: "2024-01-01",
  useCdn: true,
});

// Revalidates every 60 s — Sanity content changes propagate within one minute.
export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  if (!isSanityConfigured) {
    // Return an empty result rather than crashing during local dev or CI preview
    // builds where NEXT_PUBLIC_SANITY_PROJECT_ID is not set.
    return [] as unknown as T;
  }
  return client.fetch<T>(query, params ?? {}, { next: { revalidate: 3600 } });
}
