import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SearchBar from "./SearchBar";
import { getCopy, type Locale } from "@/lib/copy";
import { localePath } from "@/lib/i18n";

export default function Hero({ locale = "es" }: { locale?: Locale }) {
  const t = getCopy(locale).pages.home.hero;
  const altText =
    locale === "es"
      ? "Ciudad de Panamá — Panamares inmobiliaria de lujo"
      : "Panama City — Panamares luxury real estate";

  return (
    <section className="relative flex items-center justify-center min-h-screen md:min-h-[75vh] xl:min-h-screen bg-brand-navy overflow-hidden -mt-20 px-[24px] xl:px-[60px] 2xl:px-[160px]">
      {/* Background image — next only priority for LCP */}
      <Image
        src="/hero-bg.jpg"
        alt={altText}
        fill
        priority
        className="object-cover object-center scale-105"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(29,33,43,0.6)] via-[rgba(29,33,43,0.4)] to-[rgba(29,33,43,0.7)]" />
      {/* Bottom gradient to make search bar more prominent */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[rgba(13,24,53,0.85)] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-[20px] w-full max-w-[1440px] mx-auto text-center">

        {/* Eyebrow */}
        <p className="text-white text-[12px] font-medium uppercase tracking-[5px] font-body leading-[20px]">
          {t.eyebrow.split(" & ").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <>
                  {" "}&amp;<br />
                </>
              )}
            </span>
          ))}
        </p>

        {/* Heading */}
        <h1 className="flex flex-col items-center gap-[5px] font-heading font-light text-white text-[68px] xl:text-[clamp(52px,6vw,78px)] 2xl:text-[74px] leading-[0.875] xl:leading-[1] tracking-[-2.4px] xl:tracking-[-0.03em]">
          <span className="not-italic">{t.titleLine1}</span>
          <span className="italic">{t.titleLine2Italic}</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-white text-[16px] px-[50px] xl:px-0 pt-[4px] pb-[30px] xl:pb-[16px]">
          {t.subtitle.regular}
          <strong className="font-bold">{t.subtitle.bold}</strong>
        </p>

        {/* Search */}
        <div className="w-full max-w-[700px]">
          <SearchBar />
        </div>

        {/* Guided search CTA — tagline + About-style link */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <p className="font-body text-white text-[14px] leading-[20px]">
            {t.guidedSearchTagline}
          </p>
          <Link
            href={localePath("/buscar/", locale)}
            className="inline-flex items-center gap-[8px] border-b border-white pb-[5px] hover:opacity-60 transition-opacity"
          >
            <span className="font-body font-medium text-[14px] text-white uppercase tracking-[1.4px]">
              {t.guidedSearchCta}
            </span>
            <ArrowRight className="text-white" size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
