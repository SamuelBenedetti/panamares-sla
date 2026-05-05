import type { Metadata } from "next";
import dynamic from "next/dynamic";
import LayoutShell from "@/components/layout/LayoutShell";
import Footer from "@/components/layout/Footer";
import { sanityFetch } from "@/sanity/lib/client";
import { navCountsQuery } from "@/sanity/lib/queries";

const CompareBar = dynamic(() => import("@/components/properties/CompareBar"), { ssr: false });

/**
 * EN-locale metadata overrides. Cascades to every `/en/*` route via Next.js
 * App Router metadata merging, overriding the ES defaults set in the root
 * layout (src/app/layout.tsx). Page-level `metadata` exports can still
 * override `title`, `description`, `alternates`, etc. without re-specifying
 * `openGraph.locale` or the OG image alt.
 */
export const metadata: Metadata = {
  openGraph: {
    locale: "en_US",
    images: [
      {
        url: "/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Panamares — Luxury real estate in Panama City",
      },
    ],
  },
};

/**
 * EN site layout. Wraps every `/en/*` route with the locale-aware nav,
 * footer and compare bar. The `<html lang="en">` is set in the root layout
 * (src/app/layout.tsx) based on the `x-pathname` header from middleware.
 */
export default async function EnSiteLayout({ children }: { children: React.ReactNode }) {
  const navCounts = await sanityFetch<{ venta: Record<string, number>; alquiler: Record<string, number> }>(navCountsQuery);

  return (
    <LayoutShell
      navCounts={navCounts}
      locale="en"
      footer={<Footer locale="en" />}
      compareBar={<CompareBar />}
    >
      {children}
    </LayoutShell>
  );
}
