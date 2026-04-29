"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const PropertyMap = dynamic(() => import("@/components/properties/PropertyMap"), { ssr: false });

interface Props {
  lat: number;
  lng: number;
  title: string;
}

export default function ContactMap({ lat, lng, title }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <button
        onClick={() => setLoaded(true)}
        className="w-full h-full bg-[#f0f2f5] flex flex-col items-center justify-center gap-[10px] hover:bg-[#e8eaed] transition-colors"
      >
        <MapPin size={24} className="text-[#5a6478]" />
        <span className="font-body text-[13px] text-[#5a6478]">Ver en mapa</span>
      </button>
    );
  }

  return <PropertyMap lat={lat} lng={lng} title={title} className="w-full h-[260px]" />;
}
