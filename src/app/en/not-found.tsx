import Link from "next/link";
import type { Metadata } from "next";
import { whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFoundEn() {
  const waUrl = whatsappLink("Hi, I am interested in a property listed on Panamares.");

  return (
    <section className="bg-[#0c1834] min-h-[calc(100vh-80px)] flex items-center py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-[30px] flex flex-col items-center text-center gap-[24px] w-full">
        <p className="font-body font-medium text-white/40 text-[12px] uppercase tracking-[5px]">
          Error 404
        </p>
        <h1 className="font-heading font-normal text-white text-[clamp(60px,10vw,120px)] leading-none tracking-[-0.03em]">
          404
        </h1>
        <p className="font-body font-light text-white/70 text-[18px] leading-relaxed max-w-[520px]">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved. Head
          back home to keep exploring, or reach out if you need help.
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
            className="inline-flex items-center justify-center bg-white text-[#0c1834] font-body font-medium text-[14px] uppercase tracking-[1.4px] px-[32px] py-[14px] hover:bg-[#f9f9f9] transition-colors"
          >
            Talk to an agent
          </a>
        </div>
      </div>
    </section>
  );
}
