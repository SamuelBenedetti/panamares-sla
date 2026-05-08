"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCompareIds, clearCompare } from "@/lib/compare";
import { X, GitCompareArrows } from "lucide-react";
import { getCopy, type Locale } from "@/lib/copy";
import { localePath } from "@/lib/i18n";

export default function CompareBar({ locale = "es" }: { locale?: Locale }) {
  const [ids, setIds] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const t = getCopy(locale).components.compare.bar;

  function sync() { setIds(getCompareIds()); }

  useEffect(() => {
    sync();
    window.addEventListener("compare-updated", sync);
    return () => window.removeEventListener("compare-updated", sync);
  }, []);

  // Hide bar on the comparison page itself for both locales.
  if (ids.length === 0 || pathname.startsWith("/comparar") || pathname.startsWith("/en/compare")) {
    return null;
  }

  // Locale-aware compare route. `localePath` only handles paths, so build the
  // path first then append the query string. ES → "/comparar/", EN → "/en/compare/".
  const comparePath = localePath("/comparar/", locale);
  const compareHref = `${comparePath}?ids=${ids.join(",")}`;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-4 bg-[#0c1834] text-white px-3 py-2 sm:px-5 sm:py-3 shadow-xl">
      <GitCompareArrows size={16} className="shrink-0 text-white/70" />
      <span className="font-body text-[12px] sm:text-[14px] font-medium whitespace-nowrap">
        {ids.length} {ids.length === 1 ? t.selectedSingular : t.selectedPlural}
      </span>
      <button
        onClick={() => router.push(compareHref)}
        disabled={ids.length < 2}
        className="bg-white text-[#0c1834] font-body font-semibold text-[12px] sm:text-[13px] px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t.button}
      </button>
      <button
        onClick={clearCompare}
        className="text-white/50 hover:text-white transition-colors"
        aria-label={t.clearAria}
      >
        <X size={14} />
      </button>
    </div>
  );
}
