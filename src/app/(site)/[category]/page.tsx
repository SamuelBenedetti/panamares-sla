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
import { getEnUrl } from "@/lib/i18n";

interface Props {
  params: { category: string };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return Array.from(VALID_CATEGORY_SLUGS).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const config = getCategoryBySlug(params.category);
  if (!config) return {};

  const copy = getCopy("es");
  const cat = copy.categories[params.category] ?? {
    h1: config.h1,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    seoBlock: config.seoBlock ?? "",
  };

  const properties = await sanityFetch<Property[]>(
    propertiesByCategoryQuery,
    { propertyType: config.propertyType, businessType: config.businessType }
  );

  const firstImage = properties.find((p) => p.mainImage)?.mainImage;
  const ogImage = firstImage
    ? urlFor(firstImage).width(1200).height(630).url()
    : undefined;

  const url = `/${params.category}`;
  const enUrl = getEnUrl(url);
  const shouldIndex = properties.length >= 2;
  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    alternates: { canonical: canonical(url), languages: alternates(url, enUrl) },
    robots: { index: shouldIndex, follow: true },
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function CategoryPage({ params }: Props) {
  const config = getCategoryBySlug(params.category);
  if (!config) notFound();

  const copy = getCopy("es");
  const cat = copy.categories[params.category] ?? {
    h1: config.h1,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    seoBlock: config.seoBlock ?? "",
  };
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
      categorySlug: params.category,
    }));

  const pageUrl = `/${params.category}/`;
  const jsonLdList = itemListSchema(pageUrl, cat.h1, properties);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: copy.layout.breadcrumb.inicio, url: "/" },
    { name: cat.h1, url: pageUrl },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message={tHub.whatsappMessageCategoryTpl(cat.h1)} variant="floating" locale="es" />

      <ListingPageHeader
        breadcrumbs={[{ label: copy.layout.breadcrumb.inicio, href: "/" }, { label: cat.h1 }]}
        title={cat.h1}
        description={cat.seoBlock}
        count={properties.length}
        locale="es"
      />

      <CategoryPageClient
        properties={properties}
        categorySlug={params.category}
        neighborhoodLinks={neighborhoodLinks}
        locale="es"
      />
      <CTA locale="es" />
    </>
  );
}
