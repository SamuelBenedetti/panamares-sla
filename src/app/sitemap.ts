import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { CATEGORIES } from "@/lib/categories";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { BASE_URL } from "@/lib/config";
import { SLUG_MAP_ES_TO_EN, getEnUrl, getEsUrl, deriveEnSlug } from "@/lib/i18n";

interface PropertySlim {
  slug: string;
  propertyType: string;
  businessType: string;
  zone: string | null;
  updatedAt: string;
  humanReviewed?: boolean;
}

interface AgentSlim {
  slug: string;
  updatedAt: string;
  humanReviewed?: boolean;
}

interface NeighborhoodSlim {
  slug: string;
  humanReviewed?: boolean;
}

interface GuideSlim {
  slug: string;
  updatedAt: string;
  humanReviewed?: boolean;
}

type Languages = { languages: Record<string, string> };

/**
 * Build the alternates.languages object for a sitemap entry given an ES path.
 * Returns undefined when no EN counterpart exists (Phase 2 routes).
 */
function altsFromEs(esPath: string): Languages | undefined {
  const enPath = getEnUrl(esPath);
  if (!enPath) return undefined;
  const esUrl = esPath === "/" ? BASE_URL : `${BASE_URL}${esPath}`;
  const enUrl = `${BASE_URL}${enPath}`;
  return {
    languages: {
      "es-419": esUrl,
      en: enUrl,
      "x-default": esUrl,
    },
  };
}

/** Same as altsFromEs but starts from an EN path. */
function altsFromEn(enPath: string): Languages | undefined {
  const esPath = getEsUrl(enPath);
  if (!esPath) return undefined;
  return altsFromEs(esPath);
}

/**
 * PR-F: build hreflang `languages` for a property entry. Property leaf slugs
 * are localized at read time via `deriveEnSlug` (Wasi pushes ES as canonical),
 * so the generic `altsFromEs` helper — which copies the slug verbatim through
 * the `/propiedades/[slug]` → `/en/properties/[slug]` regex — would emit the
 * wrong EN URL. Use this builder for property + property-derived entries.
 */
function altsFromEsProperty(esSlug: string): Languages {
  const esUrl = `${BASE_URL}/propiedades/${esSlug}`;
  const enUrl = `${BASE_URL}/en/properties/${deriveEnSlug(esSlug)}`;
  return {
    languages: {
      "es-419": esUrl,
      en: enUrl,
      "x-default": esUrl,
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activeProperties = await sanityFetch<PropertySlim[]>(groq`
    *[_type == "property" && listingStatus == "activa" && noindex != true] {
      "slug": slug.current,
      propertyType,
      businessType,
      "zone": zone,
      "updatedAt": _updatedAt,
      humanReviewed
    }
  `);

  const [agents, guides, reviewedNeighborhoods] = await Promise.all([
    sanityFetch<AgentSlim[]>(groq`
      *[_type == "agent"] {
        "slug": slug.current,
        "updatedAt": _updatedAt,
        humanReviewed
      }
    `),
    sanityFetch<GuideSlim[]>(groq`
      *[_type == "guide"] {
        "slug": slug.current,
        "updatedAt": _updatedAt,
        humanReviewed
      }
    `),
    sanityFetch<NeighborhoodSlim[]>(groq`
      *[_type == "neighborhood" && humanReviewed == true] {
        "slug": slug.current,
        humanReviewed
      }
    `),
  ]);

  // EN-only docs ship in the sitemap once an editor marks the translation
  // reviewed. Until then, the EN URL is still served by Next.js but kept out
  // of the sitemap to avoid promoting un-reviewed translations to crawlers.
  const reviewedAgentSlugs = new Set(
    agents.filter((a) => a.humanReviewed === true).map((a) => a.slug)
  );
  const reviewedNeighborhoodSlugs = new Set(reviewedNeighborhoods.map((n) => n.slug));
  const reviewedGuideSlugs = new Set(
    guides.filter((g) => g.humanReviewed === true).map((g) => g.slug)
  );
  const reviewedPropertySlugs = new Set(
    activeProperties.filter((p) => p.humanReviewed === true).map((p) => p.slug)
  );

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
    { url: BASE_URL, alternates: altsFromEs("/"), changeFrequency: "daily", priority: 1.0 },

    // ── Tier 1: Intent hubs ──────────────────────────────────────────────────
    { url: `${BASE_URL}/propiedades-en-venta`,    alternates: altsFromEs("/propiedades-en-venta"),    changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/propiedades-en-alquiler`, alternates: altsFromEs("/propiedades-en-alquiler"), changeFrequency: "daily", priority: 0.9 },

    // ── Tier 2: Category pages (≥2 listings) ────────────────────────────────
    ...CATEGORIES.flatMap((cat) => {
      const count = categoryCountMap.get(`${cat.propertyType}|${cat.businessType}`) ?? 0;
      if (count < 2) return [];
      return [{
        url: `${BASE_URL}/${cat.slug}`,
        alternates: altsFromEs(`/${cat.slug}`),
        changeFrequency: "daily" as const,
        priority: 0.85,
      }];
    }),

    // ── Tier 3: Geo-type pages (≥2 listings) ────────────────────────────────
    // Hreflang reciprocity to EN counterpart only when the neighborhood is
    // humanReviewed AND the category has an EN slug (PR-D delivers the EN page).
    // ES URL itself ships regardless of EN reviewed state.
    ...CATEGORIES.flatMap((cat) =>
      NEIGHBORHOODS.flatMap((nbh) => {
        const count = geoTypeCountMap.get(`${cat.propertyType}|${cat.businessType}|${nbh.name}`) ?? 0;
        if (count < 2) return [];
        const esGeoPath = `/${cat.slug}/${nbh.slug}`;
        const enExists =
          reviewedNeighborhoodSlugs.has(nbh.slug) && getEnUrl(esGeoPath) !== null;
        return [{
          url: `${BASE_URL}${esGeoPath}`,
          ...(enExists && { alternates: altsFromEs(esGeoPath) }),
          changeFrequency: "daily" as const,
          priority: 0.8,
        }];
      })
    ),

    // ── Tier 4: Property listings ────────────────────────────────────────────
    // ES side always indexes. Hreflang reciprocity to /en/properties/[slug]
    // is only emitted when the EN translation is reviewed (otherwise the EN
    // URL would 404, which would be invalid hreflang).
    ...activeProperties.map((p) => ({
      url: `${BASE_URL}/propiedades/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      // PR-F: hreflang reciprocity uses the EN-derived leaf slug so the EN URL
      // emitted here matches the canonical we serve at runtime.
      ...(reviewedPropertySlugs.has(p.slug) && {
        alternates: altsFromEsProperty(p.slug),
      }),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // ── Tier 5: Neighborhood guides (≥2 listings) ───────────────────────────
    ...NEIGHBORHOODS.filter((nbh) =>
      activeProperties.filter((p) => p.zone === nbh.name).length >= 2
    ).map((nbh) => ({
      url: `${BASE_URL}/barrios/${nbh.slug}`,
      alternates: altsFromEs(`/barrios/${nbh.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    // ── Content pages ────────────────────────────────────────────────────────
    { url: `${BASE_URL}/barrios`,        alternates: altsFromEs("/barrios"),        changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/agentes`,        alternates: altsFromEs("/agentes"),        changeFrequency: "weekly",  priority: 0.6 },
    // /guias list is noindex (thin hub, only 1 guide). Re-add when guide count >= 3.
    { url: `${BASE_URL}/sobre-nosotros`, alternates: altsFromEs("/sobre-nosotros"), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contacto`,       alternates: altsFromEs("/contacto"),       changeFrequency: "monthly", priority: 0.5 },

    // ── Agent profiles (no ?page=N) ──────────────────────────────────────────
    ...agents.map((a) => ({
      url: `${BASE_URL}/agentes/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      alternates: altsFromEs(`/agentes/${a.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),

    // ── Guide articles ───────────────────────────────────────────────────────
    // Hreflang reciprocity emitted only when the EN translation is reviewed.
    ...guides.map((g) => ({
      url: `${BASE_URL}/guias/${g.slug}`,
      lastModified: new Date(g.updatedAt),
      ...(reviewedGuideSlugs.has(g.slug) && {
        alternates: altsFromEs(`/guias/${g.slug}`),
      }),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),

    // ── EN locale URLs ───────────────────────────────────────────────────────
    // Only emit EN URLs for routes that actually exist under src/app/en/**.
    // /en/[category]/[neighborhood] is Phase 2 (PR-D).
    { url: `${BASE_URL}/en`,                                                                         alternates: altsFromEn("/en"),                                            changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}${SLUG_MAP_ES_TO_EN["/propiedades-en-venta"]}`,    alternates: altsFromEn(SLUG_MAP_ES_TO_EN["/propiedades-en-venta"]),    changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}${SLUG_MAP_ES_TO_EN["/propiedades-en-alquiler"]}`, alternates: altsFromEn(SLUG_MAP_ES_TO_EN["/propiedades-en-alquiler"]), changeFrequency: "daily", priority: 0.9 },

    // EN category pages — only for ES categories with ≥2 listings AND a known EN slug
    ...CATEGORIES.flatMap((cat) => {
      const count = categoryCountMap.get(`${cat.propertyType}|${cat.businessType}`) ?? 0;
      if (count < 2) return [];
      const enPath = SLUG_MAP_ES_TO_EN[`/${cat.slug}`];
      if (!enPath) return [];
      return [{
        url: `${BASE_URL}${enPath}`,
        alternates: altsFromEn(enPath),
        changeFrequency: "daily" as const,
        priority: 0.85,
      }];
    }),

    // ── EN Tier 3: Geo-type pages (≥2 listings AND humanReviewed) ───────────
    // The EN /en/<en-cat>/<nbh> route is gated on neighborhood humanReviewed
    // in the page handler (404 otherwise). Mirror that gate here so the
    // sitemap doesn't promote 404s.
    ...CATEGORIES.flatMap((cat) =>
      NEIGHBORHOODS.flatMap((nbh) => {
        const count = geoTypeCountMap.get(`${cat.propertyType}|${cat.businessType}|${nbh.name}`) ?? 0;
        if (count < 2) return [];
        if (!reviewedNeighborhoodSlugs.has(nbh.slug)) return [];
        const enCatPath = SLUG_MAP_ES_TO_EN[`/${cat.slug}`];
        if (!enCatPath) return [];
        const enGeoPath = `${enCatPath}/${nbh.slug}`;
        return [{
          url: `${BASE_URL}${enGeoPath}`,
          alternates: altsFromEn(enGeoPath),
          changeFrequency: "daily" as const,
          priority: 0.8,
        }];
      })
    ),

    // EN neighborhood guides (≥2 listings AND humanReviewed in Sanity).
    // /en/neighborhoods/[slug] route exists for any slug, but we only sitemap
    // those an editor has approved for English consumption.
    ...NEIGHBORHOODS.filter(
      (nbh) =>
        activeProperties.filter((p) => p.zone === nbh.name).length >= 2 &&
        reviewedNeighborhoodSlugs.has(nbh.slug)
    ).map((nbh) => ({
      url: `${BASE_URL}/en/neighborhoods/${nbh.slug}`,
      alternates: altsFromEn(`/en/neighborhoods/${nbh.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    // EN content pages
    { url: `${BASE_URL}/en/neighborhoods`, alternates: altsFromEn("/en/neighborhoods"), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/en/agents`,        alternates: altsFromEn("/en/agents"),        changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE_URL}/en/about`,         alternates: altsFromEn("/en/about"),         changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/en/contact`,       alternates: altsFromEn("/en/contact"),       changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/en/terms`,         alternates: altsFromEn("/en/terms"),         changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/en/privacy`,       alternates: altsFromEn("/en/privacy"),       changeFrequency: "yearly",  priority: 0.3 },

    // EN agent profiles — /en/agents/[slug] route exists for every agent, but
    // only humanReviewed agents are listed in the sitemap (same gate as EN
    // neighborhoods). The ES sitemap entries above are unaffected.
    ...agents
      .filter((a) => reviewedAgentSlugs.has(a.slug))
      .map((a) => ({
        url: `${BASE_URL}/en/agents/${a.slug}`,
        lastModified: new Date(a.updatedAt),
        alternates: altsFromEn(`/en/agents/${a.slug}`),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),

    // EN property listings — same humanReviewed gate as agents/neighborhoods.
    // ES sitemap entries are unaffected; only EN promotion is gated.
    ...activeProperties
      .filter((p) => reviewedPropertySlugs.has(p.slug))
      .map((p) => ({
        // PR-F: EN property URL uses the derived leaf slug.
        url: `${BASE_URL}/en/properties/${deriveEnSlug(p.slug)}`,
        lastModified: new Date(p.updatedAt),
        alternates: altsFromEsProperty(p.slug),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),

    // EN guide articles — same humanReviewed gate.
    ...guides
      .filter((g) => reviewedGuideSlugs.has(g.slug))
      .map((g) => ({
        url: `${BASE_URL}/en/guides/${g.slug}`,
        lastModified: new Date(g.updatedAt),
        alternates: altsFromEn(`/en/guides/${g.slug}`),
        changeFrequency: "monthly" as const,
        priority: 0.65,
      })),
  ];
}
