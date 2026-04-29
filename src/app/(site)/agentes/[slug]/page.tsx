import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, ArrowRight, ChevronRight, MessageCircle } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/client";
import { agentBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { Agent } from "@/lib/types";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { agentSchema, breadcrumbSchema } from "@/lib/jsonld";
import { BASE_URL, whatsappLink } from "@/lib/config";
import WhatsAppButton from "@/components/properties/WhatsAppButton";

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

      <WhatsAppButton message={waMessage} variant="floating" />

      {/* ── Hero ── */}
      <section className="bg-[#0c1834] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[32px] xl:pt-[40px] pb-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-[20px] max-w-[768px]">

            {/* Breadcrumb — same size/gap as sobre-nosotros, adapted for dark bg */}
            <nav className="flex items-center gap-[8px] flex-wrap">
              <Link href="/" className="font-body font-normal text-[16px] text-white/50 tracking-[-0.32px] hover:text-white transition-colors">
                Inicio
              </Link>
              <ChevronRight size={13} className="text-white/30" />
              <Link href="/agentes/" className="font-body font-normal text-[16px] text-white/50 tracking-[-0.32px] hover:text-white transition-colors">
                Asesores
              </Link>
              <ChevronRight size={13} className="text-white/30" />
              <span className="font-body font-medium text-[16px] text-white tracking-[-0.32px]">
                {agent.name}
              </span>
            </nav>

            {/* Role eyebrow */}
            {agent.role && (
              <p className="font-body font-medium text-[12px] text-[#d4a435] tracking-[5px] uppercase leading-4">
                {agent.role}
              </p>
            )}

            {/* H1 */}
            <h1 className="font-heading font-normal text-[clamp(32px,4.2vw,52px)] text-white leading-none tracking-[-1.8px]">
              {agent.name}
            </h1>

            {listingCount > 0 && (
              <p className="font-body text-[15px] text-white/50">
                {listingCount} {listingCount === 1 ? "propiedad activa" : "propiedades activas"}
              </p>
            )}

            {/* Contact buttons — all in one row */}
            <div className="flex flex-wrap gap-[10px]">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#00b424] hover:bg-[#009e1f] text-white px-3 py-[7px] text-[13px] font-medium font-body tracking-[0.3px] transition-colors shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              {agent.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  className="inline-flex items-center gap-[8px] bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-[7px] font-body text-[13px] text-white transition-colors"
                >
                  <Phone size={13} />
                  {agent.phone}
                </a>
              )}
              {agent.email && (
                <a
                  href={`mailto:${agent.email}`}
                  className="inline-flex items-center gap-[8px] bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-[7px] font-body text-[13px] text-white transition-colors"
                >
                  <Mail size={13} />
                  {agent.email}
                </a>
              )}
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
                <PropertyGrid properties={agent.properties!} cols={3} gap="tight" />
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
