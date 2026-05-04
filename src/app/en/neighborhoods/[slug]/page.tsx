import NeighborhoodCards, { type NeighborhoodCardData } from "@/components/home/NeighborhoodCards";
import NeighborhoodListingsSection from "@/components/properties/NeighborhoodListingsSection";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import { CATEGORIES } from "@/lib/categories";
import { canonical, alternates } from "@/lib/seo";
import { whatsappLink } from "@/lib/config";
import { breadcrumbSchema, neighborhoodSchema } from "@/lib/jsonld";
import { getNeighborhoodBySlug, NEIGHBORHOOD_IMAGES, NEIGHBORHOOD_HERO_IMAGES, NEIGHBORHOODS, VALID_NEIGHBORHOOD_SLUGS } from "@/lib/neighborhoods";
import type { Neighborhood, Property } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { allNeighborhoodContentQuery, neighborhoodContentQuery, propertiesByNeighborhoodQuery, zonePropertyZonesQuery } from "@/sanity/lib/queries";
import { Home } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCopy } from "@/lib/copy";
import { neighborhoodsEn } from "@/lib/copy/neighborhoods.en";

const copy = getCopy("en");
const t = copy.components.neighborhoodDetail;

interface Props {
  params: { slug: string };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return Array.from(VALID_NEIGHBORHOOD_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const neighborhood = getNeighborhoodBySlug(params.slug);
  if (!neighborhood) return {};

  const nbhContent = await sanityFetch<Neighborhood | null>(neighborhoodContentQuery, { slug: params.slug });
  const ogImage = nbhContent?.photo
    ? urlFor(nbhContent.photo).width(1200).height(630).url()
    : undefined;

  const properties = await sanityFetch<{ _id: string }[]>(
    propertiesByNeighborhoodQuery,
    { neighborhood: neighborhood.name }
  );
  const shouldIndex = properties.length >= 2;

  const seoBlockEn = neighborhoodsEn[params.slug]?.seoBlock;

  return {
    title: `Properties in ${neighborhood.name}, Panama`,
    description:
      seoBlockEn ??
      `Complete guide to ${neighborhood.name}: available properties, price per m², lifestyle and everything you need to live or invest in this Panama City area.`,
    alternates: {
      canonical: canonical(`/en/neighborhoods/${params.slug}`),
      languages: alternates(`/barrios/${params.slug}`, `/en/neighborhoods/${params.slug}`),
    },
    robots: { index: shouldIndex, follow: true },
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function NeighborhoodGuidePageEn({ params }: Props) {
  const neighborhood = getNeighborhoodBySlug(params.slug);
  if (!neighborhood) notFound();

  const [properties, nbhContent, allNbhContent, allZones] = await Promise.all([
    sanityFetch<Property[]>(propertiesByNeighborhoodQuery, { neighborhood: neighborhood.name }),
    sanityFetch<Neighborhood | null>(neighborhoodContentQuery, { slug: params.slug }),
    sanityFetch<Array<{ slug: string; avgPricePerM2: number | null; photo?: import("@/lib/types").SanityImage }>>(allNeighborhoodContentQuery),
    sanityFetch<Array<{ zone: string }>>(zonePropertyZonesQuery),
  ]);

  // EN seoBlock comes from the EN copy bundle (Sanity stores ES only).
  const seoBlockText = neighborhoodsEn[params.slug]?.seoBlock ?? null;

  const propsWithArea = properties.filter((p) => p.area && p.area > 0);
  const avgPricePerM2 =
    nbhContent?.avgPricePerM2 ??
    (propsWithArea.length > 0
      ? Math.round(propsWithArea.reduce((s, p) => s + p.price / p.area!, 0) / propsWithArea.length)
      : null);

  const ventaCount    = properties.filter((p) => p.businessType === "venta").length;
  const alquilerCount = properties.filter((p) => p.businessType === "alquiler").length;

  const comboCounts = new Map<string, number>();
  for (const p of properties) {
    const key = `${p.propertyType}|${p.businessType}`;
    comboCounts.set(key, (comboCounts.get(key) ?? 0) + 1);
  }
  const categoryCards = CATEGORIES.flatMap((cat) => {
    const count = comboCounts.get(`${cat.propertyType}|${cat.businessType}`) ?? 0;
    if (count === 0) return [];
    return [{ cat, count }];
  });

  const mapProps = properties
    .filter((p) => p.location)
    .map((p) => ({
      lat:      p.location!.lat,
      lng:      p.location!.lng,
      title:    p.title,
      slug:     p.slug.current,
      price:    p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      imageUrl: p.mainImage
        ? urlFor(p.mainImage).width(300).height(200).fit("crop").url()
        : undefined,
    }));

  const heroImage = nbhContent?.photo
    ? urlFor(nbhContent.photo).width(1600).height(900).url()
    : NEIGHBORHOOD_HERO_IMAGES[params.slug] ?? NEIGHBORHOOD_IMAGES[params.slug] ?? "/hero-bg.jpg";

  const neighborhoodForSchema = nbhContent ?? {
    _id: params.slug,
    name: neighborhood.name,
    slug: { current: params.slug },
  };
  const jsonLdPlace      = neighborhoodSchema(neighborhoodForSchema, heroImage);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: copy.layout.breadcrumb.inicio, url: "/en/" },
    { name: t.breadcrumbLabel,             url: "/en/neighborhoods/" },
    { name: neighborhood.name,             url: `/en/neighborhoods/${params.slug}/` },
  ]);

  const nearby = NEIGHBORHOODS.filter((n) => n.slug !== params.slug).slice(0, 4);

  const avgPriceMap = new Map(allNbhContent.map((n) => [n.slug, n.avgPricePerM2]));
  const zoneCounts = new Map<string, number>();
  for (const { zone } of allZones) zoneCounts.set(zone, (zoneCounts.get(zone) ?? 0) + 1);

  const nearbyPhotoMap = new Map(
    allNbhContent
      .filter((n) => n.photo)
      .map((n) => [n.slug, urlFor(n.photo!).width(700).height(930).fit("crop").url()])
  );

  const nearbyCards: NeighborhoodCardData[] = nearby.map((n) => {
    const avg = avgPriceMap.get(n.slug);
    return {
      name:     n.name,
      slug:     n.slug,
      image:    nearbyPhotoMap.get(n.slug) ?? "/hero-bg.jpg",
      avgPrice: avg ? `$${avg.toLocaleString("en-US")}/m²` : "",
      count:    zoneCounts.get(n.name) ?? 0,
    };
  });

  const sortedByPrice = [...properties].sort((a, b) => b.price - a.price);
  const ventaProps    = sortedByPrice.filter((p) => p.businessType === "venta");
  const alquilerProps = sortedByPrice.filter((p) => p.businessType === "alquiler");

  const toCategoryLinks = (intent: "venta" | "alquiler") =>
    categoryCards
      .filter(({ cat }) => cat.businessType === intent)
      .map(({ cat, count }) => ({
        slug: cat.slug,
        label: cat.h1.split(" en ")[0],
        count,
      }));
  const categoryLinks = { venta: toCategoryLinks("venta"), alquiler: toCategoryLinks("alquiler") };

  const mostCommonType = categoryCards.length > 0
    ? categoryCards.reduce((prev, curr) => curr.count > prev.count ? curr : prev)
    : null;

  const waMsg = t.whatsappMessageTpl(neighborhood.name);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPlace) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <WhatsAppButton message={waMsg} variant="floating" />

      {/* HERO */}
      <section className="relative h-[72vh] min-h-[480px] xl:h-[80vh] flex flex-col justify-end overflow-hidden">
        <Image
          src={heroImage}
          alt={`${neighborhood.name}, Panama`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1834] via-[#0c1834]/30 to-[#0c1834]/10" />

        <div className="relative z-10 w-full px-[24px] xl:px-[60px] 2xl:px-[160px] pb-[48px] xl:pb-[80px]">
          <div className="max-w-[1440px] mx-auto flex flex-col gap-[20px]">

            <Breadcrumb
              variant="light"
              items={[
                { label: copy.layout.breadcrumb.inicio, href: "/en" },
                { label: t.breadcrumbLabel, href: "/en/neighborhoods/" },
                { label: neighborhood.name },
              ]}
            />

            <h1 className="font-heading font-normal text-[clamp(44px,6vw,80px)] 2xl:text-[68px] text-white leading-none tracking-[-2.5px] md:whitespace-nowrap">
              {t.heroH1Prefix}{neighborhood.name},
              <span className="italic">{t.heroH1Italic}</span>
            </h1>

            <div className="flex flex-wrap gap-[10px] pt-[4px]">
              <div className="h-[40px] px-[20px] py-[8px] flex flex-col justify-center items-start border border-[#E6E6E6]">
                <div className="flex items-center gap-[8px]">
                  <Home size={14} className="text-white/60 shrink-0" />
                  <span className="font-body text-[13px] text-white whitespace-nowrap">
                    <span className="font-semibold">{properties.length}</span>{" "}
                    {properties.length === 1 ? t.heroPropActiva : t.heroPropActivasPlural}
                    {ventaCount > 0 && (
                      <> <span className="text-white/40 mx-[3px]">|</span> <span className="font-semibold">{ventaCount}</span> {t.heroVentaSuffix}</>
                    )}
                    {alquilerCount > 0 && (
                      <> <span className="text-white/40 mx-[3px]">|</span> <span className="font-semibold">{alquilerCount}</span> {t.heroAlquilerSuffix}</>
                    )}
                  </span>
                </div>
              </div>

              {avgPricePerM2 && (
                <div className="h-[40px] px-[20px] py-[8px] flex flex-col justify-center items-start border border-[#E6E6E6]">
                  <div className="flex items-center gap-[8px]">
                    <Home size={14} className="text-white/60 shrink-0" />
                    <span className="font-body text-[13px] text-white whitespace-nowrap">
                      <span className="font-semibold">{formatPrice(avgPricePerM2)}/m²</span> {t.heroPromedioSuffix}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      {seoBlockText && (
      <section className="bg-[#f9f9f9] px-[24px] xl:px-[60px] 2xl:px-[160px] py-[80px] xl:py-[112px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-[64px] xl:gap-[100px] 2xl:gap-[200px]">

            <div className="flex flex-col">
              <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
                {t.aboutEyebrow}
              </p>
              <h2 className="font-heading font-normal text-[clamp(40px,4.5vw,60px)] 2xl:text-[52px] text-[#0c1834] tracking-[-1.8px] leading-none mt-[12px]">
                {t.aboutHeadingPrefix}<em className="italic">{neighborhood.name}</em>
              </h2>

              <p className="font-body text-[17px] xl:text-[20px] text-[#737b8c] leading-[1.7] mt-[32px]">
                {seoBlockText}
              </p>

              {properties.length > 0 && (
                <p className="font-body text-[15px] xl:text-[17px] text-[#737b8c] mt-[20px]">
                  {t.currentlyThereAre}{" "}
                  <span className="font-semibold text-[#0c1834]">
                    {properties.length} {properties.length === 1 ? t.propiedadDisponible : t.propiedadesDisponibles}
                  </span>{" "}
                  {t.enConnector} {neighborhood.name}.
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 mt-[50px]">
                <a
                  href={whatsappLink(waMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#00b424] text-white font-body font-medium text-[15px] px-5 py-2.5 h-[42px] flex items-center justify-center gap-[8px] hover:bg-[#009e1f] transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t.ctaWhatsapp}
                </a>
                <Link
                  href="/en/contact/"
                  className="w-full sm:w-auto bg-white text-[#0d1835] font-body font-medium text-[15px] px-5 py-2.5 h-[42px] flex items-center justify-center hover:bg-white/90 transition-colors"
                >
                  {t.ctaContactenos}
                </Link>
              </div>
            </div>

            <aside className="flex flex-col justify-start pt-[4px]">
              {avgPricePerM2 && (
                <div className="flex flex-col gap-[4px] border-b border-[#dfe5ef] pb-[32px] mb-[32px]">
                  <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
                    {t.statsPrecioPromedio}
                  </p>
                  <div className="flex items-baseline gap-[6px] mt-[10px]">
                    <span className="font-heading font-normal text-[clamp(36px,4vw,60px)] 2xl:text-[50px] text-[#0c1834] tracking-[-1.8px] leading-none">
                      {formatPrice(avgPricePerM2)}
                    </span>
                    <span className="font-heading font-normal text-[clamp(18px,2vw,30px)] text-[#0c1834] tracking-[-0.9px] leading-none">
                      /m²
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-[4px] border-b border-[#dfe5ef] pb-[32px] mb-[32px]">
                <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
                  {t.statsPropiedadesActivas}
                </p>
                <div className="flex items-baseline gap-[6px] mt-[10px]">
                  <span className="font-heading font-normal text-[clamp(36px,4vw,60px)] 2xl:text-[50px] text-[#0c1834] tracking-[-1.8px] leading-none">
                    {properties.length}
                  </span>
                  <span className="font-heading font-normal text-[clamp(18px,2vw,30px)] text-[#0c1834] tracking-[-0.9px] leading-none">
                    {properties.length === 1 ? t.statsPropiedadSingular : t.statsPropiedadPlural}
                  </span>
                </div>
              </div>

              {mostCommonType && (
                <div className="flex flex-col gap-[4px] border-b border-[#dfe5ef] pb-[32px]">
                  <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
                    {t.statsTipoMasDisponible}
                  </p>
                  <div className="flex items-baseline gap-[6px] mt-[10px]">
                    <span className="font-heading font-normal text-[clamp(36px,4vw,60px)] 2xl:text-[50px] text-[#0c1834] tracking-[-1.8px] leading-none">
                      {mostCommonType.count}
                    </span>
                    <span className="font-heading font-normal text-[clamp(18px,2vw,30px)] text-[#0c1834] tracking-[-0.9px] leading-none">
                      {mostCommonType.cat.h1.split(" en Panama")[0].split(" en Panamá")[0]}
                    </span>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
      )}

      {/* LISTINGS */}
      {properties.length > 0 && (
        <section className="bg-white border-t border-[#dfe5ef] px-[24px] xl:px-[60px] 2xl:px-[160px] py-[80px] xl:py-[130px]">
          <div className="max-w-[1440px] mx-auto">
            <NeighborhoodListingsSection
              ventaProps={ventaProps}
              alquilerProps={alquilerProps}
              allMapMarkers={mapProps}
              neighborhoodName={neighborhood.name}
              neighborhoodSlug={params.slug}
              categoryLinks={categoryLinks}
              locale="en"
            />
          </div>
        </section>
      )}

      {/* OTHER NEIGHBORHOODS */}
      {nearbyCards.length > 0 && (
        <NeighborhoodCards
          neighborhoods={nearbyCards}
          eyebrow={t.otrosBarriosEyebrow}
          heading={t.otrosBarriosHeading}
          sectionClassName="bg-[#f9f9f9] border-t border-[#dfe5ef]"
          locale="en"
        />
      )}

      {/* CTA */}
      <section className="bg-[#121e3e] px-[24px] xl:px-[60px] 2xl:px-[160px] py-[80px] xl:py-[120px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-[24px]">
          <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase">
            {t.ctaEyebrow}
          </p>
          <h2 className="font-heading font-normal text-[clamp(36px,5vw,64px)] 2xl:text-[54px] text-white tracking-[-2px] leading-none max-w-[800px]">
            {t.ctaHeadingPrefix}
            <span className="italic">{t.ctaHeadingSuffixItalicTpl(neighborhood.name)}</span>
          </h2>
          <p className="font-body font-light text-[16px] text-white/60 leading-relaxed max-w-[520px]">
            {t.ctaBody}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-[8px]">
            <a
              href={whatsappLink(waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#00b424] text-white font-body font-medium text-[15px] px-5 py-2.5 h-[42px] flex items-center justify-center gap-[8px] hover:bg-[#009e1f] transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t.ctaWhatsapp}
            </a>
            <Link
              href="/en/contact/"
              className="w-full sm:w-auto bg-white text-[#0d1835] font-body font-medium text-[15px] px-5 py-2.5 h-[42px] flex items-center justify-center hover:bg-white/90 transition-colors"
            >
              {t.ctaContactenos}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
