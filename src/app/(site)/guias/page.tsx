import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { allGuidesQuery } from "@/sanity/lib/queries";
import type { Guide } from "@/lib/types";
import GuiasPageClient from "@/components/home/GuiasPageClient";
import { breadcrumbSchema } from "@/lib/jsonld";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
      <section className="bg-[#0c1834] px-[30px] xl:px-[260px] pt-[120px] xl:pt-[160px] pb-[60px] xl:pb-[80px]">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-[24px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-[8px]">
            <Link href="/" className="font-body text-[13px] text-white/40 hover:text-white/70 transition-colors">Inicio</Link>
            <ChevronRight size={12} className="text-white/25" />
            <span className="font-body text-[13px] text-white/70">Guías</span>
          </nav>

          <div className="flex flex-col gap-[16px] max-w-[720px]">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              Recursos
            </p>
            <h1 className="flex flex-col text-white">
              <span className="font-heading font-normal text-[clamp(36px,4.5vw,64px)] leading-none tracking-[-1.8px]">
                Guías de Bienes Raíces
              </span>
              <span className="font-heading font-medium italic text-[clamp(40px,5vw,70px)] leading-none tracking-[-2px]">
                en Panama
              </span>
            </h1>
            <p className="font-body font-light text-[16px] xl:text-[17px] text-white/70 leading-relaxed max-w-[520px] pt-[4px]">
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
