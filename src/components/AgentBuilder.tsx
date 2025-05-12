"use client";

import { useState } from "react";
import { AgentConfig } from "@/types/Agents";

interface Props {
  onSubmit: (agents: AgentConfig[]) => void;
  onBack: () => void;
  initialAgents?: AgentConfig[]; // suggestions
}

export default function AgentBuilder({ onSubmit, onBack, initialAgents = [] }: Props) {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [newAgent, setNewAgent] = useState<AgentConfig>({
    name: "",
    intro: "",
    objectif: "",
    inspiration: "",
  });

  const handleAdd = () => {
    if (!newAgent.name || !newAgent.intro) return;
    setAgents((prev) => [...prev, newAgent]);
    setNewAgent({ name: "", intro: "", objectif: "", inspiration: "" });
  };

  const handleAddSuggested = (suggested: AgentConfig) => {
    if (!agents.find((a) => a.name === suggested.name)) {
      setAgents((prev) => [...prev, suggested]);
    }
  };

  return (
    <div className="space-y-4 text-black dark:text-white">
      <h2 className="text-xl font-semibold">👥 Configurez les agents du débat</h2>

      <ul className="space-y-2">
        {initialAgents.map((agent, i) => (
            <li key={i} className="flex items-start gap-4 border p-3 rounded bg-gray-50 dark:bg-gray-800">
            {agent.image && (
                <img
                src={agent.image}
                alt={`Avatar de ${agent.name}`}
                className="w-12 h-12 rounded-full border dark:border-gray-700"
                />
            )}
            <div className="flex-1 space-y-1">
                <p><strong>{agent.name}</strong> — {agent.intro}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                🎯 {agent.objectif || "aucun"} · 🌟 Inspiration : {agent.inspiration || "aucune"}
                </p>
                <button
                onClick={() => handleAddSuggested(agent)}
                className="mt-1 text-xs text-blue-600 dark:text-blue-400 "
                >
                ➕ Ajouter cet agent
                </button>
            </div>
            </li>
        ))}
        </ul>

      {agents.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium">Agents sélectionnés :</p>
          <ul className="list-disc pl-4">
            {agents.map((agent, i) => (
              <li key={i}>
                <strong>{agent.name}</strong> — {agent.intro} (🎯 {agent.objectif || "aucun"})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border rounded p-4 space-y-2 bg-gray-50 dark:bg-gray-800">
        <p className="font-medium">➕ Ajouter un agent personnalisé :</p>
        <input
          className="w-full p-2 border rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Nom de l'agent"
          value={newAgent.name}
          onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Rôle / Intro (obligatoire)"
          value={newAgent.intro}
          onChange={(e) => setNewAgent({ ...newAgent, intro: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Objectif"
          value={newAgent.objectif}
          onChange={(e) => setNewAgent({ ...newAgent, objectif: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Inspiration"
          value={newAgent.inspiration}
          onChange={(e) => setNewAgent({ ...newAgent, inspiration: e.target.value })}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          ➕ Ajouter l'agent
        </button>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="text-sm text-gray-600 dark:text-gray-300 "
        >
          ⬅ Retour
        </button>
        {agents.length > 0 && (
          <button
            onClick={() => onSubmit(agents)}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
          >
            ✅ Lancer le débat
          </button>
        )}
      </div>
    </div>
  );
}