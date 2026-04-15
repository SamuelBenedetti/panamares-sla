import { sanityFetch } from "@/sanity/lib/client";
import { featuredPropertiesQuery, propertyTypeCountsQuery, neighborhoodCountsQuery } from "@/sanity/lib/queries";
import type { Property } from "@/lib/types";
import type { Metadata } from "next";

import Hero from "@/components/home/Hero";
import PropertyTypeShortcuts from "@/components/home/PropertyTypeShortcuts";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import NeighborhoodCards from "@/components/home/NeighborhoodCards";
import TrustStrip from "@/components/home/TrustStrip";
import CTA from "@/components/home/CTA";
import SeoBlock from "@/components/home/SeoBlock";
import { realEstateAgentSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Bienes Raíces en Panama City",
  description:
    "Panamares — inmobiliaria de lujo en Panama City. Apartamentos, casas, penthouses, oficinas y más en Punta Pacífica, Punta Paitilla y las mejores zonas de la ciudad.",
  alternates: { canonical: "https://panamares.vercel.app" },
};


export default async function HomePage() {
  const [featured, typeCounts, neighborhoodCounts] = await Promise.all([
    sanityFetch<Property[]>(featuredPropertiesQuery),
    sanityFetch<Record<string, number>>(propertyTypeCountsQuery),
    sanityFetch<Record<string, number>>(neighborhoodCountsQuery),
  ]);
  const jsonLd = realEstateAgentSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      <PropertyTypeShortcuts counts={typeCounts} />
      <FeaturedProperties properties={featured} />

      <NeighborhoodCards counts={neighborhoodCounts} />
      <TrustStrip />
      <CTA />
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[20px] 2xl:px-[120px] py-[48px] xl:py-[64px] border-t border-[#dfe5ef]">
        <div className="max-w-[1600px] mx-auto">
          <SeoBlock
            text="Panamares es la plataforma líder de bienes raíces de lujo en Ciudad de Panamá. Ofrecemos una selección exclusiva de apartamentos, casas, penthouses, oficinas y más en los barrios más cotizados: Punta Pacífica, Punta Paitilla, Costa del Este, Avenida Balboa y San Francisco. Nuestro equipo de asesores especializados te guía en cada paso, ya sea para comprar, alquilar o invertir en el mercado inmobiliario panameño."
            collapsibleOnMobile
          />
        </div>
      </section>
    </>
  );
}
