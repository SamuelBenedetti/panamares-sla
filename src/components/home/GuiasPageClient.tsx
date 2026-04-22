"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Guide } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { Clock, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { value: "all",      label: "Todas" },
  { value: "comprar",  label: "Comprar" },
  { value: "alquilar", label: "Alquilar" },
  { value: "invertir", label: "Invertir" },
  { value: "vivir",    label: "Vivir en Panamá" },
];

export default function GuiasPageClient({ guides }: { guides: Guide[] }) {
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? guides : guides.filter((g) => g.category === active);

  return (
    <div className="flex flex-col gap-[40px]">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-[8px]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActive(cat.value)}
            className={`font-body font-medium text-[12px] tracking-[2px] uppercase px-[16px] py-[8px] border transition-colors ${
              active === cat.value
                ? "bg-[#0c1834] text-white border-[#0c1834]"
                : "bg-white text-[#5a6478] border-[#dfe5ef] hover:border-[#0c1834] hover:text-[#0c1834]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-[80px] text-center">
          <p className="font-body text-[16px] text-[#5a6478]">No hay guías en esta categoría todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[20px]">
          {filtered.map((guide) => {
            const imgUrl = guide.coverImage
              ? urlFor(guide.coverImage).width(600).height(360).url()
              : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=360&fit=crop";

            const catLabel = CATEGORIES.find((c) => c.value === guide.category)?.label ?? "";

            return (
              <Link
                key={guide._id}
                href={`/guias/${guide.slug.current}/`}
                className="group bg-white border border-[rgba(233,231,226,0.5)] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-[200px] sm:h-[220px] overflow-hidden shrink-0">
                  <Image
                    src={imgUrl}
                    alt={guide.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-[10px] p-[16px] xl:p-[20px] flex-1">
                  <div className="flex items-center gap-[12px]">
                    {catLabel && (
                      <span className="font-body font-medium text-[10px] text-[#b8891e] tracking-[3px] uppercase">
                        {catLabel}
                      </span>
                    )}
                    {guide.readTime && (
                      <span className="flex items-center gap-[4px] font-body text-[11px] text-[#5a6478]">
                        <Clock size={11} />
                        {guide.readTime} min
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-normal text-[20px] xl:text-[22px] text-[#0c1834] leading-tight tracking-[-0.5px] line-clamp-2 group-hover:opacity-70 transition-opacity">
                    {guide.title}
                  </h3>

                  {guide.excerpt && (
                    <p className="font-body font-light text-[13px] xl:text-[14px] text-[#5a6478] leading-relaxed line-clamp-2 flex-1">
                      {guide.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-[6px] pt-[4px]">
                    <span className="font-body font-medium text-[12px] text-[#0c1834] tracking-[1px] uppercase">
                      Leer guía
                    </span>
                    <ArrowRight size={12} className="text-[#0c1834]" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
