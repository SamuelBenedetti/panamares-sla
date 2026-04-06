"use client";

import { useState, useEffect } from "react";

function getCurrentLang(): "es" | "en" {
  if (typeof document === "undefined") return "es";
  return document.cookie.includes("googtrans=/es/en") ? "en" : "es";
}

function setLang(lang: "es" | "en") {
  if (lang === "en") {
    document.cookie = "googtrans=/es/en; path=/";
    document.cookie = `googtrans=/es/en; path=/; domain=.${window.location.hostname}`;
  } else {
    const exp = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = `googtrans=; path=/; ${exp}`;
    document.cookie = `googtrans=; path=/; domain=.${window.location.hostname}; ${exp}`;
  }
  window.location.reload();
}

export default function LangToggle({ isLight }: { isLight: boolean }) {
  const [lang, setLangState] = useState<"es" | "en">("es");

  useEffect(() => {
    setLangState(getCurrentLang());
  }, []);

  const isEN = lang === "en";

  return (
    <button
      onClick={() => setLang(isEN ? "es" : "en")}
      className={`flex items-center gap-[4px] border-[0.5px] px-[8px] py-[7px] backdrop-blur-[10px] hover:bg-black/5 transition-colors ${
        isLight ? "border-[#0c1834]" : "border-white"
      }`}
      title={isEN ? "Cambiar a Español" : "Switch to English"}
    >
      <span className={`fi fi-pa transition-opacity duration-150 ${isEN ? "opacity-40" : "opacity-100"}`} style={{ fontSize: 15 }} />
      <span className={`font-body text-[11px] font-medium ${isLight ? "text-[#0c1834]/40" : "text-white/40"}`}>/</span>
      <span className={`fi fi-us transition-opacity duration-150 ${isEN ? "opacity-100" : "opacity-40"}`} style={{ fontSize: 15 }} />
    </button>
  );
}
