import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyGrid from "@/components/properties/PropertyGrid";
import type { Property } from "@/lib/types";
import { getCopy, type Locale } from "@/lib/copy";
import { localePath } from "@/lib/i18n";

export default function FeaturedProperties({
  properties,
  locale = "es",
}: {
  properties: Property[];
  locale?: Locale;
}) {
  const t = getCopy(locale).pages.home.featured;

  return (
    <section className="bg-[#f9f9f9] py-[80px] px-[30px] xl:px-[60px] 2xl:px-[160px]">
      <div className="flex flex-col gap-8 max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-2 items-start text-left">
          <p className="font-body font-medium text-[#5a6478] text-[12px] md:text-[11px] uppercase tracking-[5px]">
            {t.eyebrow}
          </p>
          <h2 className="font-heading font-normal text-[#0c1834] text-[clamp(34px,2.5vw,38px)] 2xl:text-[38px] tracking-[-0.03em] leading-[1.1]">
            {t.heading}
          </h2>
        </div>

        {/* Grid */}
        {properties.length > 0 ? (
          <PropertyGrid properties={properties} cols={4} gap="tight" locale={locale} />
        ) : (
          <p className="font-body text-[#5a6478] text-center py-12">
            {t.emptyState}
          </p>
        )}

        {/* Ver más propiedades — centered */}
        <div className="flex justify-center pt-[52px]">
          <Link
            href={localePath("/propiedades-en-venta/", locale)}
            className="inline-flex items-center gap-[10px] border border-[#dfe5ef] text-[#0c1834] font-body font-medium text-[18px] px-[24px] py-[14px] hover:bg-gray-50 transition-colors"
          >
            {t.verMas}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
