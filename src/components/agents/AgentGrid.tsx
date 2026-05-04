"use client";

import type { Agent } from "@/lib/types";
import AgentCard from "./AgentCard";
import { getCopy, type Locale } from "@/lib/copy";

export default function AgentGrid({
  agents,
  locale = "es",
}: {
  agents: Agent[];
  locale?: Locale;
}) {
  if (agents.length === 0) {
    const t = getCopy(locale).pages.agentesIndex;
    return (
      <div className="text-center py-20">
        <p className="font-body text-[16px] text-[#5a6478]">{t.noAgentsYet}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-[20px]">
      {agents.map((a) => (
        <AgentCard key={a._id} agent={a} locale={locale} />
      ))}
    </div>
  );
}
