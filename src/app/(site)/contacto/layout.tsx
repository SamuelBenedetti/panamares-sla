import type { Metadata } from "next";
import { breadcrumbSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para comprar, vender o alquilar propiedades en Panama City. Nuestros asesores están disponibles de lunes a sábado.",
  alternates: {
    canonical: "https://panamares.vercel.app/contacto/",
  },
};

const jsonLd = breadcrumbSchema([
  { name: "Inicio", url: "/" },
  { name: "Contacto", url: "/contacto/" },
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
