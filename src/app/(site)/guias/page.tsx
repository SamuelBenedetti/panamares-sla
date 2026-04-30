import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";
import { allGuidesQuery } from "@/sanity/lib/queries";
import type { Guide } from "@/lib/types";
import GuiasPageClient from "@/components/home/GuiasPageClient";
import { breadcrumbSchema } from "@/lib/jsonld";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guías de Bienes Raíces en Panama",
  description:
    "Guías y recursos para comprar, alquilar e invertir en bienes raíces en Panama. Consejos de expertos del mercado panameño.",
  alternates: { canonical: canonical("/guias") },
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

      {/* ── Header — mismo patrón que el resto del sitio ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[32px] xl:pt-[40px] pb-[20px] xl:pb-[28px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[16px]">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-[8px] flex-wrap">
            <Link href="/" className="font-body font-normal text-[16px] text-[#5a6478] tracking-[-0.32px] hover:text-[#0c1834] transition-colors">
              Inicio
            </Link>
            <ChevronRight size={13} className="text-[#5a6478]" />
            <span className="font-body font-medium text-[16px] text-[#0c1834] tracking-[-0.32px]">
              Guías
            </span>
          </nav>

          {/* H1 + contador */}
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-heading font-normal text-[clamp(36px,4vw,60px)] text-[#0c1834] leading-none tracking-[-1.8px]">
              Guías de Bienes Raíces en Panama
            </h1>
            {guides.length > 0 && (
              <p className="font-body text-[14px] text-[#5a6478] leading-none">
                <span className="font-semibold text-[#0c1834]">{guides.length}</span> guías disponibles
              </p>
            )}
          </div>

        </div>
      </section>

      {/* ── Guides grid ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[28px] pb-[80px] xl:pb-[100px]">
        <div className="max-w-[1440px] mx-auto">
          <GuiasPageClient guides={guides} />
        </div>
      </section>
    </>
  );
}
