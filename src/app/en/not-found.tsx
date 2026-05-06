import Link from "next/link";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { featuredPropertiesQuery } from "@/sanity/lib/queries";
import type { Property } from "@/lib/types";
import PropertyGrid from "@/components/properties/PropertyGrid";
import CTA from "@/components/home/CTA";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist. Explore our featured properties in Panama.",
  robots: { index: false, follow: true },
};

export default async function NotFoundEn() {
  let featured: Property[] = [];
  try {
    const all = await sanityFetch<Property[]>(featuredPropertiesQuery);
    featured = all.slice(0, 8);
  } catch {
    featured = [];
  }

  return (
    <>
      {/* Hero — error state + primary CTAs */}
      <section className="bg-[#0c1834] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-[30px] flex flex-col items-center text-center gap-[24px]">
          <p className="font-body font-medium text-white/40 text-[12px] uppercase tracking-[5px]">
            Error 404
          </p>
          <h1 className="font-heading font-normal text-white text-[clamp(60px,10vw,120px)] leading-none tracking-[-0.03em]">
            Page not found
          </h1>
          <p className="font-body font-light text-white/70 text-[18px] leading-relaxed max-w-[520px]">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has been
            moved. Use the links below to head back or browse through our
            catalog.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-[16px]">
            <Link
              href="/en"
              className="inline-flex items-center justify-center bg-white text-[#0c1834] font-body font-medium text-[14px] uppercase tracking-[1.4px] px-[32px] py-[14px] hover:bg-[#f9f9f9] transition-colors"
            >
              Back to home
            </Link>
            <Link
              href="/en/properties-for-sale/"
              className="inline-flex items-center justify-center border border-white/30 text-white font-body font-medium text-[14px] uppercase tracking-[1.4px] px-[32px] py-[14px] hover:bg-white/10 transition-colors"
            >
              Browse properties
            </Link>
          </div>
        </div>
      </section>

      {/* Featured properties — recovery surface */}
      {featured.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-[30px]">
            <div className="mb-10 text-center md:text-left">
              <p className="font-body font-medium text-[#0c1834]/40 text-[12px] uppercase tracking-[3px]">
                You might like
              </p>
              <h2 className="font-heading font-normal text-[#0c1834] text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em] mt-2">
                Featured properties
              </h2>
            </div>
            <PropertyGrid properties={featured} cols={4} locale="en" />
          </div>
        </section>
      )}

      {/* Homepage CTA */}
      <CTA locale="en" />
    </>
  );
}
