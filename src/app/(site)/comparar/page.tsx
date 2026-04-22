import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByIdsQuery } from "@/sanity/lib/queries";
import type { Property } from "@/lib/types";
import CTA from "@/components/home/CTA";
import ComparePageClient from "./ComparePageClient";

export const metadata: Metadata = {
  title: "Comparar Propiedades",
  description: "Compara lado a lado las propiedades que seleccionaste.",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: { ids?: string };
}

export default async function CompararPage({ searchParams }: Props) {
  const rawIds = searchParams.ids ?? "";
  const ids = rawIds.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n)).slice(0, 3);

  if (ids.length < 2) notFound();

  const properties = await sanityFetch<Property[]>(propertiesByIdsQuery, { ids });

  if (properties.length < 2) notFound();

  return (
    <>
      <ComparePageClient properties={properties} />
      <CTA />
    </>
  );
}
