import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Consulta la política de privacidad de Panamares. Información sobre el tratamiento de datos personales recabados a través de panamares.com.",
  alternates: { canonical: "https://panamares.com/privacidad/" },
};

export default function PrivacidadPage() {
  return (
    <section className="bg-white px-[30px] xl:px-[20px] 2xl:px-[120px] py-[100px]">
      <div className="max-w-[800px] mx-auto flex flex-col gap-[40px]">

        <div className="flex flex-col gap-[12px]">
          <p className="font-body font-medium text-[#737b8c] text-[12px] uppercase tracking-[5px]">Legal</p>
          <h1 className="font-heading font-normal text-[#0c1834] text-[clamp(36px,4vw,52px)] tracking-[-0.03em] leading-[1.1]">
            Política de Privacidad
          </h1>
          <p className="font-body text-[#737b8c] text-[14px]">Última actualización: abril 2025</p>
        </div>

        <div className="flex flex-col gap-[32px] font-body text-[#0c1834] text-[16px] leading-[1.7]">

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">1. Responsable del tratamiento</h2>
            <p>Panamares Realty S.A. (&ldquo;Panamares&rdquo;, &ldquo;nosotros&rdquo;) es responsable del tratamiento de los datos personales recabados a través del sitio web <strong>panamares.com</strong>. Para cualquier consulta puede contactarnos en <a href="mailto:info@panamares.com" className="text-[#0c1834] underline">info@panamares.com</a>.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">2. Datos que recopilamos</h2>
            <p>Recopilamos únicamente los datos que usted nos proporciona voluntariamente a través de nuestros formularios de contacto:</p>
            <ul className="list-disc pl-[24px] flex flex-col gap-[6px]">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono (opcional)</li>
              <li>Mensaje o consulta</li>
              <li>Referencia a la propiedad de interés</li>
            </ul>
            <p>Adicionalmente, nuestro sitio puede recopilar de forma automática datos de navegación (dirección IP, tipo de navegador, páginas visitadas) con fines estadísticos a través de herramientas de analítica.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">3. Finalidad del tratamiento</h2>
            <p>Sus datos personales son utilizados exclusivamente para:</p>
            <ul className="list-disc pl-[24px] flex flex-col gap-[6px]">
              <li>Responder a sus consultas sobre propiedades</li>
              <li>Contactarle en relación con propiedades de su interés</li>
              <li>Enviar información comercial relacionada con nuestros servicios inmobiliarios (únicamente si nos da su consentimiento expreso)</li>
              <li>Mejorar nuestros servicios y la experiencia de usuario</li>
            </ul>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">4. Base legal</h2>
            <p>El tratamiento de sus datos se basa en el consentimiento que usted otorga al enviar nuestros formularios, y en el interés legítimo de Panamares para atender solicitudes de información sobre bienes raíces.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">5. Conservación de datos</h2>
            <p>Sus datos se conservarán durante el tiempo necesario para gestionar su consulta y, en caso de relación comercial, durante el tiempo que establezca la legislación aplicable de la República de Panamá.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">6. Compartir datos con terceros</h2>
            <p>No vendemos ni cedemos sus datos personales a terceros. Únicamente los compartimos con proveedores de servicios técnicos estrictamente necesarios para el funcionamiento del sitio (como servicios de envío de email), quienes están contractualmente obligados a mantener la confidencialidad.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">7. Sus derechos</h2>
            <p>De conformidad con la Ley 81 de 2019 de Protección de Datos Personales de Panamá, usted tiene derecho a:</p>
            <ul className="list-disc pl-[24px] flex flex-col gap-[6px]">
              <li>Acceder a sus datos personales</li>
              <li>Rectificar datos inexactos</li>
              <li>Solicitar la supresión de sus datos</li>
              <li>Oponerse al tratamiento de sus datos</li>
              <li>Revocar su consentimiento en cualquier momento</li>
            </ul>
            <p>Para ejercer estos derechos, contáctenos en <a href="mailto:info@panamares.com" className="text-[#0c1834] underline">info@panamares.com</a>.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">8. Seguridad</h2>
            <p>Implementamos medidas técnicas y organizativas adecuadas para proteger sus datos personales contra el acceso no autorizado, la pérdida o la divulgación indebida.</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <h2 className="font-semibold text-[20px]">9. Cambios a esta política</h2>
            <p>Nos reservamos el derecho de actualizar esta Política de Privacidad. Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
