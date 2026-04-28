import Link from "next/link";
import Image from "next/image";
import { NEIGHBORHOOD_IMAGES } from "@/lib/neighborhoods";

export interface NeighborhoodCardData {
  name: string;
  slug: string;
  image: string;
  avgPrice: string;
  count: number;
}

const DEFAULT_NEIGHBORHOODS: NeighborhoodCardData[] = [
  { name: "Punta Pacífica",  slug: "punta-pacifica",  image: NEIGHBORHOOD_IMAGES["punta-pacifica"],  avgPrice: "$3,200/m²", count: 0 },
  { name: "Punta Paitilla",  slug: "punta-paitilla",  image: NEIGHBORHOOD_IMAGES["punta-paitilla"],  avgPrice: "$2,900/m²", count: 0 },
  { name: "Avenida Balboa",  slug: "avenida-balboa",  image: NEIGHBORHOOD_IMAGES["avenida-balboa"],  avgPrice: "$2,600/m²", count: 0 },
  { name: "Costa del Este",  slug: "costa-del-este",  image: NEIGHBORHOOD_IMAGES["costa-del-este"],  avgPrice: "$2,400/m²", count: 0 },
];

const COUNT_KEYS: Record<string, string> = {
  "punta-pacifica": "puntaPacifica",
  "punta-paitilla": "puntaPaitilla",
  "avenida-balboa": "avenidaBalboa",
  "costa-del-este": "costaDelEste",
};

interface Props {
  /** Live counts from Sanity (homepage usage) */
  counts?: Record<string, number>;
  /** Override full neighborhood data (barrios page usage) */
  neighborhoods?: NeighborhoodCardData[];
  eyebrow?: string;
  heading?: string;
  sectionClassName?: string;
}

export default function NeighborhoodCards({
  counts,
  neighborhoods,
  eyebrow = "Los mejores barrios",
  heading = "Explorar por Ubicación",
  sectionClassName = "bg-white",
}: Props) {
  const items: NeighborhoodCardData[] = neighborhoods
    ?? DEFAULT_NEIGHBORHOODS.map((n) => ({
        ...n,
        count: counts?.[COUNT_KEYS[n.slug]] ?? 0,
      }));

  return (
    <section className={`${sectionClassName} py-[80px] px-[30px] xl:px-[60px] 2xl:px-[160px]`}>
      <div className="flex flex-col gap-8 max-w-[1440px] mx-auto">

        {/* Header — centered */}
        <div className="flex flex-col gap-2 items-center text-center">
          <p className="font-body font-medium text-[#737b8c] text-[12px] uppercase tracking-[5px]">
            {eyebrow}
          </p>
          <h2 className="font-heading font-normal text-[#0c1834] text-[clamp(32px,3vw,44px)] 2xl:text-[40px] tracking-[-1.8px] leading-none">
            {heading}
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {items.map((n) => (
            <Link
              key={n.slug}
              href={`/barrios/${n.slug}/`}
              className="group relative overflow-hidden h-[435px] lg:h-auto lg:aspect-[326/435] block"
            >
              <Image
                src={n.image}
                alt={`Propiedades en ${n.name}`}
                fill
                priority
                quality={90}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(29,33,43,0.8)] via-[rgba(29,33,43,0.2)] to-[rgba(29,33,43,0)]" />

              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                <h3 className="font-body font-semibold text-white text-[25px] leading-tight tracking-[-0.25px]">
                  {n.name}
                </h3>
                <div className="flex gap-2.5 pt-1">
                  {n.avgPrice && (
                    <div className="flex flex-col gap-2 items-start">
                      <span className="font-body font-normal text-white text-[12px] leading-[16px]">Precio promedio</span>
                      <span className="bg-white/20 font-body font-semibold text-white text-[16px] leading-normal px-[5px] py-[3px] w-fit">
                        {n.avgPrice}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 items-start">
                    <span className="font-body font-normal text-white text-[12px] leading-[16px]">Propiedades</span>
                    <span className="bg-white/20 font-body font-semibold text-white text-[16px] leading-normal px-[5px] py-[3px] w-fit">
                      {n.count}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
