"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Phone } from "lucide-react";
import { whatsappLink } from "@/lib/config";
import LangToggle from "./LangToggle";


const COMPRAR_ITEMS_BASE = [
  { label: "Ver todas",    href: "/propiedades-en-venta/",          typeKey: null },
  { label: "Apartamentos", href: "/apartamentos-en-venta/",         typeKey: "apartamento" },
  { label: "Casas",        href: "/casas-en-venta/",                typeKey: "casa" },
  { label: "Penthouses",   href: "/penthouses-en-venta/",           typeKey: "penthouse" },
  { label: "Oficinas",     href: "/oficinas-en-venta/",             typeKey: "oficina" },
  { label: "Locales",      href: "/locales-comerciales-en-venta/",  typeKey: "local" },
  { label: "Terrenos",     href: "/terrenos-en-venta/",             typeKey: "terreno" },
  { label: "Casas de playa",     href: "/casas-de-playa-en-venta/", typeKey: "casa de playa" },
];

const ALQUILAR_ITEMS_BASE = [
  { label: "Ver todas",      href: "/propiedades-en-alquiler/",                typeKey: null },
  { label: "Apartamentos",   href: "/apartamentos-en-alquiler/",               typeKey: "apartamento" },
  { label: "Casas",          href: "/casas-en-alquiler/",                      typeKey: "casa" },
  { label: "Penthouses",     href: "/penthouses-en-alquiler/",                 typeKey: "penthouse" },
  { label: "Oficinas",       href: "/oficinas-en-alquiler/",                   typeKey: "oficina" },
  { label: "Locales",        href: "/locales-comerciales-en-alquiler/",        typeKey: "local" },
  { label: "Terrenos",       href: "/terrenos-en-alquiler/",                   typeKey: "terreno" },
  { label: "Casas de playa", href: "/casas-de-playa-en-alquiler/",             typeKey: "casa de playa" },
];

const BARRIOS_ITEMS = [
  { label: "Ver todos",      href: "/barrios/" },
  { label: "Punta Pacífica", href: "/barrios/punta-pacifica/" },
  { label: "Punta Paitilla", href: "/barrios/punta-paitilla/" },
  { label: "Avenida Balboa", href: "/barrios/avenida-balboa/" },
  { label: "Costa del Este", href: "/barrios/costa-del-este/" },
  { label: "Obarrio",        href: "/barrios/obarrio/" },
  { label: "Calle 50",       href: "/barrios/calle-50/" },
  { label: "Albrook",        href: "/barrios/albrook/" },
  { label: "Coco del Mar",   href: "/barrios/coco-del-mar/" },
  { label: "Santa María",    href: "/barrios/santa-maria/" },
  { label: "Marbella",       href: "/barrios/marbella/" },
  { label: "El Cangrejo",    href: "/barrios/el-cangrejo/" },
];

const NAV_ITEMS_STATIC = [
  { href: "/sobre-nosotros/", label: "Nosotros", dropdown: null },
];


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

export default function Navbar({ navCounts }: { navCounts: NavCounts }) {
  const COMPRAR_ITEMS = COMPRAR_ITEMS_BASE.map((item) => ({
    ...item,
    count: item.typeKey ? (navCounts?.venta?.[item.typeKey] ?? 0) : undefined,
  }));

  const ALQUILAR_ITEMS = ALQUILAR_ITEMS_BASE.map((item) => ({
    ...item,
    count: item.typeKey ? (navCounts?.alquiler?.[item.typeKey] ?? 0) : undefined,
  }));

  const activeBarrios = BARRIOS_ITEMS;

  const NAV_ITEMS = [
    { href: "/propiedades-en-venta/",   label: "Comprar",  dropdown: COMPRAR_ITEMS },
    { href: "/propiedades-en-alquiler/", label: "Alquilar", dropdown: ALQUILAR_ITEMS },
    { href: "/barrios/", label: "Barrios", dropdown: activeBarrios },
    ...NAV_ITEMS_STATIC,
  ];

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isBuscar = pathname.startsWith("/buscar");
  const isBarrioSlug = pathname.startsWith("/barrios/") && pathname !== "/barrios/";
  const isTransparentTop = isHome || isBarrioSlug;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const logoColor = isLight ? "text-[#0c1834]" : "text-white";
  const linkColor = isLight ? "text-[#0c1834] hover:text-[#0c1834]/60" : "text-[#faf8f5] hover:text-white/70";
  const mobileMenuBg = isLight ? "bg-white" : "bg-[#0c1834]";
  const mobileLinkColor = isLight ? "text-[#0c1834]" : "text-[#faf8f5]";
  const mobileSubLinkColor = isLight ? "text-[#5a6478]" : "text-[#faf8f5]/60";
  const toggleColor = isLight ? "text-[#0c1834]" : "text-white";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 xl:px-[60px] 2xl:px-[160px] ${headerClass}`}>
      <nav className="flex h-[80px] items-center max-w-[1440px] mx-auto">

        {/* Logo */}
        <div className="flex-1">
          <Link href="/" className={`font-heading font-medium text-[26px] md:text-[30px] uppercase tracking-[2.4px] ${logoColor}`}>
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
            href={whatsappLink("Hola, me interesa conocer más sobre sus propiedades.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#00b424] hover:bg-[#009e1f] text-white px-3 py-[7px] text-[13px] font-medium font-body tracking-[0.3px] transition-colors shadow-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <Link
            href="/contacto/"
            className="flex items-center gap-1.5 bg-[#0c1834] hover:bg-[#162444] text-white px-3 py-[7px] text-[13px] font-medium font-body tracking-[0.3px] transition-colors shadow-sm"
          >
            <Phone size={15} />
            Contáctenos
          </Link>
          <LangToggle isLight={isLight} />
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-1 relative w-8 h-8 flex items-center justify-center ml-auto ${toggleColor}`}
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
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className={`${mobileMenuBg} border-t ${isLight ? "border-[#E9E7E2]" : "border-white/10"} px-6 pb-6`}>
          <ul className="flex flex-col pt-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className={`border-b ${isLight ? "border-[#E9E7E2]" : "border-white/10"}`}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                      className={`w-full flex items-center justify-between py-3.5 text-base font-medium font-body uppercase tracking-[0.35px] ${mobileLinkColor}`}
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
                            className={`py-2 font-body text-[15px] ${mobileSubLinkColor} hover:opacity-100 transition-opacity`}
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
                    className={`block py-3.5 text-base font-medium font-body uppercase tracking-[0.35px] ${mobileLinkColor}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 mt-5">
            <a
              href={whatsappLink("Hola, me interesa conocer más sobre sus propiedades.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#00b424] hover:bg-[#009e1f] text-white font-body font-medium py-3 text-sm transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <Link
              href="/contacto/"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#162444] text-white font-body font-medium py-3 text-sm"
            >
              <Phone size={18} />
              Contáctenos
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
