"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import PropertyGrid from "@/components/properties/PropertyGrid";
import type { Property } from "@/lib/types";

const PAGE_SIZE = 6;

export default function AgentPortfolioGrid({ properties, waHref }: { properties: Property[]; waHref: string }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = properties.slice(0, visible);
  const hasMore = visible < properties.length;

  if (properties.length === 0) {
    return (
      <div className="border border-[#dfe5ef] bg-white py-[60px] flex flex-col items-center gap-[12px]">
        <p className="font-body text-[15px] text-[#5a6478]">
          Este asesor no tiene propiedades activas en este momento.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-[8px] font-body font-medium text-[13px] text-[#0c1834] tracking-[1.2px] uppercase border-b border-[#0c1834] pb-[2px] hover:opacity-60 transition-opacity"
        >
          Consultar disponibilidad
          <ArrowRight size={13} />
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[32px]">
      <PropertyGrid properties={shown} cols={3} gap="tight" />
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-[8px] font-body font-medium text-[#5a6478] text-[14px] uppercase tracking-[0.35px] hover:text-[#0c1834] transition-colors"
          >
            Cargar más
            <span className="font-normal">({properties.length - visible} restantes)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
