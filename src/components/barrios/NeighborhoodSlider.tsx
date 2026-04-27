"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

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
    <div
      className="relative w-full overflow-hidden bg-[#0c1935] h-[65vh] sm:h-auto sm:aspect-[16/8] xl:aspect-[1037/412]"
    >
      {/* Background image */}
      <Image
        key={n.slug}
        src={n.image}
        alt={n.name}
        fill
        priority
        quality={90}
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient: 80% dark at bottom → 20% at 50% → transparent at top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(29,33,43,0.8) 0%, rgba(29,33,43,0.2) 50%, rgba(29,33,43,0) 100%)",
        }}
      />

      {/* Main layout: arrows centered vertically */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[30px]">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={prev}
            aria-label="Barrio anterior"
            className="backdrop-blur-[2px] bg-white/80 p-[12px] rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronLeft size={18} className="text-[#0c1834]" strokeWidth={2} />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente barrio"
            className="backdrop-blur-[2px] bg-white/80 p-[12px] rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronRight size={18} className="text-[#0c1834]" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-[20px] sm:p-[30px] flex flex-col gap-[8px]">

        {/* "favorites" label */}
        <div className="flex gap-[10px] items-start">
          <Star
            size={15}
            className="text-white/50 shrink-0"
            style={{ marginTop: "0.5px" }}
          />
          <span
            className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase"
            style={{ lineHeight: "16px" }}
          >
            favorites
          </span>
        </div>

        {/* Neighborhood name */}
        <div className="flex items-center w-full">
          <Link
            href={`/barrios/${n.slug}/`}
            className="font-heading font-normal text-[38px] sm:text-[60px] text-white tracking-[-1.2px] sm:tracking-[-1.8px] leading-none sm:leading-normal hover:text-white/90 transition-colors"
          >
            {n.name}
          </Link>
        </div>

        {/* Stats */}
        {(n.avgPrice || n.propertyCount !== undefined) && (
          <div className="flex gap-[10px] items-start pt-[4px]">
            {n.avgPrice && (
              <div className="flex flex-col gap-[10px] items-start">
                <span
                  className="font-body font-normal text-[15px] text-white whitespace-nowrap"
                  style={{ lineHeight: "16px" }}
                >
                  Precio promedio
                </span>
                <div className="bg-white/20 px-[5px] py-[3px]">
                  <span className="font-body font-semibold text-[20px] text-white leading-normal whitespace-nowrap">
                    {n.avgPrice}
                  </span>
                </div>
              </div>
            )}
            {n.propertyCount !== undefined && (
              <div className="flex flex-col gap-[10px] items-start">
                <span
                  className="font-body font-normal text-[15px] text-white whitespace-nowrap"
                  style={{ lineHeight: "16px" }}
                >
                  Propiedades
                </span>
                <div className="bg-white/20 px-[5px] py-[3px]">
                  <span className="font-body font-semibold text-[20px] text-white leading-normal">
                    {n.propertyCount}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
