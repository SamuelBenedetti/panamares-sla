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

const BASE_URL = "https://panamares.vercel.app";

interface Props {
  params: { category: string; neighborhood: string };
}

export async function generateStaticParams() {
  const params: { category: string; neighborhood: string }[] = [];
  for (const category of Array.from(VALID_CATEGORY_SLUGS)) {
    for (const neighborhood of Array.from(VALID_NEIGHBORHOOD_SLUGS)) {
      params.push({ category, neighborhood });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  const neighborhood = getNeighborhoodBySlug(params.neighborhood);
  if (!category || !neighborhood) return {};

  const properties = await sanityFetch<Property[]>(propertiesByGeoTypeQuery, {
    propertyType: category.propertyType,
    businessType: category.businessType,
    neighborhood: neighborhood.name,
  });

  const typeLabel = category.h1.split(" en Panama")[0];
  const title = `${typeLabel} en ${neighborhood.name}, Panama`;
  const description = `${typeLabel} en ${neighborhood.name}. ${properties.length} propiedades disponibles. Encuentra las mejores opciones en esta zona exclusiva de Panama City.`;
  const url = `/${params.category}/${params.neighborhood}/`;

  const shouldIndex = properties.length >= 2;
  const firstImage = properties.find((p) => p.mainImage)?.mainImage;
  const ogImage = firstImage
    ? urlFor(firstImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}${url}` },
    robots: { index: shouldIndex, follow: true },
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function GeoTypePage({ params }: Props) {
  const category = getCategoryBySlug(params.category);
  const neighborhood = getNeighborhoodBySlug(params.neighborhood);
  if (!category || !neighborhood) notFound();

  const [properties, allCategoryProperties, nbhContent] = await Promise.all([
    sanityFetch<Property[]>(propertiesByGeoTypeQuery, {
      propertyType: category.propertyType,
      businessType: category.businessType,
      neighborhood: neighborhood.name,
    }),
    sanityFetch<{ zone?: string }[]>(propertiesByCategoryQuery, {
      propertyType: category.propertyType,
      businessType: category.businessType,
    }),
    sanityFetch<Neighborhood | null>(neighborhoodContentQuery, {
      slug: params.neighborhood,
    }),
  ]);

  const typeLabel = category.h1.split(" en Panama")[0];
  const h1 = `${typeLabel} en ${neighborhood.name}, Panama`;
  const pageUrl = `/${params.category}/${params.neighborhood}/`;

  // Build neighborhood sidebar links from all properties in this category
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
      categorySlug: params.category,
    }));

  // Map pins — properties with GPS coordinates
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

  const jsonLdList = itemListSchema(pageUrl, h1, properties);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: category.h1, url: `/${params.category}/` },
    { name: neighborhood.name, url: pageUrl },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message={`Hola, busco ${typeLabel} en ${neighborhood.name}`} variant="floating" />

      <ListingPageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: category.h1, href: `/${params.category}/` },
          { label: neighborhood.name },
        ]}
        title={h1}
        count={properties.length}
        description={nbhContent?.seoBlock}
      />
      <CategoryPageClient
        properties={properties}
        categorySlug={params.category}
        neighborhoodLinks={neighborhoodLinks}
        mapProps={mapProps}
      />
      <CTA />
    </>
  );
}
