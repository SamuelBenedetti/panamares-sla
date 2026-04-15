"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface GalleryImage {
  url: string;
  alt?: string;
}

interface Props {
  images: GalleryImage[];
  contained?: boolean;
  propertyTitle?: string;
}

export default function PropertyGallery({ images, contained = false, propertyTitle }: Props) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const changeTo = useCallback((newIdx: number) => {
    setFading(true);
    setTimeout(() => {
      setActive(newIdx);
      setFading(false);
    }, 200);
  }, []);

  const prev = useCallback(() => changeTo(active === 0 ? images.length - 1 : active - 1), [active, images.length, changeTo]);
  const next = useCallback(() => changeTo(active === images.length - 1 ? 0 : active + 1), [active, images.length, changeTo]);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const lbPrev = useCallback(() =>
    setLightboxIdx(i => (i === 0 ? images.length - 1 : i - 1)),
    [images.length]);

  const lbNext = useCallback(() =>
    setLightboxIdx(i => (i === images.length - 1 ? 0 : i + 1)),
    [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbPrev();
      if (e.key === "ArrowRight") lbNext();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox, lbPrev, lbNext]);

  if (images.length === 0) return null;

  // Spec: up to 8 thumbnails
  const thumbs = images.slice(0, 8);

  return (
    <>
      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-md bg-black/70 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-[16px] md:px-[20px] py-[14px] md:py-[16px] z-10">
            {/* Counter */}
            <span className="font-body text-[13px] text-white/80 leading-none">
              {lightboxIdx + 1} / {images.length}
            </span>

            {/* Close — icon only on mobile, icon+text on desktop */}
            <button
              onClick={closeLightbox}
              className="flex items-center gap-[8px] bg-white text-[#0c1835] px-[10px] md:px-[14px] py-[8px] hover:bg-white/90 transition-colors shadow-md"
              aria-label="Cerrar galería"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="#0c1835" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span className="hidden md:inline font-body font-medium text-[13px] leading-none">Cerrar</span>
            </button>
          </div>

          {/* Image area */}
          <div
            className="relative w-full h-full max-w-[1400px] max-h-[85vh] mx-[12px] mt-[54px] mb-[88px] md:mx-[80px] md:my-[70px]"
            onClick={e => e.stopPropagation()}
          >
            <Image
              key={images[lightboxIdx].url}
              src={images[lightboxIdx].url}
              alt={images[lightboxIdx].alt ?? `${propertyTitle ?? "Propiedad"} — foto ${lightboxIdx + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Desktop side arrows — hidden on mobile */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lbPrev(); }}
              className="hidden md:flex absolute left-[20px] top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-white items-center justify-center hover:bg-white/90 transition-colors shadow-lg"
              aria-label="Foto anterior"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9L11 14" stroke="#0c1835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); lbNext(); }}
              className="hidden md:flex absolute right-[20px] top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-white items-center justify-center hover:bg-white/90 transition-colors shadow-lg"
              aria-label="Foto siguiente"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4L12 9L7 14" stroke="#0c1835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Mobile bottom nav — hidden on desktop */}
          {images.length > 1 && (
            <div
              className="md:hidden absolute bottom-0 left-0 right-0 flex items-center justify-between px-[24px] py-[20px]"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={(e) => { e.stopPropagation(); lbPrev(); }}
                className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                aria-label="Foto anterior"
              >
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <path d="M11 4L6 9L11 14" stroke="#0c1835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <span className="font-body text-[14px] text-white font-medium">
                {lightboxIdx + 1} / {images.length}
              </span>

              <button
                onClick={(e) => { e.stopPropagation(); lbNext(); }}
                className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                aria-label="Foto siguiente"
              >
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <path d="M7 4L12 9L7 14" stroke="#0c1835" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Contained mode (inside grid) ── */}
      {contained ? (
        <div className="flex flex-col gap-[8px]">
          <div
            className="relative h-[240px] md:h-[340px] lg:h-[420px] w-full overflow-hidden bg-[#0c1935] cursor-zoom-in"
            onClick={() => openLightbox(active)}
          >
            <Image
              key={images[active].url}
              src={images[active].url}
              alt={images[active].alt ?? `Foto de ${propertyTitle ?? "propiedad"}`}
              fill
              priority
              className={`object-cover transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {images.length > 1 && (
              <div
                className="absolute inset-0 flex items-center justify-between px-[16px] pointer-events-none"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="pointer-events-auto w-[36px] h-[36px] rounded-full bg-white/80 backdrop-blur-[2px] flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                  aria-label="Foto anterior"
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M11 4L6 9L11 14" stroke="#0c1935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="pointer-events-auto w-[36px] h-[36px] rounded-full bg-white/80 backdrop-blur-[2px] flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                  aria-label="Foto siguiente"
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M7 4L12 9L7 14" stroke="#0c1935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}

            <div className="absolute bottom-[12px] right-[14px] bg-[rgba(29,33,43,0.7)] backdrop-blur-[2px] px-[10px] py-[4px]">
              <span className="font-body font-normal text-[12px] text-[#faf8f5] leading-4 whitespace-nowrap">
                {active + 1} / {images.length}
              </span>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-[8px] overflow-x-auto pb-1">
              {thumbs.map((img, i) => (
                <button
                  key={i}
                  onClick={() => changeTo(i)}
                  className={`relative shrink-0 w-[52px] h-[52px] overflow-hidden transition-opacity ${
                    i === active ? "border-2 border-[#0d1835] p-[2px]" : "opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? `${propertyTitle ?? "Propiedad"} — foto ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="52px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── Full-width mode ── */
        <div className="flex flex-col">
          <div
            className="relative w-full aspect-video max-h-[440px] min-h-[220px] overflow-hidden bg-[#0c1935] cursor-zoom-in"
            onClick={() => openLightbox(active)}
          >
            <Image
              key={images[active].url}
              src={images[active].url}
              alt={images[active].alt ?? `Foto de ${propertyTitle ?? "propiedad"}`}
              fill
              priority
              className={`object-cover transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}
              sizes="100vw"
            />

            {images.length > 1 && (
              <div
                className="absolute inset-0 flex items-center justify-between px-[30px] pointer-events-none"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="pointer-events-auto w-[42px] h-[42px] rounded-full bg-white/80 backdrop-blur-[2px] flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                  aria-label="Foto anterior"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M11 4L6 9L11 14" stroke="#0c1935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="pointer-events-auto w-[42px] h-[42px] rounded-full bg-white/80 backdrop-blur-[2px] flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                  aria-label="Foto siguiente"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M7 4L12 9L7 14" stroke="#0c1935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}

            <div className="absolute bottom-[14px] right-[18px] bg-[rgba(29,33,43,0.7)] backdrop-blur-[2px] px-[12px] py-[6px]">
              <span className="font-body font-normal text-[13px] text-[#faf8f5] leading-4 whitespace-nowrap">
                {active + 1} / {images.length}
              </span>
            </div>
          </div>

          {images.length > 1 && (
            <div className="bg-white shadow-[0px_4px_16px_rgba(0,0,0,0.08)] px-[30px] xl:px-[20px] 2xl:px-[120px] py-4">
              <div className="max-w-[1600px] mx-auto">
                <div className="flex gap-[10px] overflow-x-auto pb-1">
                  {thumbs.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => changeTo(i)}
                      className={`relative shrink-0 w-[72px] h-[72px] overflow-hidden transition-opacity ${
                        i === active ? "border-2 border-[#0d1835] p-[2px]" : "opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`Ver foto ${i + 1}`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt ?? `${propertyTitle ?? "Propiedad"} — foto ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
