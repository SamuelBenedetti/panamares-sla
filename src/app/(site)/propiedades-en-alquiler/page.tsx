import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByIntentQuery } from "@/sanity/lib/queries";
import type { Property } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { getSlugByName } from "@/lib/neighborhoods";
import { itemListSchema, breadcrumbSchema } from "@/lib/jsonld";
import ListingPageHeader from "@/components/properties/ListingPageHeader";
import CategoryPageClient from "@/components/properties/CategoryPageClient";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import CTA from "@/components/home/CTA";

const BASE_URL = "https://panamares.vercel.app";
const H1 = "Propiedades en Alquiler en Panamá";
const DESCRIPTION =
  "Panamares tiene la selección más completa de propiedades en alquiler en Panama City. Apartamentos amueblados y sin amueblar, casas, oficinas y locales comerciales en Punta Pacífica, Punta Paitilla, Obarrio, Calle 50 y más zonas. Contratos en dólares, atención en español y agentes especializados que te acompañan en todo el proceso. Encuentra tu próxima propiedad en alquiler en la ciudad con el mercado inmobiliario más dinámico de la región.";

export async function generateMetadata(): Promise<Metadata> {
  const properties = await sanityFetch<Property[]>(propertiesByIntentQuery, { businessType: "alquiler" });
  const firstImage = properties.find((p) => p.mainImage)?.mainImage;
  const ogImage = firstImage ? urlFor(firstImage).width(1200).height(630).url() : undefined;
  return {
    title: "Propiedades en Alquiler en Panama",
    description: DESCRIPTION,
    alternates: { canonical: `${BASE_URL}/propiedades-en-alquiler/` },
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function PropiedadesEnAlquilerPage({
  searchParams = {},
}: {
  searchParams?: { buscar?: string; habitaciones?: string; minPrice?: string; maxPrice?: string };
}) {
  const properties = await sanityFetch<Property[]>(propertiesByIntentQuery, {
    businessType: "alquiler",
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
      categorySlug: "propiedades-en-alquiler",
    }));

  const jsonLdList = itemListSchema("/propiedades-en-alquiler/", H1, properties);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: H1, url: "/propiedades-en-alquiler/" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message="Hola, busco propiedades en alquiler en Panamá" variant="floating" />

      <ListingPageHeader
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: H1 }]}
        title={H1}
        description={DESCRIPTION}
        count={properties.length}
      />

      <CategoryPageClient
        properties={properties}
        categorySlug="propiedades-en-alquiler"
        neighborhoodLinks={neighborhoodLinks}
        initialSearch={searchParams.buscar ?? ""}
        initialBedrooms={searchParams.habitaciones ? Number(searchParams.habitaciones) : 0}
        initialMinPrice={searchParams.minPrice ?? ""}
        initialMaxPrice={searchParams.maxPrice ?? ""}
      />
      <CTA />
    </>
  );
}
