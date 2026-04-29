"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyMapMulti from "@/components/properties/PropertyMapMulti";
import type { Property } from "@/lib/types";

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  slug: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  imageUrl?: string;
}

interface Props {
  ventaProps: Property[];
  alquilerProps: Property[];
  allMapMarkers: MapMarker[];
  neighborhoodName: string;
  neighborhoodSlug: string;
}

export default function NeighborhoodListingsSection({
  ventaProps,
  alquilerProps,
  allMapMarkers,
  neighborhoodName,
  neighborhoodSlug,
}: Props) {
  const defaultTab: "venta" | "alquiler" = ventaProps.length > 0 ? "venta" : "alquiler";
  const [tab, setTab] = useState<"venta" | "alquiler">(defaultTab);

  const activeProps = tab === "venta" ? ventaProps : alquilerProps;
  const featured = activeProps.slice(0, 6);
  const showTabs = ventaProps.length > 0 && alquilerProps.length > 0;

  const activeSlugs = new Set(activeProps.map((p) => p.slug.current));
  const activeMapMarkers = allMapMarkers.filter((m) => activeSlugs.has(m.slug));

  const viewAllHref =
    tab === "venta"
      ? `/propiedades-en-venta/${neighborhoodSlug}/`
      : `/propiedades-en-alquiler/${neighborhoodSlug}/`;

  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <div className="flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[12px]">
          <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
            Selección destacada
          </p>
          <h2 className="font-heading font-normal text-[clamp(36px,4.5vw,60px)] 2xl:text-[52px] text-[#0c1834] tracking-[-1.8px] leading-none">
            {tab === "venta" ? "Propiedades en Venta" : "Propiedades en Alquiler"}
          </h2>
        </div>

        {showTabs && (
          <div className="flex items-center gap-[10px]">
            <button
              onClick={() => setTab("venta")}
              className={`flex items-center gap-[10px] px-[20px] py-[8px] font-body font-semibold text-[15px] transition-colors ${
                tab === "venta"
                  ? "bg-[#0c1834] text-white"
                  : "border border-[rgba(12,25,53,0.15)] text-[rgba(12,24,52,0.45)] hover:border-[rgba(12,25,53,0.35)]"
              }`}
            >
              Comprar
              <span className="font-bold text-[13px]">{ventaProps.length}</span>
            </button>
            <button
              onClick={() => setTab("alquiler")}
              className={`flex items-center gap-[10px] px-[20px] py-[8px] font-body font-semibold text-[15px] transition-colors ${
                tab === "alquiler"
                  ? "bg-[#0c1834] text-white"
                  : "border border-[rgba(12,25,53,0.15)] text-[rgba(12,24,52,0.45)] hover:border-[rgba(12,25,53,0.35)]"
              }`}
            >
              Alquilar
              <span className="font-bold text-[13px]">{alquilerProps.length}</span>
            </button>
          </div>
        )}
      </div>

      {/* Cards + Map */}
      <div className="flex gap-[48px] items-start">
        <div className={`flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 ${activeMapMarkers.length === 0 ? "xl:grid-cols-4" : ""}`}>
          {featured.map((p, i) => (
            <PropertyCard key={p._id} property={p} priority={i === 0} />
          ))}
        </div>

        {activeMapMarkers.length > 0 && (
          <div className="hidden xl:block shrink-0 w-[480px] sticky top-[110px]">
            <PropertyMapMulti properties={activeMapMarkers} height="h-[590px]" />
          </div>
        )}
      </div>

      {/* Ver todas */}
      <div className="flex justify-center pt-[52px]">
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-[10px] border border-[#dfe5ef] text-[#0c1834] font-body font-medium text-[18px] px-[24px] py-[14px] hover:bg-gray-50 transition-colors"
        >
          Ver todas las propiedades en {neighborhoodName}
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
