"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyMapMulti from "@/components/properties/PropertyMapMulti";
import type { Property } from "@/lib/types";
import { getCopy, type Locale } from "@/lib/copy";
import { localePath } from "@/lib/i18n";

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

interface CategoryLink {
  slug: string;
  label: string;
  count: number;
}

interface Props {
  ventaProps: Property[];
  alquilerProps: Property[];
  allMapMarkers: MapMarker[];
  neighborhoodName: string;
  neighborhoodSlug: string;
  categoryLinks: { venta: CategoryLink[]; alquiler: CategoryLink[] };
  locale?: Locale;
}

export default function NeighborhoodListingsSection({
  ventaProps,
  alquilerProps,
  allMapMarkers,
  neighborhoodName,
  neighborhoodSlug,
  categoryLinks,
  locale = "es",
}: Props) {
  const t = getCopy(locale).components.neighborhoodDetail;
  const defaultTab: "venta" | "alquiler" = ventaProps.length > 0 ? "venta" : "alquiler";
  const [tab, setTab] = useState<"venta" | "alquiler">(defaultTab);

  const activeProps = tab === "venta" ? ventaProps : alquilerProps;
  const featured = activeProps.slice(0, 6);
  const showTabs = ventaProps.length > 0 && alquilerProps.length > 0;

  const activeSlugs = new Set(activeProps.map((p) => p.slug.current));
  const activeMapMarkers = allMapMarkers.filter((m) => activeSlugs.has(m.slug));

  const activeCategories = tab === "venta" ? categoryLinks.venta : categoryLinks.alquiler;

  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <div className="flex flex-col gap-[40px]">
        <div className="flex flex-col gap-[12px]">
          <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
            {t.listingsEyebrow}
          </p>
          <h2 className="font-heading font-normal text-[clamp(36px,4.5vw,60px)] 2xl:text-[52px] text-[#0c1834] tracking-[-1.8px] leading-none">
            {tab === "venta" ? t.listingsHeadingVenta : t.listingsHeadingAlquiler}
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
              {t.tabComprar}
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
              {t.tabAlquilar}
              <span className="font-bold text-[13px]">{alquilerProps.length}</span>
            </button>
          </div>
        )}
      </div>

      {/* Ver por tipo */}
      {activeCategories.length > 0 && (
        <div className="flex flex-col gap-[24px]">
          <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
            {t.verPorTipoEnTpl(neighborhoodName)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[10px]">
            {activeCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={localePath(`/${cat.slug}/${neighborhoodSlug}/`, locale)}
                className="group flex items-center justify-between border border-[#dfe5ef] px-[20px] py-[16px] hover:border-[#0c1834] transition-colors"
              >
                <div className="flex flex-col gap-[2px]">
                  <span className="font-heading font-normal text-[28px] text-[#0c1834] leading-none tracking-[-1px]">
                    {cat.count}
                  </span>
                  <span className="font-body text-[13px] text-[#737b8c] leading-snug">
                    {cat.label}
                  </span>
                </div>
                <ArrowRight size={16} className="text-[#0c1834] opacity-30 group-hover:opacity-100 transition-opacity shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Map — mobile/tablet: above cards, desktop: side by side */}
      {activeMapMarkers.length > 0 && (
        <div className="xl:hidden">
          <PropertyMapMulti properties={activeMapMarkers} height="h-[280px] sm:h-[360px]" />
        </div>
      )}

      {/* Cards + Map */}
      <div className={activeMapMarkers.length > 0 ? "xl:grid xl:grid-cols-2 xl:gap-[48px] flex flex-col gap-[32px] items-start" : "flex gap-[48px] items-start"}>
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${activeMapMarkers.length === 0 ? "flex-1 xl:grid-cols-4" : ""}`}>
          {featured.map((p, i) => (
            <PropertyCard key={p._id} property={p} priority={i === 0} locale={locale} />
          ))}
        </div>

        {activeMapMarkers.length > 0 && (
          <div className="hidden xl:block sticky top-[110px]">
            <PropertyMapMulti properties={activeMapMarkers} height="h-[590px]" />
          </div>
        )}
      </div>
    </div>
  );
}
