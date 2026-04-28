import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle, ArrowRight, ChevronRight } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/client";
import { agentBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { Agent } from "@/lib/types";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { agentSchema, breadcrumbSchema } from "@/lib/jsonld";
import { BASE_URL, whatsappLink } from "@/lib/config";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = await sanityFetch<Agent | null>(agentBySlugQuery, { slug: params.slug });
  if (!agent) return {};
  const ogImage = agent.photo
    ? urlFor(agent.photo).width(1200).height(630).url()
    : undefined;
  return {
    title: `${agent.name} — Asesor Inmobiliario`,
    description: `${agent.name}${agent.role ? `, ${agent.role}` : ""} en Panamares. Conoce su trayectoria y propiedades disponibles en Panama City.`,
    alternates: { canonical: `${BASE_URL}/agentes/${params.slug}/` },
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function AgentProfilePage({ params }: Props) {
  const agent = await sanityFetch<Agent | null>(agentBySlugQuery, { slug: params.slug });
  if (!agent) notFound();

  const photoUrl = agent.photo
    ? urlFor(agent.photo).width(600).height(700).url()
    : null;

  const waMessage = `Hola ${agent.name}, me interesa conocer más sobre sus propiedades en Panamares.`;
  const waHref = whatsappLink(waMessage);
  const listingCount = agent.properties?.length ?? 0;

  const jsonLdAgent = agentSchema(agent);
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio", url: "/" },
    { name: "Agentes", url: "/agentes/" },
    { name: agent.name, url: `/agentes/${params.slug}/` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAgent) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* ── Hero ── */}
      <section className="bg-[#0c1834] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[110px] xl:pt-[140px] pb-[60px] xl:pb-[80px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[24px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-[8px]">
            <Link href="/" className="font-body text-[13px] text-white/40 hover:text-white/70 transition-colors">Inicio</Link>
            <ChevronRight size={12} className="text-white/25" />
            <Link href="/agentes/" className="font-body text-[13px] text-white/40 hover:text-white/70 transition-colors">Asesores</Link>
            <ChevronRight size={12} className="text-white/25" />
            <span className="font-body text-[13px] text-white/70">{agent.name}</span>
          </nav>

          {/* Agent header — photo + info */}
          <div className="flex flex-col sm:flex-row items-start gap-[28px] xl:gap-[40px]">
            {/* Photo */}
            <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] xl:w-[140px] xl:h-[140px] shrink-0 overflow-hidden bg-[#162444]">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={agent.name}
                  fill
                  className="object-cover object-top"
                  sizes="140px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading text-[48px] text-white/20 leading-none">{agent.name[0]}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-[12px]">
              {agent.role && (
                <p className="font-body font-medium text-[11px] text-[#d4a435] tracking-[4px] uppercase leading-4">
                  {agent.role}
                </p>
              )}
              <h1 className="font-heading font-normal text-[clamp(34px,4vw,56px)] text-white leading-none tracking-[-1.5px]">
                {agent.name}
              </h1>
              {listingCount > 0 && (
                <p className="font-body text-[14px] text-white/50">
                  {listingCount} {listingCount === 1 ? "propiedad activa" : "propiedades activas"}
                </p>
              )}

              {/* Contact pills */}
              <div className="flex flex-wrap gap-[10px] pt-[4px]">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[8px] bg-[#00b424] hover:bg-[#009e1f] px-[16px] py-[9px] font-body font-medium text-[13px] text-white transition-colors"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="inline-flex items-center gap-[8px] bg-white/10 hover:bg-white/20 border border-white/20 px-[16px] py-[9px] font-body text-[13px] text-white transition-colors"
                  >
                    <Phone size={13} />
                    {agent.phone}
                  </a>
                )}
                {agent.email && (
                  <a
                    href={`mailto:${agent.email}`}
                    className="inline-flex items-center gap-[8px] bg-white/10 hover:bg-white/20 border border-white/20 px-[16px] py-[9px] font-body text-[13px] text-white transition-colors"
                  >
                    <Mail size={13} />
                    {agent.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenido ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] py-[60px] xl:py-[100px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-[48px] xl:gap-[64px] items-start">

            {/* Left: Photo + Bio */}
            <div className="lg:sticky lg:top-[100px] flex flex-col gap-[28px]">
              {/* Larger portrait photo */}
              {photoUrl && (
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#dfe5ef]">
                  <Image
                    src={urlFor(agent.photo!).width(800).height(1067).url()}
                    alt={agent.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 360px"
                  />
                </div>
              )}

              {/* Bio */}
              {agent.bio && (
                <div className="flex flex-col gap-[16px]">
                  <div className="flex flex-col gap-[8px]">
                    <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
                      Sobre el asesor
                    </p>
                    <h2 className="font-heading font-normal text-[clamp(24px,2.5vw,34px)] text-[#0c1834] tracking-[-1px] leading-none">
                      Trayectoria
                    </h2>
                  </div>
                  <div className="h-px bg-[#dfe5ef]" />
                  <div className="font-body text-[15px] text-[#5a6478] leading-[1.75] [&_p]:mb-4 [&_p:last-child]:mb-0">
                    <PortableText value={agent.bio} />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Portfolio */}
            <div className="flex flex-col gap-[28px]">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-[16px]">
                <div className="flex flex-col gap-[8px]">
                  <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
                    Portafolio
                  </p>
                  <h2 className="font-heading font-normal text-[clamp(26px,3vw,38px)] text-[#0c1834] tracking-[-1px] leading-none">
                    {listingCount > 0
                      ? `${listingCount} ${listingCount === 1 ? "propiedad activa" : "propiedades activas"}`
                      : "Propiedades"}
                  </h2>
                </div>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-[8px] font-body font-medium text-[12px] text-[#5a6478] tracking-[1.2px] uppercase hover:text-[#0c1834] transition-colors whitespace-nowrap"
                >
                  Consultar disponibilidad
                  <ArrowRight size={13} />
                </a>
              </div>

              {listingCount > 0 ? (
                <PropertyGrid properties={agent.properties!} />
              ) : (
                <div className="border border-[#dfe5ef] bg-white py-[60px] flex flex-col items-center gap-[12px]">
                  <p className="font-body text-[15px] text-[#5a6478]">
                    Este asesor no tiene propiedades activas en este momento.
                  </p>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-[8px] font-body font-medium text-[13px] text-[#0c1834] tracking-[1.2px] uppercase border-b border-[#0c1834] pb-[2px] hover:opacity-60 transition-opacity"
                  >
                    Consultar disponibilidad
                    <ArrowRight size={13} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#121e3e] px-[30px] xl:px-[60px] 2xl:px-[160px] py-[70px] xl:py-[90px]">
        <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[32px]">
          <div className="flex flex-col gap-[14px]">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              ¿Hablamos?
            </p>
            <h2 className="font-heading font-normal text-[clamp(30px,4vw,50px)] text-white tracking-[-1.5px] leading-none">
              Escríbele a {agent.name.split(" ")[0]}
            </h2>
            <p className="font-body font-light text-[15px] text-white/60 leading-relaxed max-w-[440px]">
              Responde en minutos. Cuéntale qué buscas y te guiará hacia las mejores opciones disponibles.
            </p>
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-[10px] bg-[#00b424] hover:bg-[#009e1f] w-full xl:w-fit px-[32px] py-[15px] font-body font-medium text-[14px] text-white tracking-[1.4px] uppercase transition-colors whitespace-nowrap"
          >
            <MessageCircle size={16} />
            Abrir WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
