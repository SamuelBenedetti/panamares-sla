import Link from "next/link";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { featuredPropertiesQuery } from "@/sanity/lib/queries";
import type { Property } from "@/lib/types";
import PropertyGrid from "@/components/properties/PropertyGrid";
import WhatsAppButton from "@/components/properties/WhatsAppButton";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe. Explora nuestras propiedades destacadas en Panamá.",
  robots: { index: false, follow: true },
};

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/",                          label: "Inicio" },
  { href: "/propiedades-en-venta/",     label: "Propiedades en venta" },
  { href: "/propiedades-en-alquiler/",  label: "Propiedades en alquiler" },
  { href: "/barrios/",                  label: "Barrios" },
  { href: "/contacto/",                 label: "Contáctanos" },
];

export default async function NotFound() {
  let featured: Property[] = [];
  try {
    const all = await sanityFetch<Property[]>(featuredPropertiesQuery);
    featured = all.slice(0, 6);
  } catch {
    featured = [];
  }

  return (
    <>
      {/* Hero — error state + recovery nav + primary CTAs */}
      <section className="bg-[#0c1834] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-[30px] flex flex-col items-center text-center gap-[24px]">
          <p className="font-body font-medium text-white/40 text-[12px] uppercase tracking-[5px]">
            Error 404
          </p>
          <h1 className="font-heading font-normal text-white text-[clamp(60px,10vw,120px)] leading-none tracking-[-0.03em]">
            Página no encontrada
          </h1>
          <p className="font-body font-light text-white/70 text-[18px] leading-relaxed max-w-[520px]">
            La página que buscas no existe o fue movida. Te dejamos un par de
            propiedades destacadas que podrían interesarte, o usa los enlaces
            para volver al catálogo.
          </p>

          {/* Recovery nav — chips */}
          <nav
            aria-label="Navegación principal"
            className="flex flex-wrap justify-center gap-[8px] pt-[8px]"
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center justify-center border border-white/20 text-white/80 font-body font-medium text-[13px] tracking-[0.5px] px-[16px] py-[8px] hover:border-white hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col sm:flex-row gap-3 pt-[16px]">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-white text-[#0c1834] font-body font-medium text-[14px] uppercase tracking-[1.4px] px-[32px] py-[14px] hover:bg-[#f9f9f9] transition-colors"
            >
              Volver al inicio
            </Link>
            <Link
              href="/propiedades-en-venta/"
              className="inline-flex items-center justify-center border border-white/30 text-white font-body font-medium text-[14px] uppercase tracking-[1.4px] px-[32px] py-[14px] hover:bg-white/10 transition-colors"
            >
              Ver propiedades
            </Link>
          </div>
        </div>
      </section>

      {/* Featured properties — recovery surface */}
      {featured.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-[30px]">
            <div className="mb-10 text-center md:text-left">
              <p className="font-body font-medium text-[#0c1834]/40 text-[12px] uppercase tracking-[3px]">
                Te puede interesar
              </p>
              <h2 className="font-heading font-normal text-[#0c1834] text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em] mt-2">
                Propiedades destacadas
              </h2>
            </div>
            <PropertyGrid properties={featured} cols={3} locale="es" />
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="py-16 md:py-20 bg-[#f9f9f9]">
        <div className="max-w-[800px] mx-auto px-[30px] flex flex-col items-center text-center gap-[20px]">
          <p className="font-body font-medium text-[#0c1834]/40 text-[12px] uppercase tracking-[3px]">
            ¿Buscas algo específico?
          </p>
          <h2 className="font-heading font-normal text-[#0c1834] text-[clamp(24px,3.5vw,36px)] leading-tight tracking-[-0.02em]">
            Habla directo con un asesor
          </h2>
          <p className="font-body font-light text-[#0c1834]/70 text-[16px] leading-relaxed max-w-[480px]">
            Cuéntanos qué tipo de propiedad estás buscando y te ayudamos a
            encontrarla. Respuesta el mismo día.
          </p>
          <div className="pt-[8px]">
            <WhatsAppButton
              message="Hola, llegué a su página 404 y me gustaría hablar con un asesor."
              variant="sidebar"
              locale="es"
            />
          </div>
        </div>
      </section>
    </>
  );
}
