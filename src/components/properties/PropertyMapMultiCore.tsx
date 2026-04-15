"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapProperty {
  lat: number;
  lng: number;
  title: string;
  slug: string;
  price: number;
  imageUrl?: string;
  bedrooms?: number;
  bathrooms?: number;
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

function buildPopupHtml(p: MapProperty): string {
  const imgHtml = p.imageUrl
    ? `<img src="${p.imageUrl}" alt="" style="width:100%;height:110px;object-fit:cover;display:block">`
    : "";

  const meta = [
    p.bedrooms !== undefined ? `${p.bedrooms} hab` : "",
    p.bathrooms !== undefined ? `${p.bathrooms} baños` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return `
    <div style="font-family:sans-serif;min-width:200px;max-width:240px;overflow:hidden;margin:0">
      ${imgHtml}
      <div style="padding:10px">
        <p style="font-weight:700;font-size:14px;color:#0c1834;margin:0 0 3px;line-height:1.2">${formatPrice(p.price)}</p>
        ${meta ? `<p style="font-size:12px;color:#737b8c;margin:0 0 5px">${meta}</p>` : ""}
        <p style="font-size:12px;color:#3B4F6B;margin:0 0 8px;line-height:1.3">${p.title}</p>
        <a href="/propiedades/${p.slug}" style="font-size:12px;color:#C9A84C;font-weight:600;text-decoration:none">Ver más →</a>
      </div>
    </div>
  `;
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
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Fit to bounding box of all pins
    if (withCoords.length === 1) {
      map.current.setCenter([withCoords[0].lng, withCoords[0].lat]);
      map.current.setZoom(15);
    } else {
      const bounds = withCoords.reduce(
        (b, p) => b.extend([p.lng, p.lat] as [number, number]),
        new mapboxgl.LngLatBounds(
          [withCoords[0].lng, withCoords[0].lat],
          [withCoords[0].lng, withCoords[0].lat]
        )
      );
      map.current.fitBounds(bounds, { padding: 64, maxZoom: 15, duration: 0 });
    }

    // Add pins
    withCoords.forEach((p) => {
      const popup = new mapboxgl.Popup({ offset: 20, maxWidth: "260px" }).setHTML(
        buildPopupHtml(p)
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
