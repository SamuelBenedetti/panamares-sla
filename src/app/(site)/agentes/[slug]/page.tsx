import AgentPortfolioGrid from "@/components/agents/AgentPortfolioGrid";
import CTA from "@/components/home/CTA";
import WhatsAppButton from "@/components/properties/WhatsAppButton";
import { canonical, alternates } from "@/lib/seo";
import { whatsappLink } from "@/lib/config";
import { agentSchema, breadcrumbSchema } from "@/lib/jsonld";
import type { Agent } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { agentBySlugQuery } from "@/sanity/lib/queries";
import { Building2, ChevronRight, Home, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const PAGE_SIZE = 6;

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const agent = await sanityFetch<Agent | null>(agentBySlugQuery, { slug: params.slug });
  if (!agent) return {};
  const ogImage = agent.photo
    ? urlFor(agent.photo).width(1200).height(630).url()
    : undefined;
  const isPaginated = Number(searchParams?.page ?? 1) > 1;
  return {
    title: `${agent.name} — Asesor Inmobiliario`,
    description: `${agent.name}${agent.role ? `, ${agent.role}` : ""} en Panamares. Conoce su trayectoria y propiedades disponibles en Panama City.`,
    alternates: { canonical: canonical(`/agentes/${params.slug}`), languages: alternates(`/agentes/${params.slug}`, null) },
    ...(isPaginated && { robots: { index: false, follow: true } }),
    ...(ogImage && {
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    }),
  };
}

export default async function AgentProfilePage({ params, searchParams }: Props) {
  const agent = await sanityFetch<Agent | null>(agentBySlugQuery, { slug: params.slug });
  if (!agent) notFound();

  const photoUrl = agent.photo
    ? urlFor(agent.photo).width(520).height(693).url()
    : null;

  const waMessage = `Hola ${agent.name}, me interesa conocer más sobre sus propiedades en Panamares.`;
  const waHref = whatsappLink(waMessage);
  const allProperties = agent.properties ?? [];
  const listingCount = allProperties.length;

  const currentPage = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const totalPages = Math.ceil(listingCount / PAGE_SIZE);
  const offset = (currentPage - 1) * PAGE_SIZE;
  const pageProperties = allProperties.slice(offset, offset + PAGE_SIZE);

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

      <WhatsAppButton message={waMessage} variant="floating" />

      {/* ── Hero ── */}
      <section className="bg-[#0d1835] px-[30px] xl:px-[60px] 2xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-[8px] flex-wrap py-[30px]">
            <Link href="/" className="font-body font-normal text-[16px] text-[#737b8c] tracking-[-0.32px] hover:text-white transition-colors">
              Inicio
            </Link>
            <ChevronRight size={13} className="text-[#737b8c]" />
            <Link href="/agentes/" className="font-body font-medium text-[16px] text-[#737b8c] tracking-[-0.32px] hover:text-white transition-colors">
              Agentes
            </Link>
            <ChevronRight size={13} className="text-[#737b8c]" />
            <span className="font-body font-medium text-[16px] text-white tracking-[-0.32px]">
              {agent.name}
            </span>
          </nav>

          {/* Eyebrow + Name + Pills */}
          <div className="flex flex-col gap-[3px] pb-[50px]">

            {/* Eyebrow */}
            <p className="font-body font-normal text-[#737b8c] text-[16px] tracking-[3.2px] uppercase">
              Agente
            </p>

            {/* H1 */}
            <h1 className="font-heading font-normal text-[clamp(36px,3.5vw,50px)] text-white leading-normal tracking-[-2px]">
              {agent.name}
            </h1>

            {/* Pills — mobile: stacked, desktop: single row */}
            <div className="flex flex-col lg:flex-row gap-[16px] items-start lg:items-center mt-[8px]">

              {/* Row of small info pills (count + phone + email) — first on mobile */}
              <div className="flex flex-wrap gap-[8px] lg:gap-[16px] items-center lg:order-2">
                {listingCount > 0 && (
                  <span className="inline-flex items-center gap-[5px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] px-[10px] py-[7px]">
                    <Home size={15} className="text-white shrink-0" />
                    <span className="font-body font-medium text-[14px] text-white">{listingCount}</span>
                  </span>
                )}
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="inline-flex items-center bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.2)] px-[10px] py-[7px] transition-colors"
                  >
                    <span className="font-body font-medium text-[14px] text-white">{agent.phone}</span>
                  </a>
                )}
                {agent.email && (
                  <a
                    href={`mailto:${agent.email}`}
                    className="inline-flex items-center bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.2)] px-[10px] py-[7px] transition-colors"
                  >
                    <span className="font-body font-medium text-[14px] text-white">{agent.email}</span>
                  </a>
                )}
              </div>

              {/* WhatsApp — full-width button on mobile, small pill on desktop */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full lg:w-auto lg:order-1 inline-flex items-center justify-center gap-[8px] bg-[#00b424] hover:bg-[#009e1f] px-[20px] py-[12px] lg:px-[10px] lg:py-[7px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span className="font-body font-medium text-[14px] text-white tracking-[0.35px]">
                  <span className="lg:hidden">Consultar por WhatsApp</span>
                  <span className="hidden lg:inline">WhatsApp</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenido ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] py-[60px] xl:py-[80px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-[24px] items-start">

            {/* Left: Agent sticker card — below grid on mobile, sticky sidebar on desktop */}
            <div className="order-2 lg:order-1 lg:sticky lg:top-[100px]">
              <div className="bg-white border border-[#dfe5ef] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-[14px] p-[16px]">

                {/* Inner group: count bar + photo + info */}
                <div className="flex flex-col gap-[14px]">

                  {/* Properties count bar */}
                  <div className="bg-[#0d1835] flex items-center justify-center gap-[8px] px-[10px] py-[10px] w-full">
                    <Building2 size={16} className="text-white shrink-0" />
                    <p className="font-body text-[13px] text-white tracking-[-0.32px] whitespace-nowrap">
                      <strong className="font-bold">{listingCount} </strong>
                      propiedades activas
                    </p>
                  </div>

                  {/* Agent photo */}
                  {photoUrl && (
                    <div className="relative w-full overflow-hidden bg-[#dfe5ef]" style={{ aspectRatio: "3/4" }}>
                      <Image
                        src={urlFor(agent.photo!).width(520).height(693).url()}
                        alt={agent.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 1024px) 100vw, 260px"
                      />
                    </div>
                  )}

                  {/* Info block */}
                  <div className="bg-[#f8f8f9] flex flex-col gap-[8px] p-[12px]">
                    {/* Avatar + name + role */}
                    <div className="flex items-center gap-[8px]">
                      <div className="bg-[#0c1834] rounded-full w-[36px] h-[36px] flex items-center justify-center shrink-0">
                        <span className="font-heading text-[15px] text-white leading-none">
                          {agent.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                      <div className="flex flex-col gap-[3px]">
                        <p className="font-body font-medium text-[14px] text-[#0c1935] tracking-[-0.2px] leading-none">{agent.name}</p>
                        <p className="font-body font-normal text-[13px] text-[#737b8c] leading-none">Agente</p>
                      </div>
                    </div>
                    {/* Hours */}
                    <p className="font-body font-normal text-[13px] text-[#737b8c] leading-snug">
                      Atención disponible de lunes a sábado{" "}
                      <strong className="font-semibold">8am – 7pm</strong>
                    </p>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#00b424] hover:bg-[#009e1f] flex items-center justify-center gap-[8px] px-[16px] py-[9px] w-full transition-colors drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span className="font-body font-medium text-[13px] text-white">Consultar por WhatsApp</span>
                </a>

                {/* Phone CTA */}
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="border border-[#dfe5ef] flex items-center justify-center gap-[5px] px-[16px] py-[9px] w-full hover:bg-[#f9f9f9] transition-colors"
                  >
                    <Phone size={18} className="text-[#0d1835] shrink-0" />
                    <span className="font-body font-medium text-[13px] text-[#0d1835]">Llamar ahora</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right: Portfolio — first on mobile */}
            <div id="portfolio" className="order-1 lg:order-2">
              <AgentPortfolioGrid
                properties={pageProperties}
                waHref={waHref}
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/agentes/${params.slug}/`}
              />
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
