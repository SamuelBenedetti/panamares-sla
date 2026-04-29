import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyGrid from "@/components/properties/PropertyGrid";
import type { Property } from "@/lib/types";

export default function FeaturedProperties({ properties }: { properties: Property[] }) {
  return (
    <section className="bg-[#f9f9f9] py-[80px] px-[30px] xl:px-[60px] 2xl:px-[160px]">
      <div className="flex flex-col gap-8 max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-2 items-start text-left">
          <p className="font-body font-medium text-[#5a6478] text-[12px] md:text-[11px] uppercase tracking-[5px]">
            Selección destacada
          </p>
          <h2 className="font-heading font-normal text-[#0c1834] text-[clamp(28px,2.5vw,36px)] 2xl:text-[34px] tracking-[-0.03em] leading-[1.1]">
            Propiedades en Venta
          </h2>
        </div>

        {/* Grid */}
        {properties.length > 0 ? (
          <PropertyGrid properties={properties} cols={4} gap="tight" />
        ) : (
          <p className="font-body text-[#5a6478] text-center py-12">
            Pronto agregaremos propiedades destacadas.
          </p>
        )}

        {/* Ver más propiedades — centered */}
        <div className="flex justify-center pt-2">
          <Link
            href="/propiedades-en-venta/"
            className="inline-flex items-center gap-2 font-body font-medium text-[#5a6478] text-[16px] md:text-[14px] uppercase tracking-[0.35px] hover:text-[#0c1834] transition-colors"
          >
            Ver más propiedades
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
