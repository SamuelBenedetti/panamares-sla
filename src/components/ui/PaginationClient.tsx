"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}


const cell = "size-[35px] flex items-center justify-center border border-[#dfdede] font-body font-bold text-[16px] tracking-[-0.16px] text-[#737b8c] hover:border-[#0d1835] transition-colors shrink-0 cursor-pointer";
const active = "size-[35px] flex items-center justify-center bg-[#0d1835] font-body font-bold text-[16px] tracking-[-0.16px] text-white shrink-0";

export default function PaginationClient({ currentPage, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;
  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-[20px] pt-[50px]">
      <button
        onClick={() => prev && onChange(prev)}
        disabled={!prev}
        aria-label="Página anterior"
        className={`${cell} disabled:opacity-30`}
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>

      {/* Desktop: todos los números */}
      <div className="hidden xl:flex items-center gap-[20px]">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)} aria-current={p === currentPage ? "page" : undefined} className={p === currentPage ? active : cell}>
            {p}
          </button>
        ))}
      </div>

      {/* Mobile/tablet: anterior, actual, siguiente */}
      <div className="flex xl:hidden items-center gap-[20px]">
        {[prev, currentPage, next].filter((p): p is number => p !== null).map(p => (
          <button key={p} onClick={() => onChange(p)} aria-current={p === currentPage ? "page" : undefined} className={p === currentPage ? active : cell}>
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => next && onChange(next)}
        disabled={!next}
        aria-label="Página siguiente"
        className={`${cell} disabled:opacity-30`}
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </nav>
  );
}
