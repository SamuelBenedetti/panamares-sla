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
  title: string;
  slug: { current: string };
  businessType: "venta" | "alquiler";
  propertyType: string;
  listingStatus: "activa" | "vendida" | "retirada";
  price: number;
  zone?: string;
  province?: string;
  buildingName?: string;
  bedrooms?: number;
  bathrooms?: number;
  halfBathrooms?: number;
  area?: number;
  parking?: number;
  adminFee?: number;
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
  about?: PortableTextBlock[];
  avgPricePerM2?: number;
  seoBlock?: string;
}

export interface Guide {
  _id: string;
  title: string;
  slug: { current: string };
  category: "comprar" | "alquilar" | "invertir" | "vivir";
  excerpt: string;
  readTime: number;
  coverImage?: SanityImage;
  body?: PortableTextBlock[];
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
