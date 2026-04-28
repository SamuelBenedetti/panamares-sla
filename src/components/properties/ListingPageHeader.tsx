"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import SeoBlockCollapsible from "@/components/properties/SeoBlockCollapsible";

interface Props {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  eyebrow?: string;
  count?: number;
}

export default function ListingPageHeader({ breadcrumbs, title, description, eyebrow, count }: Props) {
  return (
    <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[32px] xl:pt-[40px] pb-[20px] xl:pb-[28px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-[16px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-[8px] flex-wrap">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-[8px]">
              {i > 0 && <ChevronRight size={13} className="text-[#5a6478]" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="font-body font-normal text-[16px] text-[#5a6478] tracking-[-0.32px] hover:text-[#0c1834] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-body font-medium text-[16px] text-[#0c1834] tracking-[-0.32px]">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        {/* H1 + contador */}
        <div className="flex flex-col gap-[8px]">
          {eyebrow && (
            <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
              {eyebrow}
            </p>
          )}
          <h1 className="font-heading font-normal text-[clamp(36px,4vw,60px)] 2xl:text-[52px] text-[#0c1834] leading-none tracking-[-1.8px] max-w-[850px]">
            {title}
          </h1>
          {count != null && (
            <p className="font-body text-[14px] text-[#5a6478] leading-none">
              <span className="font-semibold text-[#0c1834]">{count}</span>{" "}
              {title.toLowerCase()} disponibles
            </p>
          )}
        </div>

        {/* SEO block — visible en desktop, colapsable en móvil */}
        {description && <SeoBlockCollapsible text={description} />}

      </div>
    </section>
  );
}
