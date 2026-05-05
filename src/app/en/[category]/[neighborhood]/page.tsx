import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByGeoTypeQuery, propertiesByCategoryQuery, neighborhoodContentQuery } from "@/sanity/lib/queries";
import { getCategoryBySlug, VALID_CATEGORY_SLUGS } from "@/lib/categories";
import { getNeighborhoodBySlug, getSlugByName, VALID_NEIGHBORHOOD_SLUGS } from "@/lib/neighborhoods";
import { itemListSchema, breadcrumbSchema } from "@/lib/jsonld";
import type { Property, Neighborhood } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import ListingPageHeader from "@/components/properties/ListingPageHeader";
import CategoryPageClient from "@/components/properties/CategoryPageClient";
import CTA from "@/components/home/CTA";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import { canonical, alternates } from "@/lib/seo";
import { getCopy } from "@/lib/copy";
import { getEsUrl, SLUG_MAP_ES_TO_EN } from "@/lib/i18n";
import { resolveI18nText } from "@/lib/i18n/resolveI18n";

// Generates the Tier 3 header SEO block specific to type × intent × neighborhood
// combo, in EN. Mirrors the ES helper in `(site)/[category]/[neighborhood]/page.tsx`
// but with EN customer voice. Used only when no Sanity-side EN seoBlock exists.
function buildGeoSeoBlockEn(
  typeLabel: string,
  intentVerb: string,
  neighborhoodName: string,
  priority: "HIGH" | "MEDIUM" | "LOW",
  count: number
): string {
  const zoneTone =
    priority === "HIGH"
      ? "one of the most exclusive and sought-after areas"
      : priority === "MEDIUM"
      ? "an established and strategic area"
      : "a residential area";
  const countPhrase =
    count === 0
      ? "currently with no listings available"
      : count === 1
      ? "1 verified property available"
      : `${count} verified properties available`;
  return `Panamares brings together the largest selection of ${typeLabel.toLowerCase()} ${intentVerb} in ${neighborhoodName}, ${zoneTone} of Panama City. We have ${countPhrase}, each with full information on price, area in m², bedrooms, bathrooms, parking, building amenities and geolocation. Our advisors specialized in ${neighborhoodName} guide you through the search, the visit and the negotiation, with personalized service in English and Spanish, contracts in dollars and clear orientation on market prices. Browse the listings, filter by budget or bedrooms and reach out via WhatsApp to schedule a same-day visit.`;
}

interface Props {
  params: { category: string; neighborhood: string };
}

export const dynamicParams = false;

// EN category slugs are derived from the ES → EN slug map (same approach as
// /en/[category]/page.tsx). Cartesian product of EN categories × neighborhoods.
function getEnCategorySlugs(): string[] {
  const slugs: string[] = [];
  for (const [esPath, enPath] of Object.entries(SLUG_MAP_ES_TO_EN)) {
    const esSlug = esPath.replace(/^\//, "");
    if (!VALID_CATEGORY_SLUGS.has(esSlug)) continue;
    const enSlug = enPath.replace(/^\/en\//, "");
    slugs.push(enSlug);
  }
  return slugs;
}

export async function generateStaticParams() {
  const params: { category: string; neighborhood: string }[] = [];
  for (const category of getEnCategorySlugs()) {
    for (const neighborhood of Array.from(VALID_NEIGHBORHOOD_SLUGS)) {
      params.push({ category, neighborhood });
    }
  }
  return params;
}

function resolveEnCategory(enSlug: string) {
  const esPath = getEsUrl(`/en/${enSlug}`);
  if (!esPath) return null;
  const esSlug = esPath.replace(/^\//, "");
  if (!VALID_CATEGORY_SLUGS.has(esSlug)) return null;
  const config = getCategoryBySlug(esSlug);
  if (!config) return null;
  return { config, esSlug };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = resolveEnCategory(params.category);
  const neighborhood = getNeighborhoodBySlug(params.neighborhood);
  if (!resolved || !neighborhood) return {};
  const { config, esSlug } = resolved;

  const copy = getCopy("en");
  const cat = copy.categories[esSlug];
  if (!cat) return {};

  const [properties, nbhContent] = await Promise.all([
    sanityFetch<Property[]>(propertiesByGeoTypeQuery, {
      propertyType: config.propertyType,
      businessType: config.businessType,
      neighborhood: neighborhood.name,
    }),
    sanityFetch<Neighborhood | null>(neighborhoodContentQuery, {
      slug: params.neighborhood,
    }),
  ]);

  // EN-side gate: page 404s (and is excluded from sitemap) until an editor
  // approves the neighborhood translation. Don't emit indexable metadata.
  if (nbhContent?.humanReviewed !== true) {
    return { robots: { index: false, follow: false } };
  }

  const typeLabel = cat.h1.replace(/ in Panama$/i, "");
  const title = `${typeLabel} in ${neighborhood.name}, Panama`;
  const description = `${typeLabel} in ${neighborhood.name}. ${properties.length} properties available. The best options in this exclusive area of Panama City.`;
  const enUrl = `/en/${params.category}/${params.neighborhood}`;
  const esUrl = `/${esSlug}/${params.neighborhood}`;

  const shouldIndex = properties.length >= 2;
  const firstImage = properties.find((p) => p.mainImage)?.mainImage;
  const ogImage = firstImage
    ? urlFor(firstImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonical(enUrl),
      languages: alternates(esUrl, enUrl),
    },
    robots: { index: shouldIndex, follow: true },
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function GeoTypePageEn({ params }: Props) {
  const resolved = resolveEnCategory(params.category);
  const neighborhood = getNeighborhoodBySlug(params.neighborhood);
  if (!resolved || !neighborhood) notFound();
  const { config, esSlug } = resolved;

  const copy = getCopy("en");
  const cat = copy.categories[esSlug];
  if (!cat) notFound();
  const tHub = copy.components.categoryHub;

  const [properties, allCategoryProperties, nbhContent] = await Promise.all([
    sanityFetch<Property[]>(propertiesByGeoTypeQuery, {
      propertyType: config.propertyType,
      businessType: config.businessType,
      neighborhood: neighborhood.name,
    }),
    sanityFetch<{ zone?: string }[]>(propertiesByCategoryQuery, {
      propertyType: config.propertyType,
      businessType: config.businessType,
    }),
    sanityFetch<Neighborhood | null>(neighborhoodContentQuery, {
      slug: params.neighborhood,
    }),
  ]);

  // EN-side gate: 404 for neighborhoods that haven't been reviewed for EN yet.
  // ES route at /<es-cat>/<nbh> is unaffected.
  if (nbhContent?.humanReviewed !== true) notFound();

  const typeLabel = cat.h1.replace(/ in Panama$/i, "");
  const h1 = `${typeLabel} in ${neighborhood.name}, Panama`;
  const enPageUrl = `/en/${params.category}/${params.neighborhood}/`;

  const zoneCounts = new Map<string, number>();
  for (const p of allCategoryProperties) {
    if (p.zone) zoneCounts.set(p.zone, (zoneCounts.get(p.zone) ?? 0) + 1);
  }
  const neighborhoodLinks = Array.from(zoneCounts.entries())
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      slug: getSlugByName(name) ?? name.toLowerCase().replace(/\s+/g, "-"),
      count,
      // Listing detail pages remain ES-keyed for the click target — locale on
      // PropertyCard switches the rendered href to /en/properties/[slug].
      categorySlug: esSlug,
    }));

  const mapProps = properties
    .filter((p) => p.location)
    .map((p) => ({
      lat: p.location!.lat,
      lng: p.location!.lng,
      title: p.title,
      slug: p.slug.current,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      imageUrl: p.mainImage
        ? urlFor(p.mainImage).width(300).height(200).fit("crop").url()
        : undefined,
    }));

  // EN seoBlock: prefer Sanity i18n EN entry; fall back to a generated geo
  // block when the editor hasn't authored a per-neighborhood description in EN.
  // We deliberately do NOT fall back to ES content here — the EN page is gated
  // on humanReviewed already, so showing an English generated block is better
  // than a Spanish block on the EN URL.
  const seoBlockEn = resolveI18nText(nbhContent?.seoBlockI18n, "en", undefined);
  const headerDescription =
    seoBlockEn ||
    buildGeoSeoBlockEn(
      typeLabel,
      config.businessType === "venta" ? "for sale" : "for rent",
      neighborhood.name,
      neighborhood.priority,
      properties.length
    );

  const jsonLdList = itemListSchema(enPageUrl, h1, properties);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: copy.layout.breadcrumb.inicio, url: "/en/" },
    { name: cat.h1, url: `/en/${params.category}/` },
    { name: neighborhood.name, url: enPageUrl },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message={tHub.whatsappMessageCategoryTpl(h1)} variant="floating" />

      <ListingPageHeader
        breadcrumbs={[
          { label: copy.layout.breadcrumb.inicio, href: "/en" },
          { label: cat.h1, href: `/en/${params.category}/` },
          { label: neighborhood.name },
        ]}
        title={h1}
        count={properties.length}
        description={headerDescription}
        locale="en"
      />
      <CategoryPageClient
        properties={properties}
        categorySlug={esSlug}
        neighborhoodLinks={neighborhoodLinks}
        neighborhoodSlug={params.neighborhood}
        mapProps={mapProps}
        locale="en"
      />
      <CTA locale="en" />
    </>
  );
}
