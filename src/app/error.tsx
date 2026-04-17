"use client";

import { useEffect } from "react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary — catches unhandled runtime errors in the App Router.
 * Must be a Client Component (Next.js requirement).
 * Design mirrors the existing not-found.tsx palette.
 */
export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log to your error-reporting service here (e.g. Sentry)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0c1834] flex items-center justify-center px-[30px]">
      <div className="flex flex-col items-center text-center gap-[24px] max-w-[560px]">
        <p className="font-body font-medium text-white/40 text-[12px] uppercase tracking-[5px]">
          Error inesperado
        </p>
        <h1 className="font-heading font-normal text-white text-[clamp(60px,10vw,120px)] leading-none tracking-[-0.03em]">
          500
        </h1>
        <p className="font-body font-light text-white/70 text-[18px] leading-relaxed">
          Algo salió mal. Nuestro equipo ya fue notificado.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center bg-white text-[#0c1834] font-body font-medium text-[14px] uppercase tracking-[1.4px] px-[32px] py-[14px] hover:bg-[#f9f9f9] transition-colors"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-white/30 text-white font-body font-medium text-[14px] uppercase tracking-[1.4px] px-[32px] py-[14px] hover:bg-white/10 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
