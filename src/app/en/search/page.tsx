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
  robots: { index: true, follow: true },
};

interface Props {
  searchParams: { q?: string };
}

export default function SearchPageEn({ searchParams }: Props) {
  const q = searchParams.q?.trim();
  if (q) {
    redirect(`/en/properties-for-sale/?buscar=${encodeURIComponent(q)}`);
  }
  return <Wizard locale="en" />;
}
