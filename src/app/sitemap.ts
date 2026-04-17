import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { CATEGORIES } from "@/lib/categories";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { BASE_URL } from "@/lib/config";

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
  // Fetch all active listings
  const activeProperties: PropertySlim[] = await sanityFetch<PropertySlim[]>(groq`
    *[_type == "property" && listingStatus == "activa"] {
      "slug": slug.current,
      propertyType,
      businessType,
      "zone": zone,
      "updatedAt": _updatedAt
    }
  `);

  const agents: AgentSlim[] = await sanityFetch<AgentSlim[]>(groq`
    *[_type == "agent"] { "slug": slug.current, "updatedAt": _updatedAt }
  `);

  const guides: GuideSlim[] = await sanityFetch<GuideSlim[]>(groq`
    *[_type == "guide"] { "slug": slug.current, "updatedAt": _updatedAt }
  `);

  // Count listings per category (Tier 2)
  const categoryCountMap = new Map<string, number>();
  // Count listings per geo-type (Tier 3)
  const geoTypeCountMap = new Map<string, number>();

  for (const p of activeProperties) {
    const catKey = `${p.propertyType}|${p.businessType}`;
    categoryCountMap.set(catKey, (categoryCountMap.get(catKey) ?? 0) + 1);

    if (p.zone) {
      const geoKey = `${p.propertyType}|${p.businessType}|${p.zone}`;
      geoTypeCountMap.set(geoKey, (geoTypeCountMap.get(geoKey) ?? 0) + 1);
    }
  }

  // ── Part 1: Listings ─────────────────────────────────────────────────────
  const listingsSitemap: MetadataRoute.Sitemap = activeProperties.map((p) => ({
    url: `${BASE_URL}/propiedades/${p.slug}/`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // ── Part 2: Category pages (Tier 0, 1, 2, 3) ─────────────────────────────
  const categoriesSitemap: MetadataRoute.Sitemap = [
    // Tier 0
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    // Tier 1
    {
      url: `${BASE_URL}/propiedades-en-venta/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/propiedades-en-alquiler/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // Tier 2 — only categories with 2+ active listings
    ...CATEGORIES.flatMap((cat) => {
      const key = `${cat.propertyType}|${cat.businessType}`;
      const count = categoryCountMap.get(key) ?? 0;
      if (count < 2) return [];
      return [
        {
          url: `${BASE_URL}/${cat.slug}/`,
          lastModified: new Date(),
          changeFrequency: "daily" as const,
          priority: 0.85,
        },
      ];
    }),
    // Tier 3 — only geo-type combos with 2+ active listings
    ...CATEGORIES.flatMap((cat) =>
      NEIGHBORHOODS.flatMap((nbh) => {
        const geoKey = `${cat.propertyType}|${cat.businessType}|${nbh.name}`;
        const count = geoTypeCountMap.get(geoKey) ?? 0;
        if (count < 2) return [];
        return [
          {
            url: `${BASE_URL}/${cat.slug}/${nbh.slug}/`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
          },
        ];
      })
    ),
  ];

  // ── Part 3: Content pages (Tier 5) ───────────────────────────────────────
  const contentSitemap: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/agentes/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/guias/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: `${BASE_URL}/sobre-nosotros/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contacto/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Neighborhood guides
    ...NEIGHBORHOODS.map((nbh) => ({
      url: `${BASE_URL}/barrios/${nbh.slug}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Agent profiles
    ...agents.map((a) => ({
      url: `${BASE_URL}/agentes/${a.slug}/`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Guide articles
    ...guides.map((g) => ({
      url: `${BASE_URL}/guias/${g.slug}/`,
      lastModified: new Date(g.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  return [...listingsSitemap, ...categoriesSitemap, ...contentSitemap];
}
