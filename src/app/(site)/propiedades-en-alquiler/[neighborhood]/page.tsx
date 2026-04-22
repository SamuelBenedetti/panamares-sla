import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByIntentGeoQuery, neighborhoodContentQuery } from "@/sanity/lib/queries";
import { getNeighborhoodBySlug, VALID_NEIGHBORHOOD_SLUGS } from "@/lib/neighborhoods";
import { itemListSchema, breadcrumbSchema } from "@/lib/jsonld";
import type { Property, Neighborhood } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import ListingPageHeader from "@/components/properties/ListingPageHeader";
import CategoryPageClient from "@/components/properties/CategoryPageClient";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import CTA from "@/components/home/CTA";
import { BASE_URL } from "@/lib/config";

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

  const shouldIndex = properties.length >= 2;
  const firstImage = properties.find((p) => p.mainImage)?.mainImage;
  const ogImage = firstImage ? urlFor(firstImage).width(1200).height(630).url() : undefined;

  const url = `/${INTENT_SLUG}/${params.neighborhood}/`;
  return {
    title: `${INTENT_LABEL} en ${nbh.name}, Panam\u00e1`,
    description: `${properties.length} propiedades en alquiler en ${nbh.name}. Apartamentos, casas, oficinas y locales en una de las mejores zonas de Panama City.`,
    alternates: { canonical: `${BASE_URL}${url}` },
    robots: { index: shouldIndex, follow: true },
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function AlquilerNeighborhoodPage({ params }: Props) {
  const nbh = getNeighborhoodBySlug(params.neighborhood);
  if (!nbh) notFound();

  const [properties] = await Promise.all([
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
        count={properties.length}
        description={undefined}
      />

      <CategoryPageClient
        properties={properties}
        categorySlug={INTENT_SLUG}
        neighborhoodLinks={[]}
        neighborhoodSlug={params.neighborhood}
        mapProps={mapProps}
      />
      <CTA />
    </>
  );
}
