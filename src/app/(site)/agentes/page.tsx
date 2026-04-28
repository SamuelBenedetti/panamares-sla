import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";
import { allAgentsQuery } from "@/sanity/lib/queries";
import type { Agent } from "@/lib/types";
import AgentGrid from "@/components/agents/AgentGrid";
import { breadcrumbSchema } from "@/lib/jsonld";
import { BASE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Nuestros Asesores Inmobiliarios",
  description:
    "Conoce al equipo de asesores de Panamares. Expertos en el mercado inmobiliario de Panamá City con años de experiencia en Punta Pacífica, Punta Paitilla y las mejores zonas de la capital.",
  alternates: { canonical: `${BASE_URL}/agentes/` },
};

export default async function AgentesPage() {
  const agents = await sanityFetch<Agent[]>(allAgentsQuery);

  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Asesores", url: "/agentes/" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ── Header — mismo patrón que ListingPageHeader ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[32px] xl:pt-[40px] pb-[20px] xl:pb-[28px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[16px]">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-[8px] flex-wrap">
            <Link href="/" className="font-body font-normal text-[16px] text-[#5a6478] tracking-[-0.32px] hover:text-[#0c1834] transition-colors">
              Inicio
            </Link>
            <ChevronRight size={13} className="text-[#5a6478]" />
            <span className="font-body font-medium text-[16px] text-[#0c1834] tracking-[-0.32px]">
              Asesores
            </span>
          </nav>

          {/* H1 + contador */}
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-heading font-normal text-[clamp(36px,4vw,60px)] text-[#0c1834] leading-none tracking-[-1.8px]">
              Asesores Inmobiliarios en Panama
            </h1>
            {agents.length > 0 && (
              <p className="font-body text-[14px] text-[#5a6478] leading-none">
                <span className="font-semibold text-[#0c1834]">{agents.length}</span> asesores disponibles
              </p>
            )}
          </div>

        </div>
      </section>

      {/* ── Grid ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[28px] pb-[80px] xl:pb-[100px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[40px]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px]">
            <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
              Equipo Panamares
            </p>
            <Link
              href="/contacto/"
              className="inline-flex items-center gap-[8px] font-body font-medium text-[12px] text-[#5a6478] tracking-[1.2px] uppercase hover:text-[#0c1834] transition-colors whitespace-nowrap"
            >
              Hablar con el equipo
              <ArrowRight size={13} />
            </Link>
          </div>

          <AgentGrid agents={agents} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#121e3e] px-[30px] xl:px-[60px] 2xl:px-[160px] py-[70px] xl:py-[90px]">
        <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[32px]">
          <div className="flex flex-col gap-[14px]">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              ¿Eres agente independiente?
            </p>
            <h2 className="font-heading font-normal text-[clamp(28px,3.2vw,46px)] text-white tracking-[-1.6px] leading-none">
              Únete al equipo Panamares
            </h2>
            <p className="font-body font-light text-[15px] text-white/60 leading-relaxed max-w-[480px]">
              Si eres agente inmobiliario independiente y quieres crecer con nosotros, escríbenos. Siempre buscamos talento.
            </p>
          </div>
          <Link
            href="/contacto/"
            className="inline-flex items-center justify-center gap-[8px] bg-white w-full xl:w-fit px-[32px] py-[15px] font-body font-medium text-[14px] text-[#0c1834] tracking-[1.4px] uppercase hover:bg-[#f9f9f9] transition-colors whitespace-nowrap"
          >
            Contáctenos
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
