import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, ArrowRight } from "lucide-react";
import type { Agent } from "@/lib/types";
import { urlFor } from "@/sanity/lib/image";
import { getCopy, type Locale } from "@/lib/copy";
import { localePath } from "@/lib/i18n";

export default function AgentCard({
  agent,
  locale = "es",
}: {
  agent: Agent;
  locale?: Locale;
}) {
  const t = getCopy(locale).components.agentCard;
  const profileHref = localePath(`/agentes/${agent.slug.current}/`, locale);
  const imageUrl = agent.photo
    ? urlFor(agent.photo).width(480).height(560).url()
    : null;

  return (
    <article className="bg-white border border-[rgba(233,231,226,0.5)] shadow-sm group overflow-hidden flex flex-col">
      {/* Photo */}
      <Link href={profileHref} className="block relative h-[240px] sm:h-[280px] shrink-0 overflow-hidden bg-[#0c1834]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={agent.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-heading text-[48px] text-white/30 leading-none select-none">
              {agent.name[0]}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-[12px] p-[16px] sm:p-[20px] flex-1">
        <div className="flex flex-col gap-[4px]">
          {agent.role && (
            <p className="font-body font-medium text-[10px] text-[#b8891e] tracking-[3px] uppercase leading-4">
              {agent.role}
            </p>
          )}
          <Link href={profileHref}>
            <h3 className="font-heading font-normal text-[20px] sm:text-[22px] text-[#0c1834] leading-tight tracking-[-0.5px] hover:opacity-70 transition-opacity">
              {agent.name}
            </h3>
          </Link>
        </div>

        <div className="h-px bg-[#dfe5ef]" />

        <div className="flex flex-col gap-[6px] flex-1">
          {agent.phone && (
            <a
              href={`tel:${agent.phone}`}
              className="flex items-center gap-[8px] font-body text-[12px] text-[#5a6478] hover:text-[#0c1834] transition-colors"
            >
              <Phone size={12} strokeWidth={1.5} className="shrink-0" />
              {agent.phone}
            </a>
          )}
          {agent.email && (
            <a
              href={`mailto:${agent.email}`}
              className="flex items-center gap-[8px] font-body text-[12px] text-[#5a6478] hover:text-[#0c1834] transition-colors truncate"
            >
              <Mail size={12} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{agent.email}</span>
            </a>
          )}
        </div>

        <Link
          href={profileHref}
          className="mt-[4px] w-full h-[40px] flex items-center justify-center gap-[6px] bg-[#0c1834] hover:bg-[#162444] font-body font-medium text-[11px] text-white tracking-[1.2px] uppercase transition-colors"
        >
          {t.verPerfil}
          <ArrowRight size={11} />
        </Link>
      </div>
    </article>
  );
}
