// English agent bios + roles. Empty in PR1 — populated in PR2.
// Keys MUST mirror `agentes.es.ts` exactly.

export interface AgentCopy {
  bio?: string;
  role?: string;
}

export const agentesEn: Record<string, AgentCopy> = {
  // Populated in PR2 from `agentes.es.ts`.
};
