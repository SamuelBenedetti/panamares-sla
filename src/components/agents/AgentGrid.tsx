import type { Agent } from "@/lib/types";
import AgentCard from "./AgentCard";

export default function AgentGrid({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-[16px] text-[#737b8c]">No hay agentes registrados todavía.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-[20px]">
      {agents.map((a) => (
        <AgentCard key={a._id} agent={a} />
      ))}
    </div>
  );
}
