import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByGeoTypeQuery, neighborhoodContentQuery } from "@/sanity/lib/queries";
import { getCategoryBySlug, VALID_CATEGORY_SLUGS } from "@/lib/categories";
import { getNeighborhoodBySlug, VALID_NEIGHBORHOOD_SLUGS } from "@/lib/neighborhoods";
import { itemListSchema, breadcrumbSchema } from "@/lib/jsonld";
import type { Property, Neighborhood } from "@/lib/types";
import ListingPageHeader from "@/components/properties/ListingPageHeader";
import SeoBlock from "@/components/home/SeoBlock";
import CategoryPageClient from "@/components/properties/CategoryPageClient";
import CTA from "@/components/home/CTA";
import PropertyMapMulti from "@/components/properties/PropertyMapMulti";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import { PortableText } from "@portabletext/react";

const BASE_URL = "https://panamares.com";

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
  const title = `${typeLabel} en ${neighborhood.name}, Panama | Panamares`;
  const description = `${typeLabel} en ${neighborhood.name}. ${properties.length} propiedades disponibles. Encuentra las mejores opciones en esta zona exclusiva de Panama City.`;
  const url = `/${params.category}/${params.neighborhood}/`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}${url}` },
    robots:
      properties.length < 2
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

export default async function GeoTypePage({ params }: Props) {
  const category = getCategoryBySlug(params.category);
  const neighborhood = getNeighborhoodBySlug(params.neighborhood);
  if (!category || !neighborhood) notFound();

  const [properties, nbhContent] = await Promise.all([
    sanityFetch<Property[]>(propertiesByGeoTypeQuery, {
      propertyType: category.propertyType,
      businessType: category.businessType,
      neighborhood: neighborhood.name,
    }),
    sanityFetch<Neighborhood | null>(neighborhoodContentQuery, {
      slug: params.neighborhood,
    }),
  ]);

  const typeLabel = category.h1.split(" en Panama")[0];
  const h1 = `${typeLabel} en ${neighborhood.name}, Panama`;
  const pageUrl = `/${params.category}/${params.neighborhood}/`;

  // Neighborhood sidebar links for this category (same type/intent, other zones)
  // (empty here since this is already filtered by zone — sidebar not needed)
  const neighborhoodLinks: { name: string; slug: string; count: number; categorySlug: string }[] = [];

  // Map pins from properties with GPS
  const mapProps = properties
    .filter((p) => p.location)
    .map((p) => ({
      lat: p.location!.lat,
      lng: p.location!.lng,
      title: p.title,
      slug: p.slug.current,
      price: p.price,
    }));

  const jsonLdList = itemListSchema(pageUrl, h1, properties);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: category.h1, url: `/${params.category}/` },
    { name: neighborhood.name, url: pageUrl },
  ]);

  const contextBlock = nbhContent?.about ? (
    <div className="font-body text-[15px] text-[#737b8c] leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0">
      <PortableText value={nbhContent.about} />
    </div>
  ) : null;

  const mapSlot =
    mapProps.length > 0 ? (
      <PropertyMapMulti properties={mapProps} height="h-[320px]" />
    ) : null;

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
        description={`${properties.length} ${properties.length === 1 ? "propiedad disponible" : "propiedades disponibles"} en ${neighborhood.name}, Panama City.`}
      />
      {nbhContent?.seoBlock && (
        <div className="px-[30px] xl:px-[260px] pt-[24px]">
          <div className="max-w-[1400px] mx-auto">
            <SeoBlock text={nbhContent.seoBlock} />
          </div>
        </div>
      )}

      <CategoryPageClient
        properties={properties}
        categorySlug={params.category}
        neighborhoodLinks={neighborhoodLinks}
        contextBlock={contextBlock}
        mapSlot={mapSlot}
      />

      {/* Mobile map — below grid */}
      {mapProps.length > 0 && (
        <div className="lg:hidden px-[30px] pb-[40px]">
          <PropertyMapMulti properties={mapProps} height="h-[300px]" />
        </div>
      )}
      <CTA />
    </>
  );
}
