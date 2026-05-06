import type { Property, SanityImage } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { allNeighborhoodContentQuery, featuredPropertiesQuery, neighborhoodCountsQuery, propertyTypeCountsQuery } from "@/sanity/lib/queries";
import type { Metadata } from "next";

import CTA from "@/components/home/CTA";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Hero from "@/components/home/Hero";
import NeighborhoodCards from "@/components/home/NeighborhoodCards";
import PropertyTypeShortcuts from "@/components/home/PropertyTypeShortcuts";
import TrustStrip from "@/components/home/TrustStrip";
import { canonical, alternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Bienes Raíces en Panama City",
  description:
    "Panamares — inmobiliaria de lujo en Panama City. Apartamentos, casas, penthouses, oficinas y más en Punta Pacífica, Punta Paitilla y las mejores zonas de la ciudad.",
  alternates: { canonical: canonical("/"), languages: alternates("/", "/en") },
  robots: { index: true, follow: true },
};


export default async function HomePage() {
  const [featured, typeCounts, neighborhoodCounts, allNbhContent] = await Promise.all([
    sanityFetch<Property[]>(featuredPropertiesQuery),
    sanityFetch<Record<string, number>>(propertyTypeCountsQuery),
    sanityFetch<Record<string, number>>(neighborhoodCountsQuery),
    sanityFetch<Array<{ slug: string; avgPricePerM2?: number | null; photo?: SanityImage }>>(allNeighborhoodContentQuery),
  ]);

  const neighborhoodPhotos = Object.fromEntries(
    allNbhContent
      .filter((n) => n.photo)
      .map((n) => [n.slug, urlFor(n.photo!).width(700).height(930).fit("crop").url()])
  );

  const neighborhoodLqips = Object.fromEntries(
    allNbhContent
      .filter((n) => n.photo?.lqip)
      .map((n) => [n.slug, n.photo!.lqip!])
  );

  const neighborhoodPrices = Object.fromEntries(
    allNbhContent
      .filter((n) => n.avgPricePerM2)
      .map((n) => [n.slug, `$${n.avgPricePerM2!.toLocaleString("en-US")}/m²`])
  );

  return (
    <>
      <Hero locale="es" />
      <PropertyTypeShortcuts counts={typeCounts} locale="es" />
      <FeaturedProperties properties={featured} locale="es" />

      <NeighborhoodCards
        counts={neighborhoodCounts}
        photos={neighborhoodPhotos}
        lqips={neighborhoodLqips}
        prices={neighborhoodPrices}
        locale="es"
      />
      <TrustStrip locale="es" />
      <CTA locale="es" />
    </>
  );
}
