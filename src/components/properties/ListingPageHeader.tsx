import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";

interface Props {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description?: string;
  eyebrow?: string;
  count?: number;
}

function DescriptionText({ text }: { text: string }) {
  const dotIdx = text.indexOf(". ");
  if (dotIdx === -1) {
    return (
      <p className="font-body font-normal text-[16px] text-[#0c1834] leading-[1.55] tracking-[-0.32px] max-w-[600px] xl:max-w-[850px]">
        {text}
      </p>
    );
  }
  const first = text.slice(0, dotIdx + 1);
  const rest = text.slice(dotIdx + 1);
  return (
    <p className="font-body text-[16px] text-[#0c1834] leading-[1.55] tracking-[-0.32px] max-w-[600px] xl:max-w-[850px]">
      <span className="font-semibold">{first}</span>
      <span className="font-normal">{rest}</span>
    </p>
  );
}

export default function ListingPageHeader({ breadcrumbs, title, description, eyebrow }: Props) {
  return (
    <section className="bg-[#f9f9f9] px-[30px] xl:px-[20px] 2xl:px-[120px] pt-[32px] xl:pt-[40px] pb-[20px] xl:pb-[28px]">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-[16px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-[8px] flex-wrap">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-[8px]">
              {i > 0 && <ChevronRight size={13} className="text-[#737b8c]" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="font-body font-normal text-[16px] text-[#737b8c] tracking-[-0.32px] hover:text-[#0c1834] transition-colors"
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

        {/* Heading + description */}
        <div className="flex flex-col gap-[12px]">
          {eyebrow && (
            <p className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
              {eyebrow}
            </p>
          )}
          <h1 className="font-heading font-normal text-[clamp(36px,4vw,60px)] text-[#0c1834] leading-none tracking-[-1.8px] max-w-[850px]">
            {title}
          </h1>
          {description && <DescriptionText text={description} />}
        </div>

      </div>
    </section>
  );
}
