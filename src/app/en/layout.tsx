import dynamic from "next/dynamic";
import LayoutShell from "@/components/layout/LayoutShell";
import Footer from "@/components/layout/Footer";
import { sanityFetch } from "@/sanity/lib/client";
import { navCountsQuery } from "@/sanity/lib/queries";

const CompareBar = dynamic(() => import("@/components/properties/CompareBar"), { ssr: false });

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
