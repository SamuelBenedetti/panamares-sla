import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Star, TrendingUp, MapPin, Award } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { sanityFetch } from "@/sanity/lib/client";
import { allAgentsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { Agent } from "@/lib/types";
import { breadcrumbSchema } from "@/lib/jsonld";
import { canonical, alternates } from "@/lib/seo";
import PropertyMap from "@/components/properties/PropertyMap";
import { getCopy } from "@/lib/copy";
import { resolveI18nString } from "@/lib/i18n/resolveI18n";

const copy = getCopy("en");
const t = copy.pages.sobreNosotros;

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  alternates: {
    canonical: canonical("/en/about"),
    languages: alternates("/sobre-nosotros", "/en/about"),
  },
  robots: { index: true, follow: true },
};

export default async function AboutPageEn() {
  const agents = await sanityFetch<Agent[]>(allAgentsQuery);

  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: copy.layout.breadcrumb.inicio, url: "/en/" },
    { name: t.breadcrumbLabel, url: "/en/about/" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* ── Header ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[32px] xl:pt-[40px] pb-[80px] xl:pb-[112px]">
        <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-[20px] max-w-[768px]">

          <Breadcrumb
            items={[
              { label: copy.layout.breadcrumb.inicio, href: "/en" },
              { label: t.breadcrumbLabel },
            ]}
          />

          <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4 pt-4">
            {t.hero.eyebrow}
          </p>

          <h1 className="flex flex-col gap-[3px] text-[#0c1834]">
            <span className="font-heading font-normal text-[clamp(32px,4.2vw,52px)] leading-none tracking-[-1.8px]">
              {t.hero.titleLine1}
            </span>
            <span className="font-heading font-medium italic text-[clamp(38px,5.2vw,60px)] leading-none tracking-[-2.1px]">
              {t.hero.titleLine2Italic}
            </span>
            <span className="font-heading font-normal text-[clamp(32px,4.2vw,52px)] leading-none tracking-[-1.8px]">
              {t.hero.titleLine3}
            </span>
          </h1>

          <p className="font-body text-[#5a6478] text-[16px] xl:text-[17px] leading-relaxed max-w-[576px] pt-[11px]">
            <span className="font-semibold">{t.hero.body.bold}</span>
            <span className="font-light">{t.hero.body.light}</span>
          </p>

        </div>
        </div>
      </section>

      {/* ── Our office ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="relative aspect-[390/720] xl:aspect-auto xl:h-[720px] overflow-hidden flex flex-col justify-end p-[30px] xl:p-0">
            <Image
              src="/oficina.jpg"
              alt={t.oficina.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1920px) 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,24,53,0.6)] to-transparent mix-blend-multiply" />
            <div className="relative flex flex-col gap-[10px] items-center text-center xl:items-start xl:text-left xl:absolute xl:bottom-0 xl:left-0 xl:px-[40px] xl:py-[30px]">
              <p className="font-body font-normal text-[12px] text-white tracking-[5px] uppercase leading-4">
                {t.oficina.eyebrow}
              </p>
              <p className="font-heading font-normal text-[30px] md:text-[25px] leading-[32px] md:leading-[28px] tracking-[-0.9px] text-[#faf8f5]">
                {t.oficina.locationLine1}<br className="xl:hidden" />{" "}
                <span>{t.oficina.locationLine2}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-[#0d1835] px-[30px] xl:px-[60px] 2xl:px-[160px] py-[50px] xl:py-[70px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[50px] xl:gap-0">
            {[
              { value: "15+",    label: t.stats.labelAnos },
              { value: "1,200+", label: t.stats.labelPropiedadesVendidas },
              { value: "$850M+", label: t.stats.labelTransacciones },
              { value: "98%",    label: t.stats.labelSatisfechos },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-[10px] items-center">
                <p className="font-heading font-medium text-[clamp(38px,3.5vw,52px)] text-white tracking-[-1.8px] leading-none">
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

      {/* ── Location ── */}
      <section className="bg-white px-[30px] xl:px-[60px] 2xl:px-[160px] py-[70px] xl:py-[96px] border-t border-[#dfe5ef]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
              {t.ubicacion.eyebrow}
            </p>
            <h2 className="font-heading font-normal text-[clamp(24px,2.5vw,38px)] text-[#0c1834] tracking-[-1.2px] leading-none">
              {t.ubicacion.heading}
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

      {/* ── Story ── */}
      <section className="bg-white px-[30px] xl:px-[60px] 2xl:px-[160px] py-[70px] xl:py-[112px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[40px] xl:gap-[48px]">

          <div className="flex flex-col gap-[8px]">

            <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
              {t.historia.eyebrow}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[40px] xl:gap-[64px] items-end">

              <div className="flex flex-col gap-[20px]">
                <div className="flex flex-col text-[#0c1834]">
                  <p className="font-heading font-normal text-[clamp(30px,3.5vw,52px)] leading-none tracking-[-1.8px]">{t.historia.titleLine1}</p>
                  <p className="font-heading font-medium italic text-[clamp(30px,3.5vw,52px)] leading-none tracking-[-1.8px]">{t.historia.titleLine2Italic}</p>
                </div>
                <div className="flex flex-col gap-[20px] pt-[8px]">
                  <p className="font-body font-medium text-[15px] xl:text-[17px] text-[#5a6478] leading-relaxed">
                    {t.historia.p1}
                  </p>
                  <p className="font-body font-light text-[15px] xl:text-[17px] text-[#5a6478] leading-relaxed">
                    {t.historia.p2}
                  </p>
                  <p className="font-body font-light text-[15px] xl:text-[17px] text-[#5a6478] leading-relaxed">
                    {t.historia.p3Lead}
                    <span className="font-medium text-[#0c1834]">{t.historia.p3Cities}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-[30px] lg:grid lg:grid-cols-2 lg:grid-rows-[210px_210px] lg:gap-[24px]">
                {[
                  {
                    icon: <ShieldCheck size={20} className="text-white" />,
                    title: t.historia.cards.confianza.title,
                    body: (
                      <>
                        {t.historia.cards.confianza.bodyPrefix}
                        <span className="font-medium">{t.historia.cards.confianza.bodyBold}</span>
                        {t.historia.cards.confianza.bodySuffix}
                      </>
                    ),
                  },
                  {
                    icon: <Star size={20} className="text-white" />,
                    title: t.historia.cards.servicio.title,
                    body: t.historia.cards.servicio.body,
                  },
                  {
                    icon: <TrendingUp size={20} className="text-white" />,
                    title: t.historia.cards.inversion.title,
                    body: t.historia.cards.inversion.body,
                  },
                  {
                    icon: <MapPin size={20} className="text-white" />,
                    title: t.historia.cards.conocimiento.title,
                    body: t.historia.cards.conocimiento.body,
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

          </div>

          <div>
            <Link
              href="/en/properties-for-sale/"
              className="inline-flex items-center gap-[8px] border-b border-[#0c1834] pb-[5px] hover:opacity-60 transition-opacity"
            >
              <span className="font-body font-medium text-[14px] text-[#0c1834] uppercase tracking-[1.4px]">{t.historia.ctaVerPropiedades}</span>
              <ArrowRight size={13} className="text-[#0c1834]" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] py-[70px] xl:py-[96px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[56px] items-center">

          <div className="flex flex-col gap-[12px] items-center">
            <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4 text-center">
              {t.equipo.eyebrow}
            </p>
            <p className="font-heading font-normal text-[clamp(30px,3.5vw,52px)] text-[#0c1834] tracking-[-1.8px] leading-none text-center">
              {t.equipo.heading}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-[32px]">
            {agents.map((agent) => {
              const photoUrl = agent.photo
                ? urlFor(agent.photo).width(560).height(740).fit("crop").url()
                : null;
              const role = resolveI18nString(agent.roleI18n, "en", agent.role);
              return (
                <Link
                  key={agent._id}
                  href={`/en/agents/${agent.slug.current}`}
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
                    <p className="font-heading font-normal text-[30px] md:text-[25px] text-[#0d1835] tracking-[-0.9px] leading-7 text-center w-full">
                      {agent.name}
                    </p>
                    {role && (
                      <p className="font-body font-semibold text-[12px] text-[#5a6478] tracking-[1.2px] uppercase leading-4 text-center w-full">
                        {role}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── Recognitions ── */}
      <section className="bg-white px-[30px] xl:px-[60px] 2xl:px-[160px] py-[70px] xl:py-[96px]">
        <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row xl:items-end xl:justify-between gap-[48px] xl:gap-[40px]">

          <div className="flex flex-col gap-[15px]">
            <Award size={52} strokeWidth={1} className="text-[#0c1834]" />
            <div className="flex flex-col text-[#0c1834] tracking-[-1.8px]">
              <p className="font-heading font-normal text-[clamp(28px,3.5vw,52px)] leading-none">{t.reconocimientos.titleLine1}</p>
              <p className="font-heading font-medium italic text-[clamp(28px,3.5vw,52px)] leading-none">{t.reconocimientos.titleLine2Italic}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[24px] gap-y-[24px] pb-[10px]">
            {[
              t.reconocimientos.awards.excelencia,
              t.reconocimientos.awards.topAgencias,
              t.reconocimientos.awards.servicio,
              t.reconocimientos.awards.remax,
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

      {/* ── CTA contact ── */}
      <section className="relative bg-[#121e3e] px-[30px] xl:px-[60px] 2xl:px-[160px] py-[80px] xl:py-[130px] overflow-hidden">

        <div className="absolute left-0 top-0 bottom-0 w-[300px] pointer-events-none select-none hidden lg:block">
          <Image src="/palm-left.svg" alt="" fill className="object-cover object-right" sizes="300px" />
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-[300px] pointer-events-none select-none hidden lg:block" style={{ transform: "scaleX(-1)" }}>
          <Image src="/palm-right.svg" alt="" fill className="object-cover object-left" sizes="300px" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col gap-[16px] items-center">

          <div className="flex flex-col gap-[12px] items-center">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4 text-center">
              {t.ctaContacto.eyebrow}
            </p>
            <p className="font-heading font-normal text-[clamp(30px,3.5vw,52px)] text-white tracking-[-1.8px] leading-none text-center">
              {t.ctaContacto.heading}
            </p>
          </div>

          <p className="font-body text-[16px] text-[#faf8f5] text-center leading-relaxed max-w-[448px] pb-[24px] pt-[8px]">
            <span className="font-light">{t.ctaContacto.bodyLight}</span>
            <span className="font-semibold">{t.ctaContacto.bodyBold}</span>
          </p>

          <Link
            href="/en/contact/"
            className="bg-white h-[46px] flex items-center justify-center px-[24px] font-body font-medium text-[16px] text-[#0d1835] hover:bg-[#faf8f5] transition-colors whitespace-nowrap"
          >
            {t.ctaContacto.button}
          </Link>

        </div>
      </section>
    </>
  );
}
