"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

type Intent = "venta" | "alquiler";

export default function SearchBar() {
  const router = useRouter();
  const [intent, setIntent] = useState<Intent>("venta");
  const [propertyType, setPropertyType] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");

  // Property types available for the selected intent (derived from CATEGORIES).
  const typeOptions = useMemo(() => {
    const seen = new Map<string, { slug: string; label: string }>();
    for (const cat of CATEGORIES) {
      if (cat.businessType !== intent) continue;
      const label = cat.h1.replace(/ en (Venta|Alquiler) en Panama$/, "");
      const base = cat.slug.replace(/-en-(venta|alquiler)$/, "");
      if (!seen.has(base)) seen.set(base, { slug: base, label });
    }
    return Array.from(seen.values());
  }, [intent]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Brief: routes to correct Tier 2 or Tier 3 URL — NEVER a filtered URL with query params.
    let url: string;
    if (propertyType) {
      const categorySlug = `${propertyType}-en-${intent}`;
      url = neighborhood ? `/${categorySlug}/${neighborhood}/` : `/${categorySlug}/`;
    } else {
      // No type selected → fall back to the intent pillar (Tier 1).
      url = `/propiedades-en-${intent}/`;
    }
    router.push(url);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[900px] flex flex-col gap-[12px]">
      {/* Intent toggle */}
      <div role="tablist" aria-label="Tipo de operación" className="inline-flex self-center sm:self-start border border-white/30 bg-white/10 backdrop-blur-md">
        {(["venta", "alquiler"] as const).map((i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={intent === i}
            onClick={() => setIntent(i)}
            className={`px-[24px] py-[10px] font-body font-medium text-[12px] tracking-[1.4px] uppercase transition-colors ${
              intent === i
                ? "bg-white text-[#0c1834]"
                : "text-white hover:bg-white/10"
            }`}
          >
            {i === "venta" ? "Comprar" : "Alquilar"}
          </button>
        ))}
      </div>

      {/* Dropdowns + submit */}
      <div className="flex flex-col sm:flex-row items-stretch border border-white h-auto sm:h-[60px] w-full backdrop-blur-md bg-white/10">
        {/* Property type */}
        <label className="relative flex-1 flex items-center border-b sm:border-b-0 sm:border-r border-white/30">
          <span className="sr-only">Tipo de propiedad</span>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="appearance-none w-full h-[56px] sm:h-full bg-transparent pl-[21px] pr-[40px] text-white focus:outline-none font-body text-base cursor-pointer"
          >
            <option value="" className="text-[#0c1834]">Tipo de propiedad</option>
            {typeOptions.map((t) => (
              <option key={t.slug} value={t.slug} className="text-[#0c1834]">
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-[14px] top-1/2 -translate-y-1/2 text-white pointer-events-none" />
        </label>

        {/* Neighborhood */}
        <label className="relative flex-1 flex items-center">
          <span className="sr-only">Barrio</span>
          <select
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className="appearance-none w-full h-[56px] sm:h-full bg-transparent pl-[21px] pr-[40px] text-white focus:outline-none font-body text-base cursor-pointer"
          >
            <option value="" className="text-[#0c1834]">Todos los barrios</option>
            {NEIGHBORHOODS.filter((n) => n.slug !== "panama").map((n) => (
              <option key={n.slug} value={n.slug} className="text-[#0c1834]">
                {n.name}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-[14px] top-1/2 -translate-y-1/2 text-white pointer-events-none" />
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center gap-[10px] h-[56px] sm:h-full sm:w-[60px] bg-white sm:bg-transparent hover:bg-white/10 transition-colors border-t sm:border-t-0 sm:border-l border-white/30"
          aria-label="Buscar"
        >
          <span className="sm:hidden font-body font-medium text-[13px] tracking-[1.4px] uppercase text-[#0c1834]">
            Buscar
          </span>
          <Search size={20} className="text-[#0c1834] sm:text-white" />
        </button>
      </div>
    </form>
  );
}
