"use client";

import Link from "next/link";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Phone } from "lucide-react";
import { whatsappLink } from "@/lib/config";
import { getCopy, type Locale } from "@/lib/copy";
import { localePath } from "@/lib/i18n";
import LangToggle from "./LangToggle";


function buildCompraItems(copy: ReturnType<typeof getCopy>, locale: Locale) {
  const n = copy.layout.nav;
  return [
    { label: n.verTodas, href: localePath("/propiedades-en-venta/", locale), typeKey: null as string | null },
    { label: n.apartamentos, href: localePath("/apartamentos-en-venta/", locale), typeKey: "apartamento" },
    { label: n.apartaestudios, href: localePath("/apartaestudios-en-venta/", locale), typeKey: "apartaestudio" },
    { label: n.casas, href: localePath("/casas-en-venta/", locale), typeKey: "casa" },
    { label: n.penthouses, href: localePath("/penthouses-en-venta/", locale), typeKey: "penthouse" },
    { label: n.oficinas, href: localePath("/oficinas-en-venta/", locale), typeKey: "oficina" },
    { label: n.locales, href: localePath("/locales-comerciales-en-venta/", locale), typeKey: "local" },
    { label: n.terrenos, href: localePath("/terrenos-en-venta/", locale), typeKey: "terreno" },
    { label: n.casasDePlaya, href: localePath("/casas-de-playa-en-venta/", locale), typeKey: "casa de playa" },
    { label: n.edificios, href: localePath("/edificios-en-venta/", locale), typeKey: "edificio" },
    { label: n.fincas, href: localePath("/fincas-en-venta/", locale), typeKey: "finca" },
    { label: n.lotesComerciales, href: localePath("/lotes-comerciales-en-venta/", locale), typeKey: "lote comercial" },
  ];
}

function buildAlquilarItems(copy: ReturnType<typeof getCopy>, locale: Locale) {
  const n = copy.layout.nav;
  return [
    { label: n.verTodas, href: localePath("/propiedades-en-alquiler/", locale), typeKey: null as string | null },
    { label: n.apartamentos, href: localePath("/apartamentos-en-alquiler/", locale), typeKey: "apartamento" },
    { label: n.casas, href: localePath("/casas-en-alquiler/", locale), typeKey: "casa" },
    { label: n.penthouses, href: localePath("/penthouses-en-alquiler/", locale), typeKey: "penthouse" },
    { label: n.oficinas, href: localePath("/oficinas-en-alquiler/", locale), typeKey: "oficina" },
    { label: n.locales, href: localePath("/locales-comerciales-en-alquiler/", locale), typeKey: "local" },
    { label: n.terrenos, href: localePath("/terrenos-en-alquiler/", locale), typeKey: "terreno" },
    { label: n.casasDePlaya, href: localePath("/casas-de-playa-en-alquiler/", locale), typeKey: "casa de playa" },
  ];
}

function buildBarriosItems(copy: ReturnType<typeof getCopy>, locale: Locale) {
  return [
    { label: copy.layout.nav.verTodos, href: localePath("/barrios/", locale) },
    { label: "Punta Pacífica", href: localePath("/barrios/punta-pacifica/", locale) },
    { label: "Punta Paitilla", href: localePath("/barrios/punta-paitilla/", locale) },
    { label: "Avenida Balboa", href: localePath("/barrios/avenida-balboa/", locale) },
    { label: "Costa del Este", href: localePath("/barrios/costa-del-este/", locale) },
    { label: "Obarrio",        href: localePath("/barrios/obarrio/", locale) },
    { label: "Calle 50",       href: localePath("/barrios/calle-50/", locale) },
    { label: "Albrook",        href: localePath("/barrios/albrook/", locale) },
    { label: "Coco del Mar",   href: localePath("/barrios/coco-del-mar/", locale) },
    { label: "Santa María",    href: localePath("/barrios/santa-maria/", locale) },
    { label: "Marbella",       href: localePath("/barrios/marbella/", locale) },
    { label: "El Cangrejo",    href: localePath("/barrios/el-cangrejo/", locale) },
  ];
}


function DropdownMenu({
  items,
  isLight,
}: {
  items: { label: string; href: string; count?: number }[];
  isLight: boolean;
}) {
  return (
    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] border shadow-lg z-50 overflow-hidden ${
      isLight ? "bg-white border-[#E9E7E2]" : "bg-[#0c1834] border-white/10"
    }`}>
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          className={`group/item relative flex items-center justify-between px-5 py-[11px] font-body text-[14px] transition-all duration-150 overflow-hidden ${
            i === 0 ? "font-semibold" : "font-normal"
          } ${
            isLight
              ? "text-[#0c1834] hover:bg-[#f4f4f4] hover:pl-6"
              : "text-[#faf8f5] hover:bg-white/8 hover:pl-6"
          } ${i === 0 ? "border-b " + (isLight ? "border-[#E9E7E2]" : "border-white/10") : ""}`}
        >
          {/* Left accent bar */}
          <span className={`absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 group-hover/item:scale-y-100 transition-transform duration-150 origin-center ${
            isLight ? "bg-[#0c1834]" : "bg-white/40"
          }`} />
          <span>{item.label}</span>
          {item.count !== undefined && item.count > 0 && (
            <span className={`text-[12px] tabular-nums ml-3 ${
              isLight ? "text-[#5a6478]" : "text-white/40"
            }`}>
              ({item.count})
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

interface NavCounts {
  venta: Record<string, number>;
  alquiler: Record<string, number>;
}

export default function Navbar({ navCounts, locale = "es" }: { navCounts: NavCounts; locale?: Locale }) {
  const copy = getCopy(locale);
  const homeHref = locale === "en" ? "/en" : "/";
  const buscarHref = localePath("/buscar/", locale);

  const COMPRAR_ITEMS = buildCompraItems(copy, locale)
    .map((item) => ({
      ...item,
      count: item.typeKey ? (navCounts?.venta?.[item.typeKey] ?? 0) : undefined,
    }))
    .filter((item) => item.typeKey === null || (item.count ?? 0) >= 1);

  const ALQUILAR_ITEMS = buildAlquilarItems(copy, locale)
    .map((item) => ({
      ...item,
      count: item.typeKey ? (navCounts?.alquiler?.[item.typeKey] ?? 0) : undefined,
    }))
    .filter((item) => item.typeKey === null || (item.count ?? 0) >= 1);

  const activeBarrios = buildBarriosItems(copy, locale);

  const NAV_ITEMS_STATIC = [
    { href: localePath("/sobre-nosotros/", locale), label: copy.layout.nav.nosotros, dropdown: null },
  ];

  const NAV_ITEMS = [
    { href: localePath("/propiedades-en-venta/", locale),   label: copy.layout.nav.comprar,  dropdown: COMPRAR_ITEMS },
    { href: localePath("/propiedades-en-alquiler/", locale), label: copy.layout.nav.alquilar, dropdown: ALQUILAR_ITEMS },
    { href: localePath("/barrios/", locale), label: copy.layout.nav.barrios, dropdown: activeBarrios },
    ...NAV_ITEMS_STATIC,
  ];

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/en" || pathname === "/en/";
  const isBuscar = pathname.startsWith("/buscar") || pathname.startsWith("/en/search");
  const isBarrioSlug =
    (pathname.startsWith("/barrios/") && pathname !== "/barrios/") ||
    (pathname.startsWith("/en/neighborhoods/") && pathname !== "/en/neighborhoods/");
  const isTransparentTop = isHome || isBarrioSlug;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    const saved = sessionStorage.getItem("nav-scrolled");
    if (saved !== null) {
      sessionStorage.removeItem("nav-scrolled");
      setScrolled(saved === "1");
    } else {
      setScrolled(window.scrollY > 40);
    }
  }, []);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when navigating
  useEffect(() => { setActiveDropdown(null); setOpen(false); }, [pathname]);

  function openDropdown(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 150);
  }

  // /buscar siempre muestra el navbar oscuro (no hay scroll)
  const effectiveScrolled = scrolled || isBuscar;
  const isLight = !isTransparentTop && !isBuscar && !scrolled;

  const headerClass = isTransparentTop
    ? effectiveScrolled
      ? "bg-[#0c1834]/95 backdrop-blur-[10px] shadow-lg"
      : "bg-white/5 backdrop-blur-[10px]"
    : effectiveScrolled
      ? "bg-[#0c1834]/95 backdrop-blur-[10px] shadow-lg"
      : "bg-white backdrop-blur-[10px] border-b border-[#dfdfdf] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]";

  const effectiveHeaderClass = open ? "bg-[#0c1834] backdrop-blur-[10px]" : headerClass;

  const logoColor = isLight ? "text-[#0c1834]" : "text-white";
  const effectiveLogoColor = open ? "text-white" : logoColor;
  const linkColor = isLight ? "text-[#0c1834] hover:text-[#0c1834]/60" : "text-[#faf8f5] hover:text-white/70";
  const toggleColor = isLight ? "text-[#0c1834]" : "text-white";
  const effectiveToggleColor = open ? "text-white" : toggleColor;

  void buscarHref; // referenced by future search shortcut

  return (
    <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 px-6 xl:px-[60px] 2xl:px-[160px] ${effectiveHeaderClass}`}>
      <nav className="flex h-[80px] items-center max-w-[1440px] mx-auto">

        {/* Logo */}
        <div className="flex-1">
          <Link href={homeHref} className={`font-heading font-medium text-[26px] md:text-[30px] uppercase tracking-[2.4px] ${effectiveLogoColor}`}>
            Panamares
          </Link>
        </div>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <li
              key={item.href}
              className="relative"
              onMouseEnter={() => item.dropdown && openDropdown(item.label)}
              onMouseLeave={() => item.dropdown && scheduleClose()}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-1 text-[14px] font-medium uppercase tracking-[0.35px] font-body transition-colors ${linkColor}`}
              >
                {item.label}
                {item.dropdown && (
                  <ChevronDown
                    size={10}
                    className={`opacity-70 transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`}
                  />
                )}
              </Link>

              {item.dropdown && activeDropdown === item.label && (
                <div
                  onMouseEnter={() => openDropdown(item.label)}
                  onMouseLeave={scheduleClose}
                >
                  <DropdownMenu items={item.dropdown} isLight={isLight} />
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop right actions */}
        <div className="flex-1 hidden lg:flex items-center justify-end gap-[10px] self-stretch py-[18px]">
          <a
            href={whatsappLink(copy.layout.cta.whatsappDefaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#00b424] hover:bg-[#009e1f] text-white px-3 py-[7px] text-[13px] font-medium font-body tracking-[0.3px] transition-colors shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {copy.layout.cta.whatsapp}
          </a>
          <Link
            href={localePath("/contacto/", locale)}
            className="flex items-center gap-1.5 bg-[#0c1834] hover:bg-[#162444] text-white px-3 py-[7px] text-[13px] font-medium font-body tracking-[0.3px] transition-colors shadow-sm"
          >
            <Phone size={15} />
            {copy.layout.cta.contactenos}
          </Link>
          <LangToggle isLight={isLight} />
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-1 relative w-8 h-8 flex items-center justify-center ml-auto ${effectiveToggleColor}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`absolute transition-all duration-200 ease-in-out ${open ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}>
            <Menu size={24} />
          </span>
          <span className={`absolute transition-all duration-200 ease-in-out ${open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}>
            <X size={24} />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${open ? "max-h-[calc(100dvh-80px)] opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}>
        <div className="bg-[#0c1834] border-t border-white/10  pb-6 overflow-y-auto max-h-[calc(100dvh-80px)]">
          <ul className="flex flex-col pt-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="border-b border-white/10">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between py-3.5 text-base font-medium font-body uppercase tracking-[0.35px] text-[#faf8f5]"
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={`opacity-60 transition-transform duration-200 ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-200 ${mobileExpanded === item.label ? "max-h-[300px]" : "max-h-0"}`}>
                      <div className="flex flex-col pb-3 pl-2 gap-1">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setOpen(false)}
                            className="py-2 font-body text-[15px] text-[#faf8f5]/60 hover:opacity-100 transition-opacity"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3.5 text-base font-medium font-body uppercase tracking-[0.35px] text-[#faf8f5]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 mt-5">
            <a
              href={whatsappLink(copy.layout.cta.whatsappDefaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#00b424] hover:bg-[#009e1f] text-white font-body font-medium py-3 text-sm transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {copy.layout.cta.whatsapp}
            </a>
            <Link
              href={localePath("/contacto/", locale)}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#162444] text-white font-body font-medium py-3 text-sm"
            >
              <Phone size={18} />
              {copy.layout.cta.contactenos}
            </Link>
            <div className="flex justify-center pt-1">
              <LangToggle isLight={false} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
