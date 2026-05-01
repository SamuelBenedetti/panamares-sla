import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

type Variant = "dark" | "light";

const COLORS: Record<Variant, { current: string; link: string; sep: string; mobileLink: string }> = {
  dark:  { current: "text-[#0c1834]", link: "text-[#566070] hover:text-[#0c1834]", sep: "text-[#566070]", mobileLink: "text-[#566070] hover:text-[#0c1834]" },
  light: { current: "text-white",     link: "text-white/70 hover:text-white",      sep: "text-white/40", mobileLink: "text-white/70 hover:text-white" },
};

function ItemContent({
  item,
  isLast,
  variant,
}: {
  item: BreadcrumbItem;
  isLast: boolean;
  variant: Variant;
}) {
  const colors = COLORS[variant];
  const cls = `font-body text-[16px] tracking-[-0.32px] ${
    isLast ? `font-medium ${colors.current}` : colors.link
  } transition-colors`;
  return item.href && !isLast ? (
    <Link href={item.href} className={cls}>
      {item.label}
    </Link>
  ) : (
    <span className={cls} aria-current={isLast ? "page" : undefined}>
      {item.label}
    </span>
  );
}

export default function Breadcrumb({
  items,
  variant = "dark",
}: {
  items: BreadcrumbItem[];
  variant?: Variant;
}) {
  const colors = COLORS[variant];
  const parent = items.length >= 2 ? items[items.length - 2] : null;

  return (
    <nav aria-label="Breadcrumb">
      {/* Mobile + Tablet — solo el padre */}
      {parent?.href && (
        <Link
          href={parent.href}
          className={`flex lg:hidden items-center gap-[6px] font-body text-[15px] ${colors.mobileLink} transition-colors`}
        >
          <ChevronLeft size={14} className="flex-shrink-0" />
          {parent.label}
        </Link>
      )}

      {/* Desktop — completo, semantic ordered list */}
      <ol className="hidden lg:flex items-center gap-[8px] flex-wrap list-none p-0 m-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-[8px]">
              {i > 0 && (
                <ChevronRight size={14} className={`${colors.sep} flex-shrink-0`} aria-hidden="true" />
              )}
              <ItemContent item={item} isLast={isLast} variant={variant} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
