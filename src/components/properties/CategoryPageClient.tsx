"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import Link from "next/link";
import PropertyGrid from "@/components/properties/PropertyGrid";
import type { Property } from "@/lib/types";

const PAGE_SIZE = 12;

interface NeighborhoodLink {
  name: string;
  slug: string;
  count: number;
  categorySlug: string;
}

interface Props {
  properties: Property[];
  categorySlug: string;
  neighborhoodLinks: NeighborhoodLink[];
  contextBlock?: React.ReactNode;
  mapSlot?: React.ReactNode;
  seoBlock?: string;
  initialSearch?: string;
  initialBedrooms?: number;
  initialMinPrice?: string;
  initialMaxPrice?: string;
}

interface Filters {
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  bedrooms: number;
  bathrooms: number;
}

type SortOption = "relevancia" | "precio-asc" | "precio-desc" | "area-desc";

const INIT_FILTERS: Filters = {
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  bedrooms: 0,
  bathrooms: 0,
};

const inputBox = "bg-[#f9f9f9] border border-[#e6e6e6] px-[17.5px] py-[9px] w-[126px] font-body text-[16px] text-[#0c1935] tracking-[-0.32px] focus:outline-none focus:border-[#0c1935] placeholder:text-[rgba(12,25,53,0.3)] transition-colors text-center";
const sectionHeadingBorder = "font-body font-medium text-[16px] text-[#0c1935] pb-[10px] border-b border-[#e9e7e2] w-full";
const sectionHeading = "font-body font-medium text-[16px] text-[#0c1935] w-full";

function DualRangeSlider({
  min, max, valueMin, valueMax, onChange, format,
}: {
  min: number; max: number; valueMin: number; valueMax: number;
  onChange: (min: number, max: number) => void;
  format: (v: number) => string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"min" | "max" | null>(null);
  const leftPct = ((valueMin - min) / (max - min)) * 100;
  const rightPct = ((valueMax - min) / (max - min)) * 100;

  const getPctFromEvent = useCallback((e: PointerEvent) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  }, []);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;
    const pct = getPctFromEvent(e);
    const raw = min + pct * (max - min);
    const step = (max - min) / 100;
    const snapped = Math.round(raw / step) * step;
    if (dragging.current === "min") onChange(Math.min(snapped, valueMax - step), valueMax);
    else onChange(valueMin, Math.max(snapped, valueMin + step));
  }, [min, max, valueMin, valueMax, onChange, getPctFromEvent]);

  const onPointerUp = useCallback(() => {
    dragging.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }, [onPointerMove]);

  function startDrag(handle: "min" | "max") {
    dragging.current = handle;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  return (
    <div className="relative w-full h-5 my-2 mt-8">
      <div className="absolute -top-8 -translate-x-1/2 bg-[#0c1935] text-white font-body text-[12px] px-3 py-1 whitespace-nowrap pointer-events-none" style={{ left: `${rightPct}%` }}>
        {format(valueMax)}
      </div>
      <div ref={trackRef} className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-[#e6e6e6]">
        <div className="absolute top-0 bottom-0 bg-[#0c1935]" style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }} />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[1.5px] border-[#0c1935] shadow-sm cursor-grab active:cursor-grabbing touch-none" style={{ left: `${leftPct}%` }} onPointerDown={(e) => { e.preventDefault(); startDrag("min"); }} />
      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[1.5px] border-[#0c1935] shadow-sm cursor-grab active:cursor-grabbing touch-none" style={{ left: `${rightPct}%` }} onPointerDown={(e) => { e.preventDefault(); startDrag("max"); }} />
    </div>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="bg-[#f9f9f9] border border-[#e6e6e6] flex items-center justify-between px-[17.5px] py-[9px] w-[126px]">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="font-body text-[14px] text-[rgba(12,25,53,0.3)] hover:text-[#0c1935] transition-colors leading-none">-</button>
      <span className="font-body text-[16px] text-[#0c1935] leading-5">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} className="font-body text-[14px] text-[rgba(12,25,53,0.3)] hover:text-[#0c1935] transition-colors leading-none">+</button>
    </div>
  );
}

const PRICE_MIN = 0;
const PRICE_MAX = 2_000_000;
const AREA_MIN = 0;
const AREA_MAX = 1000;

function formatPrice(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${v}`;
}
function formatArea(v: number) { return `${Math.round(v)} m²`; }

function FilterPanel({
  filters, setFilters, onReset, hasActive,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onReset: () => void;
  hasActive: boolean;
}) {
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }
  const priceMin = filters.minPrice !== "" ? Number(filters.minPrice) : PRICE_MIN;
  const priceMax = filters.maxPrice !== "" ? Number(filters.maxPrice) : PRICE_MAX;
  const areaMin = filters.minArea !== "" ? Number(filters.minArea) : AREA_MIN;
  const areaMax = filters.maxArea !== "" ? Number(filters.maxArea) : AREA_MAX;

  return (
    <div className="bg-white border border-[#e9e7e2] p-[21px] flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-[15px] w-full">
        <p className={sectionHeadingBorder}>Gama de precios</p>
        <DualRangeSlider min={PRICE_MIN} max={PRICE_MAX} valueMin={priceMin} valueMax={priceMax} format={formatPrice}
          onChange={(lo, hi) => setFilters((f) => ({ ...f, minPrice: lo === PRICE_MIN ? "" : String(Math.round(lo)), maxPrice: hi === PRICE_MAX ? "" : String(Math.round(hi)) }))}
        />
        <div className="flex gap-[15px]">
          <input type="number" placeholder="$0" value={filters.minPrice} onChange={(e) => set("minPrice", e.target.value)} className={inputBox} />
          <input type="number" placeholder="$2,000,000" value={filters.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} className={inputBox} />
        </div>
      </div>

      <div className="flex flex-col gap-[15px] w-full">
        <p className={sectionHeadingBorder}>Tamaño</p>
        <DualRangeSlider min={AREA_MIN} max={AREA_MAX} valueMin={areaMin} valueMax={areaMax} format={formatArea}
          onChange={(lo, hi) => setFilters((f) => ({ ...f, minArea: lo === AREA_MIN ? "" : String(Math.round(lo)), maxArea: hi === AREA_MAX ? "" : String(Math.round(hi)) }))}
        />
        <div className="flex gap-[15px]">
          <input type="number" placeholder="0 m²" value={filters.minArea} onChange={(e) => set("minArea", e.target.value)} className={inputBox} />
          <input type="number" placeholder="1000 m²" value={filters.maxArea} onChange={(e) => set("maxArea", e.target.value)} className={inputBox} />
        </div>
      </div>

      <div className="flex flex-col gap-[15px] w-full">
        <p className={sectionHeading}>Habitaciones y Baños</p>
        <div className="flex gap-[15px]">
          <Stepper value={filters.bedrooms} onChange={(v) => set("bedrooms", v)} />
          <Stepper value={filters.bathrooms} onChange={(v) => set("bathrooms", v)} />
        </div>
      </div>

      {hasActive && (
        <button type="button" onClick={onReset} className="flex items-center gap-1.5 font-body text-[14px] text-[rgba(12,25,53,0.4)] hover:text-[#0c1935] transition-colors">
          <X size={13} /> Limpiar filtros
        </button>
      )}
    </div>
  );
}

function SeoBlock({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white border border-[#e9e7e2] p-[20px] xl:p-[24px]">
      {/* Desktop: always visible */}
      <p className="hidden xl:block font-body font-light text-[15px] text-[#737b8c] leading-relaxed">{text}</p>
      {/* Mobile: truncated */}
      <div className="xl:hidden">
        <p className={`font-body font-light text-[14px] text-[#737b8c] leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>{text}</p>
        <button onClick={() => setExpanded(!expanded)} className="mt-[8px] flex items-center gap-[4px] font-body font-medium text-[12px] text-[#0c1834] tracking-[1px] uppercase">
          {expanded ? "Leer menos" : "Leer más"}
          <ChevronDown size={12} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );
}

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function CategoryPageClient({
  properties, neighborhoodLinks, contextBlock, seoBlock, initialSearch = "",
  initialBedrooms = 0, initialMinPrice = "", initialMaxPrice = "",
}: Props) {
  const [filters, setFilters] = useState<Filters>({
    ...INIT_FILTERS,
    bedrooms: initialBedrooms,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
  });
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const hasActive =
    search !== "" ||
    filters.minPrice !== "" || filters.maxPrice !== "" ||
    filters.minArea !== "" || filters.maxArea !== "" ||
    filters.bedrooms > 0 || filters.bathrooms > 0;

  function reset() { setFilters(INIT_FILTERS); setSearch(""); setVisible(PAGE_SIZE); }

  useEffect(() => { setVisible(PAGE_SIZE); }, [filters, sort, search]);

  const filtered = useMemo(() => {
    let result = [...properties];

    if (search.trim()) {
      const q = normalize(search.trim());
      result = result.filter((p) =>
        normalize(p.title ?? "").includes(q) ||
        normalize(p.propertyType ?? "").includes(q) ||
        normalize(p.zone ?? "").includes(q) ||
        normalize(p.buildingName ?? "").includes(q)
      );
    }

    if (filters.minPrice) result = result.filter((p) => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter((p) => p.price <= Number(filters.maxPrice));
    if (filters.minArea) result = result.filter((p) => (p.area ?? 0) >= Number(filters.minArea));
    if (filters.maxArea) result = result.filter((p) => (p.area ?? 0) <= Number(filters.maxArea));
    if (filters.bedrooms > 0) result = result.filter((p) => (p.bedrooms ?? 0) >= filters.bedrooms);
    if (filters.bathrooms > 0) result = result.filter((p) => (p.bathrooms ?? 0) >= filters.bathrooms);

    if (sort === "precio-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "precio-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "area-desc") result.sort((a, b) => (b.area ?? 0) - (a.area ?? 0));
    else result.sort((a, b) => { if (a.featured && !b.featured) return -1; if (!a.featured && b.featured) return 1; return 0; });

    return result;
  }, [properties, filters, sort]);

  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - visible;

  return (
    <div className="bg-[#f9f9f9] py-[40px] xl:py-[60px]">
      {contextBlock && (
        <div className="px-[30px] xl:px-[260px] max-w-[1920px] mx-auto mb-6">
          <div className="max-w-[1400px] mx-auto">{contextBlock}</div>
        </div>
      )}

      {/* SEO block */}
      {seoBlock && (
        <div className="px-[30px] xl:px-[260px] mb-[28px]">
          <div className="max-w-[1400px] mx-auto">
            <SeoBlock text={seoBlock} />
          </div>
        </div>
      )}

      {/* Count + sort row */}
      <div className="px-[30px] xl:px-[260px] mb-[20px]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-[16px]">
          <span className="font-body text-[14px] text-[#737b8c]">
            <span className="font-semibold text-[#0c1834]">{filtered.length}</span> propiedades encontradas
            {search && (
              <span className="ml-1">
                para <span className="font-semibold text-[#0c1834]">&quot;{search}&quot;</span>
                <button onClick={() => setSearch("")} className="ml-2 text-[#737b8c] hover:text-[#0c1834] transition-colors" aria-label="Borrar búsqueda">
                  <X size={12} className="inline" />
                </button>
              </span>
            )}
          </span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none bg-white border border-[#dfe5ef] pl-[14px] pr-[36px] py-[8px] font-body text-[13px] text-[#0c1834] focus:outline-none focus:border-[#0c1834] transition-colors cursor-pointer"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="area-desc">Mayor área</option>
            </select>
            <ChevronDown size={12} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#737b8c] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="px-[30px] xl:px-[260px]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[309px_1fr] gap-8 items-start">

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-[100px] flex flex-col gap-[0px]">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onReset={reset}
              hasActive={hasActive}
            />

            {/* Neighborhood nav links — desktop only, Tier 3 internal links */}
            {neighborhoodLinks.length > 0 && (
              <div className="hidden lg:flex flex-col mt-[2px] bg-white border border-[#e9e7e2] border-t-0">
                <p className="font-body font-medium text-[11px] text-[#737b8c] tracking-[4px] uppercase px-[21px] pt-[18px] pb-[10px]">
                  Por barrio
                </p>
                {neighborhoodLinks.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/${n.categorySlug}/${n.slug}/`}
                    className="flex items-center justify-between px-[21px] py-[10px] font-body text-[14px] text-[#0c1834] hover:bg-[#f9f9f9] transition-colors border-t border-[#e9e7e2]"
                  >
                    <span>{n.name}</span>
                    <span className="font-body text-[12px] text-[#737b8c]">{n.count}</span>
                  </Link>
                ))}
              </div>
            )}
          </aside>

          {/* Grid + load more */}
          <div>
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-body text-[18px] text-[#737b8c]">
                  {search
                    ? `No encontramos propiedades para "${search}".`
                    : "No hay propiedades con estos filtros."}
                </p>
                <button onClick={reset} className="mt-4 font-body text-[14px] text-[#0c1834] underline hover:no-underline transition-all">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <PropertyGrid properties={shown} />
                {remaining > 0 && (
                  <div className="flex justify-center pt-[48px]">
                    <button
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      className="inline-flex items-center gap-[8px] border border-[#dfe5ef] hover:border-[#0c1834] px-[32px] py-[14px] font-body font-medium text-[13px] text-[#0c1834] tracking-[1.2px] uppercase transition-colors"
                    >
                      Ver más propiedades
                      <span className="font-normal text-[#737b8c]">({remaining} restantes)</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
