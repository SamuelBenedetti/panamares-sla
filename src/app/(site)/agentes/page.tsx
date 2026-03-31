import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";
import { allAgentsQuery } from "@/sanity/lib/queries";
import type { Agent } from "@/lib/types";
import AgentGrid from "@/components/agents/AgentGrid";

const BASE_URL = "https://panamares.com";

export const metadata: Metadata = {
  title: "Nuestros Asesores Inmobiliarios | Panamares",
  description:
    "Conoce al equipo de asesores de Panamares. Expertos en el mercado inmobiliario de Panamá City con años de experiencia en Punta Pacífica, Punta Paitilla y las mejores zonas de la capital.",
  alternates: { canonical: `${BASE_URL}/agentes/` },
};

export default async function AgentesPage() {
  const agents = await sanityFetch<Agent[]>(allAgentsQuery);

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#0c1834] px-[30px] xl:px-[260px] pt-[120px] xl:pt-[160px] pb-[70px] xl:pb-[90px]">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-[20px] max-w-[720px]">
          <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
            El equipo
          </p>
          <div className="flex flex-col text-white">
            <span className="font-heading font-normal text-[clamp(40px,5vw,68px)] leading-none tracking-[-2px]">
              Conoce a nuestros
            </span>
            <span className="font-heading font-medium italic text-[clamp(44px,6vw,76px)] leading-none tracking-[-2.3px]">
              asesores
            </span>
          </div>
          <p className="font-body font-light text-[16px] xl:text-[18px] text-white/70 leading-relaxed max-w-[520px] pt-[8px]">
            Un equipo de profesionales con años de experiencia en el mercado inmobiliario panameño, listos para acompañarte en cada paso.
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[260px] py-[80px] xl:py-[100px]">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-[48px]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
                Equipo Panamares
              </p>
              <h2 className="font-heading font-normal text-[clamp(28px,3vw,42px)] text-[#0c1834] tracking-[-1.2px] leading-none">
                {agents.length > 0 ? `${agents.length} asesores disponibles` : "Nuestros asesores"}
              </h2>
            </div>
            <Link
              href="/contacto/"
              className="inline-flex items-center gap-[8px] font-body font-medium text-[12px] text-[#737b8c] tracking-[1.2px] uppercase hover:text-[#0c1834] transition-colors whitespace-nowrap"
            >
              Hablar con el equipo
              <ArrowRight size={13} />
            </Link>
          </div>

          <AgentGrid agents={agents} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#121e3e] px-[30px] xl:px-[260px] py-[70px] xl:py-[90px]">
        <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[32px]">
          <div className="flex flex-col gap-[14px]">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              ¿Quieres formar parte?
            </p>
            <h2 className="font-heading font-normal text-[clamp(32px,4vw,54px)] text-white tracking-[-1.6px] leading-none">
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
