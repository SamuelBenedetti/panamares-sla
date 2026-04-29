"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface Props {
  url: string;
  title: string;
}

export default function ShareButton({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center justify-center gap-[8px] px-[21px] py-[13px] text-[#8a95a3] hover:text-[#0c1834] transition-colors"
      aria-label="Compartir propiedad"
    >
      {copied
        ? <Check size={18} className="text-[#22a05a] shrink-0" />
        : <Share2 size={18} className="shrink-0" />
      }
      <span className="font-body font-medium text-[14px] leading-5">
        {copied ? "¡Copiado!" : "Compartir"}
      </span>
    </button>
  );
}
