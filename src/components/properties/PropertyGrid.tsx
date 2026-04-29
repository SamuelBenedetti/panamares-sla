import type { Property } from "@/lib/types";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ properties, cols = 3, gap = "loose" }: { properties: Property[]; cols?: 2 | 3 | 4; gap?: "loose" | "tight" }) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20 text-brand-slate">
        <p className="text-lg">No se encontraron propiedades con estos filtros.</p>
      </div>
    );
  }

  const colClass =
    cols === 2 ? "xl:grid-cols-2" :
    cols === 4 ? "lg:grid-cols-4" :
    "xl:grid-cols-[31%,31%,31%]";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${colClass} ${gap === "tight" ? "gap-4" : "gap-3 md:gap-9"}`}>
      {properties.map((p, index) => (
        <PropertyCard key={p._id} property={p} priority={index === 0} />
      ))}
    </div>
  );
}
