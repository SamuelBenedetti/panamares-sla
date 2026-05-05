import Link from "next/link";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { featuredPropertiesQuery } from "@/sanity/lib/queries";
import type { Property } from "@/lib/types";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { WHATSAPP_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

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
      <section className="bg-[#0c1834] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-[30px] flex flex-col items-center text-center gap-[24px]">
          <p className="font-body font-medium text-white/40 text-[12px] uppercase tracking-[5px]">
            Error 404
          </p>
          <h1 className="font-heading font-normal text-white text-[clamp(60px,10vw,120px)] leading-none tracking-[-0.03em]">
            404
          </h1>
          <p className="font-body font-light text-white/70 text-[18px] leading-relaxed max-w-[520px]">
            La página que buscas no existe o fue movida. Te dejamos algunas propiedades
            destacadas que podrían interesarte, o vuelve al inicio para seguir explorando.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#25D366] text-white font-body font-medium text-[14px] uppercase tracking-[1.4px] px-[32px] py-[14px] hover:bg-[#1faa55] transition-colors"
            >
              Habla con un agente
            </a>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-[30px]">
            <div className="mb-10">
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
    </>
  );
}
