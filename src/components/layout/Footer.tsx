import Link from "next/link";
import { getCopy, type Locale } from "@/lib/copy";
import { localePath } from "@/lib/i18n";

const PROPIEDADES_HREFS = [
  "/apartamentos-en-venta/",
  "/casas-en-venta/",
  "/penthouses-en-venta/",
  "/propiedades-en-alquiler/",
  "/oficinas-en-venta/",
];

const BARRIOS = [
  { name: "Punta Pacífica", slug: "punta-pacifica" },
  { name: "Punta Paitilla", slug: "punta-paitilla" },
  { name: "Avenida Balboa", slug: "avenida-balboa" },
  { name: "Costa del Este", slug: "costa-del-este" },
  { name: "Obarrio",        slug: "obarrio" },
  { name: "Calle 50",       slug: "calle-50" },
  { name: "Albrook",        slug: "albrook" },
  { name: "Coco del Mar",   slug: "coco-del-mar" },
  { name: "Santa María",    slug: "santa-maria" },
  { name: "Marbella",       slug: "marbella" },
  { name: "El Cangrejo",    slug: "el-cangrejo" },
];

export default function Footer({ locale = "es" }: { locale?: Locale }) {
  const copy = getCopy(locale);
  const t = copy.layout.footer;
  const year = new Date().getFullYear();

  // Property type labels — pull from nav copy so footer matches navbar.
  const PROPIEDADES = [
    { label: copy.layout.nav.apartamentos + (locale === "es" ? " en Venta" : " for Sale"), href: localePath("/apartamentos-en-venta/", locale) },
    { label: copy.layout.nav.casas + (locale === "es" ? " en Venta" : " for Sale"), href: localePath("/casas-en-venta/", locale) },
    { label: copy.layout.nav.penthouses, href: localePath("/penthouses-en-venta/", locale) },
    { label: locale === "es" ? "Alquiler" : "Rent", href: localePath("/propiedades-en-alquiler/", locale) },
    { label: copy.layout.nav.oficinas, href: localePath("/oficinas-en-venta/", locale) },
  ];

  void PROPIEDADES_HREFS; // referenced for grep traceability

  return (
    <footer className="bg-[#0c1834] px-[30px] xl:px-[60px] 2xl:px-[160px]">
      <div className="flex flex-col gap-12 max-w-[1440px] mx-auto pt-[100px] pb-[30px] md:pt-16 md:pb-16">

        {/* Main columns — stacked on mobile, 4-col grid on md+ */}
        <div className="flex flex-col gap-12 md:grid md:grid-cols-4 md:gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href={locale === "en" ? "/en" : "/"}
              className="font-heading font-medium text-[#faf8f5] text-[45px] sm:text-[32px] md:text-[20px] uppercase tracking-[2.4px] leading-normal"
            >
              Panamares
            </Link>
            <p className="font-body font-normal text-white/50 text-[14px] md:text-[13px] leading-[20px] max-w-[242px]">
              {t.tagline}
            </p>
          </div>

          {/* Propiedades */}
          <div className="flex flex-col gap-5">
            <h4 className="font-body font-semibold text-white text-[12px] uppercase tracking-[5px] leading-[16px]">
              {t.sectionPropiedades}
            </h4>
            <ul className="flex flex-col gap-[5px]">
              {PROPIEDADES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body font-normal text-white/50 text-[16px] md:text-[14px] leading-[20px] hover:text-white/80 transition-colors py-[2px] block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Barrios */}
          <div className="flex flex-col gap-5">
            <h4 className="font-body font-semibold text-white text-[12px] uppercase tracking-[5px] leading-[16px]">
              {t.sectionBarrios}
            </h4>
            <ul className="flex flex-col gap-[5px]">
              {BARRIOS.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={localePath(`/barrios/${item.slug}/`, locale)}
                    className="font-body font-normal text-[rgba(250,248,245,0.6)] text-[16px] md:text-[14px] leading-[20px] hover:text-white/80 transition-colors py-[2px] block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-5">
            <h4 className="font-body font-semibold text-white text-[12px] uppercase tracking-[5px] leading-[16px]">
              {t.sectionContacto}
            </h4>
            <ul className="flex flex-col gap-[5px]">
              <li>
                <a
                  href="tel:+50765871849"
                  className="font-body font-normal text-white/50 text-[16px] md:text-[14px] leading-[20px] hover:text-white/80 transition-colors py-[2px] block"
                >
                  +507 6587-1849
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@panamares.com"
                  className="font-body font-normal text-white/50 text-[16px] md:text-[14px] leading-[20px] hover:text-white/80 transition-colors py-[2px] block"
                >
                  info@panamares.com
                </a>
              </li>
              <li>
                <span className="font-body font-normal text-white/50 text-[16px] md:text-[14px] leading-[20px] py-[2px] block">
                  {locale === "es" ? "Ciudad de Panamá, Panamá" : "Panama City, Panama"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex items-center justify-between">
          <p className="font-body font-normal text-white/50 text-[12px] leading-[16px]">
            {t.copyrightText(year)}
          </p>
          <div className="flex gap-6">
            <Link
              href={localePath("/privacidad/", locale)}
              className="font-body font-normal text-white/50 text-[12px] leading-[16px] hover:text-white/80 transition-colors"
            >
              {t.linkPrivacidad}
            </Link>
            <Link
              href={localePath("/terminos/", locale)}
              className="font-body font-normal text-white/50 text-[12px] leading-[16px] hover:text-white/80 transition-colors"
            >
              {t.linkTerminos}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
