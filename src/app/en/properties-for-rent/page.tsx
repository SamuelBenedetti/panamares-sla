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
import { canonical, alternates } from "@/lib/seo";
import { getCopy } from "@/lib/copy";

const copy = getCopy("en");
const t = copy.pages.propiedadesEnAlquiler;

export async function generateMetadata(): Promise<Metadata> {
  const properties = await sanityFetch<Property[]>(propertiesByIntentQuery, { businessType: "alquiler" });
  const firstImage = properties.find((p) => p.mainImage)?.mainImage;
  const ogImage = firstImage ? urlFor(firstImage).width(1200).height(630).url() : undefined;
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: canonical("/en/properties-for-rent"),
      languages: alternates("/propiedades-en-alquiler", "/en/properties-for-rent"),
    },
    robots: { index: true, follow: true },
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function PropertiesForRentPage({
  searchParams = {},
}: {
  searchParams?: { buscar?: string; habitaciones?: string; minPrice?: string; maxPrice?: string; categoria?: string };
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

  const jsonLdList = itemListSchema("/en/properties-for-rent/", t.h1, properties);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: copy.layout.breadcrumb.inicio, url: "/en/" },
    { name: t.breadcrumbLabel, url: "/en/properties-for-rent/" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message={t.whatsappMessage} variant="floating" />

      <ListingPageHeader
        breadcrumbs={[{ label: copy.layout.breadcrumb.inicio, href: "/en" }, { label: t.breadcrumbLabel }]}
        title={t.h1}
        description={t.description}
        count={properties.length}
        locale="en"
      />

      <CategoryPageClient
        properties={properties}
        categorySlug="propiedades-en-alquiler"
        neighborhoodLinks={neighborhoodLinks}
        initialSearch={searchParams.buscar ?? ""}
        initialBedrooms={searchParams.habitaciones ? Number(searchParams.habitaciones) : 0}
        initialMinPrice={searchParams.minPrice ?? ""}
        initialMaxPrice={searchParams.maxPrice ?? ""}
        initialCategoria={searchParams.categoria ?? ""}
        locale="en"
      />
      <CTA locale="en" />
    </>
  );
}
