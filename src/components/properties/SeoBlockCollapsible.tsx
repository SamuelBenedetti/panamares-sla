"use client";

import { useState } from "react";

interface Props {
  text: string;
  className?: string;
}

export default function SeoBlockCollapsible({ text, className = "" }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`max-w-[600px] xl:max-w-[850px] ${className}`}>
      {/* Desktop: always fully visible */}
      <p className="hidden md:block font-body text-[14px] text-[#0c1834] leading-[1.6] tracking-[-0.2px]">
        {text}
      </p>
      {/* Mobile: collapsible */}
      <div className="md:hidden">
        <p className={`font-body text-[14px] text-[#5a6478] leading-[1.6] tracking-[-0.2px] ${expanded ? "" : "line-clamp-3"}`}>
          {text}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-[6px] font-body font-semibold text-[13px] text-[#b8891e] hover:underline"
        >
          {expanded ? "Leer menos" : "Leer más"}
        </button>
      </div>
    </div>
  );
}
