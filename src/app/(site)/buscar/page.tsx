import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { canonical, alternates } from "@/lib/seo";
import Wizard from "./Wizard";

export const metadata: Metadata = {
  title: "Buscar Propiedades",
  description:
    "Busca propiedades en Panama City con nuestro asistente guiado: define intención, tipo, habitaciones y presupuesto en cuatro pasos.",
  alternates: { canonical: canonical("/buscar"), languages: alternates("/buscar", null) },
  robots: { index: true, follow: true },
};

interface Props {
  searchParams: { q?: string };
}

// When a `q` param is present (e.g. Google's sitelinks search box, the
// WebSite SearchAction urlTemplate, or an external link), bypass the wizard
// and forward straight to results so users land on filtered listings instead
// of the four-step funnel.
export default function BuscarPage({ searchParams }: Props) {
  const q = searchParams.q?.trim();
  if (q) {
    redirect(`/propiedades-en-venta/?buscar=${encodeURIComponent(q)}`);
  }
  return <Wizard />;
}
