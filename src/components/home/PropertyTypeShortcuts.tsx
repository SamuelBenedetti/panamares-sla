import Link from "next/link";
import { Building2, Home, Layers, Briefcase, ShoppingBag, MapPin } from "lucide-react";
import PropertyTypeShortcutsScroll from "./PropertyTypeShortcutsScroll";
import { getCopy, type Locale } from "@/lib/copy";
import { localePath } from "@/lib/i18n";

export default function PropertyTypeShortcuts({
  counts = {},
  locale = "es",
}: {
  counts?: Record<string, number>;
  locale?: Locale;
}) {
  const t = getCopy(locale).pages.home.propertyTypeShortcuts;

  const SHORTCUTS = [
    { label: t.labels.apartamentos, typeKey: "apartamento", href: localePath("/apartamentos-en-venta/", locale), Icon: Building2 },
    { label: t.labels.casas,        typeKey: "casa",         href: localePath("/casas-en-venta/", locale),        Icon: Home },
    { label: t.labels.penthouses,   typeKey: "penthouse",    href: localePath("/penthouses-en-venta/", locale),   Icon: Layers },
    { label: t.labels.oficinas,     typeKey: "oficina",      href: localePath("/oficinas-en-venta/", locale),     Icon: Briefcase },
    { label: t.labels.locales,      typeKey: "local",        href: localePath("/locales-comerciales-en-venta/", locale), Icon: ShoppingBag },
    { label: t.labels.terrenos,     typeKey: "terreno",      href: localePath("/terrenos-en-venta/", locale),     Icon: MapPin },
  ];

  return (
    <section className="bg-white py-[80px] md:pt-[32px] md:pb-[80px] xl:pt-[80px] px-[30px] xl:px-[60px] 2xl:px-[160px]">
      <div className="flex flex-col gap-8 max-w-[1440px] mx-auto">

        <div className="flex flex-col gap-2 items-center text-center">
          <p className="font-body font-medium text-[#5a6478] text-[12px] md:text-[11px] uppercase tracking-[5px]">
            {t.eyebrow}
          </p>
          <h2 className="font-heading font-normal text-[#0c1834] text-[clamp(34px,2.5vw,38px)] 2xl:text-[38px] tracking-[-0.03em] leading-[1.1]">
            {t.heading}
          </h2>
        </div>

        <PropertyTypeShortcutsScroll>
          {SHORTCUTS.map((s) => {
            const n = counts[s.typeKey] ?? 0;
            const countLabel = t.countSuffix(n);
            return (
              <Link
                key={s.href}
                href={s.href}
                className="flex flex-col gap-[10px] items-center px-[21px] py-[31px] border border-[#dfe5ef] hover:border-[#0c1834]/30 hover:shadow-md transition-all shrink-0 w-[190px] xl:w-auto group"
              >
                <div className="flex items-center justify-center rounded-full bg-[rgba(12,25,53,0.1)] size-[48px] group-hover:bg-[rgba(12,25,53,0.15)] transition-colors">
                  <s.Icon size={22} className="text-[#0c1834]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-[5px] items-center">
                  <span className="font-body font-semibold text-[#0c1834] text-[15px] md:text-[13px] tracking-[-0.18px] text-center leading-normal">
                    {s.label}
                  </span>
                  <span className="font-body font-medium text-[rgba(12,24,52,0.5)] text-[14px] md:text-[12px] leading-[16px]">
                    {countLabel}
                  </span>
                </div>
              </Link>
            );
          })}
        </PropertyTypeShortcutsScroll>
      </div>
    </section>
  );
}
