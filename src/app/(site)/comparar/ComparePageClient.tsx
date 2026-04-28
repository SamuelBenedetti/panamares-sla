"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { BASE_URL, whatsappLink } from "@/lib/config";
import { formatPrice } from "@/lib/utils";
import Breadcrumb from "@/components/ui/Breadcrumb";

type Tag = "oferta" | "economico" | "ubicacion" | "espacio";

const TAGS: { key: Tag; label: string }[] = [
  { key: "oferta",    label: "Mejor oferta" },
  { key: "economico", label: "Más económico" },
  { key: "ubicacion", label: "Mejor ubicación" },
  { key: "espacio",   label: "Más espacio" },
];

const ZONE_PRESTIGE: Record<string, number> = {
  "Punta Pacífica": 1, "Punta Paitilla": 2, "Avenida Balboa": 3,
  "Costa del Este": 4, "Coco del Mar": 5,   "Obarrio": 6,
  "Calle 50": 7,       "Marbella": 8,        "San Francisco": 9,
  "El Cangrejo": 10,   "Bella Vista": 11,    "Santa María": 12,
};

function getScore(p: Property, tag: Tag): number {
  switch (tag) {
    case "oferta":    return p.area && p.area > 0 ? p.price / p.area : Infinity;
    case "economico": return p.price;
    case "ubicacion": return ZONE_PRESTIGE[p.zone ?? ""] ?? 99;
    case "espacio":   return -(p.area ?? 0);
  }
}

function rankProperties(properties: Property[], tag: Tag) {
  return [...properties]
    .map((p) => ({ p, score: getScore(p, tag) }))
    .sort((a, b) => a.score - b.score)
    .map((item, i) => ({ ...item, rank: i + 1 }));
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

// Card image height in px.
// This value is tuned so the "Características" labels in the sidebar
// naturally align with the data rows inside the cards.
//
// Sidebar Tags section height:
//   heading 20px + gap×4 (4×12=48px) + buttons×4 (4×40=160px) = 228px
// Sidebar gap between sections: 40px
// Sidebar Características heading: 20px  → starts at 268px
// Sidebar gap after heading: 16px
// "Precio" label starts at: 268 + 20 + 16 = 304px
//
// Card "Precio" value starts at: IMG_H + card padding-top (20px)
// So: IMG_H = 304 - 20 = 284px
const IMG_H = 284;

interface Props { properties: Property[] }

export default function ComparePageClient({ properties }: Props) {
  const [activeTag, setActiveTag] = useState<Tag>("oferta");
  const ranked = useMemo(() => rankProperties(properties, activeTag), [properties, activeTag]);

  const rows: { label: string; value: (p: Property) => string }[] = [
    { label: "Precio",                 value: (p) => formatPrice(p.price) },
    { label: "Precio / m²",            value: (p) => p.area && p.area > 0 ? `${formatPrice(Math.round(p.price / p.area))}/m²` : "—" },
    { label: "Área",                   value: (p) => p.area != null ? `${p.area} m²` : "—" },
    { label: "Dormitorios",            value: (p) => p.bedrooms != null ? `${p.bedrooms} hab.` : "—" },
    { label: "Baños",                  value: (p) => p.bathrooms != null ? `${p.bathrooms} baños` : "—" },
    { label: "Barrio",                 value: (p) => p.zone ?? "—" },
    { label: "Plazas de aparcamiento", value: (p) => p.parking != null ? String(p.parking) : "—" },
  ];

  return (
    <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[24px] pb-[60px] xl:pt-[28px] xl:pb-[80px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-[20px]">

        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Inicio", href: "/" },
          { label: "Comparar propiedades" },
        ]} />

        {/* H1 + descripción */}
        <div className="flex flex-col gap-[12px]">
          <h1 className="font-heading font-normal text-[clamp(28px,2.5vw,36px)] text-[#0c1834] leading-none tracking-[-1.8px]">
            Lista comparada de propiedades
          </h1>
          <p className="font-body text-[14px] text-[#0c1834] leading-[22px] max-w-[700px]">
            <span className="font-semibold">
              Compara lado a lado las propiedades que seleccionaste y visualiza rápidamente las diferencias en precio, tamaño, ubicación y potencial de valorización.
            </span>{" "}
            <span className="font-normal">
              Usa esta vista clara para identificar la mejor oportunidad y tomar una decisión con mayor confianza.
            </span>
          </p>
        </div>

        {/* Main layout: sidebar + cards */}
        <div className="flex gap-[24px] items-start">

          {/* Left sidebar */}
          <aside className="hidden lg:flex flex-col gap-[40px] w-[267px] shrink-0 self-stretch pb-[83px]">

            {/* Tags */}
            <div className="flex flex-col gap-[12px]">
              <p className="font-body font-medium text-[#5a6478] text-[13px] leading-[20px] tracking-[3.2px] uppercase">
                Tags
              </p>
              {TAGS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTag(t.key)}
                  className={`text-left px-[16px] h-[36px] font-body text-[14px] transition-colors border ${
                    activeTag === t.key
                      ? "bg-[#727b8c] text-white border-[#727b8c] font-semibold"
                      : "border-[#e6e6e6] text-[rgba(12,25,53,0.3)] hover:border-[#0c1834] hover:text-[#0c1834]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Características labels — aligned with card data rows via IMG_H */}
            <div className="flex flex-col gap-[16px]">
              <p className="font-body font-medium text-[#5a6478] text-[13px] leading-[20px] tracking-[3.2px] uppercase">
                Características
              </p>
              {rows.map((r) => (
                <p key={r.label} className="font-body font-medium text-[#0c1935] text-[15px] leading-[30px]">
                  {r.label}
                </p>
              ))}
            </div>
          </aside>

          {/* Property cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px]">
            {ranked.map(({ p, rank }) => {
              const badge = BADGE_STYLES[rank];
              const placeholderIdx = p._id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % PLACEHOLDERS.length;
              const imgSrc = p.mainImage
                ? urlFor(p.mainImage).width(700).height(IMG_H).url()
                : PLACEHOLDERS[placeholderIdx];
              const waMsg = `Hola, me interesa esta propiedad: ${p.title} — ${BASE_URL}/propiedades/${p.slug?.current}`;

              return (
                <article
                  key={p._id}
                  style={{ order: rank }}
                  className="bg-white border border-[#dfe5ef] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative shrink-0" style={{ height: IMG_H }}>
                    <Image
                      src={imgSrc}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    {badge && (
                      <div className={`absolute top-[13px] left-[12px] ${badge.bg} px-[8px] py-[3px] backdrop-blur-[2px]`}>
                        <span className="font-body font-semibold text-white text-[14px] leading-[20px] uppercase">
                          {badge.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Data rows */}
                  <div className="flex flex-col gap-[16px] p-[16px]">
                    {rows.map((r) => (
                      <div key={r.label} className="flex flex-col gap-0.5">
                        {/* Show label inline on mobile */}
                        <span className="font-body text-[11px] text-[#5a6478] uppercase tracking-[2px] lg:hidden">
                          {r.label}
                        </span>
                        <span className="font-body font-semibold text-[#0c1834] text-[15px] text-center leading-[30px] tracking-[-0.2px]">
                          {r.value(p)}
                        </span>
                      </div>
                    ))}

                    {/* Action buttons */}
                    <div className="flex gap-[8px] pt-[4px]">
                      <a
                        href={whatsappLink(waMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center bg-[#0d1835] text-white font-body font-medium text-[14px] leading-[14px] px-[16px] py-[9px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] hover:bg-[#162444] transition-colors"
                      >
                        Contáctenos
                      </a>
                      <Link
                        href={`/propiedades/${p.slug?.current}`}
                        className="flex-1 flex items-center justify-center border border-[#dfe5ef] text-[#0c1834] font-body font-medium text-[14px] leading-[14px] px-[14px] py-[8px] hover:bg-gray-50 transition-colors"
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
