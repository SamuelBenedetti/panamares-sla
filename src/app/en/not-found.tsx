import Link from "next/link";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { featuredPropertiesQuery } from "@/sanity/lib/queries";
import type { Property } from "@/lib/types";
import PropertyGrid from "@/components/properties/PropertyGrid";
import { whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default async function NotFoundEn() {
  let featured: Property[] = [];
  try {
    const all = await sanityFetch<Property[]>(featuredPropertiesQuery);
    featured = all.slice(0, 6);
  } catch {
    featured = [];
  }

  const waUrl = whatsappLink("Hi, I am interested in a property listed on Panamares.");

  return (
    <>
      <section className="bg-[#0c1834] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-[30px] flex flex-col items-center text-center gap-[24px]">
          <p className="font-body font-medium text-white/40 text-[12px] uppercase tracking-[5px]">
            Error 404
          </p>
          <h1 className="font-heading font-normal text-white text-[clamp(60px,10vw,120px)] leading-none tracking-[-0.03em]">
            404
          </h1>
          <p className="font-body font-light text-white/70 text-[18px] leading-relaxed max-w-[520px]">
            The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved. Here are some
            featured properties you might like, or head back home to keep exploring.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#25D366] text-white font-body font-medium text-[14px] uppercase tracking-[1.4px] px-[32px] py-[14px] hover:bg-[#1faa55] transition-colors"
            >
              Talk to an agent
            </a>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-[30px]">
            <div className="mb-10">
              <p className="font-body font-medium text-[#0c1834]/40 text-[12px] uppercase tracking-[3px]">
                You might like
              </p>
              <h2 className="font-heading font-normal text-[#0c1834] text-[clamp(28px,4vw,42px)] leading-tight tracking-[-0.02em] mt-2">
                Featured properties
              </h2>
            </div>
            <PropertyGrid properties={featured} cols={3} locale="en" />
          </div>
        </section>
      )}
    </>
  );
}
