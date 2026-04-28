import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

function BreadcrumbItem({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) {
  const cls = `font-body text-[16px] tracking-[-0.32px] ${
    isLast ? "font-medium text-[#0c1834]" : "text-[#566070]"
  }`;
  return item.href && !isLast ? (
    <Link href={item.href} className={`${cls} hover:text-[#0c1834] transition-colors`}>
      {item.label}
    </Link>
  ) : (
    <span className={cls}>{item.label}</span>
  );
}

const SEP = <ChevronRight size={14} className="text-[#566070] flex-shrink-0" />;

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const parent = items.length >= 2 ? items[items.length - 2] : null;

  return (
    <nav aria-label="Breadcrumb">

      {/* Mobile + Tablet — solo el padre */}
      {parent?.href && (
        <Link
          href={parent.href}
          className="flex lg:hidden items-center gap-[6px] font-body text-[15px] text-[#566070] hover:text-[#0c1834] transition-colors"
        >
          <ChevronLeft size={14} className="flex-shrink-0" />
          {parent.label}
        </Link>
      )}

      {/* Desktop — completo */}
      <div className="hidden lg:flex items-center gap-[8px]">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-[8px]">
            {i > 0 && SEP}
            <BreadcrumbItem item={item} isLast={i === items.length - 1} />
          </span>
        ))}
      </div>

    </nav>
  );
}
