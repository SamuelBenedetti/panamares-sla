import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-[#121e3e] py-20 md:py-[130px] px-6 xl:px-[260px]">
      <div className="flex flex-col gap-4 items-center text-center max-w-[1400px] mx-auto">

        {/* Eyebrow */}
        <p className="font-body font-medium text-white/50 text-[12px] uppercase tracking-[5px]">
          Contáctenos
        </p>

        {/* Heading */}
        <div className="flex flex-col items-center text-white text-[clamp(36px,4vw,60px)] tracking-[-0.03em]">
          <span className="font-heading font-normal not-italic leading-tight">
            ¿Listo para encontrar tu
          </span>
          <span className="font-heading italic leading-tight">
            propiedad ideal?
          </span>
        </div>

        {/* Subtitle */}
        <p className="font-body font-light text-[#faf8f5] text-[16px] leading-[24px] text-center max-w-[448px] pb-6">
          Nuestros asesores están disponibles para ayudarte a encontrar la propiedad perfecta en Panamá.
        </p>

        {/* CTA button */}
        <Link
          href="/contacto/"
          className="bg-white text-[#0d1835] font-body font-medium text-[16px] px-6 py-3 h-[46px] flex items-center justify-center hover:bg-white/90 transition-colors"
        >
          Contáctenos Ahora
        </Link>
      </div>
    </section>
  );
}
