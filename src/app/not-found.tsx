import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada | Panamares",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c1834] flex items-center justify-center px-[30px]">
      <div className="flex flex-col items-center text-center gap-[24px] max-w-[560px]">
        <p className="font-body font-medium text-white/40 text-[12px] uppercase tracking-[5px]">
          Error 404
        </p>
        <h1 className="font-heading font-normal text-white text-[clamp(60px,10vw,120px)] leading-none tracking-[-0.03em]">
          404
        </h1>
        <p className="font-body font-light text-white/70 text-[18px] leading-relaxed">
          La página que buscas no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
    </div>
  );
}
