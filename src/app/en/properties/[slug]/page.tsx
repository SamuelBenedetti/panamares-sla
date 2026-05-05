import CTA from "@/components/home/CTA";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyGrid from "@/components/properties/PropertyGrid";
import PropertyMap from "@/components/properties/PropertyMap";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ShareButton from "@/components/ui/ShareButton";
import { CATEGORIES, getCategorySlugFor } from "@/lib/categories";
import { canonical, alternates } from "@/lib/seo";
import { BASE_URL, PANAMARES_TEL } from "@/lib/config";
import { breadcrumbSchema, listingSchema } from "@/lib/jsonld";
import { getSlugByName } from "@/lib/neighborhoods";
import { SLUG_MAP_ES_TO_EN } from "@/lib/i18n";
import type { Property } from "@/lib/types";
import {
  resolveI18nString,
  resolveI18nPortableText,
} from "@/lib/i18n/resolveI18n";
import { formatPrice } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { propertyBySlugQuery, relatedPropertiesQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import {
  BadgeCheck, Banknote,
  Bath,
  Bed,
  Car,
  KeyRound,
  MapPin,
  Maximize,
  Phone,
  Star,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: { slug: string };
}

function BulletCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-[3px]">
      <g clipPath="url(#bc)">
        <path d="M6.99984 12.8333C10.2215 12.8333 12.8332 10.2216 12.8332 6.99996C12.8332 3.7783 10.2215 1.16663 6.99984 1.16663C3.77818 1.16663 1.1665 3.7783 1.1665 6.99996C1.1665 10.2216 3.77818 12.8333 6.99984 12.8333Z" stroke="#0C1834" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.25 7.00004L6.41667 8.16671L8.75 5.83337" stroke="#0C1834" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs><clipPath id="bc"><rect width="14" height="14" fill="white"/></clipPath></defs>
    </svg>
  );
}

// Map ES propertyType labels (Sanity) → English labels for meta + breadcrumbs.
const PROPERTY_TYPE_EN: Record<string, string> = {
  apartamento: "Apartment",
  apartaestudio: "Studio",
  casa: "House",
  "casa de playa": "Beach House",
  penthouse: "Penthouse",
  oficina: "Office",
  local: "Commercial Space",
  "lote comercial": "Commercial Lot",
  terreno: "Land",
  edificio: "Building",
  finca: "Farm",
};

function getEnCategoryHref(esCategorySlug: string): string {
  const mapped = SLUG_MAP_ES_TO_EN[`/${esCategorySlug}`];
  return mapped ? `${mapped}/` : "/en/properties-for-sale/";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await sanityFetch<Property | null>(propertyBySlugQuery, { slug: params.slug });
  if (!property) return {};
  // EN-only gate — properties without a reviewed translation do not render on
  // the EN side. Search engines must not index half-translated pages.
  if (!property.humanReviewed) {
    return { robots: { index: false, follow: false } };
  }
  // Sold/retired listings 301-redirect at the page handler below; keep their
  // metadata minimal so the pre-redirect response is not indexable.
  if (property.listingStatus !== "activa") {
    return { robots: { index: false, follow: false } };
  }
  // CMS-level noindex toggle (demo, duplicates, unpublished).
  if (property.noindex) {
    return { title: property.title, robots: { index: false, follow: false } };
  }

  const localizedTitle = resolveI18nString(property.titleI18n, "en", property.title);
  const zone = property.zone ?? "Panama";
  const intent = property.businessType === "venta" ? "Sale" : "Rent";
  const ptLabel =
    PROPERTY_TYPE_EN[property.propertyType] ??
    property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1);
  const statsParts: string[] = [];
  if (property.bedrooms != null) statsParts.push(`${property.bedrooms} BR`);
  if (property.area != null) statsParts.push(`${property.area} m²`);
  const statsStr = statsParts.length ? ` │ ${statsParts.join(", ")}` : "";
  const title = `${ptLabel} for ${intent} in ${zone}${statsStr}`;

  const intentLabel = property.businessType === "venta" ? "for sale" : "for rent";
  const parts: string[] = [`${ptLabel} ${intentLabel} in ${zone}, Panama City.`];
  if (property.bedrooms != null) parts.push(`${property.bedrooms} BR.`);
  if (property.bathrooms != null) parts.push(`${property.bathrooms} bathrooms.`);
  if (property.area != null) parts.push(`${property.area} m².`);
  parts.push(`Price: ${formatPrice(property.price)}${property.businessType === "alquiler" ? "/mo" : ""}.`);
  parts.push("Contact us today.");
  const description = parts.join(" ");

  const ogImage = property.mainImage ? urlFor(property.mainImage).width(1200).height(630).url() : undefined;
  const ogImages = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: localizedTitle }]
    : [];
  const twitterImages = ogImage
    ? [{ url: ogImage, alt: localizedTitle }]
    : [];

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonical(`/en/properties/${property.slug.current}`),
      languages: alternates(
        `/propiedades/${property.slug.current}`,
        `/en/properties/${property.slug.current}`
      ),
    },
    openGraph: { title, description, images: ogImages },
    twitter: { card: "summary_large_image", title, description, images: twitterImages },
  };
}

export default async function PropertyDetailPageEn({ params }: Props) {
  const fetched = await sanityFetch<Property | null>(propertyBySlugQuery, { slug: params.slug });
  if (!fetched) notFound();
  const property = fetched;

  // EN-side gate: until an editor approves the EN translation, the EN URL
  // returns a real 404 so search engines cannot index half-translated pages.
  // The ES route at /propiedades/[slug] is unaffected.
  if (!property.humanReviewed) notFound();

  // Sold/retired listings → 301 to best-fit category page on the EN side.
  if (property.listingStatus !== "activa") {
    const esCategorySlug = getCategorySlugFor(property.propertyType, property.businessType);
    const enCategoryHref = getEnCategoryHref(esCategorySlug);
    redirect(enCategoryHref);
  }

  const related = await sanityFetch<Property[]>(relatedPropertiesQuery, {
    zone: property.zone ?? "",
    propertyType: property.propertyType,
    currentSlug: params.slug,
  });

  const localizedTitle = resolveI18nString(property.titleI18n, "en", property.title);
  const localizedDescription = resolveI18nPortableText(
    property.descriptionI18n,
    "en",
    property.description
  );

  const galleryImages: { url: string; alt: string }[] = (property.gallery ?? []).map((img) => ({
    url: urlFor(img).width(1200).height(800).url(),
    alt: img.alt ?? localizedTitle,
  }));
  if (galleryImages.length === 0 && property.mainImage) {
    galleryImages.push({ url: urlFor(property.mainImage).width(1200).height(800).url(), alt: localizedTitle });
  }
  if (galleryImages.length === 0) {
    galleryImages.push({ url: "/hero-bg.jpg", alt: localizedTitle });
  }

  const categorySlug = getCategorySlugFor(property.propertyType, property.businessType);
  const categoryConfig = CATEGORIES.find((c) => c.slug === categorySlug);

  if (!categoryConfig) {
    console.error(
      `[en/properties/${params.slug}] No CategoryConfig matched propertyType="${property.propertyType}" businessType="${property.businessType}" (resolved slug="${categorySlug}").`
    );
  }

  const ptLabelEn =
    PROPERTY_TYPE_EN[property.propertyType] ??
    property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1);
  const intentLabelEn = property.businessType === "venta" ? "for Sale" : "for Rent";
  const categoryLabel = `${ptLabelEn}s ${intentLabelEn}`;
  const enCategoryHref = getEnCategoryHref(categorySlug);

  const neighborhoodSlug = property.zone ? getSlugByName(property.zone) : undefined;

  const waMessage = `Hi, I'm interested in property ID ${property._id}${property.zone ? ` in ${property.zone}` : ""}: ${localizedTitle} — ${BASE_URL}/en/properties/${property.slug.current}`;

  // Strip ES intent suffix that Wasi appends to titles (best-effort cleanup).
  const cleanTitle = localizedTitle
    .replace(/\s*[-–]\s*(apartment|house|penthouse|office|commercial|land)\s+(for sale|for rent).*/i, "")
    .replace(/\s*[-–]\s*(apartamento|casa|penthouse|oficina|local|terreno)\s+en\s+(venta|alquiler).*/i, "")
    .trim();

  const breadcrumbItems = [
    { label: "Home", href: "/en" },
    { label: categoryLabel, href: enCategoryHref },
    ...(neighborhoodSlug && property.zone
      ? [{ label: property.zone, href: `/en/neighborhoods/${neighborhoodSlug}/` }]
      : []),
    { label: cleanTitle },
  ];

  const jsonLdListing = listingSchema(property, "en");
  const jsonLdBreadcrumb = breadcrumbSchema(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ?? `/en/properties/${params.slug}/`,
    }))
  );

  // Localized agent role for the side panel — falls back to ES, then to the
  // legacy `role` field per resolver behavior.
  const agentRole = property.agent
    ? resolveI18nString(property.agent.roleI18n, "en", property.agent.role)
    : "";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdListing) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* LCP preload — first gallery image */}
      <link rel="preload" as="image" href={galleryImages[0].url} fetchPriority="high" />

      {/* Floating WhatsApp — mobile */}
      <WhatsAppButton message={waMessage} variant="floating" />

      {/* ── ABOVE THE FOLD: Gallery + Info ── */}
      <section className="bg-white">
        <div className="px-[30px] xl:px-[60px] 2xl:px-[160px] max-w-[1920px] mx-auto pt-[16px] pb-[32px]">
          <div className="max-w-[1440px] mx-auto flex flex-col gap-[16px]">

            <Breadcrumb items={breadcrumbItems} />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-[28px] items-start">

              <PropertyGallery images={galleryImages} propertyTitle={localizedTitle} contained />

              <div className="lg:sticky lg:top-[100px] flex flex-col gap-[12px]">

                <div className="flex items-center gap-[8px] flex-wrap">
                  {property.zone && (
                    <div className="flex items-center gap-[6px]">
                      <MapPin size={12} className="text-[#0d1835] shrink-0" />
                      <span className="font-body font-medium text-[11px] text-[#0d1835] uppercase tracking-[2px] leading-4">
                        {property.zone}
                      </span>
                    </div>
                  )}
                  {property.condition && (
                    <span className="font-body font-medium text-[11px] text-[#566070] bg-[#f0f2f5] px-[8px] py-[3px] uppercase tracking-[1px]">
                      {property.condition}
                    </span>
                  )}
                </div>

                <h1 className="font-body font-semibold text-[clamp(20px,2.2vw,28px)] text-[#0c1834] tracking-[-0.3px] leading-tight">
                  {localizedTitle}
                </h1>

              <div className="bg-white border border-[#dfe5ef] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-[26px] flex flex-col gap-[25px]">

                {(property.featured || property.recommended || property.fairPrice || property.rented) && (
                  <div className="flex flex-wrap gap-[6px]">
                    {property.featured && (
                      <span className="inline-flex items-center gap-[4px] bg-[#fef3c7] text-[#92400e] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                        <Star size={10} className="shrink-0" /> Featured
                      </span>
                    )}
                    {property.recommended && (
                      <span className="inline-flex items-center gap-[4px] bg-[#dbeafe] text-[#1e40af] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                        <BadgeCheck size={10} className="shrink-0" /> Recommended
                      </span>
                    )}
                    {property.fairPrice && (
                      <span className="inline-flex items-center gap-[4px] bg-[#dcfce7] text-[#166534] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                        <Banknote size={10} className="shrink-0" /> Fair Price
                      </span>
                    )}
                    {property.rented && property.businessType === "venta" && (
                      <span className="inline-flex items-center gap-[4px] bg-[#f0fdf4] text-[#15803d] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                        <KeyRound size={10} className="shrink-0" /> Rented
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-[6px]">
                  <p className="font-body font-medium text-[11px] lg:text-[14px] text-[#566070] tracking-[4px] uppercase leading-4">
                    {property.businessType === "venta" ? "Sale price" : "Rental price"}
                  </p>
                  <div className="flex items-end gap-[8px] flex-wrap">
                    <span className="font-body font-bold text-[40px] lg:text-[46px] text-[#0c1834] tracking-[-0.6px] leading-[1.1]">
                      {formatPrice(property.price)}
                    </span>
                    {property.businessType === "alquiler" && (
                      <span className="font-body font-normal text-[16px] lg:text-[20px] text-[#566070] pb-[4px]">/mo</span>
                    )}
                  </div>
                  {property.businessType === "venta" && property.area && property.area > 0 && (
                    <span className="font-body font-medium text-[13px] lg:text-[16px] text-[#5a6478]">
                      {formatPrice(Math.round(property.price / property.area))}/m²
                    </span>
                  )}
                  {property.adminFee != null && property.adminFee > 0 && (
                    <p className="font-body font-normal text-[12px] lg:text-[14px] text-[#8a95a3] leading-4">
                      + ${property.adminFee}/mo maintenance
                    </p>
                  )}
                </div>

                {(property.bedrooms != null || property.bathrooms != null || property.area != null || property.parking != null) && (
                  <div className="flex border-y border-[#dfe5ef] py-[14px] gap-[8px]">
                    {property.bedrooms != null && (
                      <div className="flex-1 flex flex-col items-center gap-[2px]">
                        <Bed size={15} className="text-[#0c1935]" />
                        <span className="font-body font-medium text-[13px] lg:text-[15px] text-[#0d1835] leading-none whitespace-nowrap">
                          {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} BR`}
                        </span>
                      </div>
                    )}
                    {property.bathrooms != null && (
                      <div className="flex-1 flex flex-col items-center gap-[2px]">
                        <Bath size={15} className="text-[#0c1935]" />
                        <span className="font-body font-medium text-[13px] lg:text-[15px] text-[#0d1835] leading-none whitespace-nowrap">
                          {property.bathrooms}{property.halfBathrooms ? ".5" : ""} {property.bathrooms === 1 ? "bath" : "baths"}
                        </span>
                      </div>
                    )}
                    {property.area != null && (
                      <div className="flex-1 flex flex-col items-center gap-[2px]">
                        <Maximize size={15} className="text-[#0c1935]" />
                        <span className="font-body font-medium text-[13px] lg:text-[15px] text-[#0d1835] leading-none whitespace-nowrap">
                          {property.area} m²
                        </span>
                      </div>
                    )}
                    {property.parking != null && (
                      <div className="flex-1 flex flex-col items-center gap-[2px]">
                        <Car size={15} className="text-[#0c1935]" />
                        <span className="font-body font-medium text-[13px] lg:text-[15px] text-[#0d1835] leading-none whitespace-nowrap">
                          {property.parking} park.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-[#f8f8f9] p-[15px] flex flex-col sm:flex-row sm:items-center gap-[10px] sm:gap-[12px]">
                  {property.agent ? (
                    <div className="flex-1 flex items-center gap-[10px] min-w-0">
                      {property.agent.photo ? (
                        <Image
                          src={urlFor(property.agent.photo).width(80).height(80).url()}
                          alt={property.agent.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover w-[40px] h-[40px] shrink-0"
                        />
                      ) : (
                        <div className="w-[40px] h-[40px] rounded-full bg-[#0c1834] flex items-center justify-center shrink-0">
                          <span className="font-heading font-medium text-[16px] text-white leading-[20px]">
                            {property.agent.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <a
                          href={"/en/agents/" + (property.agent.slug?.current ?? "")}
                          className="font-body font-medium text-[16px] text-[#0c1935] tracking-[-0.16px] hover:opacity-70 transition-opacity block truncate leading-5"
                        >
                          {property.agent.name}
                        </a>
                        {agentRole ? (
                          <p className="font-body text-[12px] text-[#5a6478] leading-4">{agentRole}</p>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-[10px] min-w-0">
                      <div className="w-[40px] h-[40px] rounded-full bg-[#0c1834] flex items-center justify-center shrink-0">
                        <span className="font-heading font-medium text-[16px] text-white leading-[20px]">PM</span>
                      </div>
                      <div>
                        <p className="font-body font-medium text-[16px] text-[#0c1935] tracking-[-0.16px] leading-5">Panamares team</p>
                        <p className="font-body text-[12px] text-[#5a6478] leading-4">Real estate advisor</p>
                      </div>
                    </div>
                  )}
                  <div className="shrink-0 flex flex-col items-start sm:items-end">
                    <p className="font-body text-[12px] text-[#5a6478] leading-normal">Available Monday</p>
                    <p className="font-body text-[12px] text-[#5a6478] leading-normal">
                      to Saturday <span className="font-semibold">8am – 7pm</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-[10px]">
                  <WhatsAppButton message={waMessage} />
                  <a
                    href={"tel:" + (property.agent?.phone ?? PANAMARES_TEL)}
                    className="flex items-center justify-center gap-[8px] border border-[#dfe5ef] px-[21px] py-[13px] hover:bg-[#f9f9f9] transition-colors"
                  >
                    <Phone size={18} className="text-[#0d1835] shrink-0" />
                    <span className="font-body font-medium text-[14px] text-[#0d1835] leading-5">Call now</span>
                  </a>
                  <ShareButton
                    url={`${BASE_URL}/en/properties/${property.slug.current}`}
                    title={localizedTitle}
                  />
                </div>
              </div>

              {property.businessType === "venta" && property.rentalEstimate && (
                <div className="bg-white border border-[#dfe5ef] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-[26px] flex items-center gap-[10px]">
                  <div className="flex-1 min-w-0 font-body font-medium uppercase text-[#737B8C] text-[12px] tracking-[5px] leading-4">Rental estimate</div>
                  <div className="flex-1 min-w-0 text-[#0C1834] text-[40px] font-bold tracking-[-0.4px] leading-[40px] flex items-center gap-[10px]">
                    <span>${property.rentalEstimate}</span>
                  </div>
                </div>
              )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BELOW FOLD: Description, Features, Map ── */}
      <section className="bg-[#f9f9f9] border-t border-[#dfe5ef]">
        <div className="px-[30px] xl:px-[60px] 2xl:px-[160px] max-w-[1920px] mx-auto py-[36px]">
          <div className="max-w-[1440px] mx-auto flex flex-col gap-[32px]">

              {localizedDescription.length > 0 && (
                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-body font-bold text-[17px] text-[#0c1834] tracking-[-0.4px] leading-6">Description</h2>
                  <div className="font-body font-normal text-[14px] text-[#5a6478] leading-[21px] [&_p]:mb-3 [&_p:last-child]:mb-0 max-w-[760px]">
                    <PortableText value={localizedDescription} />
                  </div>
                </div>
              )}

              {/* Catalog-driven internal features (translated via labelI18n). */}
              {(property.featuresInternal ?? []).length > 0 && (
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-body font-bold text-[17px] text-[#0c1834] tracking-[-0.4px] leading-6">Interior features</h2>
                  <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[12px] gap-y-[10px]">
                    {(property.featuresInternal ?? []).map((f) => (
                      <li key={f._id} className="flex items-start gap-[7px]">
                        <BulletCheck />
                        <span className="font-body font-normal text-[13px] text-[#5a6478] leading-[18px]">
                          {resolveI18nString(f.labelI18n, "en", f.name)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(property.featuresExternal ?? []).length > 0 && (
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-body font-bold text-[17px] text-[#0c1834] tracking-[-0.4px] leading-6">External features</h2>
                  <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[12px] gap-y-[10px]">
                    {(property.featuresExternal ?? []).map((f) => (
                      <li key={f._id} className="flex items-start gap-[7px]">
                        <BulletCheck />
                        <span className="font-body font-normal text-[13px] text-[#5a6478] leading-[18px]">
                          {resolveI18nString(f.labelI18n, "en", f.name)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legacy string-array features (Wasi). Render if catalog refs are
                  empty — the translation pass for these strings is the
                  responsibility of the translator, not this PR. */}
              {(property.featuresInternal ?? []).length === 0 &&
               (property.featuresExternal ?? []).length === 0 &&
               (property.featuresInterior ?? []).length > 0 && (
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-body font-bold text-[17px] text-[#0c1834] tracking-[-0.4px] leading-6">Interior</h2>
                  <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[12px] gap-y-[10px]">
                    {(property.featuresInterior ?? []).map((f, i) => (
                      <li key={i} className="flex items-start gap-[7px]">
                        <BulletCheck />
                        <span className="font-body font-normal text-[13px] text-[#5a6478] leading-[18px]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(property.featuresInternal ?? []).length === 0 &&
               (property.featuresExternal ?? []).length === 0 &&
               (property.featuresBuilding ?? []).length > 0 && (
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-body font-bold text-[17px] text-[#0c1834] tracking-[-0.4px] leading-6">Building amenities</h2>
                  <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[12px] gap-y-[10px]">
                    {(property.featuresBuilding ?? []).map((f, i) => (
                      <li key={i} className="flex items-start gap-[7px]">
                        <BulletCheck />
                        <span className="font-body font-normal text-[13px] text-[#5a6478] leading-[18px]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(property.featuresInternal ?? []).length === 0 &&
               (property.featuresExternal ?? []).length === 0 &&
               (property.featuresLocation ?? []).length > 0 && (
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-body font-bold text-[17px] text-[#0c1834] tracking-[-0.4px] leading-6">Area &amp; location</h2>
                  <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-[12px] gap-y-[10px]">
                    {(property.featuresLocation ?? []).map((f, i) => (
                      <li key={i} className="flex items-start gap-[7px]">
                        <BulletCheck />
                        <span className="font-body font-normal text-[13px] text-[#5a6478] leading-[18px]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Map */}
              {property.location && (
                <div className="flex flex-col gap-[12px]">
                  <h2 className="font-body font-bold text-[17px] text-[#0c1834] tracking-[-0.4px] leading-6">Location</h2>
                  <div className="relative bg-white border border-[#dfe5ef] overflow-hidden h-[256px]">
                    <PropertyMap
                      lat={property.location.lat}
                      lng={property.location.lng}
                      title={localizedTitle}
                      className="w-full h-[256px]"
                    />
                    {property.zone && (
                      <div className="absolute bottom-0 left-0 z-10 pointer-events-none">
                        {neighborhoodSlug ? (
                          <Link
                            href={`/en/neighborhoods/${neighborhoodSlug}/`}
                            className="pointer-events-auto inline-flex items-center gap-[6px] bg-white/90 backdrop-blur-sm border border-[#dfe5ef] px-[12px] py-[7px] hover:bg-white transition-colors"
                          >
                            <MapPin size={12} className="text-[#b8891e] shrink-0" />
                            <span className="font-body font-medium text-[12px] text-[#0c1834] tracking-[-0.2px]">{property.zone}</span>
                          </Link>
                        ) : (
                          <div className="inline-flex items-center gap-[6px] bg-white/90 backdrop-blur-sm border border-[#dfe5ef] px-[12px] py-[7px]">
                            <MapPin size={12} className="text-[#b8891e] shrink-0" />
                            <span className="font-body font-medium text-[12px] text-[#0c1834] tracking-[-0.2px]">{property.zone}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

          </div>
        </div>
      </section>

      {/* Related properties */}
      {related.length > 0 && (
        <section className="px-[30px] xl:px-[60px] 2xl:px-[160px] py-[56px]">
          <div className="max-w-[1440px] mx-auto flex flex-col gap-[24px]">

            <h2 className="font-heading font-normal text-[clamp(24px,2.5vw,36px)] text-[#0c1834] tracking-[-1px] leading-none">
              Related properties
            </h2>

            <PropertyGrid properties={related.slice(0, 4)} cols={4} gap="tight" locale="en" />

          </div>
        </section>
      )}

      <CTA locale="en" />
    </>
  );
}
