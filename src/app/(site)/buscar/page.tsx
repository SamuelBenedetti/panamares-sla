import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { canonical, alternates } from "@/lib/seo";
import { getCopy } from "@/lib/copy";
import Wizard from "./Wizard";

const t = getCopy("es").pages.buscar;

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  alternates: {
    canonical: canonical("/buscar"),
    languages: alternates("/buscar", "/en/search"),
  },
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
  return <Wizard locale="es" />;
}
