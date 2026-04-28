import type { Property } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/client";
import { featuredPropertiesQuery, neighborhoodCountsQuery, propertyTypeCountsQuery } from "@/sanity/lib/queries";
import type { Metadata } from "next";

import CTA from "@/components/home/CTA";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Hero from "@/components/home/Hero";
import NeighborhoodCards from "@/components/home/NeighborhoodCards";
import PropertyTypeShortcuts from "@/components/home/PropertyTypeShortcuts";
import TrustStrip from "@/components/home/TrustStrip";
import { BASE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Bienes Raíces en Panama City",
  description:
    "Panamares — inmobiliaria de lujo en Panama City. Apartamentos, casas, penthouses, oficinas y más en Punta Pacífica, Punta Paitilla y las mejores zonas de la ciudad.",
  alternates: { canonical: BASE_URL },
};


export default async function HomePage() {
  const [featured, typeCounts, neighborhoodCounts] = await Promise.all([
    sanityFetch<Property[]>(featuredPropertiesQuery),
    sanityFetch<Record<string, number>>(propertyTypeCountsQuery),
    sanityFetch<Record<string, number>>(neighborhoodCountsQuery),
  ]);

  return (
    <>
      <Hero />
      <PropertyTypeShortcuts counts={typeCounts} />
      <FeaturedProperties properties={featured} />

      <NeighborhoodCards counts={neighborhoodCounts} />
      <TrustStrip />
      <CTA />
    </>
  );
}
