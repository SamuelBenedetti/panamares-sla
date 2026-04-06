import Navbar from "@/components/layout/Navbar";
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
  // Costa del Este is always shown even if empty
  activeSlugs.add("costa-del-este");

  return (
    <>
      <Navbar activeSlugs={activeSlugs} navCounts={navCounts} />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer activeSlugs={activeSlugs} />
      <CompareBar />
    </>
  );
}
