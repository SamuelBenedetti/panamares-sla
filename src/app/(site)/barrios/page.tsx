import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getSlugByName, NEIGHBORHOODS } from "@/lib/neighborhoods";
import { sanityFetch } from "@/sanity/lib/client";
import { activeZonesQuery, neighborhoodCountsQuery } from "@/sanity/lib/queries";
import { breadcrumbSchema } from "@/lib/jsonld";
import { BASE_URL } from "@/lib/config";
import NeighborhoodSlider from "@/components/barrios/NeighborhoodSlider";

export const metadata: Metadata = {
  title: "Barrios de Panamá | Guía de Zonas",
  description:
    "Explora los mejores barrios de Ciudad de Panamá: Punta Pacífica, Punta Paitilla, Avenida Balboa, Costa del Este y más. Guía completa de propiedades por zona.",
  alternates: { canonical: `${BASE_URL}/barrios/` },
};

const NEIGHBORHOOD_IMAGES: Record<string, string> = {
  "punta-pacifica":
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&h=800&fit=crop&q=85",
  "punta-paitilla":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=800&fit=crop&q=85",
  "avenida-balboa":
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&h=800&fit=crop&q=85",
  "costa-del-este":
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=800&fit=crop&q=85",
  "obarrio":
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&h=900&fit=crop",
  "calle-50":
    "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=700&h=900&fit=crop",
  "san-francisco":
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&h=900&fit=crop",
  "marbella":
    "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=700&h=900&fit=crop",
  "albrook":
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=700&h=900&fit=crop",
  "coronado":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&h=900&fit=crop",
  "coco-del-mar":
    "https://images.unsplash.com/photo-1494526585095-c41746248156?w=700&h=900&fit=crop",
  "santa-maria":
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=700&h=900&fit=crop",
  "el-cangrejo":
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&h=900&fit=crop",
  "altos-del-golf":
    "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=700&h=900&fit=crop",
  "via-porras":
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&h=900&fit=crop",
  "bella-vista":
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&h=900&fit=crop",
  "condado-del-rey":
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&h=900&fit=crop",
  "amador":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&h=900&fit=crop",
  "los-andes":
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&h=900&fit=crop",
  "carrasquilla":
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=700&h=900&fit=crop",
  "loma-alegre":
    "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=700&h=900&fit=crop",
  "alto-del-chase":
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=700&h=900&fit=crop",
  "versalles":
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=700&h=900&fit=crop",
  "rio-mar":
    "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=700&h=900&fit=crop",
};

// Static avg price/m² per featured slider neighborhoods
const AVG_PRICE: Record<string, string> = {
  "punta-pacifica": "$3,200/m²",
  "punta-paitilla": "$3,000/m²",
  "avenida-balboa": "$2,800/m²",
  "costa-del-este": "$2,500/m²",
  "obarrio":        "$3,200/m²",
  "calle-50":       "$2,900/m²",
  "san-francisco":  "$2,600/m²",
  "bella-vista":    "$2,400/m²",
  "albrook":        "$2,400/m²",
  "coco-del-mar":   "$2,400/m²",
  "santa-maria":    "$2,400/m²",
  "marbella":       "$2,400/m²",
  "el-cangrejo":    "$2,400/m²",
  "altos-del-golf": "$2,400/m²",
  "via-porras":     "$2,400/m²",
  "condado-del-rey":"$2,400/m²",
  "amador":         "$2,400/m²",
  "los-andes":      "$2,400/m²",
  "carrasquilla":   "$2,400/m²",
  "loma-alegre":    "$2,400/m²",
  "alto-del-chase": "$2,400/m²",
  "coronado":       "$2,400/m²",
  "versalles":      "$2,400/m²",
  "rio-mar":        "$2,400/m²",
};

// Local hi-res images for featured slider
const FEATURED_LOCAL_IMAGES: Record<string, string> = {
  "punta-pacifica": "/barrio-punta-pacifica.png",
  "punta-paitilla": "/barrio-punta-paitilla.png",
  "avenida-balboa": "/barrio-avenida-balboa.png",
  "costa-del-este": "/barrio-costa-del-este.png",
};

const FEATURED_SLUGS = [
  "punta-pacifica",
  "punta-paitilla",
  "avenida-balboa",
  "costa-del-este",
];

export default async function BarriosPage() {
  const [activeZoneNames, counts] = await Promise.all([
    sanityFetch<string[]>(activeZonesQuery),
    sanityFetch<{
      puntaPacifica: number;
      puntaPaitilla: number;
      avenidaBalboa: number;
      costaDelEste: number;
    }>(neighborhoodCountsQuery),
  ]);

  const activeSlugs = new Set(
    activeZoneNames
      .map((name) => getSlugByName(name))
      .filter((s): s is string => s !== undefined)
  );
  activeSlugs.add("costa-del-este");

  const countBySlugs: Record<string, number> = {
    "punta-pacifica": counts.puntaPacifica,
    "punta-paitilla": counts.puntaPaitilla,
    "avenida-balboa": counts.avenidaBalboa,
    "costa-del-este": counts.costaDelEste,
  };

  const sliderNeighborhoods = FEATURED_SLUGS.map((slug) => ({
    slug,
    name: NEIGHBORHOODS.find((n) => n.slug === slug)?.name ?? slug,
    image: FEATURED_LOCAL_IMAGES[slug] ?? NEIGHBORHOOD_IMAGES[slug],
    avgPrice: AVG_PRICE[slug],
    propertyCount: countBySlugs[slug] ?? undefined,
  }));

  const rest = NEIGHBORHOODS.filter((n) => !FEATURED_SLUGS.includes(n.slug));
  const totalZones = FEATURED_SLUGS.length + rest.length;

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
      <section className="bg-[#f9f9f9] px-[24px] xl:px-[20px] 2xl:px-[120px] pt-[32px] xl:pt-[40px] pb-0 xl:pb-[28px]">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-[16px]">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-[8px] flex-wrap">
            <Link
              href="/"
              className="font-body font-normal text-[16px] text-[#5a6478] tracking-[-0.32px] hover:text-[#0c1834] transition-colors"
            >
              Inicio
            </Link>
            <ChevronRight size={13} className="text-[#5a6478]" />
            <span className="font-body font-medium text-[16px] text-[#0c1834] tracking-[-0.32px]">
              Barrios
            </span>
          </nav>

          {/* Title + count */}
          <div className="flex flex-col gap-[40px] pb-[30px] xl:flex-row xl:items-baseline xl:justify-between xl:gap-[16px] xl:pb-0">
            <h1 className="font-heading font-normal text-[60px] text-[#0c1834] leading-[normal] tracking-[-1.8px]">
              Barrios de{" "}
              <em className="italic">Panama City</em>
            </h1>
            <p className="font-body text-[13px] xl:text-[14px] text-[#5a6478] leading-none shrink-0">
              <span className="font-semibold text-[#0c1834]">{totalZones}</span>{" "}
              Zonas con propiedades disponibles
            </p>
          </div>
        </div>
      </section>

      {/* ── Hero Slider ── */}
      <section className="bg-[#f9f9f9] px-[24px] xl:px-[20px] 2xl:px-[120px] pb-[32px] xl:pb-[64px]">
        <div className="max-w-[1600px] mx-auto">
          <NeighborhoodSlider neighborhoods={sliderNeighborhoods} />
        </div>
      </section>

      {/* ── Más barrios ── */}
      {rest.length > 0 && (
        <section className="bg-[#f9f9f9] px-[24px] xl:px-[20px] 2xl:px-[120px] pt-[100px] pb-[80px] xl:pb-[120px]">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-[30px]">

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
                const img =
                  NEIGHBORHOOD_IMAGES[n.slug] ??
                  NEIGHBORHOOD_IMAGES["punta-pacifica"];
                const price = AVG_PRICE[n.slug];

                return (
                  <Link
                    key={n.slug}
                    href={`/barrios/${n.slug}/`}
                    className="group relative overflow-hidden bg-[#0c1935] flex flex-col items-start justify-center"
                    style={{ aspectRatio: "338 / 250" }}
                  >
                    {/* Photo — fill the 338×250 card */}
                    <Image
                      src={img}
                      alt={n.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />

                    {/* Gradient: multiply blend — exacto Figma */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1d212b] via-[rgba(29,33,43,0.2)] via-[50%] to-[rgba(29,33,43,0)] mix-blend-multiply" />

                    {/* Info overlay */}
                    <div className="absolute bottom-[0.34px] left-0 right-0 p-[24px] flex flex-col gap-[8px]">

                      {/* Name */}
                      <div className="flex items-center w-full">
                        <h3 className="font-body font-semibold text-[25px] text-white tracking-[-0.25px] leading-normal whitespace-nowrap">
                          {n.name}
                        </h3>
                      </div>

                      {/* Stats */}
                      {price && (
                        <div className="flex gap-[10px] items-start pt-[4px]">
                          <div className="flex flex-col gap-[10px] items-start">
                            <span
                              className="font-body font-normal text-[12px] text-white whitespace-nowrap"
                              style={{ lineHeight: "16px" }}
                            >
                              Precio promedio
                            </span>
                            <div className="bg-white/20 px-[5px] py-[3px] w-full">
                              <span className="font-body font-semibold text-[16px] text-white leading-normal whitespace-nowrap">
                                {price}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-[10px] items-start">
                            <span
                              className="font-body font-normal text-[12px] text-white whitespace-nowrap"
                              style={{ lineHeight: "16px" }}
                            >
                              Propiedades
                            </span>
                            <div className="bg-white/20 px-[5px] py-[3px]">
                              <span className="font-body font-semibold text-[16px] text-white leading-normal">
                                —
                              </span>
                            </div>
                          </div>
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
      <section className="bg-[#121e3e] px-[24px] xl:px-[20px] 2xl:px-[120px] py-[70px] xl:py-[90px]">
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[32px]">
          <div className="flex flex-col gap-[14px]">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              ¿No sabes por dónde empezar?
            </p>
            <h2 className="font-heading font-normal text-[clamp(32px,4vw,54px)] text-white tracking-[-1.6px] leading-none">
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
