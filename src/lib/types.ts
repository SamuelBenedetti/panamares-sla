import type { PortableTextBlock } from "@portabletext/types";

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface Property {
  _id: string;
  wasiId?: number;
  title: string;
  slug: { current: string };
  businessType: "venta" | "alquiler";
  propertyType: string;
  listingStatus: "activa" | "vendida" | "retirada";
  price: number;
  zone?: string;
  province?: string;
  buildingName?: string;
  tower?: string;
  model?: string;
  floor?: number;
  yearBuilt?: number;
  condition?: string;
  corregimiento?: string;
  bedrooms?: number;
  bathrooms?: number;
  halfBathrooms?: number;
  area?: number;
  parking?: number;
  adminFee?: number;
  floorSize?: number;
  rentalEstimate?: number;
  publishedAt?: string;
  noindex?: boolean;
  description?: PortableTextBlock[];
  featuresInterior?: string[];
  featuresBuilding?: string[];
  featuresLocation?: string[];
  /** @deprecated use featuresInterior / featuresBuilding / featuresLocation */
  features?: string[];
  gallery?: (SanityImage & { alt?: string })[];
  mainImage?: SanityImage;
  location?: { lat: number; lng: number };
  agent?: Agent;
  featured?: boolean;
  recommended?: boolean;
  fairPrice?: boolean;
  rented?: boolean;
}

export interface Agent {
  _id: string;
  name: string;
  slug: { current: string };
  photo?: SanityImage;
  role?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  bio?: PortableTextBlock[];
  properties?: Property[];
}

export interface Neighborhood {
  _id: string;
  name: string;
  slug: { current: string };
  photo?: SanityImage;
  avgPricePerM2?: number;
  seoBlock?: string;
}

export interface GuideAuthor {
  _id?: string;
  name: string;
  slug?: { current: string };
  photo?: SanityImage;
  role?: string;
  credentials?: string;
  bio?: PortableTextBlock[];
  linkedin?: string;
}

export interface Guide {
  _id: string;
  /** ISO 8601 date — set by Sanity automatically on document creation. */
  _createdAt?: string;
  /** ISO 8601 date — set by Sanity automatically on every save. */
  _updatedAt?: string;
  title: string;
  slug: { current: string };
  category: "comprar" | "alquilar" | "invertir" | "vivir";
  excerpt: string;
  readTime: number;
  coverImage?: SanityImage;
  body?: PortableTextBlock[];
  faqs?: { question: string; answer: string }[];
  author?: GuideAuthor;
}

export interface Lead {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  propertyId?: string;
}

export interface PropertyFilter {
  businessType?: string;
  propertyType?: string;
  zone?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
}
