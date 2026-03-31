"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";

const PROPERTY_TYPES = [
  { label: "Tipo de propiedad", value: "" },
  { label: "Apartamento", value: "apartamentos" },
  { label: "Casa", value: "casas" },
  { label: "Penthouse", value: "penthouses" },
  { label: "Oficina", value: "oficinas" },
  { label: "Local Comercial", value: "locales-comerciales" },
  { label: "Terreno", value: "terrenos" },
];

const PROPERTY_STATUS = [
  { label: "Estado Propiedad", value: "" },
  { label: "Nueva", value: "nueva" },
  { label: "Usada", value: "usada" },
  { label: "En construcción", value: "en-construccion" },
];

export default function SearchBar() {
  const router = useRouter();
  const [intent, setIntent] = useState<"venta" | "alquiler">("venta");
  const [typeSlug, setTypeSlug] = useState("");
  const [neighborhoodSlug, setNeighborhoodSlug] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!typeSlug) {
      router.push(intent === "venta" ? "/propiedades-en-venta/" : "/propiedades-en-alquiler/");
      return;
    }

    const categorySlug = `${typeSlug}-en-${intent}`;
    const isValid = CATEGORIES.some((c) => c.slug === categorySlug);
    if (!isValid) {
      router.push(intent === "venta" ? "/propiedades-en-venta/" : "/propiedades-en-alquiler/");
      return;
    }

    const params = status ? `?estado=${status}` : "";

    if (neighborhoodSlug) {
      router.push(`/${categorySlug}/${neighborhoodSlug}/${params}`);
    } else {
      router.push(`/${categorySlug}/${params}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[780px]">
      {/* Glass panel */}
      <div className="backdrop-blur-[10px] bg-white/80 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] p-5 flex flex-col gap-[15px]">

        {/* Intent tabs */}
        <div className="flex gap-[10px]">
          {(["venta", "alquiler"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setIntent(t)}
              className={`px-5 py-2 text-sm font-bold uppercase tracking-[0.3px] transition-colors font-body shadow-sm ${
                intent === t
                  ? "bg-[#0c1834] text-[#faf8f5]"
                  : "bg-[rgba(12,25,53,0.1)] text-[rgba(12,24,52,0.4)] font-semibold"
              }`}
            >
              {t === "venta" ? "Comprar" : "Alquilar"}
            </button>
          ))}
        </div>

        {/* Fields — stacked on mobile, inline on sm+ */}
        <div className="flex flex-col sm:flex-row sm:gap-0 gap-[10px] h-auto sm:h-[46px]">
          {/* Property type */}
          <div className="flex-1 relative border border-[#cbcbcb] bg-white flex items-center sm:border-r-0">
            <select
              value={typeSlug}
              onChange={(e) => setTypeSlug(e.target.value)}
              className="appearance-none w-full h-full px-[17px] py-[13px] sm:py-0 text-[#737b8c] bg-transparent focus:outline-none text-base font-body pr-8"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#737b8c] pointer-events-none" />
          </div>

          {/* Neighborhood */}
          <div className="flex-1 relative border border-[#cbcbcb] bg-white flex items-center sm:border-r-0">
            <select
              value={neighborhoodSlug}
              onChange={(e) => setNeighborhoodSlug(e.target.value)}
              className="appearance-none w-full h-full px-[17px] py-[13px] sm:py-0 text-[#737b8c] bg-transparent focus:outline-none text-base font-body pr-8"
            >
              <option value="">Seleccionar barrio</option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n.slug} value={n.slug}>
                  {n.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#737b8c] pointer-events-none" />
          </div>

          {/* Property status */}
          <div className="flex-1 relative border border-[#cbcbcb] bg-white flex items-center sm:border-r-0">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none w-full h-full px-[17px] py-[13px] sm:py-0 text-[#737b8c] bg-transparent focus:outline-none text-base font-body pr-8"
            >
              {PROPERTY_STATUS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#737b8c] pointer-events-none" />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-[13px] sm:py-0 bg-[#0c1834] hover:bg-[#162444] text-[#faf8f5] font-body font-medium text-base transition-colors shrink-0"
          >
            <Search size={18} />
            Buscar
          </button>
        </div>
      </div>
    </form>
  );
}
