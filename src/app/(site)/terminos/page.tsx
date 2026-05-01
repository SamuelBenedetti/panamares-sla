import type { Metadata } from "next";
import { canonical, alternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Lee los términos y condiciones de uso del sitio web de Panamares. Condiciones de servicio para la intermediación inmobiliaria en Panama City.",
  alternates: { canonical: canonical("/terminos"), languages: alternates("/terminos", null) },
};

export default function TerminosPage() {
  return (
    <section className="bg-white px-[30px] xl:px-[60px] 2xl:px-[160px] py-[100px]">
      <div className="max-w-[800px] mx-auto flex flex-col gap-[40px]">

        <div className="flex flex-col gap-[12px]">
          <p className="font-body font-medium text-[#5a6478] text-[12px] uppercase tracking-[5px]">Legal</p>
          <h1 className="font-heading font-normal text-[#0c1834] text-[clamp(36px,4vw,52px)] tracking-[-0.03em] leading-[1.1]">
            Términos y Condiciones
          </h1>
          <p className="font-body text-[#5a6478] text-[14px]">Última actualización: abril 2025</p>
        </div>

        <div className="flex flex-col gap-[32px] font-body text-[#0c1834] text-[16px] leading-[1.7]">

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">1. Aceptación de los términos</h2>
            <p>Al acceder y utilizar el sitio web <strong>panamares.com</strong>, usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguno de los términos aquí establecidos, le rogamos que no utilice este sitio.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">2. Sobre Panamares</h2>
            <p>Panamares Realty S.A. es una empresa inmobiliaria con operaciones en la República de Panamá, dedicada a la intermediación en compraventa y alquiler de bienes raíces. Actuamos como intermediarios y no somos propietarios de las propiedades listadas en este sitio salvo indicación expresa.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">3. Uso del sitio</h2>
            <p>Este sitio web es para uso personal y no comercial. Usted se compromete a:</p>
            <ul className="list-disc pl-[24px] flex flex-col gap-[6px]">
              <li>No reproducir, distribuir ni explotar comercialmente ningún contenido sin autorización escrita</li>
              <li>No utilizar herramientas automatizadas (bots, scrapers) para extraer información del sitio</li>
              <li>No enviar información falsa a través de nuestros formularios</li>
              <li>No intentar acceder a partes restringidas del sistema</li>
            </ul>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">4. Información sobre propiedades</h2>
            <p>La información sobre precios, disponibilidad y características de las propiedades se publica con fines informativos y puede estar sujeta a cambios sin previo aviso. Panamares no garantiza la exactitud, completitud ni vigencia de la información publicada. Los precios mostrados son referenciales y pueden no incluir impuestos, gastos notariales u otros cargos aplicables.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">5. Servicios de intermediación</h2>
            <p>Panamares actúa como intermediario entre compradores/arrendatarios y vendedores/arrendadores. Cualquier acuerdo, contrato o transacción resultante es exclusivamente entre las partes involucradas. Panamares no es responsable por el incumplimiento de ninguna de las partes en una transacción inmobiliaria.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">6. Limitación de responsabilidad</h2>
            <p>En la máxima medida permitida por la ley, Panamares no será responsable por:</p>
            <ul className="list-disc pl-[24px] flex flex-col gap-[6px]">
              <li>Daños directos o indirectos derivados del uso de este sitio</li>
              <li>Inexactitudes en la información de propiedades</li>
              <li>Interrupciones en la disponibilidad del sitio</li>
              <li>Decisiones de inversión tomadas con base en la información publicada</li>
            </ul>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">7. Propiedad intelectual</h2>
            <p>Todo el contenido de este sitio — incluyendo textos, imágenes, logotipos y diseño — es propiedad de Panamares Realty S.A. o de sus respectivos titulares, y está protegido por las leyes de propiedad intelectual de la República de Panamá. Queda prohibida su reproducción total o parcial sin autorización previa.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">8. Links a terceros</h2>
            <p>Este sitio puede contener enlaces a sitios web de terceros. Panamares no se hace responsable del contenido, políticas de privacidad ni prácticas de dichos sitios.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">9. Ley aplicable y jurisdicción</h2>
            <p>Estos Términos y Condiciones se rigen por las leyes de la República de Panamá. Cualquier disputa derivada del uso de este sitio se someterá a la jurisdicción de los tribunales competentes de la Ciudad de Panamá.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">10. Modificaciones</h2>
            <p>Panamares se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en este sitio. El uso continuado del sitio después de dichas modificaciones implica la aceptación de los nuevos términos.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">11. Contacto</h2>
            <p>Para cualquier consulta sobre estos Términos y Condiciones, puede contactarnos en <a href="mailto:info@panamares.com" className="text-[#0c1834] underline">info@panamares.com</a>.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
