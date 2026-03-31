import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyGrid from "@/components/properties/PropertyGrid";
import type { Property } from "@/lib/types";

export default function FeaturedProperties({ properties }: { properties: Property[] }) {
  return (
    <section className="bg-[#f9f9f9] py-[130px] px-[30px] xl:px-[260px]">
      <div className="flex flex-col gap-12 max-w-[1400px] mx-auto">

        {/* Header — centered on mobile, space-between on xl */}
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-3">
          <div className="flex flex-col gap-3 items-center xl:items-start text-center xl:text-left">
            <p className="font-body font-medium text-[#737b8c] text-[12px] uppercase tracking-[5px]">
              Selección destacada
            </p>
            <h2 className="font-heading font-normal text-[#0c1834] text-[clamp(50px,4vw,60px)] tracking-[-0.03em] leading-[1.1]">
              Propiedades en Venta
            </h2>
          </div>
          <Link
            href="/propiedades-en-venta/"
            className="hidden xl:flex items-center gap-2 font-body font-medium text-[#737b8c] text-[16px] uppercase tracking-[0.35px] hover:text-[#0c1834] transition-colors shrink-0"
          >
            Ver todas
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Grid — 2 cols on mobile, 3 on xl */}
        {properties.length > 0 ? (
          <PropertyGrid properties={properties} />
        ) : (
          <p className="font-body text-[#737b8c] text-center py-12">
            Pronto agregaremos propiedades destacadas.
          </p>
        )}

        {/* Ver todas link — below grid, centered */}
        <div className="flex justify-center xl:hidden">
          <Link
            href="/propiedades-en-venta/"
            className="inline-flex items-center gap-2 font-body font-semibold text-[#faf8f5] text-[16px] uppercase tracking-[1.4px] bg-[#0c1834] px-8 py-4 hover:bg-[#162444] transition-colors"
          >
            Ver todas
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
