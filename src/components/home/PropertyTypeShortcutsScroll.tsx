"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PropertyTypeShortcutsScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Anterior"
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 flex bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-white transition-colors"
        >
          <ChevronLeft size={18} className="text-[#0c1834]" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-2 xl:gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-1 xl:grid xl:grid-cols-6"
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Siguiente"
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 flex bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-md hover:bg-white transition-colors"
        >
          <ChevronRight size={18} className="text-[#0c1834]" />
        </button>
      )}
    </div>
  );
}
