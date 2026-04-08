import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { MapPin, ArrowRight, TrendingUp, Building2, ChevronRight } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByNeighborhoodQuery, neighborhoodContentQuery } from "@/sanity/lib/queries";
import { getNeighborhoodBySlug, VALID_NEIGHBORHOOD_SLUGS, NEIGHBORHOODS } from "@/lib/neighborhoods";
import { CATEGORIES } from "@/lib/categories";
import { neighborhoodSchema, breadcrumbSchema } from "@/lib/jsonld";
import type { Property, Neighborhood } from "@/lib/types";
import PropertyGrid from "@/components/properties/PropertyGrid";
import PropertyMapMulti from "@/components/properties/PropertyMapMulti";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import { urlFor } from "@/sanity/lib/image";

const BASE_URL = "https://panamares.com";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return Array.from(VALID_NEIGHBORHOOD_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const neighborhood = getNeighborhoodBySlug(params.slug);
  if (!neighborhood) return {};
  return {
    title: `Propiedades en ${neighborhood.name}, Panama`,
    description: `Guía completa de ${neighborhood.name}: propiedades disponibles, precios, estilo de vida y todo lo que necesitas saber para vivir o invertir en esta zona.`,
    alternates: { canonical: `${BASE_URL}/barrios/${params.slug}/` },
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function NeighborhoodGuidePage({ params }: Props) {
  const neighborhood = getNeighborhoodBySlug(params.slug);
  if (!neighborhood) notFound();

  const [properties, nbhContent] = await Promise.all([
    sanityFetch<Property[]>(propertiesByNeighborhoodQuery, { neighborhood: neighborhood.name }),
    sanityFetch<Neighborhood | null>(neighborhoodContentQuery, { slug: params.slug }),
  ]);

  const propsWithArea = properties.filter((p) => p.area && p.area > 0);
  const avgPricePerM2 =
    nbhContent?.avgPricePerM2 ??
    (propsWithArea.length > 0
      ? Math.round(propsWithArea.reduce((s, p) => s + p.price / p.area!, 0) / propsWithArea.length)
      : null);

  const comboCounts = new Map<string, number>();
  for (const p of properties) {
    const key = `${p.propertyType}|${p.businessType}`;
    comboCounts.set(key, (comboCounts.get(key) ?? 0) + 1);
  }
  const categoryCards = CATEGORIES.flatMap((cat) => {
    const count = comboCounts.get(`${cat.propertyType}|${cat.businessType}`) ?? 0;
    if (count === 0) return [];
    return [{ cat, count }];
  });

  const mapProps = properties
    .filter((p) => p.location)
    .map((p) => ({
      lat: p.location!.lat,
      lng: p.location!.lng,
      title: p.title,
      slug: p.slug.current,
      price: p.price,
    }));

  // Hero image — use homepage NeighborhoodCards images for the 4 featured zones
  const HOMEPAGE_IMAGES: Record<string, string> = {
    "punta-pacifica": "/barrio-punta-pacifica.png",
    "punta-paitilla": "/barrio-punta-paitilla.png",
    "avenida-balboa": "/barrio-avenida-balboa.png",
    "costa-del-este": "/barrio-costa-del-este.png",
  };
  const heroImage =
    nbhContent?.photo
      ? urlFor(nbhContent.photo).width(1600).height(700).url()
      : HOMEPAGE_IMAGES[params.slug] ?? "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&h=700&fit=crop";

  const jsonLdPlace = nbhContent?._id ? neighborhoodSchema(nbhContent) : null;
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Barrios", url: "/barrios/" },
    { name: neighborhood.name, url: `/barrios/${params.slug}/` },
  ]);

  // Nearby neighborhoods (same priority or next, exclude current)
  const nearby = NEIGHBORHOODS.filter((n) => n.slug !== params.slug).slice(0, 4);

  return (
    <>
      {jsonLdPlace && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPlace) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message={`Hola, me interesa conocer propiedades en ${neighborhood.name}`} variant="floating" />

      {/* ── Hero — imagen del barrio tal cual ── */}
      <section className="relative h-[55vh] min-h-[380px] xl:h-[65vh] flex items-end overflow-hidden">
        <Image
          src={heroImage}
          alt={neighborhood.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1834]/95 via-[#0c1834]/40 to-transparent" />

        <div className="relative z-10 w-full px-[30px] xl:px-[20px] 2xl:px-[120px] pb-[40px] xl:pb-[70px]">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-[16px]">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-[8px]">
              <Link href="/" className="font-body text-[13px] text-white/50 hover:text-white/80 transition-colors">Inicio</Link>
              <ChevronRight size={12} className="text-white/30" />
              <Link href="/barrios/" className="font-body text-[13px] text-white/50 hover:text-white/80 transition-colors">Barrios</Link>
              <ChevronRight size={12} className="text-white/30" />
              <span className="font-body text-[13px] text-white/80">{neighborhood.name}</span>
            </nav>

            {/* Eyebrow */}
            <div className="flex items-center gap-[6px]">
              <MapPin size={12} className="text-[#d4a435]" />
              <p className="font-body font-medium text-[11px] text-[#d4a435] tracking-[4px] uppercase">
                Ciudad de Panamá
              </p>
            </div>

            {/* Heading */}
            <h1 className="font-heading font-normal text-[clamp(42px,5vw,72px)] text-white leading-none tracking-[-2px]">
              {neighborhood.name}
            </h1>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-[10px] pt-[4px]">
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-[14px] py-[7px] flex items-center gap-[8px]">
                <Building2 size={13} className="text-white/60" />
                <span className="font-body text-[13px] text-white">
                  <span className="font-semibold">{properties.length}</span>{" "}
                  {properties.length === 1 ? "propiedad activa" : "propiedades activas"}
                </span>
              </div>
              {avgPricePerM2 && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-[14px] py-[7px] flex items-center gap-[8px]">
                  <TrendingUp size={13} className="text-white/60" />
                  <span className="font-body text-[13px] text-white">
                    <span className="font-semibold">{formatPrice(avgPricePerM2)}</span>/m² promedio
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenido principal ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[20px] 2xl:px-[120px] py-[60px] xl:py-[100px]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-[48px] xl:gap-[80px]">

            {/* ── Left column ── */}
            <div className="flex flex-col gap-[48px] xl:gap-[64px]">

              {/* Sobre el barrio */}
              <div className="flex flex-col gap-[24px]">
                <div className="flex flex-col gap-[8px]">
                  <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
                    Guía del barrio
                  </p>
                  <h2 className="font-heading font-normal text-[clamp(28px,3vw,42px)] text-[#0c1834] tracking-[-1.2px] leading-none">
                    Sobre {neighborhood.name}
                  </h2>
                </div>
                <div className="h-px bg-[#dfe5ef]" />
                {nbhContent?.about ? (
                  <div className="font-body text-[16px] text-[#3d4452] leading-[1.75] [&_p]:mb-4 [&_p:last-child]:mb-0">
                    <PortableText value={nbhContent.about} />
                  </div>
                ) : (
                  <p className="font-body font-light text-[16px] text-[#737b8c] leading-[1.75]">
                    {neighborhood.name} es una de las zonas más exclusivas de Ciudad de Panamá,
                    reconocida por su excelente ubicación, infraestructura moderna y alta calidad
                    de vida. Con una amplia oferta de propiedades residenciales y comerciales, es
                    preferida tanto por residentes como por inversores. Su proximidad a centros
                    comerciales, restaurantes y servicios la convierte en una opción ideal para
                    vivir o invertir en Panama City.
                  </p>
                )}
              </div>

              {/* Tipos de propiedad disponibles */}
              {categoryCards.length > 0 && (
                <div className="flex flex-col gap-[24px]">
                  <div className="flex flex-col gap-[8px]">
                    <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
                      Oferta disponible
                    </p>
                    <h2 className="font-heading font-normal text-[clamp(26px,3vw,38px)] text-[#0c1834] tracking-[-1px] leading-none">
                      Propiedades en {neighborhood.name}
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-[12px]">
                    {categoryCards.map(({ cat, count }) => (
                      <Link
                        key={cat.slug}
                        href={`/${cat.slug}/${params.slug}/`}
                        className="group bg-white hover:bg-[#0c1834] flex flex-col gap-[6px] p-[18px] xl:p-[22px] transition-colors duration-200"
                      >
                        <span className="font-body font-semibold text-[14px] text-[#0c1834] group-hover:text-white transition-colors leading-tight">
                          {cat.h1.split(" en Panama")[0]}
                        </span>
                        <span className="font-body text-[12px] text-[#737b8c] group-hover:text-white/60 transition-colors">
                          {count} {count === 1 ? "propiedad" : "propiedades"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Listado de propiedades */}
              {properties.length > 0 && (
                <div className="flex flex-col gap-[28px]">
                  <div className="flex flex-col gap-[8px]">
                    <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
                      Selección actual
                    </p>
                    <h2 className="font-heading font-normal text-[clamp(26px,3vw,38px)] text-[#0c1834] tracking-[-1px] leading-none">
                      Listados en {neighborhood.name}
                    </h2>
                  </div>
                  <PropertyGrid properties={properties.slice(0, 6)} />
                  {properties.length > 6 && (
                    <Link
                      href={`/propiedades-en-venta/${params.slug}/`}
                      className="inline-flex items-center gap-[8px] font-body font-medium text-[13px] text-[#0c1834] tracking-[1.2px] uppercase border-b border-[#0c1834] pb-[2px] hover:opacity-60 transition-opacity w-fit"
                    >
                      Ver todas las propiedades
                      <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* ── Right — sticky sidebar ── */}
            <aside>
              <div className="lg:sticky lg:top-[100px] flex flex-col gap-[24px]">

                {/* Mapa */}
                {mapProps.length > 0 && (
                  <div className="flex flex-col gap-[12px]">
                    <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
                      Mapa de propiedades
                    </p>
                    <PropertyMapMulti properties={mapProps} height="h-[320px]" />
                  </div>
                )}

                {/* Stats card */}
                {(properties.length > 0 || avgPricePerM2) && (
                  <div className="bg-white border border-[#dfe5ef] p-[24px] flex flex-col gap-[16px]">
                    <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
                      Datos del mercado
                    </p>
                    <div className="h-px bg-[#dfe5ef]" />
                    <div className="flex flex-col gap-[14px]">
                      {properties.length > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="font-body text-[13px] text-[#737b8c]">Propiedades activas</span>
                          <span className="font-body font-semibold text-[15px] text-[#0c1834]">{properties.length}</span>
                        </div>
                      )}
                      {avgPricePerM2 && (
                        <div className="flex items-center justify-between">
                          <span className="font-body text-[13px] text-[#737b8c]">Precio/m² prom.</span>
                          <span className="font-body font-semibold text-[15px] text-[#0c1834]">{formatPrice(avgPricePerM2)}</span>
                        </div>
                      )}
                      {properties.length > 0 && (() => {
                        const minPrice = Math.min(...properties.map((p) => p.price));
                        const maxPrice = Math.max(...properties.map((p) => p.price));
                        return (
                          <div className="flex items-center justify-between">
                            <span className="font-body text-[13px] text-[#737b8c]">Rango de precios</span>
                            <span className="font-body font-semibold text-[12px] text-[#0c1834] text-right">
                              {formatPrice(minPrice)}<br />– {formatPrice(maxPrice)}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* CTA asesor */}
                <div className="bg-[#0c1834] p-[24px] flex flex-col gap-[14px]">
                  <p className="font-body font-medium text-[11px] text-white/50 tracking-[4px] uppercase leading-4">
                    ¿Listo para explorar?
                  </p>
                  <p className="font-heading font-normal text-[24px] text-white tracking-[-0.7px] leading-tight">
                    Agenda una visita en {neighborhood.name}
                  </p>
                  <p className="font-body font-light text-[13px] text-white/60 leading-relaxed">
                    Nuestros asesores te acompañan a conocer las mejores opciones de la zona.
                  </p>
                  <Link
                    href="/contacto/"
                    className="mt-[4px] inline-flex items-center justify-center gap-[8px] bg-white px-[20px] py-[12px] font-body font-medium text-[12px] text-[#0c1834] tracking-[1.2px] uppercase hover:bg-[#f9f9f9] transition-colors"
                  >
                    Contactar asesor
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Otros barrios ── */}
      <section className="bg-white px-[30px] xl:px-[20px] 2xl:px-[120px] py-[60px] xl:py-[100px] border-t border-[#dfe5ef]">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-[40px]">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
                Sigue explorando
              </p>
              <h2 className="font-heading font-normal text-[clamp(28px,3vw,42px)] text-[#0c1834] tracking-[-1.2px] leading-none">
                Otros barrios
              </h2>
            </div>
            <Link
              href="/barrios/"
              className="inline-flex items-center gap-[6px] font-body font-medium text-[13px] text-[#737b8c] tracking-[1.2px] uppercase hover:text-[#0c1834] transition-colors"
            >
              Ver todos
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[12px]">
            {nearby.map((n) => (
              <Link
                key={n.slug}
                href={`/barrios/${n.slug}/`}
                className="group bg-white hover:bg-[#0c1834] flex items-center justify-between gap-[8px] px-[20px] py-[18px] transition-colors duration-200"
              >
                <span className="font-body font-medium text-[14px] text-[#0c1834] group-hover:text-white transition-colors leading-tight">
                  {n.name}
                </span>
                <ArrowRight size={13} className="text-[#737b8c] group-hover:text-white/60 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
