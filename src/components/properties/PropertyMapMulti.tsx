"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { MapProperty } from "./PropertyMapMultiCore";
import type { Locale } from "@/lib/copy";

export type { MapProperty };

// Mapbox (~319 KiB) is split into its own chunk and only fetched when the map
// enters the viewport — keeps it off the critical-path bundle entirely.
const PropertyMapMultiCore = dynamic(() => import("./PropertyMapMultiCore"), { ssr: false });

interface Props {
  properties: MapProperty[];
  height?: string;
  locale?: Locale;
}

export default function PropertyMapMulti({ properties, height = "h-[420px]", locale = "es" }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const withCoords = properties.filter((p) => p.lat && p.lng);
  if (withCoords.length === 0) return null;

  return (
    <div ref={wrapperRef} className={`w-full ${height} overflow-hidden`}>
      {shouldLoad && <PropertyMapMultiCore properties={properties} height="h-full" locale={locale} />}
    </div>
  );
}
