"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/properties/PropertyMap"), { ssr: false });

interface Props {
  lat: number;
  lng: number;
  title: string;
}

export default function ContactMap({ lat, lng, title }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Mapbox only after the first user interaction so it doesn't block TBT.
    const events = ["mousemove", "scroll", "keydown", "touchstart", "pointerdown"] as const;
    const load = () => {
      setLoaded(true);
      events.forEach((e) => window.removeEventListener(e, load));
    };
    events.forEach((e) => window.addEventListener(e, load, { passive: true, once: true }));
    return () => events.forEach((e) => window.removeEventListener(e, load));
  }, []);

  if (!loaded) {
    return <div className="w-full h-full bg-[#f0f2f5]" />;
  }

  return <PropertyMap lat={lat} lng={lng} title={title} className="w-full h-[260px]" />;
}
