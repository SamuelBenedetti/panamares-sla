import LayoutShell from "@/components/layout/LayoutShell";
import Footer from "@/components/layout/Footer";
import CompareBar from "@/components/properties/CompareBar";
import { sanityFetch } from "@/sanity/lib/client";
import { activeZonesQuery, navCountsQuery } from "@/sanity/lib/queries";
import { getSlugByName } from "@/lib/neighborhoods";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [activeZoneNames, navCounts] = await Promise.all([
    sanityFetch<string[]>(activeZonesQuery),
    sanityFetch<{ venta: Record<string, number>; alquiler: Record<string, number> }>(navCountsQuery),
  ]);
  const activeSlugs = new Set(
    activeZoneNames
      .map((name) => getSlugByName(name))
      .filter((s): s is string => s !== undefined)
  );
  activeSlugs.add("costa-del-este");

  return (
    <LayoutShell
      activeSlugs={activeSlugs}
      navCounts={navCounts}
      footer={<Footer />}
      compareBar={<CompareBar />}
    >
      {children}
    </LayoutShell>
  );
}
