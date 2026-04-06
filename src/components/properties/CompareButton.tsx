"use client";

import { useEffect, useState, useCallback } from "react";
import { getCompareIds, toggleCompare, MAX_COMPARE } from "@/lib/compare";

export default function CompareButton({ id }: { id: string }) {
  const [checked, setChecked] = useState(false);
  const [atMax, setAtMax] = useState(false);

  const sync = useCallback(() => {
    const ids = getCompareIds();
    setChecked(ids.includes(id));
    setAtMax(ids.length >= MAX_COMPARE && !ids.includes(id));
  }, [id]);

  useEffect(() => {
    sync();
    window.addEventListener("compare-updated", sync);
    return () => window.removeEventListener("compare-updated", sync);
  }, [sync]);

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); toggleCompare(id); }}
      disabled={atMax}
      title={checked ? "Quitar de comparación" : atMax ? "Máximo 3 propiedades" : "Comparar"}
      className={`absolute top-[10px] right-[10px] w-[26px] h-[26px] flex items-center justify-center border transition-colors ${
        checked
          ? "bg-[#0c1834] border-[#0c1834]"
          : atMax
          ? "bg-white/50 border-white/30 cursor-not-allowed"
          : "bg-white/80 border-white/60 hover:bg-white hover:border-[#0c1834]"
      }`}
      aria-label="Comparar propiedad"
    >
      {checked ? (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6H10M6 2V10" stroke={atMax ? "#aaa" : "#0c1834"} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
}
