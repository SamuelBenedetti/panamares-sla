"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface GalleryImage {
  url: string;
  alt?: string;
}

export default function PropertyGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  const changeTo = useCallback((newIdx: number) => {
    setFading(true);
    setTimeout(() => {
      setActive(newIdx);
      setFading(false);
    }, 200);
  }, []);

  const prev = useCallback(() => changeTo(active === 0 ? images.length - 1 : active - 1), [active, images.length, changeTo]);
  const next = useCallback(() => changeTo(active === images.length - 1 ? 0 : active + 1), [active, images.length, changeTo]);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col">

      {/* ── Hero image ── */}
      <div className="relative h-[320px] md:h-[520px] xl:h-[720px] w-full overflow-hidden bg-[#0c1935]">
        <Image
          key={images[active].url}
          src={images[active].url}
          alt={images[active].alt ?? "Foto de propiedad"}
          fill
          priority
          className={`object-cover transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}
          sizes="100vw"
        />

        {/* Nav arrows — only show when multiple images */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-[30px] pointer-events-none">
            <button
              onClick={prev}
              className="pointer-events-auto w-[42px] h-[42px] rounded-full bg-white/80 backdrop-blur-[2px] flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Foto anterior"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9L11 14" stroke="#0c1935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={next}
              className="pointer-events-auto w-[42px] h-[42px] rounded-full bg-white/80 backdrop-blur-[2px] flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Foto siguiente"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4L12 9L7 14" stroke="#0c1935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* Slide counter */}
        {images.length > 1 && (
          <div className="absolute bottom-[37px] right-[40px] bg-[rgba(29,33,43,0.7)] backdrop-blur-[2px] px-[12px] py-[6px]">
            <span className="font-body font-normal text-[14px] text-[#faf8f5] leading-4 whitespace-nowrap">
              {active + 1} / {images.length}
            </span>
          </div>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && (
        <div className="bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.08)] px-[30px] xl:px-[260px] py-5">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex gap-[12px] overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => changeTo(i)}
                  className={`relative shrink-0 w-[80px] h-[80px] overflow-hidden transition-opacity ${
                    i === active
                      ? "border-2 border-[#0d1835] p-[2px]"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? `Foto ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
