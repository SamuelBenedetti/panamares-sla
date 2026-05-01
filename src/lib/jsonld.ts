import type { Property, Agent, Neighborhood, SanityImage } from "@/lib/types";
import type { PortableTextBlock } from "@portabletext/types";
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

// Resolve a Sanity image ref to a CDN URL without pulling the full image
// pipeline into this module. Returns undefined if the image is malformed
// (missing asset or _ref), which can happen for placeholder gallery entries.
function sanityImageUrl(image: SanityImage | undefined | null): string | undefined {
  const ref = image?.asset?._ref;
  if (typeof ref !== "string" || ref.length === 0) return undefined;
  const filename = ref.replace("image-", "").replace(/-([a-z]+)$/, ".$1");
  return `https://cdn.sanity.io/images/2hojajwk/production/${filename}`;
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/buscar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
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

// Listing detail page — Apartment / House / Place + Offer
export function listingSchema(property: Property) {
  const propertyUrl = `${BASE_URL}/propiedades/${property.slug.current}`;
  const isRental = property.businessType === "alquiler";
  const description = flattenPortableText(property.description);

  // Build image array from the gallery, falling back to mainImage. Google
  // prefers an image array; multiple photos improve rich-result eligibility.
  // Filter out any malformed entries so the schema stays valid.
  const galleryUrls = (() => {
    const fromGallery = property.gallery?.map(sanityImageUrl).filter((u): u is string => Boolean(u)) ?? [];
    if (fromGallery.length > 0) return fromGallery;
    const main = sanityImageUrl(property.mainImage);
    return main ? [main] : undefined;
  })();

  const offer = property.price
    ? {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "USD",
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
    name: property.title,
    ...(description && { description }),
    url: propertyUrl,
    ...(galleryUrls && { image: galleryUrls }),
    address: {
      "@type": "PostalAddress",
      ...(property.corregimiento && { streetAddress: property.corregimiento }),
      addressLocality: property.zone ?? "Ciudad de Panamá",
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

// Neighborhood guide page — Place
export function neighborhoodSchema(neighborhood: Neighborhood, imageUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: neighborhood.name,
    url: `${BASE_URL}/barrios/${neighborhood.slug?.current ?? ""}`,
    ...(neighborhood.seoBlock && { description: neighborhood.seoBlock }),
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
