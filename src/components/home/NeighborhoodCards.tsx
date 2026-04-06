import Link from "next/link";
import Image from "next/image";

const NEIGHBORHOODS = [
  {
    name: "Punta Pacífica",
    slug: "punta-pacifica",
    countKey: "puntaPacifica",
    image: "/barrio-punta-pacifica.png",
    avgPrice: "$3,200/m²",
  },
  {
    name: "Punta Paitilla",
    slug: "punta-paitilla",
    countKey: "puntaPaitilla",
    image: "/barrio-punta-paitilla.png",
    avgPrice: "$2,900/m²",
  },
  {
    name: "Avenida Balboa",
    slug: "avenida-balboa",
    countKey: "avenidaBalboa",
    image: "/barrio-avenida-balboa.png",
    avgPrice: "$2,600/m²",
  },
  {
    name: "Costa del Este",
    slug: "costa-del-este",
    countKey: "costaDelEste",
    image: "/barrio-costa-del-este.png",
    avgPrice: "$2,400/m²",
  },
];

interface Props {
  counts: Record<string, number>;
}

export default function NeighborhoodCards({ counts }: Props) {
  const visible = NEIGHBORHOODS.filter(
    (n) => n.slug === "costa-del-este" || (counts[n.countKey] ?? 0) > 0
  );
  if (visible.length === 0) return null;

  return (
    <section className="bg-white py-[130px] px-[30px] xl:px-[260px]">
      <div className="flex flex-col gap-12 max-w-[1400px] mx-auto">

        {/* Header — centered */}
        <div className="flex flex-col gap-3 items-center text-center">
          <p className="font-body font-medium text-[#737b8c] text-[12px] uppercase tracking-[5px]">
            Los mejores barrios
          </p>
          <h2 className="font-heading font-normal text-[#0c1834] text-[clamp(50px,4vw,60px)] tracking-[-0.03em] leading-[1.1]">
            Explorar por Ubicación
          </h2>
        </div>

        {/* Cards grid — 1 col on mobile, 4 on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {visible.map((n) => (
            <Link
              key={n.slug}
              href={`/barrios/${n.slug}/`}
              className="group relative overflow-hidden h-[435px] lg:h-auto lg:aspect-[326/435] block"
            >
              {/* Photo */}
              <Image
                src={n.image}
                alt={`Propiedades en ${n.name}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 25vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(29,33,43,0.8)] via-[rgba(29,33,43,0.2)] to-[rgba(29,33,43,0)]" />

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                <h3 className="font-body font-semibold text-white text-[25px] leading-tight tracking-[-0.25px]">
                  {n.name}
                </h3>

                {/* Stat badges */}
                <div className="flex gap-2.5 pt-1">
                  <div className="flex flex-col gap-2 items-start">
                    <span className="font-body font-normal text-white text-[12px] leading-[16px]">
                      Precio promedio
                    </span>
                    <span className="bg-white/20 font-body font-semibold text-white text-[16px] leading-normal px-[5px] py-[3px] w-fit">
                      {n.avgPrice}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <span className="font-body font-normal text-white text-[12px] leading-[16px]">
                      Propiedades
                    </span>
                    <span className="bg-white/20 font-body font-semibold text-white text-[16px] leading-normal px-[5px] py-[3px] w-fit">
                      {counts[n.countKey] ?? 0}
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
