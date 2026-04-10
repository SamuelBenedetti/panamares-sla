import type { Property, Agent, Neighborhood } from "@/lib/types";

const BASE_URL = "https://panamares.com";

// Root layout — Organization
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "Organization"],
    name: "Panamares",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/barrio-punta-pacifica.png`,
      width: 200,
      height: 60,
    },
    description:
      "Panamares — inmobiliaria de lujo en Panama City. Apartamentos, casas, penthouses, oficinas y más en las mejores zonas de la ciudad.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Panama City",
      addressRegion: "Panamá",
      addressCountry: "PA",
    },
    areaServed: {
      "@type": "City",
      name: "Panama City",
      addressCountry: "PA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
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

// Maps Sanity propertyType → schema.org @type
function propertySchemaType(type: string): string {
  switch (type.toLowerCase()) {
    case "apartamento":
    case "apartaestudio":
    case "penthouse":
    case "edificio":
      return "Apartment";
    case "casa":
    case "casa de playa":
      return "House";
    case "oficina":
      return "OfficeSpace";
    default:
      return "Residence";
  }
}

// Homepage — RealEstateAgent
export function realEstateAgentSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Panamares",
    url: BASE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Panama City",
      addressCountry: "PA",
    },
    areaServed: {
      "@type": "City",
      name: "Panama City",
    },
  };
}

// Listing detail page — Apartment / House / OfficeSpace
export function listingSchema(property: Property) {
  return {
    "@context": "https://schema.org",
    "@type": propertySchemaType(property.propertyType),
    name: property.title,
    url: `${BASE_URL}/propiedades/${property.slug.current}`,
    ...(property.price && {
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "USD",
        availability:
          property.listingStatus === "activa"
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
        ...(property.agent && {
          seller: {
            "@type": "RealEstateAgent",
            name: property.agent.name,
            url: `${BASE_URL}/agentes/${property.agent.slug?.current ?? ""}`,
          },
        }),
      },
    }),
    ...(property.bedrooms != null && { numberOfRooms: property.bedrooms }),
    ...(property.bathrooms != null && { numberOfBathroomsTotal: property.bathrooms }),
    ...(property.area != null && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.area,
        unitCode: "MTK",
      },
    }),
    ...(property.zone && {
      address: {
        "@type": "PostalAddress",
        addressLocality: property.zone,
        addressRegion: property.province ?? "Panamá",
        addressCountry: "PA",
      },
    }),
    ...(property.location && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.location.lat,
        longitude: property.location.lng,
      },
    }),
    ...(property.mainImage && {
      image: {
        "@type": "ImageObject",
        url: `https://cdn.sanity.io/images/2hojajwk/production/${property.mainImage.asset._ref.replace("image-", "").replace(/-([a-z]+)$/, ".$1")}`,
        width: 1200,
        height: 800,
      },
    }),
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
export function neighborhoodSchema(neighborhood: Neighborhood) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: neighborhood.name,
    url: `${BASE_URL}/barrios/${neighborhood.slug?.current ?? ""}`,
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
      logo: { "@type": "ImageObject", url: `${BASE_URL}/barrio-punta-pacifica.png` },
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

// Contact page — ContactPoint
export function contactPointSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Panamares",
    url: BASE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Panama City",
      addressCountry: "PA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: ["Spanish", "English"],
    },
  };
}
