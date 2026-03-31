import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByIntentQuery } from "@/sanity/lib/queries";
import type { Property } from "@/lib/types";
import { getSlugByName } from "@/lib/neighborhoods";
import { itemListSchema, breadcrumbSchema } from "@/lib/jsonld";
import ListingPageHeader from "@/components/properties/ListingPageHeader";
import CategoryPageClient from "@/components/properties/CategoryPageClient";
import WhatsAppButton from "@/components/properties/WhatsAppButton";

const H1 = "Propiedades en Alquiler en Panamá";
const DESCRIPTION =
  "Descubre todas las propiedades en alquiler en Panama City. Apartamentos, casas, oficinas y locales en los mejores barrios de la capital panameña.";

export const metadata: Metadata = {
  title: "Propiedades en Alquiler en Panama | Panamares",
  description: DESCRIPTION,
  alternates: { canonical: "https://panamares.com/propiedades-en-alquiler/" },
};

export default async function PropiedadesEnAlquilerPage() {
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
      />
    </>
  );
}
