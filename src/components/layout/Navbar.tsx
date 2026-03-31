"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Phone, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config";

const COMPRAR_ITEMS = [
  { label: "Ver todas", href: "/propiedades-en-venta/" },
  { label: "Apartamentos", href: "/apartamentos-en-venta/" },
  { label: "Casas", href: "/casas-en-venta/" },
  { label: "Penthouses", href: "/penthouses-en-venta/" },
  { label: "Oficinas", href: "/oficinas-en-venta/" },
  { label: "Locales", href: "/locales-comerciales-en-venta/" },
  { label: "Terrenos", href: "/terrenos-en-venta/" },
];

const ALQUILAR_ITEMS = [
  { label: "Ver todas", href: "/propiedades-en-alquiler/" },
  { label: "Apartamentos", href: "/apartamentos-en-alquiler/" },
  { label: "Casas", href: "/casas-en-alquiler/" },
  { label: "Oficinas", href: "/oficinas-en-alquiler/" },
  { label: "Locales", href: "/locales-comerciales-en-alquiler/" },
];

const BARRIOS_ITEMS = [
  { label: "Punta Pacífica", href: "/barrios/punta-pacifica/" },
  { label: "Punta Paitilla", href: "/barrios/punta-paitilla/" },
  { label: "Avenida Balboa", href: "/barrios/avenida-balboa/" },
  { label: "Obarrio", href: "/barrios/obarrio/" },
  { label: "Calle 50", href: "/barrios/calle-50/" },
  { label: "Costa del Este", href: "/barrios/costa-del-este/" },
];

const NAV_ITEMS = [
  { href: "/propiedades-en-venta/", label: "Comprar", dropdown: COMPRAR_ITEMS },
  { href: "/propiedades-en-alquiler/", label: "Alquilar", dropdown: ALQUILAR_ITEMS },
  { href: "/barrios/", label: "Barrios", dropdown: BARRIOS_ITEMS },
  { href: "/guias/", label: "Gu\u00edas", dropdown: null },
  { href: "/sobre-nosotros/", label: "Nosotros", dropdown: null },
];

function PanamaFlag() {
  return (
    <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="13" height="9" fill="white" />
      <rect x="13" width="13" height="9" fill="#D21034" />
      <rect y="9" width="13" height="9" fill="#005293" />
      <rect x="13" y="9" width="13" height="9" fill="white" />
      <polygon points="6.5,1.5 7.5,4.5 10.5,4.5 8,6.5 9,9.5 6.5,7.5 4,9.5 5,6.5 2.5,4.5 5.5,4.5" fill="#D21034" />
      <polygon points="19.5,9.5 20.5,12.5 23.5,12.5 21,14.5 22,17.5 19.5,15.5 17,17.5 18,14.5 15.5,12.5 18.5,12.5" fill="#005293" />
    </svg>
  );
}

function DropdownMenu({
  items,
  isLight,
}: {
  items: { label: string; href: string }[];
  isLight: boolean;
}) {
  return (
    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[180px] border shadow-lg z-50 ${
      isLight
        ? "bg-white border-[#E9E7E2]"
        : "bg-[#0c1834] border-white/10"
    }`}>
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          className={`block px-5 py-2.5 font-body text-[14px] transition-colors ${
            i === 0 ? "font-semibold" : "font-normal"
          } ${
            isLight
              ? "text-[#0c1834] hover:bg-[#f9f9f9]"
              : "text-[#faf8f5] hover:bg-white/10"
          } ${i === 0 ? "border-b " + (isLight ? "border-[#E9E7E2]" : "border-white/10") : ""}`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
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

  const isLight = !isHome && !scrolled;

  const headerClass = isHome
    ? scrolled
      ? "bg-[#0c1834]/95 backdrop-blur-[10px] shadow-lg"
      : "bg-white/5 backdrop-blur-[10px]"
    : scrolled
      ? "bg-[#0c1834]/95 backdrop-blur-[10px] shadow-lg"
      : "bg-white backdrop-blur-[10px] border-b border-[#dfdfdf] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]";

  const logoColor = isLight ? "text-[#0c1834]" : "text-white";
  const linkColor = isLight ? "text-[#0c1834] hover:text-[#0c1834]/60" : "text-[#faf8f5] hover:text-white/70";
  const mobileMenuBg = isLight ? "bg-white" : "bg-[#0c1834]";
  const mobileLinkColor = isLight ? "text-[#0c1834]" : "text-[#faf8f5]";
  const mobileSubLinkColor = isLight ? "text-[#737b8c]" : "text-[#faf8f5]/60";
  const toggleColor = isLight ? "text-[#0c1834]" : "text-white";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
      <nav className="flex h-[80px] items-center px-6 xl:px-[260px] max-w-[1920px] mx-auto">

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
        <div className="flex-1 hidden lg:flex items-center justify-end gap-5">
          <button className={`flex items-center gap-1.5 border px-1.5 py-1 backdrop-blur-[10px] hover:bg-black/5 transition-colors ${isLight ? "border-[#0c1834]/40" : "border-white/80"}`}>
            <PanamaFlag />
            <ChevronDown size={10} className={`opacity-70 ${isLight ? "text-[#0c1834]" : "text-white"}`} />
          </button>
          <a
            href={whatsappLink("Hola, me interesa conocer más sobre sus propiedades.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebe57] text-white px-4 py-2.5 text-[16px] font-medium font-body tracking-[0.35px] transition-colors shadow-sm"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
          <Link
            href="/contacto/"
            className="flex items-center gap-2 bg-[#0c1834] hover:bg-[#162444] text-white px-4 py-2.5 text-[16px] font-medium font-body tracking-[0.35px] transition-colors shadow-sm"
          >
            <Phone size={18} />
            Contáctenos
          </Link>
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
              className="flex items-center justify-center gap-2 bg-[#25d366] text-white font-body font-medium py-3 text-sm"
            >
              <MessageCircle size={18} />
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
