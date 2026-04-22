import LayoutShell from "@/components/layout/LayoutShell";
import Footer from "@/components/layout/Footer";
import CompareBar from "@/components/properties/CompareBar";
import { sanityFetch } from "@/sanity/lib/client";
import { navCountsQuery } from "@/sanity/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const navCounts = await sanityFetch<{ venta: Record<string, number>; alquiler: Record<string, number> }>(navCountsQuery);

  return (
    <LayoutShell
      navCounts={navCounts}
      footer={<Footer />}
      compareBar={<CompareBar />}
    >
      {children}
    </LayoutShell>
  );
}
