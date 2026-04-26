import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, ShieldCheck, Star, TrendingUp, MapPin, Award } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/client";
import { allAgentsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { Agent } from "@/lib/types";
import { breadcrumbSchema } from "@/lib/jsonld";
import { BASE_URL } from "@/lib/config";
import PropertyMap from "@/components/properties/PropertyMap";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description:
    "Panamares es una agencia inmobiliaria de lujo en Panama City. Conoce nuestro equipo y nuestra trayectoria en el mercado panameño.",
  alternates: {
    canonical: `${BASE_URL}/sobre-nosotros/`,
  },
};

export default async function SobreNosotrosPage() {
  const agents = await sanityFetch<Agent[]>(allAgentsQuery);

  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Sobre Nosotros", url: "/sobre-nosotros/" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* ── Header ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[20px] 2xl:px-[120px] pt-[32px] xl:pt-[40px] pb-[80px] xl:pb-[112px]">
        <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-[20px] max-w-[768px]">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-[8px] flex-wrap">
            <Link href="/" className="font-body font-normal text-[16px] text-[#5a6478] tracking-[-0.32px] hover:text-[#0c1834] transition-colors">
              Inicio
            </Link>
            <ChevronRight size={13} className="text-[#5a6478]" />
            <span className="font-body font-medium text-[16px] text-[#0c1834] tracking-[-0.32px]">
              Sobre Nosotros
            </span>
          </nav>

          {/* Eyebrow */}
          <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
            Quiénes somos
          </p>

          {/* H1 */}
          <h1 className="flex flex-col gap-[3px] text-[#0c1834]">
            <span className="font-heading font-normal text-[clamp(38px,5vw,60px)] leading-none tracking-[-1.8px]">
              Más de 15 años
            </span>
            <span className="font-heading font-medium italic text-[clamp(44px,6vw,70px)] leading-none tracking-[-2.1px]">
              conectando sueños
            </span>
            <span className="font-heading font-normal text-[clamp(38px,5vw,60px)] leading-none tracking-[-1.8px]">
              con propiedades
            </span>
          </h1>

          {/* Body */}
          <p className="font-body text-[#5a6478] text-[18px] xl:text-[20px] leading-relaxed max-w-[576px] pt-[11px]">
            <span className="font-semibold">Panamares nació con una convicción: que el mercado inmobiliario de lujo en Panamá </span>
            <span className="font-light">merecía una representación diferente, más honesta, más elegante, más humana.</span>
          </p>

        </div>
        </div>
      </section>

      {/* ── Nuestra oficina ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[20px] 2xl:px-[120px]">
        <div className="max-w-[1600px] mx-auto">
          <div className="relative aspect-[390/720] xl:aspect-auto xl:h-[720px] overflow-hidden flex flex-col justify-end p-[30px] xl:p-0">
            <Image
              src="/oficina.jpg"
              alt="Nuestra oficina en Punta Pacífica, Ciudad de Panamá"
              fill
              className="object-cover"
              sizes="(max-width: 1920px) 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,24,53,0.6)] to-transparent mix-blend-multiply" />
            <div className="relative flex flex-col gap-[10px] items-center text-center xl:items-start xl:text-left xl:absolute xl:bottom-0 xl:left-0 xl:px-[40px] xl:py-[30px]">
              <p className="font-body font-normal text-[12px] text-white tracking-[5px] uppercase leading-4">
                Nuestra oficina
              </p>
              <p className="font-heading font-normal text-[30px] leading-[32px] tracking-[-0.9px] text-[#faf8f5]">
                Punta Pacífica,<br className="xl:hidden" />{" "}
                <span>Ciudad de Panamá</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-[#0d1835] px-[30px] xl:px-[20px] 2xl:px-[120px] py-[50px] xl:py-[70px]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[50px] xl:gap-0">
            {[
              { value: "15+",    label: "Años en el Mercado" },
              { value: "1,200+", label: "Propiedades vendidas" },
              { value: "$850M+", label: "En transacciones" },
              { value: "98%",    label: "Clientes Satisfechos" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-[10px] items-center">
                <p className="font-heading font-medium text-[clamp(44px,4vw,60px)] text-white tracking-[-1.8px] leading-none">
                  {value}
                </p>
                <p className="font-body font-medium text-[13px] xl:text-[14px] text-white/50 uppercase tracking-wide whitespace-nowrap text-center">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nuestra ubicación ── */}
      <section className="bg-white px-[30px] xl:px-[20px] 2xl:px-[120px] py-[70px] xl:py-[96px] border-t border-[#dfe5ef]">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
              Encuéntranos
            </p>
            <h2 className="font-heading font-normal text-[clamp(28px,3vw,44px)] text-[#0c1834] tracking-[-1.2px] leading-none">
              Torre Oceánica, Piso 18 — Punta Pacífica
            </h2>
          </div>
          <div className="border border-[#dfe5ef] overflow-hidden h-[320px]">
            <PropertyMap
              lat={8.9936}
              lng={-79.5197}
              title="Panamares — Torre Oceánica, Punta Pacífica"
              className="w-full h-[320px]"
            />
          </div>
        </div>
      </section>

      {/* ── Nuestra Historia ── */}
      <section className="bg-white px-[30px] xl:px-[20px] 2xl:px-[120px] py-[70px] xl:py-[112px]">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-[40px] xl:gap-[48px]">

          {/* Eyebrow + Grid grouped close together */}
          <div className="flex flex-col gap-[8px]">

            {/* Eyebrow — above the grid */}
            <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
              Nuestra historia
            </p>

            {/* Grid: heading + paragraphs left | cards right — bottoms aligned */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px] xl:gap-[64px] items-end">

              {/* Left — heading + paragraphs, bottom-aligned with cards */}
              <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col text-[#0c1834]">
                  <p className="font-heading font-normal text-[clamp(36px,4vw,60px)] leading-none tracking-[-1.8px]">Fundada sobre</p>
                  <p className="font-heading font-medium italic text-[clamp(36px,4vw,60px)] leading-none tracking-[-1.8px]">la confianza</p>
                </div>
                <div className="flex flex-col gap-[20px] pt-[8px]">
                  <p className="font-body font-medium text-[15px] xl:text-[17px] text-[#5a6478] leading-relaxed">
                    Panamares fue fundada en 2009 por Valeria Moreno, con la visión de crear una firma que pusiera al cliente, no la comisión, en el centro de cada decisión.
                  </p>
                  <p className="font-body font-light text-[15px] xl:text-[17px] text-[#5a6478] leading-relaxed">
                    A lo largo de más de una década, hemos construido una reputación basada en la transparencia, el asesoramiento patrimonial honesto y un conocimiento profundo del mercado panameño.
                  </p>
                  <p className="font-body font-light text-[15px] xl:text-[17px] text-[#5a6478] leading-relaxed">
                    Hoy somos un equipo de 18 asesores especializados, con presencia en los principales corredores residenciales y comerciales de{" "}
                    <span className="font-medium text-[#0c1834]">Ciudad de Panamá: Punta Pacífica, Punta Paitilla, Avenida Balboa y Costa del Este.</span>
                  </p>
                </div>
              </div>

              {/* Right — 2×2 grid of fixed-height cards */}
              <div className="flex flex-col gap-[30px] lg:grid lg:grid-cols-2 lg:grid-rows-[210px_210px] lg:gap-[24px]">
                {[
                  {
                    icon: <ShieldCheck size={20} className="text-white" />,
                    title: "Confianza absoluta",
                    body: <>Cada transacción se gestiona con total <span className="font-medium">transparencia</span>, ética y cuidado hacia nuestros clientes.</>,
                  },
                  {
                    icon: <Star size={20} className="text-white" />,
                    title: "Servicio premium",
                    body: "Atención personalizada desde el primer contacto hasta la firma final, sin intermediarios.",
                  },
                  {
                    icon: <TrendingUp size={20} className="text-white" />,
                    title: "Visión de inversión",
                    body: "Asesoramos con datos de mercado reales para asegurar la mejor decisión patrimonial.",
                  },
                  {
                    icon: <MapPin size={20} className="text-white" />,
                    title: "Conocimiento local",
                    body: "Profundo expertise en cada barrio de Ciudad de Panamá y sus dinámicas de valorización.",
                  },
                ].map(({ icon, title, body }) => (
                  <div key={title} className="relative h-[210px] border border-[#dfe5ef] overflow-hidden">
                    <div className="absolute top-[24px] left-[24px] w-[40px] h-[40px] bg-[#0c1834] flex items-center justify-center">
                      {icon}
                    </div>
                    <p className="absolute top-[80px] left-[24px] right-[24px] font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">{title}</p>
                    <p className="absolute top-[115px] left-[24px] right-[24px] font-body font-light text-[14px] text-[#5a6478] leading-5">{body}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>{/* end eyebrow+grid group */}

          {/* CTA — below grid */}
          <div>
            <Link
              href="/propiedades-en-venta/"
              className="inline-flex items-center gap-[8px] border-b border-[#0c1834] pb-[5px] hover:opacity-60 transition-opacity"
            >
              <span className="font-body font-medium text-[14px] text-[#0c1834] uppercase tracking-[1.4px]">Ver nuestras propiedades</span>
              <ArrowRight size={13} className="text-[#0c1834]" />
            </Link>
          </div>

        </div>
      </section>
      {/* ── El equipo ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[20px] 2xl:px-[120px] py-[70px] xl:py-[96px]">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-[56px] items-center">

          {/* Header */}
          <div className="flex flex-col gap-[12px] items-center">
            <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4 text-center">
              El equipo
            </p>
            <p className="font-heading font-normal text-[clamp(36px,4vw,60px)] text-[#0c1834] tracking-[-1.8px] leading-none text-center">
              Asesores de confianza
            </p>
          </div>

          {/* Agent cards */}
          <div className="flex flex-wrap justify-center gap-[32px]">
            {agents.map((agent) => {
              const photoUrl = agent.photo
                ? urlFor(agent.photo).width(560).height(740).fit("crop").url()
                : null;
              return (
                <Link
                  key={agent._id}
                  href={`/agentes/${agent.slug.current}`}
                  className="flex flex-col gap-[20px] items-start w-[277px] group"
                >
                  <div className="relative w-full overflow-hidden bg-[#0c1834]" style={{ aspectRatio: "277/370" }}>
                    {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={agent.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="277px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-heading text-[64px] text-white/20 leading-none select-none">
                        {agent.name[0]}
                      </span>
                    </div>
                  )}
                  </div>
                  <div className="flex flex-col gap-[10px] items-center w-full">
                    <p className="font-heading font-normal text-[30px] text-[#0d1835] tracking-[-0.9px] leading-7 text-center w-full">
                      {agent.name}
                    </p>
                    {agent.role && (
                      <p className="font-body font-semibold text-[12px] text-[#5a6478] tracking-[1.2px] uppercase leading-4 text-center w-full">
                        {agent.role}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>
      {/* ── Reconocimientos ── */}
      <section className="bg-white px-[30px] xl:px-[20px] 2xl:px-[120px] py-[70px] xl:py-[96px]">
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row xl:items-end xl:justify-between gap-[48px] xl:gap-[40px]">

          {/* Left — icon + heading */}
          <div className="flex flex-col gap-[15px]">
            <Award size={52} strokeWidth={1} className="text-[#0c1834]" />
            <div className="flex flex-col text-[#0c1834] tracking-[-1.8px]">
              <p className="font-heading font-normal text-[clamp(34px,4vw,60px)] leading-none">Reconocida como la</p>
              <p className="font-heading font-medium italic text-[clamp(34px,4vw,60px)] leading-none">mejor firma inmobiliaria</p>
            </div>
          </div>

          {/* Right — 2×2 award items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[24px] gap-y-[24px] pb-[10px]">
            {[
              { title: "Premio Excelencia Inmobiliaria", sub: "Panamá 2023" },
              { title: "Top 5 Agencias de Lujo",        sub: "LAMag 2022" },
              { title: "Mejor Servicio al Cliente",      sub: "ACOBIR 2021" },
              { title: "Certificación RE/MAX Platinum",  sub: "2019–2024" },
            ].map(({ title, sub }) => (
              <div key={title} className="flex gap-[12px] items-start">
                <div className="w-[4px] min-h-[40px] self-stretch bg-[#737b8c] rounded-full mt-[4px]" />
                <div className="flex flex-col">
                  <p className="font-body font-semibold text-[16px] text-[#0c1834] leading-normal">
                    {title} —
                  </p>
                  <p className="font-body font-light text-[16px] text-[#0c1834] leading-normal">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      {/* ── CTA contacto ── */}
      <section className="relative bg-[#121e3e] px-[30px] xl:px-[20px] 2xl:px-[120px] py-[80px] xl:py-[130px] overflow-hidden">

        {/* Palm tree — left */}
        <div className="absolute left-0 top-0 bottom-0 w-[300px] pointer-events-none select-none hidden lg:block">
          <Image src="/palm-left.svg" alt="" fill className="object-cover object-right" sizes="300px" />
        </div>

        {/* Palm tree — right (flipped) */}
        <div className="absolute right-0 top-0 bottom-0 w-[300px] pointer-events-none select-none hidden lg:block" style={{ transform: "scaleX(-1)" }}>
          <Image src="/palm-right.svg" alt="" fill className="object-cover object-left" sizes="300px" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto flex flex-col gap-[16px] items-center">

          {/* Eyebrow + Heading */}
          <div className="flex flex-col gap-[12px] items-center">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4 text-center">
              ¿Tienes alguna consulta?
            </p>
            <p className="font-heading font-normal text-[clamp(36px,4vw,60px)] text-white tracking-[-1.8px] leading-none text-center">
              Estamos para ayudarte
            </p>
          </div>

          {/* Body */}
          <p className="font-body text-[16px] text-[#faf8f5] text-center leading-relaxed max-w-[448px] pb-[24px] pt-[8px]">
            <span className="font-light">Contacta directamente con uno de nuestros asesores </span>
            <span className="font-semibold">y recibe orientación personalizada sin compromisos.</span>
          </p>

          {/* CTA */}
          <Link
            href="/contacto/"
            className="bg-white h-[46px] flex items-center justify-center px-[24px] font-body font-medium text-[16px] text-[#0d1835] hover:bg-[#faf8f5] transition-colors whitespace-nowrap"
          >
            Contáctenos Ahora
          </Link>

        </div>
      </section>
    </>
  );
}
