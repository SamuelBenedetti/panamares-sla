import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-[8px]">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-[8px]">
          {i > 0 && (
            <ChevronRight size={14} className="text-[#737b8c] flex-shrink-0" />
          )}
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="font-body text-[16px] text-[#737b8c] tracking-[-0.32px] hover:text-[#0c1834] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`font-body text-[16px] tracking-[-0.32px] ${
                i === items.length - 1
                  ? "font-medium text-[#0c1834]"
                  : "text-[#737b8c]"
              }`}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
