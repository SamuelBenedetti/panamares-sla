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
const H1 = "Propiedades en Venta en Panamá";
const DESCRIPTION =
  "Panamares reúne la mayor oferta de propiedades en venta en Panama City. Apartamentos, casas, penthouses, oficinas, locales y terrenos en Punta Pacífica, Punta Paitilla, Costa del Este y más zonas exclusivas. Cada inmueble cuenta con información completa de precio, área, habitaciones y amenidades. Filtra por tipo de propiedad, barrio o presupuesto y encuentra la opción ideal para comprar o invertir en el mercado inmobiliario más sólido de Centroamérica.";

export async function generateMetadata(): Promise<Metadata> {
  const properties = await sanityFetch<Property[]>(propertiesByIntentQuery, { businessType: "venta" });
  const firstImage = properties.find((p) => p.mainImage)?.mainImage;
  const ogImage = firstImage ? urlFor(firstImage).width(1200).height(630).url() : undefined;
  return {
    title: "Propiedades en Venta en Panama",
    description: DESCRIPTION,
    alternates: { canonical: `${BASE_URL}/propiedades-en-venta/` },
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function PropiedadesEnVentaPage({
  searchParams,
}: {
  searchParams: { buscar?: string; habitaciones?: string; minPrice?: string; maxPrice?: string };
}) {
  const properties = await sanityFetch<Property[]>(propertiesByIntentQuery, {
    businessType: "venta",
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
      categorySlug: "propiedades-en-venta",
    }));

  const jsonLdList = itemListSchema("/propiedades-en-venta/", H1, properties);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: H1, url: "/propiedades-en-venta/" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message="Hola, busco propiedades en venta en Panamá" variant="floating" />

      <ListingPageHeader
        breadcrumbs={[{ label: "Inicio", href: "/" }, { label: H1 }]}
        title={H1}
        description={DESCRIPTION}
        count={properties.length}
      />

      <CategoryPageClient
        properties={properties}
        categorySlug="propiedades-en-venta"
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
