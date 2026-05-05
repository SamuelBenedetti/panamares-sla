import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByCategoryQuery } from "@/sanity/lib/queries";
import { getCategoryBySlug, VALID_CATEGORY_SLUGS } from "@/lib/categories";
import { getSlugByName } from "@/lib/neighborhoods";
import { itemListSchema, breadcrumbSchema } from "@/lib/jsonld";
import type { Property } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import ListingPageHeader from "@/components/properties/ListingPageHeader";
import CategoryPageClient from "@/components/properties/CategoryPageClient";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import CTA from "@/components/home/CTA";
import { canonical, alternates } from "@/lib/seo";
import { getCopy } from "@/lib/copy";
import { getEsUrl, SLUG_MAP_ES_TO_EN } from "@/lib/i18n";

interface Props {
  params: { category: string };
}

export const dynamicParams = false;

// EN category slugs are derived from the ES → EN slug map: every entry whose
// ES key is in VALID_CATEGORY_SLUGS becomes an EN static param. The EN slug is
// the trailing segment after `/en/`.
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
  return getEnCategorySlugs().map((category) => ({ category }));
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
  if (!resolved) return {};
  const { config, esSlug } = resolved;

  const copy = getCopy("en");
  const cat = copy.categories[esSlug];
  if (!cat) return {};

  const properties = await sanityFetch<Property[]>(
    propertiesByCategoryQuery,
    { propertyType: config.propertyType, businessType: config.businessType }
  );

  const firstImage = properties.find((p) => p.mainImage)?.mainImage;
  const ogImage = firstImage
    ? urlFor(firstImage).width(1200).height(630).url()
    : undefined;

  const enUrl = `/en/${params.category}`;
  const esUrl = `/${esSlug}`;
  const shouldIndex = properties.length >= 2;
  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    alternates: { canonical: canonical(enUrl), languages: alternates(esUrl, enUrl) },
    robots: { index: shouldIndex, follow: true },
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function CategoryPageEn({ params }: Props) {
  const resolved = resolveEnCategory(params.category);
  if (!resolved) notFound();
  const { config, esSlug } = resolved;

  const copy = getCopy("en");
  const cat = copy.categories[esSlug];
  if (!cat) notFound();
  const tHub = copy.components.categoryHub;

  const properties = await sanityFetch<Property[]>(propertiesByCategoryQuery, {
    propertyType: config.propertyType,
    businessType: config.businessType,
  });

  const zoneCounts = new Map<string, number>();
  for (const p of properties) {
    if (p.zone) zoneCounts.set(p.zone, (zoneCounts.get(p.zone) ?? 0) + 1);
  }
  const neighborhoodLinks = Array.from(zoneCounts.entries())
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      slug: getSlugByName(name) ?? name.toLowerCase().replace(/\s+/g, "-"),
      count,
      // CategoryPageClient uses this slug only to derive businessType heuristics
      // and as a stable React key — keep ES slug since the listing detail pages
      // remain ES (Phase 2).
      categorySlug: esSlug,
    }));

  const pageUrl = `/en/${params.category}/`;
  const jsonLdList = itemListSchema(pageUrl, cat.h1, properties);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: copy.layout.breadcrumb.inicio, url: "/en/" },
    { name: cat.h1, url: pageUrl },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message={tHub.whatsappMessageCategoryTpl(cat.h1)} variant="floating" locale="en" />

      <ListingPageHeader
        breadcrumbs={[{ label: copy.layout.breadcrumb.inicio, href: "/en" }, { label: cat.h1 }]}
        title={cat.h1}
        description={cat.seoBlock}
        count={properties.length}
        locale="en"
      />

      <CategoryPageClient
        properties={properties}
        categorySlug={esSlug}
        neighborhoodLinks={neighborhoodLinks}
        locale="en"
      />
      <CTA locale="en" />
    </>
  );
}
