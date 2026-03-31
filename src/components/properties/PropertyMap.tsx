"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  lat: number;
  lng: number;
  title?: string;
}

export default function PropertyMap({ lat, lng, title }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 14,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    new mapboxgl.Marker({ color: "#C9A84C" })
      .setLngLat([lng, lat])
      .setPopup(
        title
          ? new mapboxgl.Popup().setHTML(`<strong>${title}</strong>`)
          : undefined
      )
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [lat, lng, title]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[400px] rounded-xl overflow-hidden"
    />
  );
}
