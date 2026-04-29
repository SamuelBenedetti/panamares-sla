"use client";

import { useState, useMemo, useRef, useCallback, useEffect, useTransition } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import PropertyGrid from "@/components/properties/PropertyGrid";
import PaginationClient from "@/components/ui/PaginationClient";
import type { MapProperty } from "@/components/properties/PropertyMapMulti";
import type { Property } from "@/lib/types";

const PropertyMapMulti = dynamic(() => import("@/components/properties/PropertyMapMulti"), { ssr: false });

const PAGE_SIZE = 12;

interface NeighborhoodLink {
  name: string;
  slug: string;
  count: number;
  categorySlug: string;
}

const CATEGORIA_TYPES: Record<string, string[]> = {
  residencial: ["apartamento", "casa", "penthouse", "casa de playa"],
  comercial:   ["oficina", "local"],
  otro:        ["terreno"],
};

interface Props {
  properties: Property[];
  categorySlug: string;
  neighborhoodLinks: NeighborhoodLink[];
  neighborhoodSlug?: string;
  contextBlock?: React.ReactNode;
  mapProps?: MapProperty[];
  seoBlock?: string;
  initialSearch?: string;
  initialBedrooms?: number;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialCategoria?: string;
}

interface Filters {
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  neighborhoodFilter: string;
  categoria: string;
}

type SortOption = "relevancia" | "precio-asc" | "precio-desc" | "area-desc" | "recientes";

const INIT_FILTERS: Filters = {
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  bedrooms: 0,
  bathrooms: 0,
  propertyType: "",
  neighborhoodFilter: "",
  categoria: "",
};

const PRICE_MIN = 0;
const PRICE_MAX_VENTA   = 2_000_000;
const PRICE_MAX_ALQUILER = 10_000;
const AREA_MIN = 0;
const AREA_MAX = 1000;


// ── Dual Range Slider ──────────────────────────────────────────────────────────
function DualRangeSlider({ min, max, valueMin, valueMax, onChange, onActiveHandle }: {
  min: number; max: number; valueMin: number; valueMax: number;
  onChange: (min: number, max: number) => void;
  onActiveHandle?: (handle: "min" | "max" | null) => void;
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
    onActiveHandle?.(handle);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  return (
    <div className="relative w-full h-5 my-2">
      {/* Track */}
      <div ref={trackRef} className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[2px] bg-[#e6e6e6]">
        <div
          className="absolute top-0 bottom-0 bg-[#0c1935]"
          style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
        />
      </div>
      {/* Min handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[1.5px] border-[#0c1935] shadow-sm cursor-grab active:cursor-grabbing touch-none"
        style={{ left: `${leftPct}%` }}
        onPointerDown={(e) => { e.preventDefault(); startDrag("min"); }}
      />
      {/* Max handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-[1.5px] border-[#0c1935] shadow-sm cursor-grab active:cursor-grabbing touch-none"
        style={{ left: `${rightPct}%` }}
        onPointerDown={(e) => { e.preventDefault(); startDrag("max"); }}
      />
    </div>
  );
}

// ── Stepper ────────────────────────────────────────────────────────────────────
const STEPPER_MAX = 4;

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const display = value === 0 ? "Todos" : value >= STEPPER_MAX ? "4+" : `${value}`;
  return (
    <div className="flex flex-col gap-[8px] flex-1">
      <p className="font-body text-[13px] text-[#5a6478]">{label}</p>
      <div className="bg-[#f9f9f9] border border-[#e6e6e6] flex items-center justify-between px-[10px] py-[9px] w-full">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="font-body text-[14px] text-[rgba(12,25,53,0.3)] hover:text-[#0c1935] transition-colors leading-none">-</button>
        <span className="font-body text-[13px] text-[#0c1935] leading-5">{display}</span>
        <button type="button" onClick={() => onChange(Math.min(STEPPER_MAX, value + 1))} className="font-body text-[14px] text-[rgba(12,25,53,0.3)] hover:text-[#0c1935] transition-colors leading-none">+</button>
      </div>
    </div>
  );
}



function FilterPanel({
  filters, setFilters, onReset, hasActive, businessType, propertyTypes, neighborhoodSlug, neighborhoodLinks,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onReset: () => void;
  hasActive: boolean;
  businessType: "venta" | "alquiler";
  propertyTypes: string[];
  neighborhoodSlug?: string;
  neighborhoodLinks?: NeighborhoodLink[];
}) {
  const [showMore, setShowMore] = useState(false);
  const [priceActive, setPriceActive] = useState<"min" | "max" | null>(null);
  const [areaActive, setAreaActive] = useState<"min" | "max" | null>(null);

  const PRICE_MAX = businessType === "alquiler" ? PRICE_MAX_ALQUILER : PRICE_MAX_VENTA;

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  const priceMin = filters.minPrice !== "" ? Number(filters.minPrice) : PRICE_MIN;
  const priceMax = filters.maxPrice !== "" ? Number(filters.maxPrice) : PRICE_MAX;
  const areaMin = filters.minArea !== "" ? Number(filters.minArea) : AREA_MIN;
  const areaMax = filters.maxArea !== "" ? Number(filters.maxArea) : AREA_MAX;

  const inputBox = "border px-[10px] py-[9px] flex-1 min-w-0 font-body text-[14px] text-[#0c1935] tracking-[-0.32px] focus:outline-none focus:border-[#0c1935] placeholder:text-[rgba(12,25,53,0.3)] transition-colors text-center";
  const inputDefault = "bg-[#f9f9f9] border-[#e6e6e6]";
  const inputHighlight = "bg-[#0c1834] border-[#0c1834] text-white placeholder:text-white/50";

  return (
    <div className="bg-white border border-[#dfe5ef] p-[21px] flex flex-col gap-[20px] w-full">

      {/* ── 1. Tipo de investigación ── */}
      <div className="flex flex-col gap-[15px] w-full">
        <p className="font-body font-medium text-[16px] text-[#0c1935] leading-[20px]">
          Tipo de investigación
        </p>
        <div className="flex gap-[10px] w-full">
          <Link
            href={neighborhoodSlug ? `/propiedades-en-venta/${neighborhoodSlug}/` : "/propiedades-en-venta/"}
            className={`flex flex-1 items-center justify-center px-[20px] py-[8px] font-body font-semibold text-[16px] transition-colors shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ${
              businessType === "venta"
                ? "bg-[#0c1834] text-white"
                : "bg-[rgba(12,25,53,0.1)] text-[rgba(12,24,52,0.4)] hover:bg-[rgba(12,25,53,0.15)]"
            }`}
          >
            Comprar
          </Link>
          <Link
            href={neighborhoodSlug ? `/propiedades-en-alquiler/${neighborhoodSlug}/` : "/propiedades-en-alquiler/"}
            className={`flex flex-1 items-center justify-center px-[20px] py-[8px] font-body font-semibold text-[16px] transition-colors shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ${
              businessType === "alquiler"
                ? "bg-[#0c1834] text-white"
                : "bg-[rgba(12,25,53,0.1)] text-[rgba(12,24,52,0.4)] hover:bg-[rgba(12,25,53,0.15)]"
            }`}
          >
            Alquilar
          </Link>
        </div>
      </div>

      {/* ── 2. Gama de precios ── */}
      <div className="flex flex-col gap-[15px] w-full">
        <p className="font-body font-medium text-[16px] text-[#0c1935] leading-[20px]">
          Gama de precios
        </p>
        <DualRangeSlider
          min={PRICE_MIN} max={PRICE_MAX}
          valueMin={priceMin} valueMax={priceMax}
          onActiveHandle={setPriceActive}
          onChange={(lo, hi) => setFilters((f) => ({
            ...f,
            minPrice: lo === PRICE_MIN ? "" : String(Math.round(lo)),
            maxPrice: hi === PRICE_MAX ? "" : String(Math.round(hi)),
          }))}
        />
        <div className="flex gap-[15px]">
          <input
            type="text"
            inputMode="numeric"
            placeholder="$0"
            value={filters.minPrice ? `$${Number(filters.minPrice).toLocaleString("en-US")}` : ""}
            onChange={(e) => set("minPrice", e.target.value.replace(/[^0-9]/g, ""))}
            className={`${inputBox} ${priceActive === "min" ? inputHighlight : inputDefault}`}
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder={businessType === "alquiler" ? "$10,000" : "$2,000,000"}
            value={filters.maxPrice ? `$${Number(filters.maxPrice).toLocaleString("en-US")}` : ""}
            onChange={(e) => set("maxPrice", e.target.value.replace(/[^0-9]/g, ""))}
            className={`${inputBox} ${priceActive === "max" ? inputHighlight : inputDefault}`}
          />
        </div>
      </div>

      {/* ── 3. Tamaño ── */}
      <div className="flex flex-col gap-[15px] w-full">
        <p className="font-body font-medium text-[16px] text-[#0c1935] leading-[20px]">
          Tamaño
        </p>
        <DualRangeSlider
          min={AREA_MIN} max={AREA_MAX}
          valueMin={areaMin} valueMax={areaMax}
          onActiveHandle={setAreaActive}
          onChange={(lo, hi) => setFilters((f) => ({
            ...f,
            minArea: lo === AREA_MIN ? "" : String(Math.round(lo)),
            maxArea: hi === AREA_MAX ? "" : String(Math.round(hi)),
          }))}
        />
        <div className="flex gap-[15px]">
          <input
            type="text"
            inputMode="numeric"
            placeholder="0 m²"
            value={filters.minArea ? `${Number(filters.minArea).toLocaleString("en-US")} m²` : ""}
            onChange={(e) => set("minArea", e.target.value.replace(/[^0-9]/g, ""))}
            className={`${inputBox} ${areaActive === "min" ? inputHighlight : inputDefault}`}
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="1,000 m²"
            value={filters.maxArea ? `${Number(filters.maxArea).toLocaleString("en-US")} m²` : ""}
            onChange={(e) => set("maxArea", e.target.value.replace(/[^0-9]/g, ""))}
            className={`${inputBox} ${areaActive === "max" ? inputHighlight : inputDefault}`}
          />
        </div>
      </div>

      {/* ── 4. Tipo de propiedad ── */}
      <div className="flex flex-col gap-[15px] w-full">
        <p className="font-body font-medium text-[16px] text-[#0c1935] leading-[20px]">
          Tipo de propiedad
        </p>
        <div className="relative">
          <select
            value={filters.propertyType}
            onChange={(e) => set("propertyType", e.target.value)}
            className="appearance-none bg-[#f9f9f9] border border-[#e6e6e6] h-[40px] w-full pl-[17.5px] pr-[40px] font-body text-[14px] text-[#0c1935] focus:outline-none focus:border-[#0c1935] transition-colors cursor-pointer"
            style={{ color: filters.propertyType === "" ? "rgba(12,25,53,0.3)" : "#0c1935" }}
          >
            <option value="">Todos los tipos</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t} style={{ color: "#0c1935" }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown size={10} className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#5a6478] pointer-events-none" />
        </div>
      </div>

      {/* ── 5. Barrio (solo Tier 2) ── */}
      {!neighborhoodSlug && neighborhoodLinks && neighborhoodLinks.length > 0 && (
        <div className="flex flex-col gap-[15px] w-full">
          <p className="font-body font-medium text-[16px] text-[#0c1935] leading-[20px]">
            Barrio
          </p>
          <div className="relative">
            <select
              value={filters.neighborhoodFilter}
              onChange={(e) => set("neighborhoodFilter", e.target.value)}
              className="appearance-none bg-[#f9f9f9] border border-[#e6e6e6] h-[40px] w-full pl-[17.5px] pr-[40px] font-body text-[14px] text-[#0c1935] focus:outline-none focus:border-[#0c1935] transition-colors cursor-pointer"
              style={{ color: filters.neighborhoodFilter === "" ? "rgba(12,25,53,0.3)" : "#0c1935" }}
            >
              <option value="">Todos los barrios</option>
              {neighborhoodLinks.map((n) => (
                <option key={n.slug} value={n.name} style={{ color: "#0c1935" }}>
                  {n.name} ({n.count})
                </option>
              ))}
            </select>
            <ChevronDown size={10} className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#5a6478] pointer-events-none" />
          </div>
        </div>
      )}

      {/* ── 6. Ver más — Habitaciones + Baños ── */}
      <div className="flex flex-col gap-[15px] w-full">
        {showMore && (
          <div className="flex gap-[15px]">
            <Stepper label="Habitaciones" value={filters.bedrooms} onChange={(v) => set("bedrooms", v)} />
            <Stepper label="Baños" value={filters.bathrooms} onChange={(v) => set("bathrooms", v)} />
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="flex items-center justify-center gap-[8px] w-full h-[40px] border border-[#e6e6e6] font-body text-[14px] text-[#0c1935] hover:border-[#0c1935] transition-colors"
        >
          <ChevronDown size={14} className={`transition-transform duration-200 ${showMore ? "rotate-180" : ""}`} />
          {showMore ? "Cerrar" : "Ver más"}
        </button>
      </div>

      {/* ── 7. Limpiar (solo si hay filtros activos) ── */}
      {hasActive && (
        <button type="button" onClick={onReset} className="flex items-center gap-1.5 font-body text-[14px] text-[rgba(12,25,53,0.4)] hover:text-[#0c1935] transition-colors">
          <X size={13} /> Limpiar filtros
        </button>
      )}

    </div>
  );
}

// ── Normalize helper ───────────────────────────────────────────────────────────
function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function CategoryPageClient({
  properties, categorySlug, neighborhoodLinks, neighborhoodSlug, contextBlock, mapProps,
  initialSearch = "", initialBedrooms = 0, initialMinPrice = "", initialMaxPrice = "", initialCategoria = "",
}: Props) {
  const businessType: "venta" | "alquiler" = categorySlug.includes("alquiler") ? "alquiler" : "venta";

  const propertyTypes = useMemo(() => {
    const types = new Set<string>();
    for (const p of properties) if (p.propertyType) types.add(p.propertyType);
    return Array.from(types).sort();
  }, [properties]);

  const [, startTransition] = useTransition();
  const [filters, setFilters] = useState<Filters>({
    ...INIT_FILTERS,
    bedrooms: initialBedrooms,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    categoria: initialCategoria,
  });

  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const hasActive =
    search !== "" ||
    filters.minPrice !== "" || filters.maxPrice !== "" ||
    filters.minArea !== "" || filters.maxArea !== "" ||
    filters.bedrooms > 0 || filters.bathrooms > 0 ||
    filters.propertyType !== "" || filters.neighborhoodFilter !== "" ||
    filters.categoria !== "";

  function reset() {
    startTransition(() => { setFilters(INIT_FILTERS); setSearch(""); setCurrentPage(1); });
  }

  useEffect(() => { startTransition(() => setCurrentPage(1)); }, [filters, sort, search]);

const filtered = useMemo(() => {
    let result = [...properties];

    if (search.trim()) {
      const q = normalize(search.trim());
      result = result.filter((p) =>
        normalize(p.title ?? "").includes(q) ||
        normalize(p.propertyType ?? "").includes(q) ||
        normalize(p.zone ?? "").includes(q)
      );
    }

    if (filters.categoria && CATEGORIA_TYPES[filters.categoria] && !filters.propertyType) {
      const allowed = CATEGORIA_TYPES[filters.categoria];
      result = result.filter((p) => allowed.includes(p.propertyType ?? ""));
    }
    if (filters.propertyType) result = result.filter((p) => p.propertyType === filters.propertyType);
    if (filters.minPrice) result = result.filter((p) => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter((p) => p.price <= Number(filters.maxPrice));
    if (filters.minArea) result = result.filter((p) => (p.area ?? 0) >= Number(filters.minArea));
    if (filters.maxArea) result = result.filter((p) => (p.area ?? 0) <= Number(filters.maxArea));
    if (filters.bedrooms > 0) result = result.filter((p) => (p.bedrooms ?? 0) >= filters.bedrooms);
    if (filters.bathrooms > 0) result = result.filter((p) => (p.bathrooms ?? 0) >= filters.bathrooms);
    if (filters.neighborhoodFilter) result = result.filter((p) => normalize(p.zone ?? "") === normalize(filters.neighborhoodFilter));

    if (sort === "precio-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "precio-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "area-desc") result.sort((a, b) => (b.area ?? 0) - (a.area ?? 0));
    else if (sort === "recientes") result.sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());
    else result.sort((a, b) => { if (a.featured && !b.featured) return -1; if (!a.featured && b.featured) return 1; return 0; });

    return result;
  }, [properties, filters, sort, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const shown = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="bg-[#f9f9f9] pt-[24px] pb-[60px] xl:pt-[28px] xl:pb-[80px]">
      {contextBlock && (
        <div className="px-[30px] xl:px-[60px] 2xl:px-[160px] max-w-[1440px] mx-auto mb-6">
          <div className="max-w-[1440px] mx-auto">{contextBlock}</div>
        </div>
      )}

      {/* Sort row */}
      <div className="px-[30px] xl:px-[60px] 2xl:px-[160px] mb-[20px]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-[12px]">

          {/* Left: mobile filter trigger + count tag + search context */}
          <div className="flex items-center gap-[10px]">
            {/* Mobile filter button — hidden on desktop */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-[8px] bg-white border border-[#dfe5ef] px-[14px] py-[8px] font-body text-[13px] text-[#0c1834] hover:border-[#0c1834] transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filtros
              {hasActive && <span className="w-[6px] h-[6px] rounded-full bg-[#d4a435]" />}
            </button>

            {/* Count tag */}
            <div className="hidden lg:flex items-center bg-white border border-[#dfe5ef] px-[14px] py-[8px] font-body text-[13px] text-[#0c1834]">
              <span className="font-semibold">{filtered.length}</span>&nbsp;propiedades disponibles
            </div>

          </div>

          {/* Sort */}
          <div className="relative w-auto">
            <label htmlFor="sort-select" className="sr-only">Ordenar por</label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => startTransition(() => setSort(e.target.value as SortOption))}
              className="appearance-none bg-white border border-[#dfe5ef] pl-[14px] pr-[36px] py-[8px] font-body text-[13px] text-[#0c1834] focus:outline-none focus:border-[#0c1834] transition-colors cursor-pointer"
            >
              <option value="relevancia">Relevancia</option>
              <option value="recientes">Más recientes</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="area-desc">Mayor área</option>
            </select>
            <ChevronDown size={12} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#5a6478] pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Main layout */}
      <div className="px-[30px] xl:px-[60px] 2xl:px-[160px]">
        <div className={`max-w-[1440px] mx-auto grid grid-cols-1 items-start gap-8 ${
          mapProps && mapProps.length > 0
            ? "lg:grid-cols-[300px_1fr_380px]"
            : "lg:grid-cols-[300px_1fr]"
        }`}>

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:flex lg:sticky lg:top-[100px] flex-col gap-[0px]">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onReset={reset}
              hasActive={hasActive}
              businessType={businessType}
              propertyTypes={propertyTypes}
              neighborhoodSlug={neighborhoodSlug}
              neighborhoodLinks={neighborhoodLinks}
            />
          </aside>

          {/* Grid + pagination + mobile map */}
          <div ref={gridRef}>
            {/* Grid con min-h fijo para que la paginación no salte */}
            <div className="min-h-[60vh] lg:min-h-[1800px]">
              {filtered.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-body text-[18px] text-[#5a6478]">
                    {search
                      ? `No encontramos propiedades para "${search}".`
                      : "No hay propiedades con estos filtros."}
                  </p>
                  <button onClick={reset} className="mt-4 font-body text-[14px] text-[#0c1834] underline hover:no-underline transition-all">
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <PropertyGrid properties={shown} cols={mapProps && mapProps.length > 0 ? 2 : 3} gap="tight" pageSize={PAGE_SIZE} />
              )}
            </div>

            {/* Paginación siempre fuera del min-h */}
            {filtered.length > 0 && (
              <PaginationClient
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={(page) => setCurrentPage(page)}
              />
            )}

            {/* Mobile map — below grid, hidden on desktop */}
            {mapProps && mapProps.length > 0 && (
              <div className="lg:hidden mt-[32px]">
                <PropertyMapMulti properties={mapProps} height="h-[300px]" />
              </div>
            )}
          </div>

          {/* Map — desktop right sidebar, hidden on mobile */}
          {mapProps && mapProps.length > 0 && (
            <div className="hidden lg:block lg:sticky lg:top-[100px]">
              <PropertyMapMulti properties={mapProps} height="h-[380px]" />
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ─────────────────────────────────────────────── */}
      {filterDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setFilterDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white max-h-[88vh] flex flex-col rounded-t-[12px] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-[21px] py-[16px] border-b border-[#e9e7e2] shrink-0">
              <span className="font-body font-semibold text-[16px] text-[#0c1834]">Filtros</span>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="text-[#5a6478] hover:text-[#0c1834] transition-colors"
                aria-label="Cerrar filtros"
              >
                <X size={20} />
              </button>
            </div>
            {/* Scrollable panel */}
            <div className="overflow-y-auto p-[21px]">
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                onReset={reset}
                hasActive={hasActive}
                businessType={businessType}
                propertyTypes={propertyTypes}
                neighborhoodSlug={neighborhoodSlug}
                neighborhoodLinks={neighborhoodLinks}
              />
            </div>
            {/* Apply button */}
            <div className="shrink-0 px-[21px] py-[16px] border-t border-[#e9e7e2]">
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full bg-[#0c1834] text-white font-body font-medium text-[14px] tracking-[1.2px] uppercase py-[14px] hover:bg-[#1a2d56] transition-colors"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
