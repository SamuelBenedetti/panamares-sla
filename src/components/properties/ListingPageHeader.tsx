"use client";

import React from "react";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SeoBlockCollapsible from "@/components/properties/SeoBlockCollapsible";

interface Props {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  subtitle?: React.ReactNode;
  eyebrow?: string;
  count?: number;
}

export default function ListingPageHeader({ breadcrumbs, title, description, subtitle, eyebrow }: Props) {
  return (
    <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[32px] xl:pt-[40px] pb-[20px] xl:pb-[28px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-[16px]">

        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} />

        {/* H1 */}
        <div className="flex flex-col gap-[8px]">
          {eyebrow && (
            <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4">
              {eyebrow}
            </p>
          )}
          <h1 className="font-heading font-normal text-[clamp(36px,4vw,60px)] 2xl:text-[52px] text-[#0c1834] leading-none tracking-[-1.8px] max-w-[850px]">
            {title}
          </h1>
        </div>

        {/* Subtítulo fijo (sin collapsible) */}
        {subtitle}

        {/* SEO block — visible en desktop, colapsable en móvil */}
        {description && <SeoBlockCollapsible text={description} />}


      </div>
    </section>
  );
}
