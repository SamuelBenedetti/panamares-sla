"use client";

import { useState } from "react";

interface Props {
  text: string;
  collapsibleOnMobile?: boolean;
}

export default function SeoBlock({ text, collapsibleOnMobile = true }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="text-brand-slate text-sm leading-relaxed">
      {/* Desktop: always visible */}
      <p className="hidden md:block">{text}</p>

      {/* Mobile: collapsible */}
      {collapsibleOnMobile && (
        <div className="md:hidden">
          <p className={expanded ? "" : "line-clamp-3"}>{text}</p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-brand-gold text-xs font-semibold hover:underline"
          >
            {expanded ? "Leer menos" : "Leer más"}
          </button>
        </div>
      )}
    </div>
  );
}
