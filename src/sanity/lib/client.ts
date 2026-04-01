import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const isSanityConfigured = Boolean(projectId && projectId !== "placeholder");

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

// Cachea 60 segundos — cambios en Sanity se reflejan en máximo 1 minuto
export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  if (!isSanityConfigured) {
    return [] as unknown as T;
  }
  return client.fetch<T>(query, params ?? {}, { next: { revalidate: 60 } });
}
