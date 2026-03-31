import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center min-h-screen bg-brand-navy overflow-hidden -mt-20">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://www.figma.com/api/mcp/asset/46c62f80-93f2-48ab-a542-c8b9722522e1')",
        }}
      />

      {/* Gradient overlay matching Figma */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(29,33,43,0.6)] via-[rgba(29,33,43,0.4)] to-[rgba(29,33,43,0.7)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-[1400px] mx-auto px-6 py-20 text-center">

        {/* Eyebrow */}
        <p className="text-white text-[11px] font-medium uppercase tracking-[5px] font-body">
          Ciudad de Panamá · Propiedades de Lujo
        </p>

        {/* Heading */}
        <div className="flex flex-col items-center leading-none -mt-2">
          <h1 className="font-heading font-light text-white text-[clamp(80px,8vw,120px)] leading-[0.875] tracking-[-0.03em] not-italic">
            Bienes Raíces
          </h1>
          <span className="font-heading font-light italic text-white text-[clamp(80px,8vw,120px)] leading-[0.875] tracking-[-0.03em]">
            en Panama
          </span>
        </div>

        {/* Subtitle */}
        <p className="font-body text-white text-lg md:text-xl -mt-2">
          Propiedades exclusivas en{" "}
          <strong className="font-bold">las mejores zonas de la ciudad.</strong>
        </p>

        {/* Search widget */}
        <SearchBar />

        {/* CTA */}
        <Link
          href="/propiedades-en-venta/"
          className="flex items-center gap-2 border border-white/50 text-white font-body font-semibold text-sm uppercase tracking-[1.4px] px-8 py-4 hover:bg-white/10 transition-colors"
        >
          Ver propiedades en venta
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </section>
  );
}
