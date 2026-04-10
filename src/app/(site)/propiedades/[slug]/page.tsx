import { notFound } from "next/navigation";
import Image from "next/image";
import { Bed, Bath, Maximize, Car, MapPin, Check, Phone, Star, BadgeCheck, Banknote, KeyRound } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/client";
import { propertyBySlugQuery, relatedPropertiesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { Property } from "@/lib/types";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyMap from "@/components/properties/PropertyMap";
import PropertyGrid from "@/components/properties/PropertyGrid";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ShareButton from "@/components/ui/ShareButton";
import { listingSchema, breadcrumbSchema } from "@/lib/jsonld";
import { BASE_URL } from "@/lib/config";
import CTA from "@/components/home/CTA";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await sanityFetch<Property | null>(propertyBySlugQuery, { slug: params.slug });
  if (!property) return {};

  const zone = property.zone ?? "Panama";
  const intent = property.businessType === "venta" ? "Venta" : "Alquiler";
  const ptLabel = property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1);
  const title = `${property.title} | ${ptLabel} en ${intent} | Panamares`;
  const intentLabel = property.businessType === "venta" ? "en venta" : "en alquiler";
  const parts: string[] = [
    `${property.propertyType} ${intentLabel} en ${zone}, Panama City.`,
  ];
  if (property.bedrooms != null) parts.push(`${property.bedrooms} hab.`);
  if (property.bathrooms != null) parts.push(`${property.bathrooms} baños.`);
  if (property.area != null) parts.push(`${property.area} m².`);
  parts.push(`Precio: ${formatPrice(property.price)}${property.businessType === "alquiler" ? "/mes" : ""}.`);
  if (property.buildingName) parts.push(`Edificio ${property.buildingName}.`);
  parts.push("Contáctanos hoy.");
  const description = parts.join(" ");

  const ogImage = property.mainImage
    ? urlFor(property.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE_URL}/propiedades/${property.slug.current}/` },
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const property = await sanityFetch<Property | null>(propertyBySlugQuery, { slug: params.slug });
  if (!property) notFound();

  const related = await sanityFetch<Property[]>(relatedPropertiesQuery, {
    zone: property.zone ?? "",
    propertyType: property.propertyType,
    currentSlug: params.slug,
  });

  const galleryImages = (property.gallery ?? []).map((img) => ({
    url: urlFor(img).width(1200).height(800).url(),
    alt: img.alt ?? property.title,
  }));
  if (galleryImages.length === 0 && property.mainImage) {
    galleryImages.push({ url: urlFor(property.mainImage).width(1200).height(800).url(), alt: property.title });
  }
  if (galleryImages.length === 0) {
    galleryImages.push({ url: "/placeholder-property.jpg", alt: property.title });
  }

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

  const waMessage = `Hola, me interesa esta propiedad: ${property.title} — ${BASE_URL}/propiedades/${property.slug.current}`;

  const jsonLdListing = listingSchema(property);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: property.businessType === "venta" ? "Propiedades en Venta" : "Propiedades en Alquiler", url: property.businessType === "venta" ? "/propiedades-en-venta/" : "/propiedades-en-alquiler/" },
    { name: property.title, url: `/propiedades/${params.slug}` },
  ]);


  const conditionLabel =
    property.condition === "nuevo" ? "Nuevo" :
    property.condition === "en_planos" ? "En planos" :
    property.condition === "en_construccion" ? "En construcción" :
    property.condition === "usado" ? "Usado" : null;

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
          <Breadcrumb items={[
            { label: "Inicio", href: "/" },
            { label: property.businessType === "venta" ? "Propiedades en Venta" : "Propiedades en Alquiler", href: `/${categorySlug}/` },
            { label: property.title },
          ]} />
        </div>
      </div>

      {/* ── HERO: Gallery + Key Info — above the fold ── */}
      <section className="px-[30px] xl:px-[20px] 2xl:px-[120px] max-w-[1920px] mx-auto pb-[40px]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-[32px] items-start">

            {/* Gallery — contained, left column */}
            <PropertyGallery images={galleryImages} contained propertyTitle={property.title} />

            {/* Key info — right column, sticky */}
            <div className="lg:sticky lg:top-[24px] lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto flex flex-col gap-[16px]">

              {/* Main card */}
              <div className="bg-white border border-[#dfe5ef] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-[26px] flex flex-col gap-[20px]">

                {/* Zone + condition + badges */}
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[8px] flex-wrap">
                    {property.zone && (
                      <div className="flex items-center gap-[6px]">
                        <MapPin size={13} className="text-[#0d1835] shrink-0" />
                        <span className="font-body font-normal text-[12px] text-[#0d1835] uppercase tracking-[1.2px] leading-4">
                          {property.zone}
                        </span>
                      </div>
                    )}
                    {conditionLabel && (
                      <span className="font-body font-medium text-[11px] text-[#566070] bg-[#f0f0f0] px-[8px] py-[3px] uppercase tracking-[1px]">
                        {conditionLabel}
                      </span>
                    )}
                  </div>
                  {(property.featured || property.recommended || property.fairPrice || property.rented) && (
                    <div className="flex flex-wrap gap-[6px]">
                      {property.featured && (
                        <span className="inline-flex items-center gap-[4px] bg-[#fef3c7] text-[#92400e] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                          <Star size={10} className="shrink-0" />
                          Destacado
                        </span>
                      )}
                      {property.recommended && (
                        <span className="inline-flex items-center gap-[4px] bg-[#dbeafe] text-[#1e40af] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                          <BadgeCheck size={10} className="shrink-0" />
                          Recomendado
                        </span>
                      )}
                      {property.fairPrice && (
                        <span className="inline-flex items-center gap-[4px] bg-[#dcfce7] text-[#166534] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                          <Banknote size={10} className="shrink-0" />
                          Buen precio
                        </span>
                      )}
                      {property.rented && property.businessType === "venta" && (
                        <span className="inline-flex items-center gap-[4px] bg-[#f0fdf4] text-[#15803d] px-[8px] py-[3px] font-body font-medium text-[11px] uppercase tracking-[0.8px]">
                          <KeyRound size={10} className="shrink-0" />
                          Rentado
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-body font-semibold text-[22px] md:text-[26px] text-[#0c1834] tracking-[-0.3px] leading-tight">
                  {property.title}
                </h1>

                {/* Price */}
                <div className="flex flex-col gap-[6px]">
                  <p className="font-body font-medium text-[11px] text-[#566070] tracking-[4px] uppercase leading-4">
                    {property.businessType === "venta" ? "Precio de venta" : "Precio de alquiler"}
                  </p>
                  <div className="flex items-end gap-[8px] flex-wrap">
                    <span className="font-body font-bold text-[52px] text-[#0c1834] tracking-[-0.6px] leading-[1.1]">
                      {formatPrice(property.price)}
                    </span>
                    {property.businessType === "alquiler" && (
                      <span className="font-body font-normal text-[20px] text-[#566070] pb-[8px]">/mes</span>
                    )}
                  </div>
                  {property.businessType === "venta" && property.area && property.area > 0 && (
                    <span className="font-body font-medium text-[18px] text-[#737b8c]">
                      {formatPrice(Math.round(property.price / property.area))}/m²
                    </span>
                  )}
                  {property.adminFee != null && property.adminFee > 0 && (
                    <p className="font-body font-normal text-[12px] text-[#8a95a3] leading-4">
                      + ${property.adminFee}/mes mantenimiento
                    </p>
                  )}
                </div>

                {/* Stats row */}
                {(property.bedrooms != null || property.bathrooms != null || property.area != null || property.parking != null) && (
                  <div className="flex items-center gap-[18px] border-y border-[#dfe5ef] py-[16px] flex-wrap">
                    {property.bedrooms != null && (
                      <div className="flex items-center gap-[8px]">
                        <Bed size={20} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-medium text-[18px] text-[#0d1835] leading-none">
                          {property.bedrooms === 0 ? "Estudio" : `${property.bedrooms} hab.`}
                        </span>
                      </div>
                    )}
                    {property.bathrooms != null && (
                      <div className="flex items-center gap-[8px]">
                        <Bath size={20} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-medium text-[18px] text-[#0d1835] leading-none">
                          {property.bathrooms}{property.halfBathrooms ? "+½" : ""} {property.bathrooms === 1 ? "baño" : "baños"}
                        </span>
                      </div>
                    )}
                    {property.area != null && (
                      <div className="flex items-center gap-[8px]">
                        <Maximize size={20} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-medium text-[18px] text-[#0d1835] leading-none">
                          {property.area} m²
                        </span>
                      </div>
                    )}
                    {property.parking != null && (
                      <div className="flex items-center gap-[8px]">
                        <Car size={20} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-medium text-[18px] text-[#0d1835] leading-none">
                          {property.parking} {property.parking === 1 ? "parking" : "parkings"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Agent card */}
                <div className="bg-[#f8f8f9] p-[15px] flex items-center justify-between gap-[12px]">
                  {property.agent ? (
                    <div className="flex items-center gap-[12px] min-w-0 flex-1">
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
                          <span className="font-heading font-medium text-[14px] text-white leading-none">
                            {property.agent.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-body font-medium text-[10px] text-[#566070] uppercase tracking-[1px] leading-4">Agente</p>
                        <a
                          href={"/agentes/" + (property.agent.slug?.current ?? "")}
                          className="font-body font-semibold text-[14px] text-[#0c1935] hover:text-[#0c1834] leading-5 block truncate"
                        >
                          {property.agent.name}
                        </a>
                        {property.agent.role && (
                          <p className="font-body font-normal text-[12px] text-[#566070] leading-4">{property.agent.role}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-[12px] min-w-0 flex-1">
                      <div className="w-[40px] h-[40px] rounded-full bg-[#0c1834] flex items-center justify-center shrink-0">
                        <span className="font-heading font-medium text-[14px] text-white leading-none">PM</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-body font-medium text-[10px] text-[#566070] uppercase tracking-[1px] leading-4">Agente</p>
                        <p className="font-body font-semibold text-[14px] text-[#0c1935] leading-5">Equipo Panamares</p>
                        <p className="font-body font-normal text-[12px] text-[#566070] leading-4">Asesor inmobiliario</p>
                      </div>
                    </div>
                  )}
                  <div className="shrink-0 text-right">
                    <p className="font-body font-medium text-[11px] text-[#0c1834] leading-4">Lun – Sáb</p>
                    <p className="font-body font-bold text-[13px] text-[#0c1834] leading-5">8am – 7pm</p>
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

              {/* Estimación de alquiler — only for sale properties with rentalEstimate */}
              {property.businessType === "venta" && property.rentalEstimate && (
                <div className="bg-white border border-[#dfe5ef] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-[24px] flex items-center justify-between gap-[16px]">
                  <div className="flex flex-col gap-[2px]">
                    <p className="font-body font-medium text-[11px] text-[#566070] tracking-[4px] uppercase leading-4">Estimación</p>
                    <p className="font-body font-medium text-[11px] text-[#566070] tracking-[4px] uppercase leading-4">de alquiler</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body font-bold text-[36px] text-[#0c1834] tracking-[-0.4px] leading-none">
                      {formatPrice(property.rentalEstimate)}
                    </p>
                    <p className="font-body font-normal text-[14px] text-[#566070] leading-5">/mes</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT: Details, Description, Features, Map ── */}
      <section className="bg-[#f9f9f9] w-full py-[60px]">
        <div className="px-[30px] xl:px-[20px] 2xl:px-[120px] max-w-[1920px] mx-auto">
          <div className="max-w-[1600px] mx-auto">
            <div className="max-w-[780px] flex flex-col gap-[48px]">

              {/* Detalles del inmueble */}
              <div className="flex flex-col gap-[16px]">
                <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Detalles del inmueble</h2>
                <div className="border border-[#dfe5ef]">
                  {[
                    { label: "País", value: "Panamá" },
                    { label: "Provincia", value: property.province ?? "Panamá" },
                    property.zone ? { label: "Barrio / Zona", value: property.zone } : null,
                    { label: "Tipo de inmueble", value: property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1) },
                    { label: "Tipo de negocio", value: property.businessType === "venta" ? "Venta" : "Alquiler" },
                    conditionLabel ? { label: "Estado", value: conditionLabel } : null,
                    property.area != null ? { label: "Área construida", value: `${property.area} m²` } : null,
                    property.bedrooms != null ? { label: "Recámaras", value: String(property.bedrooms) } : null,
                    property.bathrooms != null ? { label: "Baños", value: String(property.bathrooms) } : null,
                    property.halfBathrooms ? { label: "Baño medio", value: "Sí" } : null,
                    property.parking != null ? { label: "Estacionamiento", value: String(property.parking) } : null,
                    property.buildingName ? { label: "Edificio", value: property.buildingName } : null,
                    property.yearBuilt ? { label: "Año de construcción", value: String(property.yearBuilt) } : null,
                    property.adminFee ? { label: "Mantenimiento", value: `$${property.adminFee}/mes` } : null,
                  ].filter(Boolean).map((row, i, arr) => (
                    <div
                      key={i}
                      className={`flex items-center px-[16px] py-[10px] ${i < arr.length - 1 ? "border-b border-[#dfe5ef]" : ""} ${i % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"}`}
                    >
                      <span className="font-body font-medium text-[13px] text-[#566070] w-[180px] shrink-0">{row!.label}</span>
                      <span className="font-body font-normal text-[13px] text-[#0c1834]">{row!.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {property.description && (
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Descripción</h2>
                  <div className="font-body font-normal text-[16px] text-[#566070] leading-[26px] [&_p]:mb-3 [&_p:last-child]:mb-0">
                    <PortableText value={property.description} />
                  </div>
                </div>
              )}

              {/* Características internas */}
              {(property.featuresInterior ?? []).length > 0 && (
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Características internas</h2>
                  <ul className="grid grid-cols-2 lg:grid-cols-3 gap-[10px]">
                    {(property.featuresInterior ?? []).map((f, i) => (
                      <li key={i} className="flex items-center gap-[8px]">
                        <Check size={14} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-normal text-[14px] text-[#566070] leading-5">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Características externas */}
              {([...(property.featuresBuilding ?? []), ...(property.featuresLocation ?? [])]).length > 0 && (
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Características externas</h2>
                  <ul className="grid grid-cols-2 lg:grid-cols-3 gap-[10px]">
                    {[...(property.featuresBuilding ?? []), ...(property.featuresLocation ?? [])].map((f, i) => (
                      <li key={i} className="flex items-center gap-[8px]">
                        <Check size={14} className="text-[#0c1935] shrink-0" />
                        <span className="font-body font-normal text-[14px] text-[#566070] leading-5">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Map */}
              <div className="flex flex-col gap-[16px]">
                <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Ubicación</h2>
                <div className="border border-[#dfe5ef] overflow-hidden h-[280px]">
                  {property.location ? (
                    <PropertyMap
                      lat={property.location.lat}
                      lng={property.location.lng}
                      title={property.title}
                      className="w-full h-[280px]"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f4f4f4] flex flex-col items-center justify-center gap-[8px]">
                      <MapPin size={28} className="text-[#c0c6d0]" />
                      <p className="font-body font-normal text-[14px] text-[#9aa0ab]">Mapa no disponible</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-body font-normal text-[14px] text-[#566070] leading-5">
                    {[property.zone, "Ciudad de Panamá"].filter(Boolean).join(", ")}
                  </p>
                  <p className="font-body font-normal text-[12px] text-[rgba(115,123,140,0.6)] leading-4">
                    Panamá, República de Panamá
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Related properties */}
      {related.length > 0 && (
        <section className="px-[30px] xl:px-[20px] 2xl:px-[120px] py-[80px]">
          <div className="max-w-[1600px] mx-auto">
            <h2 className="font-heading font-medium text-[36px] text-[#0c1834] tracking-[-1.2px] leading-tight mb-8">
              Propiedades Relacionadas
            </h2>
            <PropertyGrid properties={related.slice(0, 6)} />
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
