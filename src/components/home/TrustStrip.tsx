import { sanityFetch } from "@/sanity/lib/client";
import { siteStatsQuery } from "@/sanity/lib/queries";

interface Stats {
  activeListings: number;
  agents: number;
}

export default async function TrustStrip() {
  const stats = await sanityFetch<Stats>(siteStatsQuery);

  const items = [
    { value: `${stats?.activeListings ?? "261"}`, label: "Propiedades Activas" },
    { value: `${stats?.agents ?? "18"}`, label: "Agentes Especializados" },
    { value: "15+", label: "Años en el Mercado" },
    { value: "98%", label: "Clientes Satisfechos" },
  ];

  return (
    <section className="bg-[#f9f9f9] py-[36px] px-[30px] xl:px-[60px] 2xl:px-[160px]">
      <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-[36px] lg:gap-0 max-w-[1440px] mx-auto">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-[8px] items-center">
            <p className="font-heading text-[#0d1835] text-[44px] md:text-[38px] leading-[38px] tracking-[-1.8px] font-medium">
              {item.value}
            </p>
            <p className="font-body font-medium text-[#5a6478] text-[14px] md:text-[12px] uppercase tracking-wide text-center">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
