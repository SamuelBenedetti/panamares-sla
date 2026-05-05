import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Maximize } from "lucide-react";
import type { Property } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { BASE_URL, whatsappLink } from "@/lib/config";
import { formatPrice } from "@/lib/utils";
import { getSlugByName } from "@/lib/neighborhoods";
import { getCopy, type Locale } from "@/lib/copy";
import { deriveEnSlug, localePath } from "@/lib/i18n";
import { resolveI18nString } from "@/lib/i18n/resolveI18n";
import CompareButton from "./CompareButton";

export default function PropertyCard({
  property,
  priority = false,
  locale = "es",
}: {
  property: Property;
  priority?: boolean;
  locale?: Locale;
}) {
  const { slug, price, bedrooms, bathrooms, area, zone, mainImage, recommended, fairPrice, rented } = property;
  const t = getCopy(locale).components.propertyCard;
  // Localized title with graceful fallback to the legacy `title` field —
  // EN cards render the EN translation when authored, otherwise the resolver
  // walks ES then the legacy `title` (Wasi-imported) so cards keep rendering.
  const title = resolveI18nString(property.titleI18n, locale, property.title);

  const imageUrl = mainImage
    ? urlFor(mainImage).width(800).height(530).fit("crop").url()
    : "/hero-bg.jpg";

  const pricePerM2 = area && area > 0 ? Math.round(price / area) : null;
  const zoneSlug = zone ? getSlugByName(zone) : undefined;
  // Property detail route is locale-prefixed: `/propiedades/[slug]` for ES and
  // `/en/properties/[slug]` for EN (Phase 2 PR-C delivers the EN route).
  // PR-F: on EN we localize the leaf slug at read time via `deriveEnSlug`
  // (e.g. `penthouses-en-venta-...` → `penthouses-for-sale-...`). The EN route
  // handler accepts both ES-form and EN-form slugs and 308s ES-form to EN-form.
  const propertyHref =
    locale === "en"
      ? `/en/properties/${deriveEnSlug(slug?.current ?? "")}`
      : `/propiedades/${slug?.current}`;
  const zoneHref = zoneSlug ? localePath(`/barrios/${zoneSlug}/`, locale) : undefined;
  const waMessage = `${t.whatsappPrefix}${title} — ${BASE_URL}${propertyHref}`;
  const waHref = whatsappLink(waMessage);

  return (
    <article className="bg-white border border-[rgba(233,231,226,0.5)] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-video shrink-0 overflow-hidden">
        <Link href={propertyHref} className="block size-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority={priority}
            className="object-cover scale-[1.6] hover:scale-[1.65] transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        {property.wasiId != null && <CompareButton id={String(property.wasiId)} />}
        {/* Tags — stack vertically top-left */}
        <div className="absolute top-[11px] left-[10px] flex flex-col gap-[4px]">
          {recommended && (
            <div className="bg-[#8B00EE] backdrop-blur-[2px] px-[10px] py-[2px]">
              <span className="font-body font-semibold text-white text-[12px] uppercase leading-[16px]">
                {t.tagRecomendado}
              </span>
            </div>
          )}
          {fairPrice && (
            <div className="bg-[#007ECC] backdrop-blur-[2px] px-[10px] py-[2px]">
              <span className="font-body font-semibold text-white text-[12px] uppercase leading-[16px]">
                {t.tagPrecioJusto}
              </span>
            </div>
          )}
          {rented && (
            <div className="bg-[#0D1835] backdrop-blur-[2px] px-[10px] py-[2px]">
              <span className="font-body font-semibold text-white text-[12px] uppercase leading-[16px]">
                {t.tagAlquilado}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[6px] p-[8px] md:p-[11px] flex-1">
        {/* Title + description */}
        <div className="flex flex-col gap-[3px]">
          <Link href={propertyHref}>
            <h3 className="font-body font-semibold text-[#0c1834] text-[17px] lg:text-[15px] leading-tight tracking-[-0.2px] hover:opacity-70 transition-opacity line-clamp-2">
              {title}
            </h3>
          </Link>
          {zone && (
            zoneHref ? (
              <Link
                href={zoneHref}
                className="font-body font-normal text-[#5a6478] text-[14px] lg:text-[12px] leading-normal line-clamp-1 hover:text-[#0c1834] transition-colors py-[3px] inline-block"
              >
                {zone}
              </Link>
            ) : (
              <p className="font-body font-normal text-[#5a6478] text-[14px] lg:text-[12px] leading-normal line-clamp-1 py-[3px]">
                {zone}
              </p>
            )
          )}
        </div>

        {/* Stats — stacked on mobile, horizontal on desktop */}
        <div className="flex flex-row gap-[8px]  md:items-center md:gap-3 pt-1">
          {bedrooms != null && (
            <span className="flex items-center gap-[5px] font-body text-[#5a6478] text-[13px] lg:text-[12px] leading-[16px]">
              <Bed size={13} strokeWidth={1.5} />
              {bedrooms} {t.labelHabitacionesShort}
            </span>
          )}
          {bathrooms != null && (
            <span className="flex items-center gap-[5px] font-body text-[#5a6478] text-[13px] lg:text-[12px] leading-[16px]">
              <Bath size={13} strokeWidth={1.5} />
              {bathrooms} {t.labelBanos}
            </span>
          )}
          {area != null && (
            <span className="flex items-center gap-[5px] font-body text-[#5a6478] text-[13px] lg:text-[12px] leading-[16px]">
              <Maximize size={13} strokeWidth={1.5} />
              {area} {t.labelMetros}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-[4px] pt-[6px]">
          <Link href={propertyHref}>
            <span className="font-body font-bold text-[#0c1834] text-[18px] lg:text-[16px] leading-normal tracking-[-0.2px]">
              {formatPrice(price)}
            </span>
          </Link>
          {pricePerM2 && (
            <span className="font-body text-[#5a6478] text-[13px] lg:text-[12px] leading-[16px]">
              {formatPrice(pricePerM2)}/m²
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons — stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col gap-[6px] md:flex-row md:gap-2 pt-[6px]">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-[38px] flex items-center justify-center gap-[6px] bg-[#00b424] hover:bg-[#009e1f] text-white font-body font-medium text-[13px] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
          <Link
            href={propertyHref}
            className="w-full h-[38px] flex items-center justify-center font-body font-medium text-[#0c1834] text-[13px] border border-[#dfe5ef] hover:bg-gray-50 transition-colors"
          >
            {t.verPropiedad}
          </Link>
        </div>
      </div>
    </article>
  );
}
