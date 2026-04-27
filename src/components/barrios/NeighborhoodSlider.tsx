"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SliderNeighborhood {
  name: string;
  slug: string;
  image: string;
  avgPrice?: string;
  propertyCount?: number;
}

export default function NeighborhoodSlider({
  neighborhoods,
}: {
  neighborhoods: SliderNeighborhood[];
}) {
  const [current, setCurrent] = useState(0);
  const n = neighborhoods[current];

  const prev = () =>
    setCurrent((c) => (c - 1 + neighborhoods.length) % neighborhoods.length);
  const next = () =>
    setCurrent((c) => (c + 1) % neighborhoods.length);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/8] xl:aspect-[1200/540] overflow-hidden rounded-[6px] bg-[#0c1834]">
      <Link href={`/barrios/${n.slug}/`} className="block w-full h-full">
        <Image
          key={n.slug}
          src={n.image}
          alt={n.name}
          fill
          priority
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1400px"
        />
      </Link>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 p-[24px] xl:p-[44px] flex flex-col gap-[10px] pointer-events-none">
        <Link
          href={`/barrios/${n.slug}/`}
          className="pointer-events-auto w-fit"
        >
          <h2 className="font-heading font-normal text-[clamp(38px,5.5vw,76px)] text-white leading-none tracking-[-2px] hover:text-white/90 transition-colors">
            {n.name}
          </h2>
        </Link>

        {(n.avgPrice || n.propertyCount !== undefined) && (
          <div className="flex items-end gap-[24px]">
            {n.avgPrice && (
              <div className="flex flex-col gap-[3px]">
                <span className="font-body text-[10px] text-white/55 uppercase tracking-[2.5px]">
                  Precio promedio
                </span>
                <span className="font-body font-semibold text-[16px] text-white">
                  {n.avgPrice}
                </span>
              </div>
            )}
            {n.propertyCount !== undefined && (
              <div className="flex flex-col gap-[3px]">
                <span className="font-body text-[10px] text-white/55 uppercase tracking-[2.5px]">
                  Propiedades
                </span>
                <span className="font-body font-semibold text-[16px] text-white">
                  {n.propertyCount}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-[24px] xl:bottom-[44px] right-[24px] xl:right-[44px] flex items-center gap-[6px]">
        {neighborhoods.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ver ${neighborhoods[i].name}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-[20px] h-[6px] bg-white"
                : "w-[6px] h-[6px] bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Barrio anterior"
        className="absolute left-[14px] xl:left-[20px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white/15 backdrop-blur-[6px] border border-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente barrio"
        className="absolute right-[14px] xl:right-[20px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full bg-white/15 backdrop-blur-[6px] border border-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={20} className="text-white" />
      </button>
    </div>
  );
}
