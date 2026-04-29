"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Mapbox (~319 KiB) is split into its own chunk and only fetched when the map
// enters the viewport — keeps it off the critical-path bundle entirely.
const PropertyMapCore = dynamic(() => import("./PropertyMapCore"), { ssr: false });

interface Props {
  lat: number;
  lng: number;
  title?: string;
  className?: string;
}

export default function PropertyMap({ lat, lng, title, className = "w-full h-[400px]" }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          // Defer Mapbox bundle load until browser is idle so it doesn't
          // block TBT on pages where the map is immediately visible (desktop).
          if ("requestIdleCallback" in window) {
            (window as typeof window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
              .requestIdleCallback(() => setShouldLoad(true), { timeout: 2000 });
          } else {
            setTimeout(() => setShouldLoad(true), 500);
          }
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={className}>
      {shouldLoad && <PropertyMapCore lat={lat} lng={lng} title={title} className="w-full h-full" />}
    </div>
  );
}
