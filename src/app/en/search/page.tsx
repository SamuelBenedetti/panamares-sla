import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { canonical, alternates } from "@/lib/seo";
import { getCopy } from "@/lib/copy";
import Wizard from "@/app/(site)/buscar/Wizard";

const t = getCopy("en").pages.buscar;

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  alternates: {
    canonical: canonical("/en/search"),
    languages: alternates("/buscar", "/en/search"),
  },
  robots: { index: false, follow: true },
};

interface Props {
  searchParams: { q?: string };
}

// When a `q` param is present (e.g. Google's sitelinks search box, the
// WebSite SearchAction urlTemplate, or an external link), bypass the wizard
// and forward straight to results so users land on filtered listings instead
// of the four-step funnel.
// Note: the query param key remains `buscar` (Spanish) because the EN listing
// handler shares the same searchParams shape as ES — see
// `src/app/en/properties-for-sale/page.tsx`. Param name parity intentional.
export default function SearchPageEn({ searchParams }: Props) {
  const q = searchParams.q?.trim();
  if (q) {
    redirect(`/en/properties-for-sale?buscar=${encodeURIComponent(q)}`);
  }
  return <Wizard locale="en" />;
}
