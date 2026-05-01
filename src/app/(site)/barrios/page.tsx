import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { getSlugByName, NEIGHBORHOODS, NEIGHBORHOOD_IMAGES } from "@/lib/neighborhoods";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { activeZonesQuery, zonePropertyZonesQuery, allNeighborhoodContentQuery } from "@/sanity/lib/queries";
import type { SanityImage } from "@/lib/types";
import { breadcrumbSchema } from "@/lib/jsonld";
import { canonical, alternates } from "@/lib/seo";
import NeighborhoodSlider from "@/components/barrios/NeighborhoodSlider";

export const metadata: Metadata = {
  title: "Barrios de Panamá | Guía de Zonas",
  description:
    "Explora los mejores barrios de Ciudad de Panamá: Punta Pacífica, Punta Paitilla, Avenida Balboa, Costa del Este y más. Guía completa de propiedades por zona.",
  alternates: { canonical: canonical("/barrios"), languages: alternates("/barrios", null) },
};

// Static avg price/m² fallback (used when Sanity doc has no avgPricePerM2)
const AVG_PRICE_FALLBACK: Record<string, string> = {
  "punta-pacifica":  "$3,200/m²",
  "punta-paitilla":  "$3,000/m²",
  "avenida-balboa":  "$2,800/m²",
  "costa-del-este":  "$2,500/m²",
  "obarrio":         "$3,200/m²",
  "calle-50":        "$2,900/m²",
  "san-francisco":   "$2,600/m²",
  "bella-vista":     "$2,400/m²",
  "panama-pacifico": "$2,000/m²",
  "farallon":        "$1,800/m²",
};

const FEATURED_SLUGS = [
  "punta-pacifica",
  "punta-paitilla",
  "avenida-balboa",
  "costa-del-este",
];

export default async function BarriosPage() {
  const [activeZoneNames, allZones, allNbhContent] = await Promise.all([
    sanityFetch<string[]>(activeZonesQuery),
    sanityFetch<{ zone: string }[]>(zonePropertyZonesQuery),
    sanityFetch<Array<{ slug: string; avgPricePerM2: number | null; photo?: SanityImage }>>(allNeighborhoodContentQuery),
  ]);

  const photoMap = new Map(
    allNbhContent
      .filter((n) => n.photo)
      .map((n) => [n.slug, urlFor(n.photo!).width(1920).height(900).fit("crop").url()])
  );

  const activeSlugs = new Set(
    activeZoneNames
      .map((name) => getSlugByName(name))
      .filter((s): s is string => s !== undefined)
  );

  // Count active properties per slug from all zones
  const countBySlug: Record<string, number> = {};
  for (const { zone } of allZones) {
    const slug = getSlugByName(zone);
    if (slug) countBySlug[slug] = (countBySlug[slug] ?? 0) + 1;
  }

  // Price map: Sanity avgPricePerM2 takes priority over static fallback
  const priceBySlug: Record<string, string> = { ...AVG_PRICE_FALLBACK };
  for (const { slug, avgPricePerM2 } of allNbhContent) {
    if (avgPricePerM2) {
      priceBySlug[slug] = `$${avgPricePerM2.toLocaleString("en-US")}/m²`;
    }
  }

  const sliderNeighborhoods = FEATURED_SLUGS.map((slug) => ({
    slug,
    name: NEIGHBORHOODS.find((n) => n.slug === slug)?.name ?? slug,
    image: photoMap.get(slug) ?? NEIGHBORHOOD_IMAGES[slug] ?? "/hero-bg.jpg",
    avgPrice: priceBySlug[slug],
    propertyCount: countBySlug[slug] ?? undefined,
  }));

  const rest = NEIGHBORHOODS.filter((n) => !FEATURED_SLUGS.includes(n.slug));
  const totalZones = activeSlugs.size;

  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Barrios", url: "/barrios/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ── Header ── */}
      <section className="bg-[#f9f9f9] px-[24px] xl:px-[60px] 2xl:px-[160px] pt-[32px] xl:pt-[40px] pb-0 xl:pb-[28px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[16px]">

          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Inicio", href: "/" },
              { label: "Barrios" },
            ]}
          />

          {/* Title + count */}
          <div className="flex flex-col gap-[40px] pb-[60px] xl:flex-row xl:items-baseline xl:justify-between xl:gap-[16px] xl:pb-0">
            <h1 className="font-heading font-normal text-[60px] text-[#0c1834] leading-[normal] tracking-[-1.8px]">
              Barrios de{" "}
              <em className="italic">Panama City</em>
            </h1>
            <div className="flex items-start gap-[5px] bg-white px-[10px] py-[8px] w-fit shrink-0">
              <span className="font-body font-semibold text-[13px] xl:text-[14px] text-[#0c1834] leading-none">{totalZones}</span>
              <span className="font-body font-normal text-[13px] xl:text-[14px] text-[#5a6478] leading-none">Zonas con propiedades disponibles</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hero Slider ── */}
      <section className="bg-[#f9f9f9] px-[24px] xl:px-[60px] 2xl:px-[160px] pb-[32px] xl:pb-[64px]">
        <div className="max-w-[1440px] mx-auto">
          <NeighborhoodSlider neighborhoods={sliderNeighborhoods} />
        </div>
      </section>

      {/* ── Más barrios ── */}
      {rest.length > 0 && (
        <section className="bg-[#f9f9f9] px-[24px] xl:px-[60px] 2xl:px-[160px] pt-[100px] pb-[80px] xl:pb-[120px]">
          <div className="max-w-[1440px] mx-auto flex flex-col gap-[30px]">

            {/* Section header */}
            <div className="flex flex-col pb-[20px]">
              <span
                className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase"
                style={{ lineHeight: "16px" }}
              >
                más zonas
              </span>
              <div className="flex gap-[10px] items-start leading-normal text-[#0c1834] text-[60px] tracking-[-1.8px]">
                <span className="font-heading font-normal not-italic whitespace-nowrap">
                  Otro
                </span>
                <span className="font-heading italic whitespace-nowrap">
                  barrios
                </span>
              </div>
            </div>

            {/* Cards grid — aspect-[326/434] portrait, 4 cols on xl */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[16px]">
              {rest.map((n) => {
                const img = photoMap.get(n.slug) ?? NEIGHBORHOOD_IMAGES[n.slug] ?? "/hero-bg.jpg";
                const price = priceBySlug[n.slug];
                const count = countBySlug[n.slug] ?? 0;

                return (
                  <Link
                    key={n.slug}
                    href={`/barrios/${n.slug}/`}
                    className="group relative overflow-hidden bg-[#0c1935] flex flex-col items-start justify-center"
                    style={{ aspectRatio: "338 / 250" }}
                  >
                    <Image
                      src={img}
                      alt={n.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1d212b] via-[rgba(29,33,43,0.2)] via-[50%] to-[rgba(29,33,43,0)] mix-blend-multiply" />

                    <div className="absolute bottom-[0.34px] left-0 right-0 p-[24px] flex flex-col gap-[8px]">
                      <h3 className="font-body font-semibold text-[25px] text-white tracking-[-0.25px] leading-normal whitespace-nowrap">
                        {n.name}
                      </h3>

                      {(price || count > 0) && (
                        <div className="flex gap-[10px] items-start pt-[4px]">
                          {price && (
                            <div className="flex flex-col gap-[10px] items-start">
                              <span className="font-body font-normal text-[12px] text-white whitespace-nowrap" style={{ lineHeight: "16px" }}>
                                Precio promedio
                              </span>
                              <div className="bg-white/20 px-[5px] py-[3px]">
                                <span className="font-body font-semibold text-[16px] text-white leading-normal whitespace-nowrap">
                                  {price}
                                </span>
                              </div>
                            </div>
                          )}
                          {count > 0 && (
                            <div className="flex flex-col gap-[10px] items-start">
                              <span className="font-body font-normal text-[12px] text-white whitespace-nowrap" style={{ lineHeight: "16px" }}>
                                Propiedades
                              </span>
                              <div className="bg-white/20 px-[5px] py-[3px]">
                                <span className="font-body font-semibold text-[16px] text-white leading-normal">
                                  {count}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="bg-[#121e3e] px-[24px] xl:px-[60px] 2xl:px-[160px] py-[70px] xl:py-[90px]">
        <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[32px]">
          <div className="flex flex-col gap-[14px]">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              ¿No sabes por dónde empezar?
            </p>
            <h2 className="font-heading font-normal text-[clamp(28px,3.2vw,46px)] 2xl:text-[40px] text-white tracking-[-1.6px] leading-none">
              Te ayudamos a elegir
            </h2>
            <p className="font-body font-light text-[15px] text-white/60 leading-relaxed max-w-[480px]">
              Nuestros asesores conocen cada zona a fondo. Cuéntanos qué buscas
              y te guiamos hacia el barrio perfecto para ti.
            </p>
          </div>
          <Link
            href="/contacto/"
            className="inline-flex items-center justify-center gap-[8px] bg-white w-full xl:w-fit px-[32px] py-[15px] font-body font-medium text-[14px] text-[#0c1834] tracking-[1.4px] uppercase hover:bg-[#f9f9f9] transition-colors whitespace-nowrap"
          >
            Hablar con un asesor
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
