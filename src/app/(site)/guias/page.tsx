import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { allGuidesQuery } from "@/sanity/lib/queries";
import type { Guide } from "@/lib/types";
import GuiasPageClient from "@/components/home/GuiasPageClient";
import { breadcrumbSchema } from "@/lib/jsonld";

const BASE_URL = "https://panamares.com";

export const metadata: Metadata = {
  title: "Guías de Bienes Raíces en Panama | Panamares",
  description:
    "Guías y recursos para comprar, alquilar e invertir en bienes raíces en Panama. Consejos de expertos del mercado panameño.",
  alternates: { canonical: `${BASE_URL}/guias/` },
};

export default async function GuiasPage() {
  const guides = await sanityFetch<Guide[]>(allGuidesQuery);

  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Guías", url: "/guias/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ── Hero ── */}
      <section className="relative flex items-end min-h-[70vh] bg-[#0c1834] overflow-hidden -mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://www.figma.com/api/mcp/asset/46c62f80-93f2-48ab-a542-c8b9722522e1')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(29,33,43,0.4)] via-[rgba(29,33,43,0.3)] to-[rgba(29,33,43,0.85)]" />

        <div className="relative z-10 w-full px-[30px] xl:px-[260px] pb-[70px] xl:pb-[90px] pt-[140px]">
          <div className="flex flex-col gap-[20px] max-w-[720px]">
            <p className="font-body font-medium text-[12px] text-white/60 tracking-[5px] uppercase leading-4">
              Recursos
            </p>
            <div className="flex flex-col text-white">
              <span className="font-heading font-normal text-[clamp(40px,5vw,68px)] leading-none tracking-[-2px]">
                Guías de Bienes Raíces
              </span>
              <span className="font-heading font-medium italic text-[clamp(44px,6vw,76px)] leading-none tracking-[-2.3px]">
                en Panama
              </span>
            </div>
            <p className="font-body font-light text-[16px] xl:text-[18px] text-white/70 leading-relaxed max-w-[560px] pt-[8px]">
              Todo lo que necesitas saber para comprar, alquilar e invertir en Panama City — escrito por nuestros expertos.
            </p>
          </div>
        </div>
      </section>

      {/* ── Guides grid ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[260px] py-[60px] xl:py-[100px]">
        <div className="max-w-[1400px] mx-auto">
          <GuiasPageClient guides={guides} />
        </div>
      </section>
    </>
  );
}
