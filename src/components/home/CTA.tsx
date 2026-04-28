import Link from "next/link";
import Image from "next/image";
import { whatsappLink } from "@/lib/config";

export default function CTA() {
  return (
    <section className="relative bg-[#121e3e] py-20 md:py-[130px] px-6 xl:px-[20px] 2xl:px-[120px] overflow-hidden">

      {/* Palm tree — left */}
      <div className="absolute left-0 top-0 bottom-0 w-[300px] pointer-events-none select-none hidden lg:block">
        <Image
          src="/palm-left.svg"
          alt=""
          fill
          className="object-cover object-right"
          sizes="300px"
        />
      </div>

      {/* Palm tree — right (flipped) */}
      <div className="absolute right-0 top-0 bottom-0 w-[300px] pointer-events-none select-none hidden lg:block" style={{ transform: "scaleX(-1)" }}>
        <Image
          src="/palm-right.svg"
          alt=""
          fill
          className="object-cover object-left"
          sizes="300px"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-4 items-center text-center max-w-[1600px] mx-auto">

        {/* Eyebrow */}
        <p className="font-body font-medium text-white/50 text-[12px] uppercase tracking-[5px]">
          Contáctenos
        </p>

        {/* Heading */}
        <div className="flex flex-col items-center text-white text-[clamp(36px,4vw,60px)] 2xl:text-[52px] tracking-[-0.03em]">
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

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={whatsappLink("Hola, me interesa conocer más sobre sus propiedades en Panamares.")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#00b424] text-white font-body font-medium text-[16px] px-6 py-3 h-[46px] flex items-center justify-center gap-[8px] hover:bg-[#009e1f] transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
          <Link
            href="/contacto/"
            className="bg-white text-[#0d1835] font-body font-medium text-[16px] px-6 py-3 h-[46px] flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            Contáctenos Ahora
          </Link>
        </div>
      </div>
    </section>
  );
}
