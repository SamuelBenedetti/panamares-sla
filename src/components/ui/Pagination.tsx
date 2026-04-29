import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;

  const pageHref = (p: number) =>
    p === 1 ? basePath : `${basePath}?page=${p}`;

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-2 py-8">
      {prev ? (
        <Link scroll={false} href={pageHref(prev)} className="px-4 py-2 border text-sm">
          ← Anterior
        </Link>
      ) : (
        <span className="px-4 py-2 border text-sm opacity-30">← Anterior</span>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link scroll={false}
            key={p}
            href={pageHref(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`px-3 py-2 border text-sm ${p === currentPage ? "bg-[#0c1834] text-white border-[#0c1834]" : ""}`}
          >
            {p}
          </Link>
        ))}
      </div>

      {next ? (
        <Link scroll={false} href={pageHref(next)} className="px-4 py-2 border text-sm">
          Siguiente →
        </Link>
      ) : (
        <span className="px-4 py-2 border text-sm opacity-30">Siguiente →</span>
      )}
    </nav>
  );
}
