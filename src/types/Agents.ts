// types/Agents.ts
export interface AgentConfig {
    name: string;
    intro: string;
    objectif?: string;
    inspiration?: string;
    image?: string; // ✅ nouvelle propriété pour l’image
  }