// English agent bios + roles. Translated in PR2 from agentes.es.ts.
// Keys MUST mirror `agentes.es.ts` exactly.

export interface AgentCopy {
  bio?: string;
  role?: string;
}

export const agentesEn: Record<string, AgentCopy> = {
  "andrea-alvarado": {
    role: "Agent",
  },
  "carlos-bustamante": {
    role: "Agent",
  },
};
