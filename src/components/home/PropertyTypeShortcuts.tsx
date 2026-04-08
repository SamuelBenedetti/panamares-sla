"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-[130px] px-[30px] xl:px-[20px] 2xl:px-[120px]">
      <div className="flex flex-col gap-12 max-w-[1600px] mx-auto">

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
          {/* Left arrow — only when can scroll */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              aria-label="Anterior"
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 flex bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-white transition-colors"
            >
              <ChevronLeft size={18} className="text-[#0c1834]" />
            </button>
          )}

          {/* Scrollable row — wraps on xl, scrolls on smaller */}
          <div
            ref={scrollRef}
            className="flex gap-2 xl:gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-1 xl:grid xl:grid-cols-6"
            style={{ scrollbarWidth: "none" }}
          >
            {SHORTCUTS.map((s) => {
              const n = counts[s.typeKey] ?? 0;
              const countLabel = n > 0 ? `${n} prop.` : "—";
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="flex flex-col gap-[10px] items-center px-[21px] py-[31px] border border-[#dfe5ef] hover:border-[#0c1834]/30 hover:shadow-md transition-all shrink-0 w-[190px] xl:w-auto group"
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

          {/* Right arrow — only when can scroll */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              aria-label="Siguiente"
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 flex bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-white transition-colors"
            >
              <ChevronRight size={18} className="text-[#0c1834]" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
