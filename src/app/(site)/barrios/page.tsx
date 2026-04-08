import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, ChevronRight } from "lucide-react";
import { NEIGHBORHOODS, getSlugByName } from "@/lib/neighborhoods";
import { sanityFetch } from "@/sanity/lib/client";
import { activeZonesQuery } from "@/sanity/lib/queries";
import { breadcrumbSchema } from "@/lib/jsonld";

const BASE_URL = "https://panamares.com";

export const metadata: Metadata = {
  title: "Barrios de Panamá | Guía de Zonas",
  description:
    "Explora los mejores barrios de Ciudad de Panamá: Punta Pacífica, Punta Paitilla, Avenida Balboa, Costa del Este y más. Guía completa de propiedades por zona.",
  alternates: { canonical: `${BASE_URL}/barrios/` },
};

const NEIGHBORHOOD_IMAGES: Record<string, string> = {
  "punta-pacifica":
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
  "punta-paitilla":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
  "avenida-balboa":
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
  "costa-del-este":
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
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
  "panama":
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop&q=80&sat=-20",
};

// Same 4 neighborhoods + images as the homepage "Explorar por Ubicación" section
const FEATURED_NEIGHBORHOODS = [
  {
    name: "Punta Pacífica",
    slug: "punta-pacifica",
    image: "/barrio-punta-pacifica.png",
  },
  {
    name: "Punta Paitilla",
    slug: "punta-paitilla",
    image: "/barrio-punta-paitilla.png",
  },
  {
    name: "Avenida Balboa",
    slug: "avenida-balboa",
    image: "/barrio-avenida-balboa.png",
  },
  {
    name: "Costa del Este",
    slug: "costa-del-este",
    image: "/barrio-costa-del-este.png",
  },
];

export default async function BarriosPage() {
  const activeZoneNames = await sanityFetch<string[]>(activeZonesQuery);
  const activeSlugs = new Set(
    activeZoneNames
      .map((name) => getSlugByName(name))
      .filter((s): s is string => s !== undefined)
  );
  activeSlugs.add("costa-del-este");

  const featured = FEATURED_NEIGHBORHOODS.filter(
    (n) => n.slug === "costa-del-este" || activeSlugs.has(n.slug)
  );
  const rest = NEIGHBORHOODS.filter(
    (n) => n.priority !== "HIGH" && activeSlugs.has(n.slug)
  );
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Barrios", url: "/barrios/" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* ── Hero ── */}
      <section className="relative flex items-end min-h-[70vh] bg-[#0c1834] overflow-hidden -mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://www.figma.com/api/mcp/asset/46c62f80-93f2-48ab-a542-c8b9722522e1')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(29,33,43,0.4)] via-[rgba(29,33,43,0.3)] to-[rgba(29,33,43,0.85)]" />

        <div className="relative z-10 w-full px-[30px] xl:px-[20px] 2xl:px-[120px] pb-[70px] xl:pb-[90px] pt-[140px]">
          <div className="flex flex-col gap-[20px] max-w-[720px]">
            <nav className="flex items-center gap-[8px]">
              <Link href="/" className="font-body text-[13px] text-white/50 hover:text-white/80 transition-colors">Inicio</Link>
              <ChevronRight size={12} className="text-white/30" />
              <span className="font-body text-[13px] text-white/80">Barrios</span>
            </nav>
            <p className="font-body font-medium text-[12px] text-white/60 tracking-[5px] uppercase leading-4">
              Ciudad de Panamá
            </p>
            <h1 className="flex flex-col text-white">
              <span className="font-heading font-normal text-[clamp(40px,5vw,68px)] leading-none tracking-[-2px]">
                Explora los mejores
              </span>
              <span className="font-heading font-medium italic text-[clamp(44px,6vw,76px)] leading-none tracking-[-2.3px]">
                barrios de Panamá
              </span>
            </h1>
            <p className="font-body font-light text-[16px] xl:text-[18px] text-white/70 leading-relaxed max-w-[560px] pt-[8px]">
              Guía completa de las zonas más exclusivas de Ciudad de Panamá —
              propiedades, precios, estilo de vida y todo lo que necesitas para decidir dónde vivir o invertir.
            </p>
          </div>
        </div>
      </section>

      {/* ── Zonas destacadas ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[20px] 2xl:px-[120px] pt-[80px] xl:pt-[100px] pb-[60px]">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-[40px]">
          <div className="flex flex-col gap-[10px]">
            <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
              Zonas destacadas
            </p>
            <h2 className="font-heading font-normal text-[clamp(32px,4vw,48px)] text-[#0c1834] tracking-[-1.4px] leading-none">
              Las zonas más exclusivas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
            {featured.map((n) => {
              return (
                <Link
                  key={n.slug}
                  href={`/barrios/${n.slug}/`}
                  className="group relative h-[300px] sm:h-[380px] xl:aspect-[326/435] xl:h-auto overflow-hidden bg-[#0c1834] flex flex-col justify-end"
                >
                  <Image
                    src={n.image}
                    alt={n.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1834]/90 via-[#0c1834]/20 to-transparent" />
                  <div className="relative z-10 p-[20px] xl:p-[28px] flex flex-col gap-[8px]">
                    <div className="flex items-center gap-[6px]">
                      <MapPin size={12} className="text-[#d4a435]" />
                      <span className="font-body font-medium text-[11px] text-[#d4a435] tracking-[3px] uppercase">
                        Ciudad de Panamá
                      </span>
                    </div>
                    <h3 className="font-heading font-normal text-[28px] xl:text-[38px] text-white leading-none tracking-[-1px]">
                      {n.name}
                    </h3>
                    <div className="flex items-center gap-[6px] mt-[4px] xl:opacity-0 xl:group-hover:opacity-100 xl:translate-y-[6px] xl:group-hover:translate-y-0 transition-all duration-300">
                      <span className="font-body font-medium text-[13px] text-white/80">
                        Ver propiedades
                      </span>
                      <ArrowRight size={14} className="text-white/80" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Todas las zonas ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[20px] 2xl:px-[120px] pt-[20px] pb-[100px] xl:pb-[130px]">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[10px]">
            <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
              Todas las zonas
            </p>
            <h2 className="font-heading font-normal text-[clamp(28px,3vw,40px)] text-[#0c1834] tracking-[-1.2px] leading-none">
              Más barrios de Panamá
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[16px]">
            {rest.map((n) => {
              const img = NEIGHBORHOOD_IMAGES[n.slug] ?? "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop";
              return (
                <Link
                  key={n.slug}
                  href={`/barrios/${n.slug}/`}
                  className="group relative h-[200px] md:h-[240px] overflow-hidden bg-[#0c1834] flex flex-col justify-end"
                >
                  <Image
                    src={img}
                    alt={n.name}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1834]/80 via-transparent to-transparent" />
                  <div className="relative z-10 p-[16px] xl:p-[20px]">
                    <h3 className="font-body font-semibold text-[15px] xl:text-[17px] text-white leading-tight">
                      {n.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#121e3e] px-[30px] xl:px-[20px] 2xl:px-[120px] py-[70px] xl:py-[90px]">
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[32px]">
          <div className="flex flex-col gap-[14px]">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              ¿No sabes por dónde empezar?
            </p>
            <h2 className="font-heading font-normal text-[clamp(32px,4vw,54px)] text-white tracking-[-1.6px] leading-none">
              Te ayudamos a elegir
            </h2>
            <p className="font-body font-light text-[15px] text-white/60 leading-relaxed max-w-[480px]">
              Nuestros asesores conocen cada zona a fondo. Cuéntanos qué buscas y te guiamos hacia el barrio perfecto para ti.
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
