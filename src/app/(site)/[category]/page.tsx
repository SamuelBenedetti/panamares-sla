import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByCategoryQuery } from "@/sanity/lib/queries";
import { getCategoryBySlug, VALID_CATEGORY_SLUGS } from "@/lib/categories";
import { getSlugByName } from "@/lib/neighborhoods";
import { itemListSchema, breadcrumbSchema } from "@/lib/jsonld";
import type { Property } from "@/lib/types";
import ListingPageHeader from "@/components/properties/ListingPageHeader";
import CategoryPageClient from "@/components/properties/CategoryPageClient";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import CTA from "@/components/home/CTA";

const BASE_URL = "https://panamares.com";

interface Props {
  params: { category: string };
}

export async function generateStaticParams() {
  return Array.from(VALID_CATEGORY_SLUGS).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const config = getCategoryBySlug(params.category);
  if (!config) return {};

  const url = `/${params.category}/`;
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: { canonical: `${BASE_URL}${url}` },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const config = getCategoryBySlug(params.category);
  if (!config) notFound();

  const properties = await sanityFetch<Property[]>(propertiesByCategoryQuery, {
    propertyType: config.propertyType,
    businessType: config.businessType,
  });

  // Build neighborhood links for sidebar
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
  const jsonLdList = itemListSchema(pageUrl, config.h1, properties);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: config.h1, url: pageUrl },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message={`Hola, busco propiedades en ${config.h1}`} variant="floating" />

      <ListingPageHeader
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: config.h1 }]}
        title={config.h1}
        description={config.metaDescription}
        count={properties.length}
      />

      <CategoryPageClient
        properties={properties}
        categorySlug={params.category}
        neighborhoodLinks={neighborhoodLinks}
        seoBlock={config.seoBlock}
      />
      <CTA />
    </>
  );
}
