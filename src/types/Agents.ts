export interface AgentConfig {
    name: string;
    intro: string; // description du rôle
    objectif?: string; // optionnel : intention ou angle d’attaque
    voice?: string; // pour plus tard (nova, alloy, etc.)
    inspiration?: string; // 👈 nouveau champ
  }