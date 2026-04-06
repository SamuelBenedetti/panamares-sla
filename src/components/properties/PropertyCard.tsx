import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Maximize } from "lucide-react";
import type { Property } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { BASE_URL, whatsappLink } from "@/lib/config";
import CompareButton from "./CompareButton";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyCard({ property }: { property: Property }) {
  const { title, slug, price, bedrooms, bathrooms, area, zone, mainImage, recommended, fairPrice, rented } = property;

  const imageUrl = mainImage
    ? urlFor(mainImage).width(600).height(400).url()
    : "/placeholder-property.jpg";

  const pricePerM2 = area && area > 0 ? Math.round(price / area) : null;
  const waMessage = `Hola, me interesa esta propiedad: ${title} — ${BASE_URL}/propiedades/${slug?.current}`;
  const waHref = whatsappLink(waMessage);

  return (
    <article className="bg-white border border-[rgba(233,231,226,0.5)] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-[130px] md:h-[260px] shrink-0 overflow-hidden">
        <Link href={`/propiedades/${slug?.current}`} className="block size-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <CompareButton id={property._id} />
        {/* Tags — stack vertically top-left */}
        <div className="absolute top-[11px] left-[10px] flex flex-col gap-[4px]">
          {recommended && (
            <div className="bg-white/90 backdrop-blur-[2px] px-[10px] py-[4px]">
              <span className="font-body font-semibold text-[#0c1834] text-[12px] uppercase leading-[16px]">
                Recomendado
              </span>
            </div>
          )}
          {fairPrice && (
            <div className="bg-[#00b424] backdrop-blur-[2px] px-[10px] py-[4px]">
              <span className="font-body font-semibold text-white text-[12px] uppercase leading-[16px]">
                Precio Justo
              </span>
            </div>
          )}
          {rented && (
            <div className="bg-[#e03131] backdrop-blur-[2px] px-[10px] py-[4px]">
              <span className="font-body font-semibold text-white text-[12px] uppercase leading-[16px]">
                Alquilado
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[8px] p-[10px] md:p-[20px] flex-1">
        {/* Title + description */}
        <div className="flex flex-col gap-[3px]">
          <Link href={`/propiedades/${slug?.current}`}>
            <h3 className="font-body font-semibold text-[#0c1834] text-[15px] md:text-[22px] leading-tight tracking-[-0.2px] hover:opacity-70 transition-opacity line-clamp-2">
              {title}
            </h3>
          </Link>
          {zone && (
            <p className="font-body font-normal text-[#737b8c] text-[12px] md:text-[14px] leading-normal line-clamp-1">
              {zone}
            </p>
          )}
        </div>

        {/* Stats — stacked on mobile, horizontal on desktop */}
        <div className="flex flex-col gap-[10px] md:flex-row md:items-center md:gap-4 pt-1">
          {bedrooms != null && (
            <span className="flex items-center gap-[6px] font-body text-[#737b8c] text-[12px] leading-[16px]">
              <Bed size={13} strokeWidth={1.5} />
              {bedrooms} hab.
            </span>
          )}
          {bathrooms != null && (
            <span className="flex items-center gap-[6px] font-body text-[#737b8c] text-[12px] leading-[16px]">
              <Bath size={13} strokeWidth={1.5} />
              {bathrooms} baños
            </span>
          )}
          {area != null && (
            <span className="flex items-center gap-[6px] font-body text-[#737b8c] text-[12px] leading-[16px]">
              <Maximize size={13} strokeWidth={1.5} />
              {area} m²
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-[5px] pt-[8px]">
          <Link href={`/propiedades/${slug?.current}`}>
            <span className="font-body font-bold text-[#0c1834] text-[18px] md:text-[20px] leading-normal tracking-[-0.2px]">
              {formatPrice(price)}
            </span>
          </Link>
          {pricePerM2 && (
            <span className="font-body text-[#737b8c] text-[12px] leading-[16px]">
              {formatPrice(pricePerM2)}/m²
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons — stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col gap-[8px] md:flex-row md:gap-2 pt-[8px]">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
className="w-full h-[42px] flex items-center justify-center bg-[#0d1835] hover:bg-[#162444] text-white font-body font-medium text-[14px] md:text-[16px] transition-colors shadow-sm"
          >
            Contáctenos
          </a>
          <Link
            href={`/propiedades/${slug?.current}`}
            className="w-full h-[42px] flex items-center justify-center font-body font-medium text-[#0c1834] text-[14px] md:text-[16px] border border-[#dfe5ef] hover:bg-gray-50 transition-colors"
          >
            Ver propiedad
          </Link>
        </div>
      </div>
    </article>
  );
}
