import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, ChevronRight } from "lucide-react";
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
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400&h=600&fit=crop",
  "punta-paitilla":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=600&fit=crop",
  "avenida-balboa":
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&h=600&fit=crop",
  "costa-del-este":
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&h=600&fit=crop",
  "obarrio":
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
  "calle-50":
    "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800&h=600&fit=crop",
  "san-francisco":
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
  "marbella":
    "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop",
  "albrook":
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop",
  "coronado":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
  "coco-del-mar":
    "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&h=600&fit=crop",
  "santa-maria":
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
  "el-cangrejo":
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
  "altos-del-golf":
    "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&h=600&fit=crop",
  "via-porras":
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop",
  "bella-vista":
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
  "condado-del-rey":
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  "amador":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "los-andes":
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop",
  "carrasquilla":
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&h=600&fit=crop",
  "loma-alegre":
    "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&h=600&fit=crop",
  "alto-del-chase":
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop",
  "versalles":
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop",
  "rio-mar":
    "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800&h=600&fit=crop",
};

// Static avg price/m² per featured neighborhood
const AVG_PRICE: Record<string, string> = {
  "punta-pacifica": "$3,200/m²",
  "punta-paitilla": "$3,000/m²",
  "avenida-balboa": "$2,800/m²",
  "costa-del-este": "$2,500/m²",
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

  const rest = NEIGHBORHOODS.filter(
    (n) => !FEATURED_SLUGS.includes(n.slug)
  );

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
      <section className="bg-[#f9f9f9] px-[24px] xl:px-[20px] 2xl:px-[120px] pt-[32px] xl:pt-[40px] pb-[20px] xl:pb-[28px]">
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

          {/* Title + count — same row */}
          <div className="flex items-baseline justify-between gap-[16px]">
            <h1 className="font-heading font-normal text-[clamp(36px,4vw,60px)] text-[#0c1834] leading-none tracking-[-1.8px]">
              Barrios de{" "}
              <em className="italic">Panama City</em>
            </h1>
            <p className="font-body text-[14px] text-[#5a6478] leading-none shrink-0 hidden sm:block">
              <span className="font-semibold text-[#0c1834]">{totalZones}</span>{" "}
              Zonas con propiedades disponibles
            </p>
          </div>

          {/* Mobile-only count */}
          <p className="font-body text-[13px] text-[#5a6478] leading-none sm:hidden">
            <span className="font-semibold text-[#0c1834]">{totalZones}</span>{" "}
            zonas con propiedades disponibles
          </p>
        </div>
      </section>

      {/* ── Hero Slider ── */}
      <section className="bg-[#f9f9f9] px-[24px] xl:px-[20px] 2xl:px-[120px] pb-[48px] xl:pb-[64px]">
        <div className="max-w-[1600px] mx-auto">
          <NeighborhoodSlider neighborhoods={sliderNeighborhoods} />
        </div>
      </section>

      {/* ── Más barrios ── */}
      {rest.length > 0 && (
        <section className="bg-[#f9f9f9] px-[24px] xl:px-[20px] 2xl:px-[120px] pb-[60px]">
          <div className="max-w-[1600px] mx-auto flex flex-col gap-[24px]">
            <div className="flex flex-col gap-[6px]">
              <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
                Más zonas
              </p>
              <h2 className="font-heading font-normal text-[clamp(28px,3vw,40px)] text-[#0c1834] tracking-[-1.2px] leading-none">
                Otros barrios
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[12px]">
              {rest.map((n) => {
                const img =
                  NEIGHBORHOOD_IMAGES[n.slug] ??
                  NEIGHBORHOOD_IMAGES["punta-pacifica"];
                return (
                  <Link
                    key={n.slug}
                    href={`/barrios/${n.slug}/`}
                    className="group relative h-[160px] md:h-[200px] overflow-hidden bg-[#0c1834] flex flex-col justify-end rounded-[4px]"
                  >
                    <Image
                      src={img}
                      alt={n.name}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1834]/80 via-transparent to-transparent" />
                    <div className="relative z-10 p-[14px] xl:p-[18px] flex items-center justify-between">
                      <h3 className="font-body font-semibold text-[15px] text-white leading-tight">
                        {n.name}
                      </h3>
                      <ArrowRight size={13} className="text-white/60 shrink-0" />
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
