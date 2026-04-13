import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para comprar, vender o alquilar propiedades en Panama City. Nuestros asesores están disponibles de lunes a sábado.",
  alternates: {
    canonical: "https://panamares.vercel.app/contacto/",
  },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
