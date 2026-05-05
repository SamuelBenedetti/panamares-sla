import type { Property, Agent, Neighborhood, SanityImage } from "@/lib/types";
import type { PortableTextBlock } from "@portabletext/types";
import type { Locale } from "@/lib/copy";
import { resolveI18nString, resolveI18nPortableText, resolveI18nText } from "@/lib/i18n/resolveI18n";
import {
  BASE_URL,
  PANAMARES_PHONE,
  PANAMARES_STREET,
  PANAMARES_LOCALITY,
  PANAMARES_LAT,
  PANAMARES_LNG,
  PANAMARES_OPENING_HOURS,
  PANAMARES_EMAIL_INFO,
  PANAMARES_EMAIL_VENTAS,
} from "@/lib/config";

// Resolve a Sanity image ref to a CDN URL plus the dimensions encoded in the
// asset id (`image-{hash}-{width}x{height}-{format}`). Returns undefined if
// the image is malformed (missing asset or _ref), which can happen for
// placeholder gallery entries.
type SanityImageDescriptor = { url: string; width?: number; height?: number };
function sanityImageDescriptor(
  image: SanityImage | undefined | null,
): SanityImageDescriptor | undefined {
  const ref = image?.asset?._ref;
  if (typeof ref !== "string" || ref.length === 0) return undefined;
  const filename = ref.replace("image-", "").replace(/-([a-z]+)$/, ".$1");
  const url = `https://cdn.sanity.io/images/2hojajwk/production/${filename}`;
  const dims = ref.match(/^image-[^-]+-(\d+)x(\d+)-[a-z]+$/);
  if (!dims) return { url };
  return { url, width: Number(dims[1]), height: Number(dims[2]) };
}

// Flatten Sanity Portable Text into a single plain-text description for
// schema.org. Only walks blocks of _type "block" — image / embed nodes that
// can appear in the same array are ignored. Returns undefined when no usable
// text is found.
function flattenPortableText(blocks?: PortableTextBlock[]): string | undefined {
  if (!Array.isArray(blocks) || blocks.length === 0) return undefined;
  const text = blocks
    .filter((b): b is PortableTextBlock => (b as { _type?: string })?._type === "block")
    .map((b) => {
      const children = (b as { children?: { text?: string }[] }).children;
      return Array.isArray(children) ? children.map((c) => c.text ?? "").join("") : "";
    })
    .filter(Boolean)
    .join(" ")
    .trim();
  return text || undefined;
}

// Sitewide WebSite schema with SearchAction — declares the site has a
// /buscar search box so Google may render a sitelinks search box for branded
// queries. Companion to organizationSchema (which describes the business).
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Panamares",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/buscar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Homepage + Root layout — RealEstateAgent + Organization (unified)
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "Organization"],
    name: "Panamares",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      // Note: using absolute URL for logo to ensure it works in contexts like Google Search where relative URLs may not resolve correctly
      url: `${BASE_URL}/logo.png`,
      width: 200,
      height: 60,
    },
    description:
      "Panamares — inmobiliaria de lujo en Panama City. Apartamentos, casas, penthouses, oficinas y más en las mejores zonas de la ciudad.",
    telephone: PANAMARES_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: PANAMARES_STREET,
      addressLocality: PANAMARES_LOCALITY,
      addressRegion: "Panamá",
      addressCountry: "PA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: PANAMARES_LAT,
      longitude: PANAMARES_LNG,
    },
    openingHours: PANAMARES_OPENING_HOURS,
    areaServed: {
      "@type": "City",
      name: "Panama City",
      addressCountry: "PA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: PANAMARES_PHONE,
      availableLanguage: ["Spanish", "English"],
    },
    sameAs: [
      "https://www.instagram.com/panamares",
      "https://www.facebook.com/panamares",
    ],
  };
}

// Maps Sanity propertyType → [Product, residence-specific schema.org type].
// Product is included so Google treats the listing as eligible for rich
// results across both real-estate and shopping-style result formats.
function propertySchemaTypes(type: string): string[] {
  const t = type.toLowerCase();
  if (["apartamento", "apartaestudio", "penthouse", "edificio"].includes(t)) {
    return ["Product", "Apartment"];
  }
  if (["casa", "casa de playa"].includes(t)) {
    return ["Product", "House"];
  }
  if (
    ["oficina", "local", "local comercial", "terreno", "lote comercial", "finca"].includes(t)
  ) {
    return ["Product", "Place"];
  }
  return ["Product", "Residence"];
}

// Listing detail page — Apartment / House / Place + Offer.
// `locale` selects which translation to emit for `name` and `description`,
// and which canonical URL the schema points at. Defaults to `"es"` so existing
// callers continue to render the ES variant unchanged.
export function listingSchema(property: Property, locale: Locale = "es") {
  const propertyPath =
    locale === "en"
      ? `/en/properties/${property.slug.current}`
      : `/propiedades/${property.slug.current}`;
  const propertyUrl = `${BASE_URL}${propertyPath}`;
  const isRental = property.businessType === "alquiler";

  // Localized title/description with graceful fallback to the legacy field via
  // the i18n resolver — keeps the schema valid even when EN translations are
  // empty (resolver picks ES, then the legacy field).
  const localizedTitle = resolveI18nString(property.titleI18n, locale, property.title);
  const localizedDescriptionBlocks = resolveI18nPortableText(
    property.descriptionI18n,
    locale,
    property.description
  );
  const description =
    flattenPortableText(localizedDescriptionBlocks) ?? flattenPortableText(property.description);

  // Build image array as ImageObject entries (with width/height when the
  // Sanity asset ref encodes them). Falls back to mainImage when no gallery,
  // and filters malformed entries so the schema stays valid.
  const imageObjects = (() => {
    const fromGallery = property.gallery?.map(sanityImageDescriptor).filter(
      (d): d is SanityImageDescriptor => Boolean(d),
    ) ?? [];
    const sources = fromGallery.length > 0
      ? fromGallery
      : (() => {
          const main = sanityImageDescriptor(property.mainImage);
          return main ? [main] : [];
        })();
    if (sources.length === 0) return undefined;
    return sources.map((s) => ({
      "@type": "ImageObject" as const,
      url: s.url,
      ...(s.width && s.height && { width: s.width, height: s.height }),
    }));
  })();

  // Listings without an explicit expiry are treated by Google as "unknown".
  // Setting priceValidUntil to ~6 months out silences the Rich Results Test
  // warning without committing to a hard rotation date.
  const priceValidUntil = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().slice(0, 10);
  })();

  const offer = property.price
    ? {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "USD",
        priceValidUntil,
        availability:
          property.listingStatus === "activa"
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
        url: propertyUrl,
        seller: {
          "@type": "RealEstateAgent",
          name: "Panamares",
          url: BASE_URL,
        },
        ...(isRental && {
          // Monthly unit-price specification distinguishes rentals from sales
          // for Google's structured-data parser.
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: property.price,
            priceCurrency: "USD",
            unitCode: "MON",
          },
        }),
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": propertySchemaTypes(property.propertyType),
    name: localizedTitle,
    ...(description && { description }),
    url: propertyUrl,
    ...(imageObjects && { image: imageObjects }),
    address: {
      "@type": "PostalAddress",
      ...(property.corregimiento && { streetAddress: property.corregimiento }),
      ...(property.zone && { addressLocality: property.zone }),
      addressRegion: property.province ?? "Panamá",
      addressCountry: "PA",
    },
    ...(property.location && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.location.lat,
        longitude: property.location.lng,
      },
    }),
    ...(property.area != null && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.area,
        unitCode: "MTK",
      },
    }),
    ...(property.bedrooms != null && { numberOfRooms: property.bedrooms }),
    ...(property.bathrooms != null && { numberOfBathroomsTotal: property.bathrooms }),
    ...(offer && { offers: offer }),
  };
}

// Category pages (Tier 2 & 3) — ItemList with top 5 listings
export function itemListSchema(
  pageUrl: string,
  pageName: string,
  listings: Pick<Property, "_id" | "title" | "slug">[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageName,
    url: `${BASE_URL}${pageUrl}`,
    numberOfItems: listings.length,
    itemListElement: listings.slice(0, 5).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${BASE_URL}/propiedades/${p.slug.current}`,
    })),
  };
}

// All pages except homepage — BreadcrumbList
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

// Agent profile page — Person
export function agentSchema(agent: Agent) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: agent.name,
    url: `${BASE_URL}/agentes/${agent.slug?.current ?? ""}`,
    ...(agent.phone && { telephone: agent.phone }),
    ...(agent.email && { email: agent.email }),
    worksFor: {
      "@type": "RealEstateAgent",
      name: "Panamares",
    },
  };
}

// Neighborhood guide page — Place + AdministrativeArea (dual type) with
// optional GeoCoordinates + hasMap. Defensive: geo/hasMap only emitted when
// both lat AND lng are finite numbers, preventing malformed schema for docs
// where coords are null/undefined/0,0/NaN.
//
// `locale` selects which translation to emit for `description`, falling back
// through the `resolveI18nText` chain to the legacy `seoBlock` field when no
// i18n entry is available. Defaults to `"es"` so existing callers keep their
// previous behavior unchanged.
export function neighborhoodSchema(
  neighborhood: Neighborhood,
  imageUrl?: string,
  locale: Locale = "es",
) {
  const lat = neighborhood.latitude;
  const lng = neighborhood.longitude;
  const hasValidCoords =
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0);

  // Localized description with graceful fallback. `resolveI18nText` walks
  // requested locale → ES → fallback. Empty string means "no description".
  const description = resolveI18nText(
    neighborhood.seoBlockI18n,
    locale,
    neighborhood.seoBlock,
  );

  return {
    "@context": "https://schema.org",
    "@type": ["Place", "AdministrativeArea"],
    name: neighborhood.name,
    url: `${BASE_URL}/barrios/${neighborhood.slug?.current ?? ""}`,
    ...(description && { description }),
    ...(imageUrl && {
      image: { "@type": "ImageObject", url: imageUrl, width: 1200, height: 630 },
    }),
    address: {
      "@type": "PostalAddress",
      addressLocality: neighborhood.name,
      addressRegion: "Panamá",
      addressCountry: "PA",
    },
    containedInPlace: {
      "@type": "City",
      name: "Panama City",
      addressCountry: "PA",
    },
    ...(hasValidCoords && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: lat,
        longitude: lng,
      },
      hasMap: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    }),
  };
}

// FAQ pages
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Article (guides/blog posts)
export function articleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  image,
}: {
  title: string;
  description?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    ...(description && { description }),
    url: url.startsWith("http") ? url : `${BASE_URL}${url}`,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    publisher: {
      "@type": "Organization",
      name: "Panamares",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png`, width: 200, height: 60 },
    },
    ...(authorName && {
      author: {
        "@type": "Person",
        name: authorName,
        ...(authorUrl && { url: authorUrl.startsWith("http") ? authorUrl : `${BASE_URL}${authorUrl}` }),
      },
    }),
    ...(image && { image: { "@type": "ImageObject", url: image } }),
  };
}

// Contact page — RealEstateAgent with ContactPoint (brief §4 — schema.org/ContactPoint)
export function contactPointSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Panamares",
    url: `${BASE_URL}/contacto`,
    telephone: PANAMARES_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: PANAMARES_STREET,
      addressLocality: PANAMARES_LOCALITY,
      addressRegion: "Panamá",
      addressCountry: "PA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: PANAMARES_LAT,
      longitude: PANAMARES_LNG,
    },
    openingHours: PANAMARES_OPENING_HOURS,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: PANAMARES_PHONE,
        email: PANAMARES_EMAIL_VENTAS,
        availableLanguage: ["Spanish", "English"],
        areaServed: "PA",
      },
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: PANAMARES_PHONE,
        email: PANAMARES_EMAIL_INFO,
        availableLanguage: ["Spanish", "English"],
        areaServed: "PA",
      },
    ],
  };
}
