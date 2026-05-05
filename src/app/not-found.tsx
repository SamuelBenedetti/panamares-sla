import Link from "next/link";
import type { Metadata } from "next";

/**
 * Root-level not-found fallback. Used only for errors that fall outside the
 * (site) and en/ route groups (rare). The richer 404 with navbar/footer +
 * featured listings + WhatsApp CTA lives in:
 *   - src/app/(site)/not-found.tsx  (ES)
 *   - src/app/en/not-found.tsx      (EN)
 */
export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
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
        </div>
      </div>
    </div>
  );
}
