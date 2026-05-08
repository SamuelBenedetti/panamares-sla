import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByIdsQuery } from "@/sanity/lib/queries";
import type { Property } from "@/lib/types";
import { getCopy } from "@/lib/copy";
import CTA from "@/components/home/CTA";
import ComparePageClient from "@/app/(site)/comparar/ComparePageClient";

const t = getCopy("en").components.compare.page;

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  // Compare flow is functional, not content-to-index. Mirrors the ES twin at
  // /comparar — both stay out of search indexes by design.
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: { ids?: string };
}

export default async function ComparePage({ searchParams }: Props) {
  const rawIds = searchParams.ids ?? "";
  const ids = rawIds.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n)).slice(0, 3);

  if (ids.length < 2) notFound();

  const properties = await sanityFetch<Property[]>(propertiesByIdsQuery, { ids });

  if (properties.length < 2) notFound();

  return (
    <>
      <ComparePageClient properties={properties} locale="en" />
      <CTA locale="en" />
    </>
  );
}
