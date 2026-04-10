"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProperty {
  lat: number;
  lng: number;
  title: string;
  slug: string;
  price: number;
}

interface Props {
  properties: MapProperty[];
  height?: string;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyMapMultiCore({ properties, height = "h-full" }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const withCoords = properties.filter((p) => p.lat && p.lng);

  useEffect(() => {
    if (!mapContainer.current || withCoords.length === 0) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    const avgLat = withCoords.reduce((s, p) => s + p.lat, 0) / withCoords.length;
    const avgLng = withCoords.reduce((s, p) => s + p.lng, 0) / withCoords.length;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [avgLng, avgLat],
      zoom: 14,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    withCoords.forEach((p) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div style="font-family:sans-serif;min-width:160px">
          <p style="font-weight:700;font-size:13px;margin:0 0 4px">${formatPrice(p.price)}</p>
          <p style="font-size:12px;color:#3B4F6B;margin:0 0 6px;line-height:1.3">${p.title}</p>
          <a href="/propiedades/${p.slug}" style="font-size:12px;color:#C9A84C;font-weight:600">Ver propiedad →</a>
        </div>`
      );

      new mapboxgl.Marker({ color: "#C9A84C" })
        .setLngLat([p.lng, p.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withCoords.length]);

  return <div ref={mapContainer} className={`w-full ${height}`} />;
}
