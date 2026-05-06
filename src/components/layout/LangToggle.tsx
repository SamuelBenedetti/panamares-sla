"use client";

import { usePathname, useRouter } from "next/navigation";
import { getLocaleFromPath, getEnUrl, getEsUrl } from "@/lib/i18n";
import { useTranslationGate } from "@/lib/translation-gate";

export default function LangToggle({ isLight }: { isLight: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = getLocaleFromPath(pathname);
  const isEN = currentLocale === "en";
  const { blocked } = useTranslationGate();

  // Disabled only when on ES and the EN counterpart is gated by humanReviewed
  // on the current page. EN → ES never blocks (ES is always rendered).
  const isDisabled = !isEN && blocked;

  function handleToggle() {
    if (isDisabled) return;
    const target = isEN ? getEsUrl(pathname) : getEnUrl(pathname);
    if (target) {
      // Preserve scroll-state hint so the navbar stays styled correctly across navigation.
      sessionStorage.setItem("nav-scrolled", window.scrollY > 40 ? "1" : "0");
      router.push(target);
    } else {
      // Fallback when the route has no counterpart yet — go to the locale root.
      router.push(isEN ? "/" : "/en");
    }
  }

  const titleText = isDisabled
    ? "Traducción al inglés pendiente de revisión"
    : isEN
      ? "Cambiar a Español"
      : "Switch to English";

  return (
    <button
      onClick={handleToggle}
      disabled={isDisabled}
      className={`flex items-center gap-[4px] border-[0.5px] px-[8px] py-[7px] backdrop-blur-[10px] transition-colors ${
        isLight ? "border-[#0c1834]" : "border-white"
      } ${
        isDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-black/5"
      }`}
      title={titleText}
      aria-label={titleText}
      aria-disabled={isDisabled || undefined}
    >
      <span
        className={`fi fi-pa transition-opacity duration-150 ${isEN ? "opacity-40" : "opacity-100"}`}
        style={{ fontSize: 15 }}
      />
      <span className={`font-body text-[11px] font-medium ${isLight ? "text-[#0c1834]/40" : "text-white/40"}`}>/</span>
      <span
        className={`fi fi-us transition-opacity duration-150 ${isEN ? "opacity-100" : "opacity-40"}`}
        style={{ fontSize: 15 }}
      />
    </button>
  );
}
