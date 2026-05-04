import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { CATEGORIES } from "@/lib/categories";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { BASE_URL } from "@/lib/config";
import { SLUG_MAP_ES_TO_EN } from "@/lib/i18n";

interface PropertySlim {
  slug: string;
  propertyType: string;
  businessType: string;
  zone: string | null;
  updatedAt: string;
}

interface AgentSlim {
  slug: string;
  updatedAt: string;
}

interface GuideSlim {
  slug: string;
  updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activeProperties = await sanityFetch<PropertySlim[]>(groq`
    *[_type == "property" && listingStatus == "activa" && noindex != true] {
      "slug": slug.current,
      propertyType,
      businessType,
      "zone": zone,
      "updatedAt": _updatedAt
    }
  `);

  const [agents, guides] = await Promise.all([
    sanityFetch<AgentSlim[]>(groq`
      *[_type == "agent"] { "slug": slug.current, "updatedAt": _updatedAt }
    `),
    sanityFetch<GuideSlim[]>(groq`
      *[_type == "guide"] { "slug": slug.current, "updatedAt": _updatedAt }
    `),
  ]);

  // Build lookup maps for category/geo filtering
  const categoryCountMap = new Map<string, number>();
  const geoTypeCountMap = new Map<string, number>();
  for (const p of activeProperties) {
    const catKey = `${p.propertyType}|${p.businessType}`;
    categoryCountMap.set(catKey, (categoryCountMap.get(catKey) ?? 0) + 1);
    if (p.zone) {
      const geoKey = `${p.propertyType}|${p.businessType}|${p.zone}`;
      geoTypeCountMap.set(geoKey, (geoTypeCountMap.get(geoKey) ?? 0) + 1);
    }
  }

  return [
    // ── Tier 0: Homepage ─────────────────────────────────────────────────────
    { url: BASE_URL, changeFrequency: "daily", priority: 1.0 },

    // ── Tier 1: Intent hubs ──────────────────────────────────────────────────
    { url: `${BASE_URL}/propiedades-en-venta`,    changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/propiedades-en-alquiler`, changeFrequency: "daily", priority: 0.9 },

    // ── Tier 2: Category pages (≥2 listings) ────────────────────────────────
    ...CATEGORIES.flatMap((cat) => {
      const count = categoryCountMap.get(`${cat.propertyType}|${cat.businessType}`) ?? 0;
      if (count < 2) return [];
      return [{ url: `${BASE_URL}/${cat.slug}`, changeFrequency: "daily" as const, priority: 0.85 }];
    }),

    // ── Tier 3: Geo-type pages (≥2 listings) ────────────────────────────────
    ...CATEGORIES.flatMap((cat) =>
      NEIGHBORHOODS.flatMap((nbh) => {
        const count = geoTypeCountMap.get(`${cat.propertyType}|${cat.businessType}|${nbh.name}`) ?? 0;
        if (count < 2) return [];
        return [{ url: `${BASE_URL}/${cat.slug}/${nbh.slug}`, changeFrequency: "daily" as const, priority: 0.8 }];
      })
    ),

    // ── Tier 4: Property listings ────────────────────────────────────────────
    ...activeProperties.map((p) => ({
      url: `${BASE_URL}/propiedades/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // ── Tier 5: Neighborhood guides (≥2 listings) ───────────────────────────
    ...NEIGHBORHOODS.filter((nbh) =>
      activeProperties.filter((p) => p.zone === nbh.name).length >= 2
    ).map((nbh) => ({
      url: `${BASE_URL}/barrios/${nbh.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    // ── Content pages ────────────────────────────────────────────────────────
    { url: `${BASE_URL}/barrios`,       changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/agentes`,       changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE_URL}/guias`,         changeFrequency: "weekly",  priority: 0.65 },
    { url: `${BASE_URL}/sobre-nosotros`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contacto`,      changeFrequency: "monthly", priority: 0.5 },

    // ── Agent profiles (no ?page=N) ──────────────────────────────────────────
    ...agents.map((a) => ({
      url: `${BASE_URL}/agentes/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    // ── Guide articles ───────────────────────────────────────────────────────
    ...guides.map((g) => ({
      url: `${BASE_URL}/guias/${g.slug}`,
      lastModified: new Date(g.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),

    // ── EN locale URLs ───────────────────────────────────────────────────────
    // Only emit EN URLs for routes that actually exist under src/app/en/**.
    // /en/property/[slug] and /en/[category]/[neighborhood] are Phase 2.
    // Guides do not have an EN route yet, so /en/guides/* is omitted.
    { url: `${BASE_URL}/en`, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}${SLUG_MAP_ES_TO_EN["/propiedades-en-venta"]}`,    changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}${SLUG_MAP_ES_TO_EN["/propiedades-en-alquiler"]}`, changeFrequency: "daily", priority: 0.9 },

    // EN category pages — only for ES categories with ≥2 listings AND a known EN slug
    ...CATEGORIES.flatMap((cat) => {
      const count = categoryCountMap.get(`${cat.propertyType}|${cat.businessType}`) ?? 0;
      if (count < 2) return [];
      const enPath = SLUG_MAP_ES_TO_EN[`/${cat.slug}`];
      if (!enPath) return [];
      return [{ url: `${BASE_URL}${enPath}`, changeFrequency: "daily" as const, priority: 0.85 }];
    }),

    // EN neighborhood guides (≥2 listings) — /en/neighborhoods/[slug] route exists
    ...NEIGHBORHOODS.filter((nbh) =>
      activeProperties.filter((p) => p.zone === nbh.name).length >= 2
    ).map((nbh) => ({
      url: `${BASE_URL}/en/neighborhoods/${nbh.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    // EN content pages
    { url: `${BASE_URL}/en/neighborhoods`, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/en/agents`,        changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE_URL}/en/about`,         changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/en/contact`,       changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/en/terms`,         changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/en/privacy`,       changeFrequency: "yearly",  priority: 0.3 },

    // EN agent profiles — /en/agents/[slug] route exists, slug shared with ES
    ...agents.map((a) => ({
      url: `${BASE_URL}/en/agents/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
