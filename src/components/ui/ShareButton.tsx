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
      className="flex items-center gap-[5px] text-[#8a95a3] hover:text-[#0c1834] transition-colors"
      aria-label="Compartir propiedad"
    >
      {copied
        ? <Check size={13} className="text-[#22a05a]" />
        : <Share2 size={13} />
      }
      <span className="font-body font-normal text-[12px] leading-4">
        {copied ? "¡Copiado!" : "Compartir"}
      </span>
    </button>
  );
}
