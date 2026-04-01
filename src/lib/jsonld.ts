import type { Property, Agent, Neighborhood } from "@/lib/types";

const BASE_URL = "https://panamares.com";

// Maps Sanity propertyType → schema.org @type
function propertySchemaType(type: string): string {
  switch (type) {
    case "Apartamento":
    case "Apartaestudio":
    case "Penthouse":
    case "Edificio":
      return "Apartment";
    case "Casa":
    case "Casa de Playa":
      return "House";
    case "Oficina":
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
      },
    }),
    ...(property.bedrooms != null && { numberOfRooms: property.bedrooms }),
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
