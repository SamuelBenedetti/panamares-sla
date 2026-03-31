import { notFound } from "next/navigation";
import Image from "next/image";
import { Bed, Bath, Maximize, Car, MapPin, Building, Check, MessageCircle, Phone } from "lucide-react";
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
import { listingSchema, breadcrumbSchema } from "@/lib/jsonld";
import { BASE_URL, whatsappLink } from "@/lib/config";
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
  const title = `${property.propertyType} en ${intent} en ${zone}${property.bedrooms ? ` | ${property.bedrooms} Hab` : ""}${property.area ? `, ${property.area}m²` : ""} | Panamares`;
  const description = `${property.propertyType} en ${zone} — ${formatPrice(property.price)}.${property.bedrooms ? ` ${property.bedrooms} hab.` : ""}${property.bathrooms ? ` ${property.bathrooms} baños.` : ""}${property.area ? ` ${property.area} m².` : ""}`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/propiedades/${property.slug.current}` },
    openGraph: {
      images: property.mainImage
        ? [{ url: urlFor(property.mainImage).width(1200).height(630).url() }]
        : [],
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
  // Fallback placeholders when no Sanity images exist (seed/demo data)
  if (galleryImages.length === 0) {
    const PLACEHOLDERS = [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
    ];
    const seed = property._id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    PLACEHOLDERS.forEach((url, i) => {
      galleryImages.push({ url: PLACEHOLDERS[(seed + i) % PLACEHOLDERS.length], alt: `${property.title} — foto ${i + 1}` });
    });
  }

  const categorySlug = (() => {
    const typeMap: Record<string, string> = {
      Apartamento: "apartamentos", Apartaestudio: "apartaestudios", Casa: "casas",
      "Casa de Playa": "casas-de-playa", Penthouse: "penthouses", Oficina: "oficinas",
      Local: "locales-comerciales", Terreno: "terrenos", Edificio: "edificios",
      Finca: "fincas", "Lote Comercial": "lotes-comerciales",
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdListing) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* Floating WhatsApp — mobile */}
      <WhatsAppButton message={waMessage} variant="floating" />

      {/* Breadcrumb bar */}
      <div className="px-[30px] xl:px-[260px] max-w-[1920px] mx-auto py-[30px]">
        <div className="max-w-[1400px] mx-auto">
          <Breadcrumb items={[
            { label: "Inicio", href: "/" },
            { label: property.businessType === "venta" ? "Propiedades en Venta" : "Propiedades en Alquiler", href: `/${categorySlug}/` },
            { label: property.title },
          ]} />
        </div>
      </div>

      {/* Gallery — full width, outside any container */}
      <PropertyGallery images={galleryImages} />

      <section className="bg-white px-[30px] xl:px-[260px] max-w-[1920px] mx-auto">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-[40px] items-start">

            {/* ── LEFT COLUMN ── */}
            <div className="flex flex-col gap-[40px] pt-[70px] pb-[100px] order-2 lg:order-1">

              {/* 1 — Header: zone · title · stats */}
              <div className="flex flex-col gap-[20px]">
                {property.zone && (
                  <div className="flex items-center gap-[8px]">
                    <MapPin size={13} className="text-[#0d1835] shrink-0" />
                    <span className="font-body font-normal text-[12px] text-[#0d1835] uppercase tracking-[1.2px] leading-4">
                      {property.zone}
                    </span>
                  </div>
                )}
                <h1 className="font-body font-semibold text-[28px] md:text-[35px] text-[#0c1834] tracking-[-0.35px] leading-tight">
                  {property.title}
                </h1>
                <div className="flex flex-wrap items-center gap-[24px] border-y border-[#dfdfdf] pt-[21px] pb-[17px]">
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
                      <span className="font-body font-bold text-[14px] text-[#0c1935] leading-5">{property.bathrooms}{property.halfBathrooms ? `+½` : ""}</span>
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
                      <Building size={16} className="text-[#0c1935] shrink-0" />
                      <span className="font-body font-bold text-[14px] text-[#0c1935] leading-5">{property.propertyType}</span>
                    </div>
                  )}
                  {property.buildingName && (
                    <div className="flex items-center gap-[8px]">
                      <Building size={15} className="text-[#0c1935] shrink-0" />
                      <span className="font-body font-bold text-[14px] text-[#0c1935] leading-5">{property.buildingName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2 — Descripción */}
              {property.description && (
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Descripción</h2>
                  <div className="font-body font-normal text-[16px] text-[#737b8c] leading-[22.75px] [&_p]:mb-3 [&_p:last-child]:mb-0">
                    <PortableText value={property.description} />
                  </div>
                </div>
              )}

              {/* 3 — Características */}
              {(() => {
                const all = [
                  ...(property.featuresInterior ?? []),
                  ...(property.featuresBuilding ?? []),
                  ...(property.featuresLocation ?? []),
                  ...(property.features ?? []),
                ];
                return all.length > 0 ? (
                  <div className="flex flex-col gap-[24px]">
                    <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Características</h2>
                    <ul className="grid grid-cols-2 lg:grid-cols-3 gap-[12px]">
                      {all.map((f, i) => (
                        <li key={i} className="flex items-center gap-[8px]">
                          <Check size={14} className="text-[#0c1935] shrink-0" />
                          <span className="font-body font-normal text-[14px] text-[#737b8c] leading-5">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null;
              })()}

              {/* 4 — Ubicación */}
              {property.location && (
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">Ubicación</h2>
                  <div className="border border-[#dfe5ef] overflow-hidden h-[256px]">
                    <PropertyMap lat={property.location.lat} lng={property.location.lng} title={property.title} />
                  </div>
                  <div className="text-center">
                    <p className="font-body font-normal text-[14px] text-[#737b8c] leading-5">
                      {[property.zone, "Ciudad de Panamá"].filter(Boolean).join(", ")}
                    </p>
                    <p className="font-body font-normal text-[12px] text-[rgba(115,123,140,0.6)] leading-4">
                      Panamá, República de Panamá
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <aside className="pt-[40px] lg:pt-[70px] order-1 lg:order-2">
              <div className="border border-[#dfe5ef] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-[26px] flex flex-col gap-[25px]">

                {/* Price */}
                <div className="flex flex-col gap-[4px]">
                  <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase text-center leading-4">
                    {property.businessType === "venta" ? "Precio de venta" : "Precio de alquiler"}
                  </p>
                  <div className="flex items-end gap-[10px] flex-wrap">
                    <span className="font-body font-bold text-[55px] text-[#0c1834] tracking-[-0.55px] leading-none">
                      {formatPrice(property.price)}
                    </span>
                    {property.area && property.area > 0 && (
                      <span className="font-body font-medium text-[16px] text-[#737b8c] pb-[13px]">
                        {formatPrice(Math.round(property.price / property.area))}/m²
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats strip */}
                <div className="border-y border-[#dfe5ef] py-[26px] flex gap-[12px]">
                  {property.bedrooms != null && (
                    <div className="flex flex-1 flex-col items-center gap-[4px]">
                      <Bed size={20} className="text-[#0d1835]" />
                      <span className="font-body font-medium text-[16px] xl:text-[20px] text-[#0d1835] leading-normal">{property.bedrooms} hab.</span>
                    </div>
                  )}
                  {property.bathrooms != null && (
                    <div className="flex flex-1 flex-col items-center gap-[4px]">
                      <Bath size={20} className="text-[#0d1835]" />
                      <span className="font-body font-medium text-[16px] xl:text-[20px] text-[#0d1835] leading-normal">{property.bathrooms} baños</span>
                    </div>
                  )}
                  {property.area != null && (
                    <div className="flex flex-1 flex-col items-center gap-[4px]">
                      <Maximize size={20} className="text-[#0d1835]" />
                      <span className="font-body font-medium text-[16px] xl:text-[20px] text-[#0d1835] leading-normal">{property.area} m²</span>
                    </div>
                  )}
                </div>

                {/* Agent */}
                {property.agent && (
                  <div className="bg-[#f8f8f9] p-[15px] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-[10px] min-w-0">
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
                          <span className="font-heading font-medium text-[16px] text-white leading-5">
                            {property.agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-body font-medium text-[14px] text-[#0c1935] tracking-[-0.16px] leading-5 truncate">{property.agent.name}</p>
                        {property.agent.role && (
                          <p className="font-body font-normal text-[12px] text-[#737b8c] leading-4">{property.agent.role}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-body font-normal text-[11px] text-[#737b8c] leading-4">Lunes a sábado</p>
                      <p className="font-body font-semibold text-[11px] text-[#737b8c] leading-4">8am – 7pm</p>
                    </div>
                  </div>
                )}

                {/* WhatsApp */}
                <a
                  href={whatsappLink(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-[8px] bg-[#25d366] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] px-[20px] py-[12px] hover:bg-[#1ebe57] transition-colors"
                >
                  <MessageCircle size={22} className="text-white shrink-0" />
                  <span className="font-body font-medium text-[14px] text-white leading-5">Consultar por WhatsApp</span>
                </a>

                {/* Call */}
                {property.agent?.phone && (
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center justify-center gap-[5px] border border-[#dfe5ef] px-[21px] py-[13px] hover:bg-[#f9f9f9] transition-colors"
                  >
                    <Phone size={22} className="text-[#0d1835] shrink-0" />
                    <span className="font-body font-medium text-[14px] text-[#0d1835] leading-5">Llamar ahora</span>
                  </a>
                )}
              </div>
            </aside>
          </div>

          {/* Related listings */}
          {related.length > 0 && (
            <div className="border-t border-[#dfe5ef] pt-[100px] pb-[100px]">
              <h2 className="font-heading font-medium text-[40px] text-[#0c1834] tracking-[-1.2px] leading-tight mb-8">
                Propiedades Relacionadas
              </h2>
              <PropertyGrid properties={related.slice(0, 3)} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
