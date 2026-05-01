import type { Metadata } from "next";
import { breadcrumbSchema } from "@/lib/jsonld";
import { canonical, alternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para comprar, vender o alquilar propiedades en Panama City. Nuestros asesores están disponibles de lunes a sábado.",
  alternates: {
    canonical: canonical("/contacto"),
    languages: alternates("/contacto", null),
  },
};

const jsonLd = breadcrumbSchema([
  { name: "Inicio", url: "/" },
  { name: "Contacto", url: "/contacto" },
]);

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
