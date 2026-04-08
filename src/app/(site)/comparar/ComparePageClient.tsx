"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { BASE_URL, whatsappLink } from "@/lib/config";

type Tag = "oferta" | "economico" | "ubicacion" | "espacio";

const TAGS: { key: Tag; label: string }[] = [
  { key: "oferta", label: "Mejor oferta" },
  { key: "economico", label: "Más económico" },
  { key: "ubicacion", label: "Mejor ubicación" },
  { key: "espacio", label: "Más espacio" },
];

const ZONE_PRESTIGE: Record<string, number> = {
  "Punta Pacífica": 1,
  "Punta Paitilla": 2,
  "Avenida Balboa": 3,
  "Costa del Este": 4,
  "Coco del Mar": 5,
  "Obarrio": 6,
  "Calle 50": 7,
  "Marbella": 8,
  "San Francisco": 9,
  "El Cangrejo": 10,
  "Bella Vista": 11,
  "Santa María": 12,
};

function getScore(p: Property, tag: Tag): number {
  switch (tag) {
    case "oferta": {
      const ppm = p.area && p.area > 0 ? p.price / p.area : Infinity;
      return ppm; // lower = better
    }
    case "economico":
      return p.price; // lower = better
    case "ubicacion":
      return ZONE_PRESTIGE[p.zone ?? ""] ?? 99; // lower = better
    case "espacio":
      return -(p.area ?? 0); // higher area = better → negate for consistent "lower = better"
  }
}

function rankProperties(properties: Property[], tag: Tag) {
  return [...properties]
    .map((p) => ({ p, score: getScore(p, tag) }))
    .sort((a, b) => a.score - b.score)
    .map((item, i) => ({ ...item, rank: i + 1 }));
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const BADGE_STYLES: Record<number, { bg: string; label: string }> = {
  1: { bg: "bg-[#00b424]", label: "Winner" },
  2: { bg: "bg-[#007ecd]", label: "2º" },
  3: { bg: "bg-[#737b8c]", label: "3º" },
};

const PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
];

interface Props { properties: Property[] }

export default function ComparePageClient({ properties }: Props) {
  const [activeTag, setActiveTag] = useState<Tag>("oferta");

  const ranked = useMemo(() => rankProperties(properties, activeTag), [properties, activeTag]);

  const rows: { label: string; value: (p: Property) => string }[] = [
    { label: "Precio", value: (p) => formatPrice(p.price) },
    { label: "Precio / m²", value: (p) => p.area && p.area > 0 ? `${formatPrice(Math.round(p.price / p.area))}/m²` : "—" },
    { label: "Área", value: (p) => p.area != null ? `${p.area} m²` : "—" },
    { label: "Dormitorios", value: (p) => p.bedrooms != null ? `${p.bedrooms} hab.` : "—" },
    { label: "Baños", value: (p) => p.bathrooms != null ? `${p.bathrooms} baños` : "—" },
    { label: "Barrio", value: (p) => p.zone ?? "—" },
    { label: "Plazas de aparcamiento", value: (p) => p.parking != null ? String(p.parking) : "—" },
  ];

  return (
    <section className="bg-[#f9f9f9] py-[110px] px-[30px] xl:px-[20px] 2xl:px-[120px]">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-[30px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-body text-[14px] text-[#737b8c]">
          <Link href="/" className="hover:text-[#0c1834] transition-colors">Inicio</Link>
          <span>›</span>
          <Link href="/propiedades-en-venta/" className="hover:text-[#0c1834] transition-colors">Propiedades en Venta</Link>
          <span>›</span>
          <span className="text-[#0c1834] font-medium">Lista comparada de propiedades</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-5 max-w-[600px] pb-10">
          <h1 className="font-heading font-normal text-[#0c1834] text-[clamp(40px,4vw,60px)] tracking-[-0.03em] leading-tight">
            Lista comparada de propiedades
          </h1>
          <p className="font-body text-[15px] text-[#0c1834] leading-[22px]">
            <strong>Compara lado a lado las propiedades que seleccionaste</strong> y visualiza rápidamente las diferencias en precio, tamaño, ubicación y potencial de valorización.{" "}
            <span className="font-normal text-[#737b8c]">Usa esta vista clara para identificar la mejor oportunidad y tomar una decisión con mayor confianza.</span>
          </p>
        </div>

        {/* Main layout */}
        <div className="flex gap-8 items-start">

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-10 w-[220px] shrink-0 pt-[220px]">
            {/* Tags */}
            <div className="flex flex-col gap-3">
              <p className="font-body font-medium text-[#737b8c] text-[12px] uppercase tracking-[3.2px]">Tags</p>
              {TAGS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTag(t.key)}
                  className={`text-left px-5 py-[9px] font-body text-[16px] transition-colors border ${
                    activeTag === t.key
                      ? "bg-[#727b8c] text-white border-[#727b8c] font-semibold"
                      : "border-[#e6e6e6] text-[rgba(12,25,53,0.3)] hover:border-[#0c1834] hover:text-[#0c1834]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Characteristics labels */}
            <div className="flex flex-col gap-4">
              <p className="font-body font-medium text-[#737b8c] text-[12px] uppercase tracking-[3.2px]">Características</p>
              {rows.map((r) => (
                <p key={r.label} className="font-body font-medium text-[#0c1935] text-[20px] leading-[30px]">
                  {r.label}
                </p>
              ))}
            </div>
          </aside>

          {/* Cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" style={{ gridAutoFlow: "row" }}>
            {ranked.map(({ p, rank }) => {
              const badge = BADGE_STYLES[rank];
              const placeholderIdx = p._id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % PLACEHOLDERS.length;
              const imgSrc = p.mainImage
                ? urlFor(p.mainImage).width(600).height(300).url()
                : PLACEHOLDERS[placeholderIdx];
              const waMsg = `Hola, me interesa esta propiedad: ${p.title} — ${BASE_URL}/propiedades/${p.slug?.current}`;

              return (
                <article key={p._id} style={{ order: rank }} className="bg-white border border-[#dfe5ef] shadow-sm flex flex-col overflow-hidden">
                  {/* Image */}
                  <div className="relative h-[200px] shrink-0">
                    <Image src={imgSrc} alt={p.title} fill className="object-cover" sizes="400px" />
                    {badge && (
                      <div className={`absolute top-[13px] left-[12px] ${badge.bg} px-[10px] py-[4px] backdrop-blur-[2px]`}>
                        <span className="font-body font-semibold text-white text-[20px] leading-[30px]">
                          {badge.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Data rows */}
                  <div className="flex flex-col gap-5 p-5">
                    {/* Mobile: show labels inline */}
                    {rows.map((r) => (
                      <div key={r.label} className="flex flex-col gap-0.5">
                        <span className="font-body text-[11px] text-[#737b8c] uppercase tracking-[2px] lg:hidden">
                          {r.label}
                        </span>
                        <span className="font-body font-semibold text-[#0c1834] text-[20px] text-center leading-[30px]">
                          {r.value(p)}
                        </span>
                      </div>
                    ))}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <a
                        href={whatsappLink(waMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 h-[44px] flex items-center justify-center bg-[#0d1835] text-white font-body font-medium text-[16px] hover:bg-[#162444] transition-colors"
                      >
                        Contáctenos
                      </a>
                      <Link
                        href={`/propiedades/${p.slug?.current}`}
                        className="flex-1 h-[44px] flex items-center justify-center border border-[#dfe5ef] text-[#0c1834] font-body font-medium text-[16px] hover:bg-gray-50 transition-colors"
                      >
                        Ver propiedad
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
