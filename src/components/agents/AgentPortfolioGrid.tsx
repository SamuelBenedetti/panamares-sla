import { ArrowRight } from "lucide-react";
import PropertyGrid from "@/components/properties/PropertyGrid";
import Pagination from "@/components/ui/Pagination";
import type { Property } from "@/lib/types";
import { getCopy, type Locale } from "@/lib/copy";

interface Props {
  properties: Property[];
  waHref: string;
  currentPage: number;
  totalPages: number;
  basePath: string;
  locale?: Locale;
}

export default function AgentPortfolioGrid({
  properties,
  waHref,
  currentPage,
  totalPages,
  basePath,
  locale = "es",
}: Props) {
  const t = getCopy(locale).components.agentDetail;

  if (properties.length === 0 && currentPage === 1) {
    return (
      <div className="border border-[#dfe5ef] bg-white py-[60px] flex flex-col items-center gap-[12px]">
        <p className="font-body text-[15px] text-[#5a6478]">
          {t.noPropertiesEmpty}
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-[8px] font-body font-medium text-[13px] text-[#0c1834] tracking-[1.2px] uppercase border-b border-[#0c1834] pb-[2px] hover:opacity-60 transition-opacity"
        >
          {t.consultarDisponibilidad}
          <ArrowRight size={13} />
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[32px]">
      <PropertyGrid properties={properties} cols={3} gap="tight" />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
        locale={locale}
      />
    </div>
  );
}
