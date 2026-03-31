"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Building2, Home, Layers, Briefcase, ShoppingBag, MapPin } from "lucide-react";

const SHORTCUTS = [
  { label: "Apartamentos", typeKey: "apartamento", href: "/apartamentos-en-venta/", Icon: Building2 },
  { label: "Casas",        typeKey: "casa",         href: "/casas-en-venta/",        Icon: Home },
  { label: "Penthouses",   typeKey: "penthouse",    href: "/penthouses-en-venta/",   Icon: Layers },
  { label: "Oficinas",     typeKey: "oficina",      href: "/oficinas-en-venta/",     Icon: Briefcase },
  { label: "Locales",      typeKey: "local",        href: "/locales-comerciales-en-venta/", Icon: ShoppingBag },
  { label: "Terrenos",     typeKey: "terreno",      href: "/terrenos-en-venta/",     Icon: MapPin },
];

export default function PropertyTypeShortcuts({ counts = {} }: { counts?: Record<string, number> }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-[130px] px-[30px] xl:px-[260px]">
      <div className="flex flex-col gap-12 max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-3 items-center text-center">
          <p className="font-body font-medium text-[#737b8c] text-[12px] uppercase tracking-[5px]">
            Explorar por tipo
          </p>
          <h2 className="font-heading font-normal text-[#0c1834] text-[clamp(50px,4vw,60px)] tracking-[-0.03em] leading-[1.1]">
            ¿Qué tipo de propiedad buscas?
          </h2>
        </div>

        {/* Cards + scroll arrows */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            aria-label="Anterior"
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-white transition-colors"
          >
            <ChevronLeft size={18} className="text-[#0c1834]" />
          </button>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {SHORTCUTS.map((s) => {
              const n = counts[s.typeKey] ?? 0;
              const countLabel = n > 0 ? `${n} prop.` : "—";
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="flex flex-col gap-[10px] items-center px-[21px] py-[31px] border border-[#dfe5ef] hover:border-[#0c1834]/30 hover:shadow-md transition-all shrink-0 w-[220px] group"
                >
                  {/* Icon circle */}
                  <div className="flex items-center justify-center rounded-full bg-[rgba(12,25,53,0.1)] size-[48px] group-hover:bg-[rgba(12,25,53,0.15)] transition-colors">
                    <s.Icon size={22} className="text-[#0c1834]" strokeWidth={1.5} />
                  </div>

                  {/* Label + count */}
                  <div className="flex flex-col gap-[5px] items-center">
                    <span className="font-body font-semibold text-[#0c1834] text-[18px] tracking-[-0.18px] text-center leading-normal">
                      {s.label}
                    </span>
                    <span className="font-body font-medium text-[rgba(12,24,52,0.5)] text-[14px] leading-[16px]">
                      {countLabel}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            aria-label="Siguiente"
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 hidden md:flex bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-white transition-colors"
          >
            <ChevronRight size={18} className="text-[#0c1834]" />
          </button>
        </div>
      </div>
    </section>
  );
}
