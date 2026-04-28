import NeighborhoodCards, { type NeighborhoodCardData } from "@/components/home/NeighborhoodCards";
import NeighborhoodListingsSection from "@/components/properties/NeighborhoodListingsSection";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import { CATEGORIES } from "@/lib/categories";
import { BASE_URL, whatsappLink } from "@/lib/config";
import { breadcrumbSchema, neighborhoodSchema } from "@/lib/jsonld";
import { getNeighborhoodBySlug, NEIGHBORHOODS, VALID_NEIGHBORHOOD_SLUGS, NEIGHBORHOOD_IMAGES } from "@/lib/neighborhoods";
import type { Neighborhood, Property } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { allNeighborhoodContentQuery, neighborhoodContentQuery, propertiesByNeighborhoodQuery, zonePropertyZonesQuery } from "@/sanity/lib/queries";
import { ArrowRight, ChevronRight, Home } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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



export default async function NeighborhoodGuidePage({ params }: Props) {
  const neighborhood = getNeighborhoodBySlug(params.slug);
  if (!neighborhood) notFound();

  const [properties, nbhContent, allNbhContent, allZones] = await Promise.all([
    sanityFetch<Property[]>(propertiesByNeighborhoodQuery, { neighborhood: neighborhood.name }),
    sanityFetch<Neighborhood | null>(neighborhoodContentQuery, { slug: params.slug }),
    sanityFetch<Array<{ slug: string; avgPricePerM2: number | null }>>(allNeighborhoodContentQuery),
    sanityFetch<Array<{ zone: string }>>(zonePropertyZonesQuery),
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
    : NEIGHBORHOOD_IMAGES[params.slug] ?? "/hero-bg.jpg";

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

  // ── Nearby enriched (for NeighborhoodCards) ────────────────────────────────
  const avgPriceMap = new Map(allNbhContent.map((n) => [n.slug, n.avgPricePerM2]));
  const zoneCounts = new Map<string, number>();
  for (const { zone } of allZones) zoneCounts.set(zone, (zoneCounts.get(zone) ?? 0) + 1);

  const nearbyCards: NeighborhoodCardData[] = nearby.map((n) => {
    const avg = avgPriceMap.get(n.slug);
    return {
      name:     n.name,
      slug:     n.slug,
      image:    NEIGHBORHOOD_IMAGES[n.slug] ?? "/hero-bg.jpg",
      avgPrice: avg ? `$${avg.toLocaleString("en-US")}/m²` : "",
      count:    zoneCounts.get(n.name) ?? 0,
    };
  });

  // ── Split by intent, sorted by price desc ─────────────────────────────────
  const sortedByPrice = [...properties].sort((a, b) => b.price - a.price);
  const ventaProps    = sortedByPrice.filter((p) => p.businessType === "venta");
  const alquilerProps = sortedByPrice.filter((p) => p.businessType === "alquiler");

  // ── Most common property type ──────────────────────────────────────────────
  const mostCommonType = categoryCards.length > 0
    ? categoryCards.reduce((prev, curr) => curr.count > prev.count ? curr : prev)
    : null;

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
            <h1 className="font-heading font-normal text-[clamp(44px,6vw,80px)] 2xl:text-[68px] text-white leading-none tracking-[-2.5px] md:whitespace-nowrap">
              Vivir en {neighborhood.name},
              <span className="italic"> Panama</span>
            </h1>

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
      <section className="bg-[#f9f9f9] px-[24px] xl:px-[20px] 2xl:px-[120px] py-[80px] xl:py-[112px]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-[64px] xl:gap-[100px] 2xl:gap-[200px]">

            {/* Left — text */}
            <div className="flex flex-col">
              <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
                Guía del barrio
              </p>
              <h2 className="font-heading font-normal text-[clamp(40px,4.5vw,60px)] 2xl:text-[52px] text-[#0c1834] tracking-[-1.8px] leading-none mt-[12px]">
                Sobre <em className="italic">{neighborhood.name}</em>
              </h2>

              <p className="font-body text-[17px] xl:text-[20px] text-[#737b8c] leading-[1.7] mt-[32px]">
                {nbhContent.seoBlock}
              </p>

              {properties.length > 0 && (
                <p className="font-body text-[15px] xl:text-[17px] text-[#737b8c] mt-[20px]">
                  Actualmente hay{" "}
                  <span className="font-semibold text-[#0c1834]">
                    {properties.length} {properties.length === 1 ? "propiedad disponible" : "propiedades disponibles"}
                  </span>{" "}
                  en {neighborhood.name}.
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[18px] mt-[50px]">
                <Link
                  href={`/propiedades-en-venta/${params.slug}/`}
                  className="inline-flex justify-center items-center gap-[8px] border border-[#dfe5ef] text-[#0c1834] font-body font-medium text-[14px] px-[21px] py-[13px] hover:bg-white transition-colors whitespace-nowrap"
                >
                  Ver propiedades
                  <ArrowRight size={14} />
                </Link>
                <a
                  href={whatsappLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-[8px] bg-[#00b424] hover:bg-[#009e1f] text-white font-body font-medium text-[14px] px-[21px] py-[13px] transition-colors whitespace-nowrap"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Consultar por WhatsApp
                </a>
              </div>
            </div>

            {/* Right — stat rows */}
            <aside className="flex flex-col justify-start pt-[4px]">
              {avgPricePerM2 && (
                <div className="flex flex-col gap-[4px] border-b border-[#dfe5ef] pb-[32px] mb-[32px]">
                  <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
                    Precio promedio
                  </p>
                  <div className="flex items-baseline gap-[6px] mt-[10px]">
                    <span className="font-heading font-normal text-[clamp(36px,4vw,60px)] 2xl:text-[50px] text-[#0c1834] tracking-[-1.8px] leading-none">
                      {formatPrice(avgPricePerM2)}
                    </span>
                    <span className="font-heading font-normal text-[clamp(18px,2vw,30px)] text-[#0c1834] tracking-[-0.9px] leading-none">
                      /m²
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-[4px] border-b border-[#dfe5ef] pb-[32px] mb-[32px]">
                <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
                  Propiedades activas
                </p>
                <div className="flex items-baseline gap-[6px] mt-[10px]">
                  <span className="font-heading font-normal text-[clamp(36px,4vw,60px)] 2xl:text-[50px] text-[#0c1834] tracking-[-1.8px] leading-none">
                    {properties.length}
                  </span>
                  <span className="font-heading font-normal text-[clamp(18px,2vw,30px)] text-[#0c1834] tracking-[-0.9px] leading-none">
                    listings
                  </span>
                </div>
              </div>

              {mostCommonType && (
                <div className="flex flex-col gap-[4px] border-b border-[#dfe5ef] pb-[32px]">
                  <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
                    Tipo más disponible
                  </p>
                  <div className="flex items-baseline gap-[6px] mt-[10px]">
                    <span className="font-heading font-normal text-[clamp(36px,4vw,60px)] 2xl:text-[50px] text-[#0c1834] tracking-[-1.8px] leading-none">
                      {mostCommonType.count}
                    </span>
                    <span className="font-heading font-normal text-[clamp(18px,2vw,30px)] text-[#0c1834] tracking-[-0.9px] leading-none">
                      {mostCommonType.cat.h1.split(" en Panama")[0].split(" en Panamá")[0]}
                    </span>
                  </div>
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


      {/* ═══════════════════════════════════════════════════════════════════════
          5. LISTINGS — Cards + mapa (tabs Comprar / Alquilar)
      ═══════════════════════════════════════════════════════════════════════ */}
      {properties.length > 0 && (
        <section className="bg-white border-t border-[#dfe5ef] px-[24px] xl:px-[20px] 2xl:px-[120px] py-[80px] xl:py-[130px]">
          <div className="max-w-[1600px] mx-auto">
            <NeighborhoodListingsSection
              ventaProps={ventaProps}
              alquilerProps={alquilerProps}
              allMapMarkers={mapProps}
              neighborhoodName={neighborhood.name}
              neighborhoodSlug={params.slug}
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          8. OTROS BARRIOS
      ═══════════════════════════════════════════════════════════════════════ */}
      {nearbyCards.length > 0 && (
        <NeighborhoodCards
          neighborhoods={nearbyCards}
          eyebrow="Sigue explorando"
          heading="Otros barrios"
          sectionClassName="bg-[#f9f9f9] border-t border-[#dfe5ef]"
        />
      )}
       {/* ═══════════════════════════════════════════════════════════════════════
          7. CTA — Conversión
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#121e3e] px-[24px] xl:px-[20px] 2xl:px-[120px] py-[80px] xl:py-[120px]">
        <div className="max-w-[1600px] mx-auto flex flex-col items-center text-center gap-[24px]">
          <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase">
            Contáctenos
          </p>
          <h2 className="font-heading font-normal text-[clamp(36px,5vw,64px)] 2xl:text-[54px] text-white tracking-[-2px] leading-none max-w-[800px]">
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

    </>
  );
}
