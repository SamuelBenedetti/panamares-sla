import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Bed, Bath, Maximize, Car, MapPin, Phone,
  Star, BadgeCheck, Banknote, KeyRound, Building2, Home,
} from "lucide-react";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/client";
import { propertyBySlugQuery, relatedPropertiesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { getCategorySlugFor } from "@/lib/categories";
import type { Property } from "@/lib/types";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyMap from "@/components/properties/PropertyMap";
import PropertyCard from "@/components/properties/PropertyCard";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ShareButton from "@/components/ui/ShareButton";
import { listingSchema, breadcrumbSchema } from "@/lib/jsonld";
import { BASE_URL } from "@/lib/config";
import { CATEGORIES } from "@/lib/categories";
import { getSlugByName } from "@/lib/neighborhoods";
import CTA from "@/components/home/CTA";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

// ── Placeholder property for layout testing ──────────────────────────────────
const DEMO_GALLERY: { url: string; alt: string }[] = [
  { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop", alt: "Vista exterior" },
  { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop", alt: "Sala de estar" },
  { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop", alt: "Cocina" },
  { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop", alt: "Fachada" },
  { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop", alt: "Habitación principal" },
];

const DEMO_PROPERTY: Property = {
  _id: "demo-001",
  title: "Luxe Residences Torre A — Apto 1803",
  slug: { current: "demo" },
  businessType: "venta",
  propertyType: "apartamento",
  listingStatus: "activa",
  price: 485000,
  zone: "Punta Pacifica",
  buildingName: "Luxe Residences",
  bedrooms: 3,
  bathrooms: 2,
  area: 151,
  parking: 1,
  adminFee: 380,
  rentalEstimate: 2800,
  featured: true,
  recommended: true,
  featuresInterior: ["Aire acondicionado", "Amueblado parcial", "Cocina equipada", "Closets empotrados", "Pisos de mármol", "Balcón panorámico"],
  featuresBuilding: ["Piscina infinita", "Gimnasio equipado", "Área de BBQ", "Salón social", "Conserje 24h", "Lobby con seguridad"],
  featuresLocation: ["Acceso al Corredor Sur", "Cerca de Johns Hopkins", "Parque Urracá a 5 min", "Comunidad cerrada"],
};

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

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (params.slug === "demo") return { title: "Demo — Panamares", robots: { index: false, follow: false } };
  const property = await sanityFetch<Property | null>(propertyBySlugQuery, { slug: params.slug });
  if (!property) return {};
  // Sold/retired listings 301-redirect at the page handler below; keep their
  // metadata minimal so the pre-redirect response is not indexable.
  if (property.listingStatus !== "activa") {
    return { robots: { index: false, follow: false } };
  }

  const zone = property.zone ?? "Panama";
  const intent = property.businessType === "venta" ? "Venta" : "Alquiler";
  const ptLabel = property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1);
  const statsParts: string[] = [];
  if (property.bedrooms != null) statsParts.push(`${property.bedrooms} Hab`);
  if (property.area != null) statsParts.push(`${property.area}m²`);
  const statsStr = statsParts.length ? ` | ${statsParts.join(", ")}` : "";
  const buildingPrefix = property.buildingName ? `${property.buildingName} — ` : "";
  const title = `${buildingPrefix}${ptLabel} en ${intent} en ${zone}${statsStr}`;

  const intentLabel = property.businessType === "venta" ? "en venta" : "en alquiler";
  const parts: string[] = [`${property.propertyType} ${intentLabel} en ${zone}, Panama City.`];
  if (property.bedrooms != null) parts.push(`${property.bedrooms} hab.`);
  if (property.bathrooms != null) parts.push(`${property.bathrooms} baños.`);
  if (property.area != null) parts.push(`${property.area} m².`);
  parts.push(`Precio: ${formatPrice(property.price)}${property.businessType === "alquiler" ? "/mes" : ""}.`);
  if (property.buildingName) parts.push(`Edificio ${property.buildingName}.`);
  parts.push("Contáctanos hoy.");
  const description = parts.join(" ");

  const ogImage = property.mainImage ? urlFor(property.mainImage).width(1200).height(630).url() : undefined;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE_URL}/propiedades/${property.slug.current}/` },
    openGraph: { title, description, images: ogImage ? [{ url: ogImage }] : [] },
    twitter: { card: "summary_large_image", title, description, images: ogImage ? [ogImage] : [] },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const isDemo = params.slug === "demo";

  let property: Property;
  let related: Property[];
  let galleryImages: { url: string; alt: string }[];

  if (isDemo) {
    property = DEMO_PROPERTY;
    related = [];
    galleryImages = DEMO_GALLERY;
  } else {
    const fetched = await sanityFetch<Property | null>(propertyBySlugQuery, { slug: params.slug });
    if (!fetched) notFound();
    property = fetched;

    // Sold/retired listings → 301 to best-fit category page (SEO doc §4.4).
    if (property.listingStatus !== "activa") {
      redirect(`/${getCategorySlugFor(property.propertyType, property.businessType)}/`);
    }

    related = await sanityFetch<Property[]>(relatedPropertiesQuery, {
      zone: property.zone ?? "",
      propertyType: property.propertyType,
      currentSlug: params.slug,
    });

    galleryImages = (property.gallery ?? []).map((img) => ({
      url: urlFor(img).width(1200).height(800).url(),
      alt: img.alt ?? property.title,
    }));
    if (galleryImages.length === 0 && property.mainImage) {
      galleryImages.push({ url: urlFor(property.mainImage).width(1200).height(800).url(), alt: property.title });
    }
    if (galleryImages.length === 0) {
      galleryImages.push({ url: "/placeholder-property.jpg", alt: property.title });
    }
  }

  // Derive category slug (e.g. "apartamentos-en-venta")
  const categorySlug = (() => {
    const typeMap: Record<string, string> = {
      apartamento: "apartamentos", apartaestudio: "apartaestudios", casa: "casas",
      "casa de playa": "casas-de-playa", penthouse: "penthouses", oficina: "oficinas",
      local: "locales-comerciales", terreno: "terrenos", edificio: "edificios",
      finca: "fincas", "lote comercial": "lotes-comerciales",
    };
    const t = typeMap[property.propertyType] ?? "propiedades";
    const i = property.businessType === "venta" ? "venta" : "alquiler";
    return `${t}-en-${i}`;
  })();

  const categoryConfig = CATEGORIES.find((c) => c.slug === categorySlug);
  // Short label without " en Panama" — e.g. "Apartamentos en Venta"
  const categoryLabel = categoryConfig
    ? categoryConfig.h1.replace(/ en Panama$/, "")
    : property.businessType === "venta" ? "Propiedades en Venta" : "Propiedades en Alquiler";

  const neighborhoodSlug = property.zone ? getSlugByName(property.zone) : undefined;

  const waMessage = `Hola, me interesa la propiedad ID ${property._id}${property.zone ? ` en ${property.zone}` : ""}: ${property.title} — ${BASE_URL}/propiedades/${property.slug.current}`;

  const conditionLabel =
    property.condition === "nuevo" ? "Nuevo" :
    property.condition === "en_planos" ? "En planos" :
    property.condition === "en_construccion" ? "En construcción" :
    property.condition === "usado" ? "Usado" : null;

  // Build breadcrumb items — Inicio → Categoría → Geo-tipo → Título
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: categoryLabel, href: `/${categorySlug}/` },
    ...(neighborhoodSlug
      ? [{ label: `${categoryLabel} en ${property.zone}`, href: `/${categorySlug}/${neighborhoodSlug}/` }]
      : []),
    { label: property.title },
  ];

  const jsonLdListing = listingSchema(property);
  const jsonLdBreadcrumb = breadcrumbSchema(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ?? `/propiedades/${params.slug}/`,
    }))
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdListing) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* LCP preload — first gallery image */}
      <link rel="preload" as="image" href={galleryImages[0].url} fetchPriority="high" />

      {/* Floating WhatsApp — mobile */}
      <WhatsAppButton message={waMessage} variant="floating" />

      {/* Breadcrumb */}
      <div className="px-[30px] xl:px-[20px] 2xl:px-[120px] max-w-[1920px] mx-auto py-[20px]">
        <div className="max-w-[1600px] mx-auto">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Full-width gallery */}
      <PropertyGallery images={galleryImages} propertyTitle={property.title} />

      {/* ── MAIN: Content + Sidebar ── */}
      <section className="bg-[#f9f9f9]">
        <div className="px-[30px] xl:px-[20px] 2xl:px-[120px] max-w-[1920px] mx-auto py-[40px]">
          <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-[32px] items-start">

            {/* Right: Sticky sidebar — order-2 on desktop so content column is left */}
            <div className="lg:sticky lg:top-[100px] flex flex-col gap-[16px] lg:order-2">

              {/* Main card — price, stats, CTAs */}
              <div className="bg-white border border-[#dfe5ef] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-[26px] flex flex-col gap-[25px]">

                {/* Badges */}
                {(property.featured || property.recommended || property.fairPrice || property.rented) && (
                  <div className="flex flex-wrap gap-[6px]">
                    {property.featured && (
                      <span className="inline-flex items-center gap-[4px] bg-[#fef3c7] text-[#92400e] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                        <Star size={10} className="shrink-0" /> Destacado
                      </span>
                    )}
                    {property.recommended && (
                      <span className="inline-flex items-center gap-[4px] bg-[#dbeafe] text-[#1e40af] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                        <BadgeCheck size={10} className="shrink-0" /> Recomendado
                      </span>
                    )}
                    {property.fairPrice && (
                      <span className="inline-flex items-center gap-[4px] bg-[#dcfce7] text-[#166534] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                        <Banknote size={10} className="shrink-0" /> Buen precio
                      </span>
                    )}
                    {property.rented && property.businessType === "venta" && (
                      <span className="inline-flex items-center gap-[4px] bg-[#f0fdf4] text-[#15803d] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                        <KeyRound size={10} className="shrink-0" /> Rentado
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="flex flex-col gap-[6px]">
                  <p className="font-body font-medium text-[11px] text-[#566070] tracking-[4px] uppercase leading-4">
                    {property.businessType === "venta" ? "Precio de venta" : "Precio de alquiler"}
                  </p>
                  <div className="flex items-end gap-[8px] flex-wrap">
                    <span className="font-body font-bold text-[40px] text-[#0c1834] tracking-[-0.6px] leading-[1.1]">
                      {formatPrice(property.price)}
                    </span>
                    {property.businessType === "alquiler" && (
                      <span className="font-body font-normal text-[16px] text-[#566070] pb-[4px]">/mes</span>
                    )}
                  </div>
                  {property.businessType === "venta" && property.area && property.area > 0 && (
                    <span className="font-body font-medium text-[13px] text-[#737b8c]">
                      {formatPrice(Math.round(property.price / property.area))}/m²
                    </span>
                  )}
                  {property.adminFee != null && property.adminFee > 0 && (
                    <p className="font-body font-normal text-[12px] text-[#8a95a3] leading-4">
                      + ${property.adminFee}/mes mantenimiento
                    </p>
                  )}
                </div>

                {/* Stats row — centered columns, icon above label */}
                {(property.bedrooms != null || property.bathrooms != null || property.area != null || property.parking != null) && (
                  <div className="flex border-y border-[#dfe5ef] py-[14px] gap-[12px]">
                    {property.bedrooms != null && (
                      <div className="flex-1 flex flex-col items-center gap-[2px]">
                        <Bed size={16} className="text-[#0c1935]" />
                        <span className="font-body font-medium text-[15px] text-[#0d1835] leading-none">
                          {property.bedrooms === 0 ? "Estudio" : `${property.bedrooms} hab.`}
                        </span>
                      </div>
                    )}
                    {property.bathrooms != null && (
                      <div className="flex-1 flex flex-col items-center gap-[2px]">
                        <Bath size={16} className="text-[#0c1935]" />
                        <span className="font-body font-medium text-[15px] text-[#0d1835] leading-none">
                          {property.bathrooms}{property.halfBathrooms ? ".5" : ""} {property.bathrooms === 1 ? "baño" : "baños"}
                        </span>
                      </div>
                    )}
                    {property.area != null && (
                      <div className="flex-1 flex flex-col items-center gap-[2px]">
                        <Maximize size={16} className="text-[#0c1935]" />
                        <span className="font-body font-medium text-[15px] text-[#0d1835] leading-none">
                          {property.area} m²
                        </span>
                      </div>
                    )}
                    {property.parking != null && (
                      <div className="flex-1 flex flex-col items-center gap-[2px]">
                        <Car size={16} className="text-[#0c1935]" />
                        <span className="font-body font-medium text-[15px] text-[#0d1835] leading-none">
                          {property.parking} park.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Agent strip */}
                <div className="bg-[#f8f8f9] p-[15px] flex items-center gap-[12px]">
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
                          href={"/agentes/" + (property.agent.slug?.current ?? "")}
                          className="font-body font-medium text-[16px] text-[#0c1935] tracking-[-0.16px] hover:opacity-70 transition-opacity block truncate leading-5"
                        >
                          {property.agent.name}
                        </a>
                        {property.agent.role && (
                          <p className="font-body text-[12px] text-[#737b8c] leading-4">{property.agent.role}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-[10px] min-w-0">
                      <div className="w-[40px] h-[40px] rounded-full bg-[#0c1834] flex items-center justify-center shrink-0">
                        <span className="font-heading font-medium text-[16px] text-white leading-[20px]">PM</span>
                      </div>
                      <div>
                        <p className="font-body font-medium text-[16px] text-[#0c1935] tracking-[-0.16px] leading-5">Equipo Panamares</p>
                        <p className="font-body text-[12px] text-[#737b8c] leading-4">Asesor inmobiliario</p>
                      </div>
                    </div>
                  )}
                  <div className="shrink-0 flex flex-col items-start">
                    <p className="font-body text-[12px] text-[#737b8c] leading-normal">Atención disponible de lunes</p>
                    <p className="font-body text-[12px] text-[#737b8c] leading-normal">
                      a sábado <span className="font-semibold">8am – 7pm</span>
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-[10px]">
                  <WhatsAppButton message={waMessage} />
                  <a
                    href={"tel:" + (property.agent?.phone ?? "+50769998888")}
                    className="flex items-center justify-center gap-[8px] border border-[#dfe5ef] px-[21px] py-[13px] hover:bg-[#f9f9f9] transition-colors"
                  >
                    <Phone size={18} className="text-[#0d1835] shrink-0" />
                    <span className="font-body font-medium text-[14px] text-[#0d1835] leading-5">Llamar ahora</span>
                  </a>
                  <div className="flex justify-center pt-[2px]">
                    <ShareButton
                      url={`${BASE_URL}/propiedades/${property.slug.current}/`}
                      title={property.title}
                    />
                  </div>
                </div>
              </div>

              {/* Rental estimate */}
              {property.businessType === "venta" && property.rentalEstimate && (
                <div className="bg-white border border-[#dfe5ef] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-[26px] flex items-center gap-[10px]">
                  <div className="flex-1 min-w-0 font-body font-medium uppercase text-[#737B8C] text-[12px] tracking-[5px] leading-4">Estimación de alquiler</div>
                  <div className="flex-1 min-w-0 text-[#0C1834] text-[40px] font-bold tracking-[-0.4px] leading-[40px] flex items-center gap-[10px]">
                    <div className="shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="27" viewBox="0 0 34 27" fill="none">
  <path d="M4.94903 25.122L2.31148 26.6681C2.05292 26.8189 1.7255 26.8176 1.56569 26.52L0.054622 23.7071C-0.0818029 23.4537 0.054622 23.1471 0.272902 23.0262L1.14472 22.5442C1.04987 22.0804 0.288493 21.2397 0.853682 20.8681L1.81905 20.2328L1.32272 19.1323C1.21488 18.8932 1.31363 18.6334 1.52151 18.4904L2.49468 17.8213L1.93729 16.522L2.98971 12.4773C1.56829 11.1378 0.935537 9.23953 1.1798 7.31659C1.60207 3.97483 4.65019 1.63352 8.03093 2.15453C9.22757 0.540818 11.1739 -0.299819 13.2034 0.0977624C15.0068 0.451168 16.5854 1.80372 17.1441 3.68639L22.7921 4.21909C23.2144 4.25937 23.6107 4.53222 23.916 4.83755L33.0578 13.9637C33.3098 14.2158 33.289 14.5419 33.0422 14.7888L25.1854 22.6689C24.9697 22.8859 24.6436 22.8599 24.4292 22.6455L15.2731 13.4869C14.9444 13.1582 14.6963 12.7528 14.6534 12.3071L14.4039 9.77094C13.8491 10.0425 13.2787 10.2023 12.6265 10.2569C11.8651 12.1421 10.3034 13.6844 8.25831 14.1365L5.22448 24.727C5.1764 24.8933 5.11274 25.0271 4.95033 25.122H4.94903ZM14.3013 8.58729L14.0817 6.42138C13.9518 5.14289 14.682 3.96963 15.9878 3.6669C15.5018 2.36891 14.3455 1.42043 13.0864 1.15798C11.6261 0.852647 10.2033 1.3035 9.1808 2.44427C11.8781 3.49279 13.4477 6.2005 12.9604 9.07842C13.4801 9.01346 13.866 8.83675 14.3013 8.58599V8.58729ZM2.24652 25.4715L4.22663 24.2995L7.30203 13.5571C7.48913 12.9022 8.23232 13.3752 9.59397 12.4228C10.3839 11.8706 11.0284 11.1352 11.4221 10.2257C10.484 10.0373 9.69662 9.71117 9.02099 9.14338C8.80661 8.96278 8.84299 8.62757 8.97421 8.44827C9.12493 8.24298 9.44845 8.14813 9.67972 8.31184C10.3112 8.7588 11.005 9.09141 11.817 9.14079C12.3666 6.67864 10.9699 4.21779 8.56104 3.44602C8.36875 3.71497 8.32067 4.01511 8.24401 4.34902C9.03008 4.65955 9.52251 5.34687 9.50952 6.12514C9.49523 6.95539 8.98201 7.64921 8.2765 7.90906C7.48003 8.2014 6.65629 7.93505 6.12098 7.3036C5.69092 6.79688 5.59997 6.10825 5.84424 5.46511C6.04303 4.9428 6.51597 4.48675 7.14222 4.32174C7.20329 3.93975 7.32282 3.61493 7.42676 3.23034C4.50857 3.00946 2.12698 5.35337 2.20234 8.23258C2.24002 9.6631 2.86368 10.9572 3.96027 11.868C4.0954 11.9797 4.18245 12.1941 4.13697 12.376L3.09235 16.4441L3.70431 17.8148C3.81735 18.0682 3.70821 18.3488 3.48343 18.4969L2.53496 19.1232L3.01569 20.1288C3.12743 20.3614 3.09235 20.6641 2.87407 20.8097L1.89441 21.4593L2.39204 22.5013C2.51287 22.756 2.43231 23.0353 2.19454 23.1796L1.27595 23.7382L2.24652 25.4767V25.4715ZM24.8502 21.5113L31.9339 14.3964L23.2118 5.67689C23.013 5.4859 22.8428 5.37156 22.5829 5.27281L16.3567 4.72711C15.7305 4.67254 15.1042 5.40274 15.1601 6.01211L15.724 12.2084C15.8162 12.4384 15.9306 12.5878 16.1034 12.7788L24.8515 21.5126L24.8502 21.5113ZM8.42072 6.14333C8.42072 5.70028 8.06211 5.34168 7.61906 5.34168C7.176 5.34168 6.8174 5.70028 6.8174 6.14333C6.8174 6.58639 7.176 6.94499 7.61906 6.94499C8.06211 6.94499 8.42072 6.58639 8.42072 6.14333Z" fill="#0C1834"/>
  <path d="M24.2242 16.2363C23.9721 16.4884 23.6564 16.4975 23.4381 16.2935C23.2198 16.0895 23.1809 15.7608 23.4134 15.5282L26.0029 12.9348C26.2264 12.7113 26.546 12.7087 26.763 12.9062C26.98 13.1037 27.0072 13.4558 26.7669 13.6949L24.2255 16.2363H24.2242Z" fill="#0C1834"/>
  <path d="M21.1969 13.2078C20.9461 13.4598 20.6265 13.4767 20.3913 13.2467C20.2042 13.0648 20.1575 12.7231 20.3874 12.4932L22.973 9.90628C23.2017 9.67761 23.52 9.66981 23.7461 9.88939C23.9306 10.0687 23.9865 10.4104 23.7617 10.6365L21.1969 13.2078Z" fill="#0C1834"/>
</svg>
                    </div>
                    <span>${property.rentalEstimate}</span>
                  </div>
                </div>
              )}

            </div>

            {/* Left: Content */}
            <div className="flex flex-col gap-[40px] lg:order-1">

              {/* Zone + H1 + inline stats strip */}
              <div className="flex flex-col gap-[20px]">
                {/* Zone */}
                {property.zone && (
                  <div className="flex items-center gap-[8px]">
                    <MapPin size={13} className="text-[#0d1835] shrink-0" />
                    <span className="font-body font-normal text-[12px] text-[#0d1835] uppercase tracking-[1.2px] leading-4">
                      {property.zone}
                    </span>
                  </div>
                )}

                {/* H1 */}
                <h1 className="font-body font-semibold text-[35px] text-[#0c1834] tracking-[-0.35px] leading-tight">
                  {property.title}
                </h1>

                {/* Inline stats strip — icon + bold number + gray label */}
                {(property.bedrooms != null || property.bathrooms != null || property.area != null || property.parking != null || property.propertyType || property.buildingName) && (
                  <div className="flex flex-wrap items-center gap-x-[24px] gap-y-[12px] border-y border-[#dfdfdf] py-[21px]">
                    {property.bedrooms != null && (
                      <div className="flex items-center gap-[8px]">
                        <Bed size={16} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-bold text-[14px] text-[#0c1935] leading-5">{property.bedrooms}</span>
                        <span className="font-body font-normal text-[14px] text-[#737b8c] leading-5">Habitaciones</span>
                      </div>
                    )}
                    {property.bathrooms != null && (
                      <div className="flex items-center gap-[8px]">
                        <Bath size={16} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-bold text-[14px] text-[#0c1935] leading-5">
                          {property.bathrooms}{property.halfBathrooms ? ".5" : ""}
                        </span>
                        <span className="font-body font-normal text-[14px] text-[#737b8c] leading-5">Baños</span>
                      </div>
                    )}
                    {property.area != null && (
                      <div className="flex items-center gap-[8px]">
                        <Maximize size={16} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-bold text-[14px] text-[#0c1935] leading-5">{property.area}</span>
                        <span className="font-body font-normal text-[14px] text-[#737b8c] leading-5">m²</span>
                      </div>
                    )}
                    {property.parking != null && (
                      <div className="flex items-center gap-[8px]">
                        <Car size={16} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-bold text-[14px] text-[#0c1935] leading-5">{property.parking}</span>
                        <span className="font-body font-normal text-[14px] text-[#737b8c] leading-5">Plazas de aparcamiento</span>
                      </div>
                    )}
                    {property.propertyType && (
                      <div className="flex items-center gap-[8px]">
                        <Home size={16} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-bold text-[14px] text-[#0c1935] leading-5 capitalize">{property.propertyType}</span>
                      </div>
                    )}
                    {property.buildingName && (
                      <div className="flex items-center gap-[8px]">
                        <Building2 size={16} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-bold text-[14px] text-[#0c1935] leading-5">{property.buildingName}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Descripción</h2>
                  <div className="font-body font-normal text-[16px] text-[#737b8c] leading-[22.75px] [&_p]:mb-3 [&_p:last-child]:mb-0">
                    <PortableText value={property.description} />
                  </div>
                </div>
              )}

              {/* Características — 3 categorías */}
              {(property.featuresInterior ?? []).length > 0 && (
                <div className="flex flex-col gap-[24px]">
                  <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Interior</h2>
                  <ul className="grid grid-cols-2 lg:grid-cols-3 gap-x-[12px] gap-y-[12px]">
                    {(property.featuresInterior ?? []).map((f, i) => (
                      <li key={i} className="flex items-start gap-[8px]">
                        <BulletCheck />
                        <span className="font-body font-normal text-[14px] text-[#737b8c] leading-5">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(property.featuresBuilding ?? []).length > 0 && (
                <div className="flex flex-col gap-[24px]">
                  <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Amenidades del edificio</h2>
                  <ul className="grid grid-cols-2 lg:grid-cols-3 gap-x-[12px] gap-y-[12px]">
                    {(property.featuresBuilding ?? []).map((f, i) => (
                      <li key={i} className="flex items-start gap-[8px]">
                        <BulletCheck />
                        <span className="font-body font-normal text-[14px] text-[#737b8c] leading-5">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(property.featuresLocation ?? []).length > 0 && (
                <div className="flex flex-col gap-[24px]">
                  <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Ubicación</h2>
                  <ul className="grid grid-cols-2 lg:grid-cols-3 gap-x-[12px] gap-y-[12px]">
                    {(property.featuresLocation ?? []).map((f, i) => (
                      <li key={i} className="flex items-start gap-[8px]">
                        <BulletCheck />
                        <span className="font-body font-normal text-[14px] text-[#737b8c] leading-5">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fallback: legacy flat array */}
              {(property.featuresInterior ?? []).length === 0 &&
               (property.featuresBuilding ?? []).length === 0 &&
               (property.featuresLocation ?? []).length === 0 &&
               (property.features ?? []).length > 0 && (
                <div className="flex flex-col gap-[24px]">
                  <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Características</h2>
                  <ul className="grid grid-cols-2 lg:grid-cols-3 gap-x-[12px] gap-y-[12px]">
                    {(property.features ?? []).map((f, i) => (
                      <li key={i} className="flex items-start gap-[8px]">
                        <BulletCheck />
                        <span className="font-body font-normal text-[14px] text-[#737b8c] leading-5">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ubicación */}
              <div className="flex flex-col gap-[16px]">
                <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Ubicación</h2>
                <div className="relative bg-white border border-[#dfe5ef] overflow-hidden h-[256px]">
                  {property.location ? (
                    <>
                      <PropertyMap
                        lat={property.location.lat}
                        lng={property.location.lng}
                        title={property.title}
                        className="w-full h-[256px]"
                      />
                      {/* Neighborhood overlay */}
                      {property.zone && (
                        <div className="absolute bottom-0 left-0 z-10 pointer-events-none">
                          {neighborhoodSlug ? (
                            <Link
                              href={`/barrios/${neighborhoodSlug}/`}
                              className="pointer-events-auto inline-flex items-center gap-[6px] bg-white/90 backdrop-blur-sm border border-[#dfe5ef] px-[12px] py-[7px] hover:bg-white transition-colors"
                            >
                              <MapPin size={12} className="text-[#d4a435] shrink-0" />
                              <span className="font-body font-medium text-[12px] text-[#0c1834] tracking-[-0.2px]">{property.zone}</span>
                            </Link>
                          ) : (
                            <div className="inline-flex items-center gap-[6px] bg-white/90 backdrop-blur-sm border border-[#dfe5ef] px-[12px] py-[7px]">
                              <MapPin size={12} className="text-[#d4a435] shrink-0" />
                              <span className="font-body font-medium text-[12px] text-[#0c1834] tracking-[-0.2px]">{property.zone}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-[8px]">
                      <MapPin size={32} className="text-[#d4a435]" />
                      <p className="font-body font-normal text-[14px] text-[#737b8c] leading-5 text-center">
                        {[property.zone, "Ciudad de Panamá"].filter(Boolean).join(", ")}
                      </p>
                      <p className="font-body font-normal text-[12px] text-[rgba(115,123,140,0.6)] leading-4">
                        Panamá, República de Panamá
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Related properties */}
      {related.length > 0 && (
        <section className="px-[30px] xl:px-[20px] 2xl:px-[120px] py-[80px]">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-[32px]">

            <h2 className="font-heading font-normal text-[clamp(28px,3vw,42px)] text-[#0c1834] tracking-[-1.2px] leading-none">
              Propiedades relacionadas
            </h2>

            {/* Mobile: horizontal scroll */}
            <div className="flex lg:hidden overflow-x-auto gap-[16px] pb-[8px] snap-x snap-mandatory -mx-[30px] px-[30px]">
              {related.slice(0, 6).map((p) => (
                <div key={p._id} className="min-w-[260px] snap-start shrink-0">
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>

            {/* Desktop: 3-col grid */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {related.slice(0, 6).map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>

          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
