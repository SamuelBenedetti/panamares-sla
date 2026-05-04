import type { Property } from "@/lib/types";
import PropertyCard from "./PropertyCard";
import type { Locale } from "@/lib/copy";

export default function PropertyGrid({
  properties,
  cols = 3,
  gap = "loose",
  pageSize,
  locale = "es",
}: {
  properties: Property[];
  cols?: 2 | 3 | 4;
  gap?: "loose" | "tight";
  pageSize?: number;
  locale?: Locale;
}) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20 text-brand-slate">
        <p className="text-lg">
          {locale === "es"
            ? "No se encontraron propiedades con estos filtros."
            : "No properties found with these filters."}
        </p>
      </div>
    );
  }

  const colClass =
    cols === 2 ? "xl:grid-cols-2" :
    cols === 4 ? "lg:grid-cols-4" :
    "xl:grid-cols-3";

  const placeholders = pageSize ? Math.max(0, pageSize - properties.length) : 0;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${colClass} ${gap === "tight" ? "gap-4" : "gap-4 md:gap-6"}`}>
      {properties.map((p, index) => (
        <PropertyCard key={p._id} property={p} priority={index === 0} locale={locale} />
      ))}
      {Array.from({ length: placeholders }).map((_, i) => (
        <div key={`ph-${i}`} aria-hidden="true" />
      ))}
    </div>
  );
}
