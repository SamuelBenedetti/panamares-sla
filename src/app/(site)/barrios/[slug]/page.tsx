import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, TrendingUp, Building2, Home, Layers, ChevronRight } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";
import { propertiesByNeighborhoodQuery, neighborhoodContentQuery } from "@/sanity/lib/queries";
import { getNeighborhoodBySlug, VALID_NEIGHBORHOOD_SLUGS, NEIGHBORHOODS } from "@/lib/neighborhoods";
import { CATEGORIES } from "@/lib/categories";
import { neighborhoodSchema, breadcrumbSchema } from "@/lib/jsonld";
import type { Property, Neighborhood } from "@/lib/types";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyMapMulti from "@/components/properties/PropertyMapMulti";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import { urlFor } from "@/sanity/lib/image";
import { BASE_URL, whatsappLink } from "@/lib/config";
import { formatPrice } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return Array.from(VALID_NEIGHBORHOOD_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const neighborhood = getNeighborhoodBySlug(params.slug);
  if (!neighborhood) return {};

  const nbhContent = await sanityFetch<Neighborhood | null>(neighborhoodContentQuery, { slug: params.slug });
  const ogImage = nbhContent?.photo
    ? urlFor(nbhContent.photo).width(1200).height(630).url()
    : undefined;

  const properties = await sanityFetch<{ _id: string }[]>(
    propertiesByNeighborhoodQuery,
    { neighborhood: neighborhood.name }
  );
  const shouldIndex = properties.length >= 2;

  return {
    title: `Propiedades en ${neighborhood.name}, Panama`,
    description:
      nbhContent?.seoBlock ??
      `Guía completa de ${neighborhood.name}: propiedades disponibles, precios por m², estilo de vida y todo lo que necesitas para vivir o invertir en esta zona de Panama City.`,
    alternates: { canonical: `${BASE_URL}/barrios/${params.slug}/` },
    robots: { index: shouldIndex, follow: true },
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

const HOMEPAGE_IMAGES: Record<string, string> = {
  "punta-pacifica": "/barrio-punta-pacifica.png",
  "punta-paitilla": "/barrio-punta-paitilla.png",
  "avenida-balboa": "/barrio-avenida-balboa.png",
  "costa-del-este": "/barrio-costa-del-este.png",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&h=900&fit=crop";

// Map category slug prefix → Lucide icon
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  apartamento:   <Building2 size={22} strokeWidth={1.5} />,
  apartaestudio: <Building2 size={22} strokeWidth={1.5} />,
  penthouse:     <Layers     size={22} strokeWidth={1.5} />,
  casa:          <Home       size={22} strokeWidth={1.5} />,
  "casa de playa": <Home    size={22} strokeWidth={1.5} />,
  oficina:       <Building2 size={22} strokeWidth={1.5} />,
  local:         <Building2 size={22} strokeWidth={1.5} />,
  terreno:       <Layers     size={22} strokeWidth={1.5} />,
};

export default async function NeighborhoodGuidePage({ params }: Props) {
  const neighborhood = getNeighborhoodBySlug(params.slug);
  if (!neighborhood) notFound();

  const [properties, nbhContent] = await Promise.all([
    sanityFetch<Property[]>(propertiesByNeighborhoodQuery, { neighborhood: neighborhood.name }),
    sanityFetch<Neighborhood | null>(neighborhoodContentQuery, { slug: params.slug }),
  ]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const propsWithArea = properties.filter((p) => p.area && p.area > 0);
  const avgPricePerM2 =
    nbhContent?.avgPricePerM2 ??
    (propsWithArea.length > 0
      ? Math.round(propsWithArea.reduce((s, p) => s + p.price / p.area!, 0) / propsWithArea.length)
      : null);

  const ventaCount    = properties.filter((p) => p.businessType === "venta").length;
  const alquilerCount = properties.filter((p) => p.businessType === "alquiler").length;

  // ── Category cards ─────────────────────────────────────────────────────────
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

  // ── Map data ───────────────────────────────────────────────────────────────
  const mapProps = properties
    .filter((p) => p.location)
    .map((p) => ({
      lat:      p.location!.lat,
      lng:      p.location!.lng,
      title:    p.title,
      slug:     p.slug.current,
      price:    p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      imageUrl: p.mainImage
        ? urlFor(p.mainImage).width(300).height(200).fit("crop").url()
        : undefined,
    }));

  // ── Hero image ─────────────────────────────────────────────────────────────
  const heroImage = nbhContent?.photo
    ? urlFor(nbhContent.photo).width(1600).height(900).url()
    : HOMEPAGE_IMAGES[params.slug] ?? FALLBACK_IMAGE;

  // ── JSON-LD ────────────────────────────────────────────────────────────────
  const neighborhoodForSchema = nbhContent ?? {
    _id: params.slug,
    name: neighborhood.name,
    slug: { current: params.slug },
  };
  const jsonLdPlace      = neighborhoodSchema(neighborhoodForSchema, heroImage);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio",     url: "/" },
    { name: "Barrios",    url: "/barrios/" },
    { name: neighborhood.name, url: `/barrios/${params.slug}/` },
  ]);

  // ── Nearby ─────────────────────────────────────────────────────────────────
  const nearby = NEIGHBORHOODS.filter((n) => n.slug !== params.slug).slice(0, 4);

  // ── Featured (up to 6, sorted by price desc) ───────────────────────────────
  const featured = [...properties]
    .sort((a, b) => b.price - a.price)
    .slice(0, 6);

  const waMsg = `Hola, me interesa conocer propiedades en ${neighborhood.name}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPlace) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message={waMsg} variant="floating" />

      {/* ═══════════════════════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[72vh] min-h-[480px] xl:h-[80vh] flex flex-col justify-end overflow-hidden">
        <Image
          src={heroImage}
          alt={`${neighborhood.name}, Panama`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1834] via-[#0c1834]/30 to-[#0c1834]/10" />

        <div className="relative z-10 w-full px-[24px] xl:px-[20px] 2xl:px-[120px] pb-[48px] xl:pb-[80px]">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-[20px]">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-[8px] flex-wrap">
              <Link href="/" className="font-body font-normal text-[14px] text-white/70 hover:text-white transition-colors">
                Inicio
              </Link>
              <ChevronRight size={12} className="text-white/40" />
              <Link href="/barrios/" className="font-body font-normal text-[14px] text-white/70 hover:text-white transition-colors">
                Barrios
              </Link>
              <ChevronRight size={12} className="text-white/40" />
              <span className="font-body font-medium text-[14px] text-white">
                {neighborhood.name}
              </span>
            </nav>

            {/* H1 */}
            <h1 className="font-heading font-normal text-[clamp(44px,6vw,80px)] text-white leading-none tracking-[-2.5px] whitespace-nowrap">
              Vivir en {neighborhood.name},
              <span className="italic"> Panama</span>
            </h1>

            {/* Description */}
            {nbhContent?.seoBlock && (
              <p className="font-body font-light text-[15px] text-white/80 leading-relaxed max-w-[580px] line-clamp-2">
                {nbhContent.seoBlock}
              </p>
            )}

            {/* Stats — unified pills with | separators */}
            <div className="flex flex-wrap gap-[10px] pt-[4px]">
              <div className="h-[40px] px-[20px] py-[8px] flex flex-col justify-center items-start border border-[#E6E6E6]">
                <div className="flex items-center gap-[8px]">
                  <Home size={14} className="text-white/60 shrink-0" />
                  <span className="font-body text-[13px] text-white whitespace-nowrap">
                    <span className="font-semibold">{properties.length}</span>{" "}
                    {properties.length === 1 ? "propiedad activa" : "propiedades activas"}
                    {ventaCount > 0 && (
                      <> <span className="text-white/40 mx-[3px]">|</span> <span className="font-semibold">{ventaCount}</span> venta</>
                    )}
                    {alquilerCount > 0 && (
                      <> <span className="text-white/40 mx-[3px]">|</span> <span className="font-semibold">{alquilerCount}</span> alquiler</>
                    )}
                  </span>
                </div>
              </div>

              {avgPricePerM2 && (
                <div className="h-[40px] px-[20px] py-[8px] flex flex-col justify-center items-start border border-[#E6E6E6]">
                  <div className="flex items-center gap-[8px]">
                    <Home size={14} className="text-white/60 shrink-0" />
                    <span className="font-body text-[13px] text-white whitespace-nowrap">
                      <span className="font-semibold">{formatPrice(avgPricePerM2)}/m²</span> promedio
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. ABOUT — Editorial block (ranking content)
      ═══════════════════════════════════════════════════════════════════════ */}
      {nbhContent?.seoBlock && (
      <section className="bg-[#f9f9f9] px-[24px] xl:px-[20px] 2xl:px-[120px] py-[64px] xl:py-[100px]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-[48px] xl:gap-[80px]">

            {/* Text */}
            <div className="flex flex-col gap-[28px]">
              <div className="flex flex-col gap-[10px]">
                <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase">
                  Guía del barrio
                </p>
                <h2 className="font-heading font-normal text-[clamp(32px,4vw,52px)] text-[#0c1834] tracking-[-1.5px] leading-none">
                  Sobre {neighborhood.name}
                </h2>
              </div>

              <div className="h-px bg-[#dfe5ef]" />

              <p className="font-body font-light text-[17px] text-[#3d4452] leading-[1.8]">
                {nbhContent.seoBlock}
              </p>

              {properties.length > 0 && (
                <p className="font-body text-[15px] text-[#5a6478]">
                  Actualmente hay{" "}
                  <span className="font-semibold text-[#0c1834]">{properties.length} {properties.length === 1 ? "propiedad disponible" : "propiedades disponibles"}</span>{" "}
                  en {neighborhood.name} a través de Panamares.
                </p>
              )}

              {/* CTA inline */}
              <div className="flex flex-wrap gap-[12px] pt-[4px]">
                <a
                  href={whatsappLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[8px] bg-[#00b424] hover:bg-[#009e1f] text-white font-body font-medium text-[14px] px-[20px] py-[12px] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
                <Link
                  href="/contacto/"
                  className="inline-flex items-center gap-[8px] bg-white border border-[#dfe5ef] text-[#0c1834] font-body font-medium text-[14px] px-[20px] py-[12px] hover:bg-gray-50 transition-colors"
                >
                  Hablar con un asesor
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Stats sidebar */}
            <aside className="flex flex-col gap-[16px]">
              {avgPricePerM2 && (
                <div className="bg-white border border-[#dfe5ef] p-[24px] xl:p-[28px] flex flex-col gap-[8px]">
                  <p className="font-body font-medium text-[11px] text-[#5a6478] tracking-[3px] uppercase">
                    Precio promedio
                  </p>
                  <p className="font-heading font-normal text-[clamp(28px,3vw,38px)] text-[#0c1834] tracking-[-1px] leading-none">
                    {formatPrice(avgPricePerM2)}
                  </p>
                  <p className="font-body text-[13px] text-[#5a6478]">por metro cuadrado</p>
                </div>
              )}

              <div className="bg-white border border-[#dfe5ef] p-[24px] xl:p-[28px] flex flex-col gap-[8px]">
                <p className="font-body font-medium text-[11px] text-[#5a6478] tracking-[3px] uppercase">
                  Propiedades activas
                </p>
                <p className="font-heading font-normal text-[clamp(28px,3vw,38px)] text-[#0c1834] tracking-[-1px] leading-none">
                  {properties.length}
                </p>
                <p className="font-body text-[13px] text-[#5a6478]">listings en esta zona</p>
              </div>

              {categoryCards.length > 0 && (
                <div className="bg-white border border-[#dfe5ef] p-[24px] xl:p-[28px] flex flex-col gap-[8px]">
                  <p className="font-body font-medium text-[11px] text-[#5a6478] tracking-[3px] uppercase">
                    Tipo más disponible
                  </p>
                  <p className="font-heading font-normal text-[clamp(22px,2.5vw,30px)] text-[#0c1834] tracking-[-0.8px] leading-tight">
                    {categoryCards[0].cat.h1.replace(" en Panama", "").replace(" en Panamá", "")}
                  </p>
                  <p className="font-body text-[13px] text-[#5a6478]">
                    {categoryCards[0].count} {categoryCards[0].count === 1 ? "propiedad" : "propiedades"}
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          4. CATEGORY CARDS — Internal linking hub (SEO priority #1)
      ═══════════════════════════════════════════════════════════════════════ */}
      {categoryCards.length > 0 && (
        <section className="bg-white border-t border-[#dfe5ef] px-[24px] xl:px-[20px] 2xl:px-[120px] py-[64px] xl:py-[100px]">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-[40px]">

            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-[16px]">
              <div className="flex flex-col gap-[10px]">
                <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase">
                  Oferta disponible
                </p>
                <h2 className="font-heading font-normal text-[clamp(30px,4vw,52px)] text-[#0c1834] tracking-[-1.5px] leading-none">
                  Propiedades en {neighborhood.name}
                </h2>
              </div>
              <p className="font-body font-light text-[15px] text-[#5a6478] max-w-[420px] xl:text-right leading-relaxed">
                Explora cada tipo de propiedad disponible y encuentra la que se ajusta a tu búsqueda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[2px] bg-[#dfe5ef]">
              {categoryCards.map(({ cat, count }) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}/${params.slug}/`}
                  className="group bg-white hover:bg-[#0c1834] flex items-center justify-between gap-[16px] p-[28px] xl:p-[32px] transition-all duration-200"
                >
                  <div className="flex flex-col gap-[10px]">
                    {/* Icon */}
                    <span className="text-[#5a6478] group-hover:text-white/60 transition-colors">
                      {CATEGORY_ICONS[cat.propertyType] ?? <Building2 size={22} strokeWidth={1.5} />}
                    </span>
                    {/* Label */}
                    <div className="flex flex-col gap-[4px]">
                      <span className="font-body font-semibold text-[17px] text-[#0c1834] group-hover:text-white transition-colors leading-tight">
                        {cat.h1.split(" en Panama")[0]}
                      </span>
                      <span className="font-body text-[13px] text-[#5a6478] group-hover:text-white/60 transition-colors">
                        {count} {count === 1 ? "propiedad" : "propiedades"}
                      </span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="shrink-0 size-[40px] border border-[#dfe5ef] group-hover:border-white/20 flex items-center justify-center transition-colors">
                    <ArrowRight size={16} className="text-[#5a6478] group-hover:text-white transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          5. MAP — Mapa de propiedades activas
      ═══════════════════════════════════════════════════════════════════════ */}
      {mapProps.length > 0 && (
        <section className="bg-[#f9f9f9] border-t border-[#dfe5ef] px-[24px] xl:px-[20px] 2xl:px-[120px] py-[64px] xl:py-[100px]">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-[32px]">

            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-[16px]">
              <div className="flex flex-col gap-[10px]">
                <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase">
                  Ubicación
                </p>
                <h2 className="font-heading font-normal text-[clamp(30px,4vw,52px)] text-[#0c1834] tracking-[-1.5px] leading-none">
                  Mapa de propiedades
                </h2>
              </div>
              <p className="font-body text-[14px] text-[#5a6478]">
                {mapProps.length} {mapProps.length === 1 ? "propiedad ubicada" : "propiedades ubicadas"} en {neighborhood.name}
              </p>
            </div>

            <PropertyMapMulti properties={mapProps} height="h-[480px] xl:h-[560px]" />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          6. FEATURED LISTINGS
      ═══════════════════════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section className="bg-[#f9f9f9] border-t border-[#dfe5ef] px-[24px] xl:px-[20px] 2xl:px-[120px] py-[64px] xl:py-[100px]">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-[40px]">

            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-[16px]">
              <div className="flex flex-col gap-[10px]">
                <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase">
                  Selección actual
                </p>
                <h2 className="font-heading font-normal text-[clamp(30px,4vw,52px)] text-[#0c1834] tracking-[-1.5px] leading-none">
                  Propiedades en {neighborhood.name}
                </h2>
              </div>
              {properties.length > 6 && (
                <Link
                  href={`/propiedades-en-venta/${params.slug}/`}
                  className="inline-flex items-center gap-[8px] font-body font-medium text-[13px] text-[#5a6478] tracking-[1.2px] uppercase hover:text-[#0c1834] transition-colors whitespace-nowrap"
                >
                  Ver todas ({properties.length})
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[16px] xl:gap-[24px]">
              {featured.map((p, index) => (
                <PropertyCard key={p._id} property={p} priority={index === 0} />
              ))}
            </div>

            {properties.length > 6 && (
              <div className="flex justify-center pt-[8px]">
                <Link
                  href={`/propiedades-en-venta/${params.slug}/`}
                  className="inline-flex items-center justify-center gap-[8px] bg-[#0c1834] text-white font-body font-medium text-[14px] px-[32px] py-[14px] hover:bg-[#162444] transition-colors"
                >
                  Ver todas las propiedades en {neighborhood.name}
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          7. CTA — Conversión
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#121e3e] px-[24px] xl:px-[20px] 2xl:px-[120px] py-[80px] xl:py-[120px]">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center text-center gap-[24px]">
          <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase">
            Contáctenos
          </p>
          <h2 className="font-heading font-normal text-[clamp(36px,5vw,64px)] text-white tracking-[-2px] leading-none max-w-[800px]">
            ¿Listo para vivir en{" "}
            <span className="italic">{neighborhood.name}?</span>
          </h2>
          <p className="font-body font-light text-[16px] text-white/60 leading-relaxed max-w-[520px]">
            Nuestros asesores conocen cada edificio y cada calle de la zona.
            Cuéntanos qué buscas y te mostramos las mejores opciones disponibles.
          </p>
          <div className="flex flex-wrap justify-center gap-[12px] pt-[8px]">
            <a
              href={whatsappLink(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[8px] bg-[#00b424] hover:bg-[#009e1f] text-white font-body font-medium text-[15px] px-[28px] py-[14px] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <Link
              href="/contacto/"
              className="inline-flex items-center gap-[8px] bg-white hover:bg-[#f9f9f9] text-[#0c1834] font-body font-medium text-[15px] px-[28px] py-[14px] transition-colors"
            >
              Contactar asesor
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          8. OTROS BARRIOS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-[#dfe5ef] px-[24px] xl:px-[20px] 2xl:px-[120px] py-[64px] xl:py-[80px]">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-[36px]">

          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-[10px]">
              <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase">
                Sigue explorando
              </p>
              <h2 className="font-heading font-normal text-[clamp(26px,3vw,40px)] text-[#0c1834] tracking-[-1.2px] leading-none">
                Otros barrios
              </h2>
            </div>
            <Link
              href="/barrios/"
              className="hidden sm:inline-flex items-center gap-[6px] font-body font-medium text-[13px] text-[#5a6478] tracking-[1.2px] uppercase hover:text-[#0c1834] transition-colors"
            >
              Ver todos
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-[#dfe5ef]">
            {nearby.map((n) => (
              <Link
                key={n.slug}
                href={`/barrios/${n.slug}/`}
                className="group bg-white hover:bg-[#0c1834] flex items-center justify-between gap-[12px] px-[24px] py-[22px] transition-all duration-200"
              >
                <div className="flex items-center gap-[10px]">
                  <MapPin size={14} className="text-[#b8891e] shrink-0" />
                  <span className="font-body font-medium text-[15px] text-[#0c1834] group-hover:text-white transition-colors leading-tight">
                    {n.name}
                  </span>
                </div>
                <ArrowRight size={13} className="text-[#5a6478] group-hover:text-white/60 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>

          <Link
            href="/barrios/"
            className="sm:hidden inline-flex items-center gap-[6px] font-body font-medium text-[13px] text-[#5a6478] tracking-[1.2px] uppercase hover:text-[#0c1834] transition-colors self-start"
          >
            Ver todos los barrios
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </>
  );
}
