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
  titleI18n?: import("./i18n/resolveI18n").I18nString[];
  slug: { current: string };
  businessType: "venta" | "alquiler";
  propertyType: string;
  listingStatus: "activa" | "vendida" | "retirada";
  price: number;
  zone?: string;
  province?: string;
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
  humanReviewed?: boolean;
  description?: PortableTextBlock[];
  descriptionI18n?: import("./i18n/resolveI18n").I18nPortableText[];
  featuresInterior?: string[];
  featuresBuilding?: string[];
  featuresLocation?: string[];
  featuresInternal?: Feature[];
  featuresExternal?: Feature[];
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

export interface Feature {
  _id: string;
  slug?: { current: string } | string;
  wasiId?: number;
  category: "interna" | "externa";
  labelI18n?: import("./i18n/resolveI18n").I18nString[];
  name: string;
}

export interface Agent {
  _id: string;
  name: string;
  slug: { current: string };
  photo?: SanityImage;
  role?: string;
  roleI18n?: import("./i18n/resolveI18n").I18nString[];
  phone?: string;
  whatsapp?: string;
  email?: string;
  bio?: PortableTextBlock[];
  bioI18n?: import("./i18n/resolveI18n").I18nPortableText[];
  humanReviewed?: boolean;
  properties?: Property[];
}

export interface Neighborhood {
  _id: string;
  name: string;
  slug: { current: string };
  photo?: SanityImage;
  avgPricePerM2?: number;
  seoBlock?: string;
  seoBlockI18n?: import("./i18n/resolveI18n").I18nText[];
  humanReviewed?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface GuideAuthor {
  _id?: string;
  name: string;
  slug?: { current: string };
  photo?: SanityImage;
  role?: string;
  roleI18n?: import("./i18n/resolveI18n").I18nString[];
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
  titleI18n?: import("./i18n/resolveI18n").I18nString[];
  slug: { current: string };
  category: "comprar" | "alquilar" | "invertir" | "vivir";
  excerpt: string;
  readTime: number;
  coverImage?: SanityImage;
  body?: PortableTextBlock[];
  bodyI18n?: import("./i18n/resolveI18n").I18nPortableText[];
  faqs?: { question: string; answer: string }[];
  author?: GuideAuthor;
  humanReviewed?: boolean;
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
