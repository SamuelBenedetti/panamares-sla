"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCompareIds, clearCompare } from "@/lib/compare";
import { X, GitCompareArrows } from "lucide-react";

export default function CompareBar() {
  const [ids, setIds] = useState<string[]>([]);
  const router = useRouter();

  function sync() { setIds(getCompareIds()); }

  useEffect(() => {
    sync();
    window.addEventListener("compare-updated", sync);
    return () => window.removeEventListener("compare-updated", sync);
  }, []);

  if (ids.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#0c1834] text-white px-5 py-3 shadow-xl">
      <GitCompareArrows size={18} className="shrink-0 text-white/70" />
      <span className="font-body text-[14px] font-medium">
        {ids.length} {ids.length === 1 ? "propiedad seleccionada" : "propiedades seleccionadas"}
      </span>
      <button
        onClick={() => router.push(`/comparar/?ids=${ids.join(",")}`)}
        disabled={ids.length < 2}
        className="bg-white text-[#0c1834] font-body font-semibold text-[13px] px-4 py-2 hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Comparar
      </button>
      <button
        onClick={clearCompare}
        className="text-white/50 hover:text-white transition-colors"
        aria-label="Limpiar selección"
      >
        <X size={16} />
      </button>
    </div>
  );
}
