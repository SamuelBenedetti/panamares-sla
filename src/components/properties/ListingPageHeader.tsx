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

export default function ListingPageHeader({ breadcrumbs, title, description, eyebrow, count }: Props) {
  // Split title into two lines for the heading style used across the site
  const words = title.split(" ");
  const half = Math.ceil(words.length / 2);
  const line1 = words.slice(0, half).join(" ");
  const line2 = words.slice(half).join(" ");

  return (
    <section className="bg-[#0c1834] px-[30px] xl:px-[260px] pt-[120px] xl:pt-[160px] pb-[60px] xl:pb-[80px]">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-[24px]">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-[8px] flex-wrap">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-[8px]">
              {i > 0 && <ChevronRight size={12} className="text-white/25" />}
              {item.href ? (
                <Link href={item.href} className="font-body text-[13px] text-white/40 hover:text-white/70 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="font-body text-[13px] text-white/70">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Heading */}
        <div className="flex flex-col gap-[16px] max-w-[720px]">
          {eyebrow && (
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              {eyebrow}
            </p>
          )}
          <div className="flex flex-col text-white">
            <span className="font-heading font-normal text-[clamp(36px,4.5vw,64px)] leading-none tracking-[-1.8px]">
              {line1}
            </span>
            {line2 && (
              <span className="font-heading font-medium italic text-[clamp(40px,5vw,70px)] leading-none tracking-[-2px]">
                {line2}
              </span>
            )}
          </div>
          {count !== undefined && (
            <p className="font-body font-medium text-[14px] text-white/50">
              {count} {count === 1 ? "propiedad activa" : "propiedades activas"}
            </p>
          )}
          {description && (
            <p className="font-body font-light text-[16px] xl:text-[17px] text-white/70 leading-relaxed max-w-[560px] pt-[4px]">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
