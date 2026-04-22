import Link from "next/link";

const PROPIEDADES = [
  { label: "Apartamentos en Venta", href: "/apartamentos-en-venta/" },
  { label: "Casas en Venta", href: "/casas-en-venta/" },
  { label: "Penthouses", href: "/penthouses-en-venta/" },
  { label: "Alquiler", href: "/propiedades-en-alquiler/" },
  { label: "Oficinas", href: "/oficinas-en-venta/" },
];

const BARRIOS = [
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

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0c1834] px-[30px] xl:px-[20px] 2xl:px-[120px]">
      <div className="flex flex-col gap-12 max-w-[1600px] mx-auto pt-[100px] pb-[30px] md:pt-16 md:pb-16">

        {/* Main columns — stacked on mobile, 4-col grid on md+ */}
        <div className="flex flex-col gap-12 md:grid md:grid-cols-4 md:gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="font-heading font-medium text-[#faf8f5] text-[45px] sm:text-[32px] md:text-[20px] uppercase tracking-[2.4px] leading-normal"
            >
              Panamares
            </Link>
            <p className="font-body font-normal text-white/50 text-[14px] md:text-[13px] leading-[20px] max-w-[242px]">
              Especialistas en bienes raíces de lujo en Ciudad de Panamá. Más de 15 años conectando clientes con propiedades excepcionales.
            </p>
          </div>

          {/* Propiedades */}
          <div className="flex flex-col gap-5">
            <h4 className="font-body font-semibold text-white text-[12px] uppercase tracking-[5px] leading-[16px]">
              Propiedades
            </h4>
            <ul className="flex flex-col gap-[5px]">
              {PROPIEDADES.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body font-normal text-white/50 text-[16px] md:text-[14px] leading-[20px] hover:text-white/80 transition-colors py-[2px] block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Barrios */}
          <div className="flex flex-col gap-5">
            <h4 className="font-body font-semibold text-white text-[12px] uppercase tracking-[5px] leading-[16px]">
              Barrios
            </h4>
            <ul className="flex flex-col gap-[5px]">
              {BARRIOS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body font-normal text-[rgba(250,248,245,0.6)] text-[16px] md:text-[14px] leading-[20px] hover:text-white/80 transition-colors py-[2px] block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-5">
            <h4 className="font-body font-semibold text-white text-[12px] uppercase tracking-[5px] leading-[16px]">
              Contacto
            </h4>
            <ul className="flex flex-col gap-[5px]">
              <li>
                <a
                  href="tel:+50765871849"
                  className="font-body font-normal text-white/50 text-[16px] md:text-[14px] leading-[20px] hover:text-white/80 transition-colors py-[2px] block"
                >
                  +507 6587-1849
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@panamares.com"
                  className="font-body font-normal text-white/50 text-[16px] md:text-[14px] leading-[20px] hover:text-white/80 transition-colors py-[2px] block"
                >
                  info@panamares.com
                </a>
              </li>
              <li>
                <span className="font-body font-normal text-white/50 text-[16px] md:text-[14px] leading-[20px] py-[2px] block">
                  Ciudad de Panamá, Panamá
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex items-center justify-between">
          <p className="font-body font-normal text-white/50 text-[12px] leading-[16px]">
            © {year} Panamares. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacidad/"
              className="font-body font-normal text-white/50 text-[12px] leading-[16px] hover:text-white/80 transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos/"
              className="font-body font-normal text-white/50 text-[12px] leading-[16px] hover:text-white/80 transition-colors"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
