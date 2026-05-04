import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ContactMap from "@/app/(site)/contacto/ContactMap";
import { canonical, alternates } from "@/lib/seo";
import { contactPointSchema, breadcrumbSchema } from "@/lib/jsonld";
import {
  WHATSAPP_URL,
  WHATSAPP_EQUIPO_URL,
  PANAMARES_PHONE,
  PANAMARES_PHONE_2,
  PANAMARES_EMAIL_INFO,
  PANAMARES_EMAIL_VENTAS,
  PANAMARES_STREET,
  PANAMARES_LOCALITY,
  PANAMARES_LAT,
  PANAMARES_LNG,
} from "@/lib/config";
import ContactForm from "@/app/(site)/contacto/ContactForm";
import { getCopy } from "@/lib/copy";

const copy = getCopy("en");
const t = copy.pages.contacto;

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  alternates: {
    canonical: canonical("/en/contact"),
    languages: alternates("/contacto", "/en/contact"),
  },
  robots: { index: true, follow: true },
};

export default function ContactPageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPointSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
          { name: copy.layout.breadcrumb.inicio, url: "/en/" },
          { name: t.breadcrumbLabel, url: "/en/contact/" },
        ])) }}
      />

      {/* ── Hero ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[32px] xl:pt-[40px] pb-[80px] xl:pb-[112px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-[20px]">
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
              <span className="font-heading font-normal text-[50px] xl:text-[60px] leading-none tracking-[-1.5px] xl:tracking-[-1.8px]">
                {t.hero.titleLine1}
              </span>
              <span className="font-heading font-medium italic text-[60px] xl:text-[70px] leading-none tracking-[-1.8px] xl:tracking-[-2.1px]">
                {t.hero.titleLine2Italic}
              </span>
            </h1>
            <p className="font-body text-[18px] xl:text-[20px] text-[#5a6478] leading-relaxed max-w-[576px] pt-[11px]">
              <span className="font-semibold">{t.hero.bodyBold}</span>{" "}
              <span className="font-normal">{t.hero.bodyRegular}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Form + Sidebar ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] pb-[80px] xl:pb-[120px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-[40px] xl:gap-[64px]">

            <div className="flex flex-col gap-[32px]">
              <div className="bg-[rgba(0,180,36,0.05)] border border-[rgba(0,180,36,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px] p-[21px]">
                <div className="flex flex-col gap-[2px]">
                  <p className="font-body font-semibold text-[14px] text-[#0c1935] leading-5">
                    {t.whatsappBanner.heading}
                  </p>
                  <p className="font-body font-normal text-[12px] text-[#5a6478] leading-4">
                    {t.whatsappBanner.subtitle}
                  </p>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#00b424] inline-flex items-center gap-[8px] px-[20px] py-[10px] font-body font-medium text-[14px] text-white shrink-0 hover:opacity-90 transition-opacity"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.9.52 3.68 1.43 5.21L2 22l4.89-1.41A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M8.5 9c0-.5.5-2 2-2 .5 0 1 .5 1.5 1.5.3.7.1 1.3-.3 1.8-.4.5-.7.9-.5 1.4.3.8 1.3 2 2.1 2.5.5.3 1 .1 1.5-.2.5-.3 1-.5 1.5-.2.8.5 1.2 1 1.2 1.5 0 1-1 2-2 2-2 0-7.5-4.5-7.5-8.3z" fill="white" />
                  </svg>
                  {t.whatsappBanner.button}
                </a>
              </div>

              <ContactForm locale="en" />
            </div>

            <div className="flex flex-col gap-[32px]">

              <div className="flex flex-col">
                {(
                  [
                    {
                      icon: <MapPin size={17} className="text-white" />,
                      label: t.sidebar.labelDireccion,
                      content: (
                        <>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">{PANAMARES_STREET}</p>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">{t.sidebar.cityLine(PANAMARES_LOCALITY)}</p>
                        </>
                      ),
                    },
                    {
                      icon: <Phone size={17} className="text-white" />,
                      label: t.sidebar.labelTelefono,
                      content: (
                        <>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">{PANAMARES_PHONE}</p>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">{PANAMARES_PHONE_2}</p>
                        </>
                      ),
                    },
                    {
                      icon: <Mail size={17} className="text-white" />,
                      label: t.sidebar.labelCorreo,
                      content: (
                        <>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">{PANAMARES_EMAIL_INFO}</p>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">{PANAMARES_EMAIL_VENTAS}</p>
                        </>
                      ),
                    },
                    {
                      icon: <Clock size={17} className="text-white" />,
                      label: t.sidebar.labelHorario,
                      content: (
                        <>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">
                            {t.sidebar.horario.lunVie.label} <span className="font-semibold">{t.sidebar.horario.lunVie.range}</span>
                          </p>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">
                            {t.sidebar.horario.sabados.label} <span className="font-semibold">{t.sidebar.horario.sabados.range}</span>
                          </p>
                        </>
                      ),
                    },
                  ] as { icon: React.ReactNode; label: string; content: React.ReactNode }[]
                ).map(({ icon, label, content }, i) => (
                  <div key={label}>
                    {i > 0 && <div className="h-px bg-[#dfe5ef] my-[20px]" />}
                    <div className="flex gap-[16px] items-start min-h-[60px]">
                      <div className="bg-[#0d1835] w-[40px] h-[40px] flex items-center justify-center shrink-0 mt-[2px]">
                        {icon}
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <p className="font-body font-semibold text-[12px] text-[#5a6478] tracking-[1.2px] uppercase leading-4">
                          {label}
                        </p>
                        {content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-[#dfe5ef]" />

              <div className="flex flex-col gap-[12px]">
                <p className="font-body font-semibold text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
                  {t.sidebar.ubicacionEyebrow}
                </p>
                <div className="border border-[#dfe5ef] overflow-hidden h-[260px]">
                  <ContactMap lat={PANAMARES_LAT} lng={PANAMARES_LNG} title={t.sidebar.mapTitle(PANAMARES_STREET, PANAMARES_LOCALITY)} />
                </div>
              </div>

              <div className="h-px bg-[#dfe5ef]" />

              <div className="bg-white px-[20px] pt-[20px] pb-[23px] flex flex-col gap-[7px]">
                <p className="font-body font-normal text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
                  {t.conoceMejor.eyebrow}
                </p>
                <p className="font-body font-light text-[14px] text-[#0c1935] leading-[22.75px]">
                  {t.conoceMejor.body}
                </p>
                <Link
                  href="/en/about/"
                  className="inline-flex items-center gap-[6px] pt-[14px] font-body font-semibold text-[12px] text-[#b8891e] tracking-[1.2px] uppercase leading-4 hover:opacity-70 transition-opacity"
                >
                  {t.conoceMejor.cta}
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Join the team ── */}
      <section className="bg-[#121e3e] px-[30px] xl:px-[60px] 2xl:px-[160px] py-[80px] xl:py-[100px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center xl:items-start xl:flex-row xl:justify-between gap-[32px] xl:gap-[40px]">
          <div className="flex flex-col gap-[15px] items-center xl:items-start text-center xl:text-left">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              {t.uneteEquipo.eyebrow}
            </p>
            <p className="font-heading font-normal text-[50px] xl:text-[clamp(34px,4vw,60px)] text-white tracking-[-1.5px] xl:tracking-[-1.8px] leading-[55px] xl:leading-none">
              {t.uneteEquipo.heading}
            </p>
          </div>
          <a
            href={WHATSAPP_EQUIPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[8px] border border-white/50 px-[33px] py-[15px] font-body font-medium text-[16px] text-white tracking-[1.4px] uppercase hover:bg-white/10 transition-colors whitespace-nowrap w-fit"
          >
            {t.uneteEquipo.button}
            <Send size={14} />
          </a>
        </div>
      </section>
    </>
  );
}
