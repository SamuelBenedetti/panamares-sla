"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Agent } from "@/lib/types";
import AgentCard from "./AgentCard";

const PAGE_SIZE = 8;

export default function AgentGrid({ agents }: { agents: Agent[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  if (agents.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-[16px] text-[#5a6478]">No hay agentes registrados todavía.</p>
      </div>
    );
  }

  const shown = agents.slice(0, visible);
  const remaining = agents.length - visible;

  return (
    <div className="flex flex-col gap-[40px]">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-[20px]">
        {shown.map((a) => (
          <AgentCard key={a._id} agent={a} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="pt-[8px] flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-[8px] font-body font-medium text-[#5a6478] text-[14px] uppercase tracking-[0.35px] hover:text-[#0c1834] transition-colors"
          >
            Cargar más
            <span className="font-normal">({remaining} restantes)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
