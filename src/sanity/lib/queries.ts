import { groq } from "next-sanity";

// Shared field set for listing cards
const CARD_FIELDS = groq`
  _id,
  wasiId,
  title,
  slug,
  businessType,
  propertyType,
  listingStatus,
  price,
  bedrooms,
  bathrooms,
  area,
  zone,
  publishedAt,
  mainImage,
  location,
  featured,
  recommended,
  fairPrice,
  rented
`;

// Properties — all active (used for old /propiedades page)
export const allPropertiesQuery = groq`
  *[_type == "property" && listingStatus == "activa"] | order(_createdAt desc) {
    ${CARD_FIELDS},
    "agent": agent->{name, slug, photo}
  }
`;

// Comparison page — fetch properties by list of wasiIds (numbers)
export const propertiesByIdsQuery = groq`
  *[_type == "property" && wasiId in $ids] {
    ${CARD_FIELDS}
  }
`;

// Homepage — featured active listings
export const featuredPropertiesQuery = groq`
  *[_type == "property" && featured == true && listingStatus == "activa"] | order(_createdAt desc) [0...6] {
    ${CARD_FIELDS}
  }
`;

// Listing detail page
export const propertyBySlugQuery = groq`
  *[_type == "property" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    businessType,
    propertyType,
    listingStatus,
    price,
    adminFee,
    bedrooms,
    bathrooms,
    halfBathrooms,
    area,
    parking,
    province,
    zone,
    corregimiento,
    condition,
    floor,
    yearBuilt,
    description,
    featuresInterior,
    featuresBuilding,
    featuresLocation,
    features,
    floorSize,
    rentalEstimate,
    publishedAt,
    noindex,
    gallery[] { asset->, alt },
    mainImage,
    location,
    featured,
    "agent": agent->{_id, name, slug, photo, phone, whatsapp, email, role}
  }
`;

// Related listings — same neighborhood + type, exclude current
export const relatedPropertiesQuery = groq`
  *[
    _type == "property" &&
    listingStatus == "activa" &&
    zone == $zone &&
    propertyType == $propertyType &&
    slug.current != $currentSlug
  ] | order(_createdAt desc) [0...6] {
    ${CARD_FIELDS}
  }
`;

// Tier 1 pillar pages — all active by intent
export const propertiesByIntentQuery = groq`
  *[_type == "property" && businessType == $businessType && listingStatus == "activa"] | order(_createdAt desc) {
    ${CARD_FIELDS}
  }
`;

// Tier 2 category pages — active by propertyType + businessType
export const propertiesByCategoryQuery = groq`
  *[_type == "property" && propertyType == $propertyType && businessType == $businessType && listingStatus == "activa"] | order(_createdAt desc) {
    ${CARD_FIELDS}
  }
`;

// Tier 3 geo-type pages — active by propertyType + businessType + zone
export const propertiesByGeoTypeQuery = groq`
  *[_type == "property" && propertyType == $propertyType && businessType == $businessType && zone == $neighborhood && listingStatus == "activa"] | order(_createdAt desc) {
    ${CARD_FIELDS}
  }
`;

// Intent + geo pages — all types, by businessType + zone (e.g. /propiedades-en-venta/avenida-balboa/)
export const propertiesByIntentGeoQuery = groq`
  *[_type == "property" && businessType == $businessType && zone == $neighborhood && listingStatus == "activa"] | order(_createdAt desc) {
    ${CARD_FIELDS}
  }
`;

// Tier 5 neighborhood guide pages — all active in a zone
export const propertiesByNeighborhoodQuery = groq`
  *[_type == "property" && zone == $neighborhood && listingStatus == "activa"] | order(_createdAt desc) {
    ${CARD_FIELDS}
  }
`;

// Nav dropdown counts — by propertyType + businessType
export const navCountsQuery = groq`{
  "venta": {
    "apartamento":    count(*[_type == "property" && propertyType == "apartamento"  && businessType == "venta" && listingStatus == "activa"]),
    "casa":           count(*[_type == "property" && propertyType == "casa"         && businessType == "venta" && listingStatus == "activa"]),
    "penthouse":      count(*[_type == "property" && propertyType == "penthouse"    && businessType == "venta" && listingStatus == "activa"]),
    "oficina":        count(*[_type == "property" && propertyType == "oficina"      && businessType == "venta" && listingStatus == "activa"]),
    "local":          count(*[_type == "property" && propertyType == "local"        && businessType == "venta" && listingStatus == "activa"]),
    "terreno":        count(*[_type == "property" && propertyType == "terreno"      && businessType == "venta" && listingStatus == "activa"]),
    "casa de playa":  count(*[_type == "property" && propertyType == "casa de playa" && businessType == "venta" && listingStatus == "activa"])
  },
  "alquiler": {
    "apartamento":   count(*[_type == "property" && propertyType == "apartamento"  && businessType == "alquiler" && listingStatus == "activa"]),
    "casa":          count(*[_type == "property" && propertyType == "casa"         && businessType == "alquiler" && listingStatus == "activa"]),
    "penthouse":     count(*[_type == "property" && propertyType == "penthouse"    && businessType == "alquiler" && listingStatus == "activa"]),
    "oficina":       count(*[_type == "property" && propertyType == "oficina"      && businessType == "alquiler" && listingStatus == "activa"]),
    "local":         count(*[_type == "property" && propertyType == "local"        && businessType == "alquiler" && listingStatus == "activa"]),
    "terreno":       count(*[_type == "property" && propertyType == "terreno"      && businessType == "alquiler" && listingStatus == "activa"]),
    "casa de playa": count(*[_type == "property" && propertyType == "casa de playa" && businessType == "alquiler" && listingStatus == "activa"])
  }
}`;

// Zones that have at least 1 active property (used to hide empty neighborhoods)
export const activeZonesQuery = groq`
  array::unique(*[_type == "property" && listingStatus == "activa" && defined(zone)].zone)
`;

// Per-zone property counts (for barrios index page)
export const zonePropertyZonesQuery = groq`
  *[_type == "property" && listingStatus == "activa" && defined(zone)] {
    "zone": zone
  }
`;

// All neighborhood CMS docs (for avgPricePerM2 + photo)
export const allNeighborhoodContentQuery = groq`
  *[_type == "neighborhood"] {
    "slug": slug.current,
    avgPricePerM2,
    photo
  }
`;

// Homepage trust strip stats
export const siteStatsQuery = groq`{
  "activeListings": count(*[_type == "property" && listingStatus == "activa"]),
  "agents": count(*[_type == "agent"])
}`;

// Homepage neighborhood counts
export const neighborhoodCountsQuery = groq`{
  "puntaPacifica": count(*[_type == "property" && zone == "Punta Pacífica" && listingStatus == "activa"]),
  "puntaPaitilla": count(*[_type == "property" && zone == "Punta Paitilla" && listingStatus == "activa"]),
  "avenidaBalboa": count(*[_type == "property" && zone == "Avenida Balboa" && listingStatus == "activa"]),
  "costaDelEste": count(*[_type == "property" && zone == "Costa del Este" && listingStatus == "activa"])
}`;

// Homepage property type counts
export const propertyTypeCountsQuery = groq`{
  "apartamento": count(*[_type == "property" && propertyType == "apartamento" && listingStatus == "activa"]),
  "casa": count(*[_type == "property" && propertyType == "casa" && listingStatus == "activa"]),
  "penthouse": count(*[_type == "property" && propertyType == "penthouse" && listingStatus == "activa"]),
  "oficina": count(*[_type == "property" && propertyType == "oficina" && listingStatus == "activa"]),
  "local": count(*[_type == "property" && propertyType == "local" && listingStatus == "activa"]),
  "terreno": count(*[_type == "property" && propertyType == "terreno" && listingStatus == "activa"])
}`;

// Neighborhood content (from Sanity CMS — optional editorial)
export const neighborhoodContentQuery = groq`
  *[_type == "neighborhood" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    photo,
    avgPricePerM2,
    seoBlock
  }
`;

// All guides
export const allGuidesQuery = groq`
  *[_type == "guide"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    category,
    excerpt,
    readTime,
    coverImage,
    "author": author->{ name, slug, photo, role, credentials }
  }
`;

// Single guide by slug
export const guideBySlugQuery = groq`
  *[_type == "guide" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    excerpt,
    readTime,
    _createdAt,
    _updatedAt,
    coverImage,
    body,
    faqs[] { question, answer },
    "author": author->{ _id, name, slug, photo, role, credentials, bio, linkedin }
  }
`;

// Agents
export const allAgentsQuery = groq`
  *[_type == "agent"] | order(name asc) {
    _id,
    name,
    slug,
    photo,
    role,
    phone,
    whatsapp,
    email
  }
`;

export const agentBySlugQuery = groq`
  *[_type == "agent" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    photo,
    role,
    phone,
    whatsapp,
    email,
    bio,
    "properties": *[_type == "property" && listingStatus == "activa" && references(^._id)] | order(_createdAt desc) {
      ${CARD_FIELDS}
    }
  }
`;
