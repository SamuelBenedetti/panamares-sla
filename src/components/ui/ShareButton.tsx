"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { getCopy } from "@/lib/copy";
import type { Locale } from "@/lib/copy/types";

interface Props {
  url: string;
  title: string;
  locale?: Locale;
}

export default function ShareButton({ url, title, locale = "es" }: Props) {
  const [copied, setCopied] = useState(false);
  const t = getCopy(locale).components.shareButton;

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
      aria-label={t.aria}
    >
      {copied
        ? <Check size={18} className="text-[#22a05a] shrink-0" />
        : <Share2 size={18} className="shrink-0" />
      }
      <span className="font-body font-medium text-[14px] leading-5">
        {copied ? t.copied : t.label}
      </span>
    </button>
  );
}
