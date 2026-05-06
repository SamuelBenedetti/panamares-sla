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
  title: "Real Estate in Panama City",
  description:
    "Panamares — luxury real estate in Panama City. Apartments, houses, penthouses, offices and more in Punta Pacífica, Punta Paitilla and the city's most desirable areas.",
  alternates: { canonical: canonical("/en"), languages: alternates("/", "/en") },
  robots: { index: true, follow: true },
};


export default async function HomePageEn() {
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
      <Hero locale="en" />
      <PropertyTypeShortcuts counts={typeCounts} locale="en" />
      <FeaturedProperties properties={featured} locale="en" />

      <NeighborhoodCards
        counts={neighborhoodCounts}
        photos={neighborhoodPhotos}
        lqips={neighborhoodLqips}
        prices={neighborhoodPrices}
        locale="en"
      />
      <TrustStrip locale="en" />
      <CTA locale="en" />
    </>
  );
}
