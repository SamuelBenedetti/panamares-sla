"use client";

import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    // Only load the GT script when the user has already chosen English.
    // Spanish visitors (the default) never touch Google's servers.
    if (!document.cookie.includes("googtrans=/es/en")) return;

    const win = window as typeof window & {
      googleTranslateElementInit?: () => void;
      google?: { translate: { TranslateElement: new (...args: unknown[]) => unknown } };
    };

    win.googleTranslateElementInit = function () {
      new win.google!.translate.TranslateElement(
        { pageLanguage: "es", includedLanguages: "en", autoDisplay: false },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div id="google_translate_element" style={{ display: "none" }} />;
}
