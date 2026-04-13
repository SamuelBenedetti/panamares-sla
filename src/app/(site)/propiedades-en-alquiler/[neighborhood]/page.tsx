import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByIntentGeoQuery, neighborhoodContentQuery } from "@/sanity/lib/queries";
import { getNeighborhoodBySlug, VALID_NEIGHBORHOOD_SLUGS } from "@/lib/neighborhoods";
import { itemListSchema, breadcrumbSchema } from "@/lib/jsonld";
import type { Property, Neighborhood } from "@/lib/types";
import ListingPageHeader from "@/components/properties/ListingPageHeader";
import CategoryPageClient from "@/components/properties/CategoryPageClient";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import CTA from "@/components/home/CTA";
import { PortableText } from "@portabletext/react";

const BASE_URL = "https://panamares.vercel.app";
const BUSINESS_TYPE = "alquiler";
const INTENT_LABEL = "Propiedades en Alquiler";
const INTENT_SLUG = "propiedades-en-alquiler";

interface Props {
  params: { neighborhood: string };
}

export async function generateStaticParams() {
  return Array.from(VALID_NEIGHBORHOOD_SLUGS).map((neighborhood) => ({ neighborhood }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const nbh = getNeighborhoodBySlug(params.neighborhood);
  if (!nbh) return {};

  const properties = await sanityFetch<Property[]>(propertiesByIntentGeoQuery, {
    businessType: BUSINESS_TYPE,
    neighborhood: nbh.name,
  });

  const url = `/${INTENT_SLUG}/${params.neighborhood}/`;
  return {
    title: `${INTENT_LABEL} en ${nbh.name}, Panam\u00e1`,
    description: `${properties.length} propiedades en alquiler en ${nbh.name}. Apartamentos, casas, oficinas y locales en una de las mejores zonas de Panama City.`,
    alternates: { canonical: `${BASE_URL}${url}` },
    robots: { index: true, follow: true },
  };
}

export default async function AlquilerNeighborhoodPage({ params }: Props) {
  const nbh = getNeighborhoodBySlug(params.neighborhood);
  if (!nbh) notFound();

  const [properties, nbhContent] = await Promise.all([
    sanityFetch<Property[]>(propertiesByIntentGeoQuery, {
      businessType: BUSINESS_TYPE,
      neighborhood: nbh.name,
    }),
    sanityFetch<Neighborhood | null>(neighborhoodContentQuery, {
      slug: params.neighborhood,
    }),
  ]);

  const h1 = `${INTENT_LABEL} en ${nbh.name}, Panam\u00e1`;
  const pageUrl = `/${INTENT_SLUG}/${params.neighborhood}/`;

  const jsonLdList = itemListSchema(pageUrl, h1, properties);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: INTENT_LABEL, url: `/${INTENT_SLUG}/` },
    { name: nbh.name, url: pageUrl },
  ]);

  const contextBlock = nbhContent?.about ? (
    <div className="font-body text-[15px] text-[#737b8c] leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0">
      <PortableText value={nbhContent.about} />
    </div>
  ) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message={`Hola, busco propiedades en alquiler en ${nbh.name}`} variant="floating" />

      <ListingPageHeader
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: INTENT_LABEL, href: `/${INTENT_SLUG}/` },
          { label: nbh.name },
        ]}
        title={h1}
        description={`${properties.length} ${properties.length === 1 ? "propiedad disponible" : "propiedades disponibles"} en ${nbh.name}, Panama City.`}
      />

      <CategoryPageClient
        properties={properties}
        categorySlug={INTENT_SLUG}
        neighborhoodLinks={[]}
        contextBlock={contextBlock}
      />
      <CTA />
    </>
  );
}
