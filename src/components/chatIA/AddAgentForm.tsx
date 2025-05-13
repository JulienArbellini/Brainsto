"use client";

import { useState } from "react";
import { AgentConfig } from "@/types/Agents";

interface Props {
  onAdd: (agent: AgentConfig) => void;
}

export default function AddAgentForm({ onAdd }: Props) {
  const [show, setShow] = useState(false);
  const [agent, setAgent] = useState<AgentConfig>({
    name: "",
    intro: "",
    objectif: "",
    inspiration: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent.name || !agent.intro) return;
    onAdd(agent);
    setAgent({ name: "", intro: "", objectif: "", inspiration: "" });
    setShow(false);
  };

  return (
    <div className="border p-3 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700 mt-4">
      <button
        onClick={() => setShow(!show)}
        className="text-sm text-blue-600 dark:text-blue-400  mb-2"
      >
        ➕ Ajouter un intervenant IA
      </button>

      {show && (
        <form onSubmit={handleSubmit} className="space-y-2 text-sm">
          <input
            placeholder="Nom"
            className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
            value={agent.name}
            onChange={(e) => setAgent({ ...agent, name: e.target.value })}
          />
          <input
            placeholder="Intro / rôle (obligatoire)"
            className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
            value={agent.intro}
            onChange={(e) => setAgent({ ...agent, intro: e.target.value })}
          />
          <input
            placeholder="Objectif"
            className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
            value={agent.objectif}
            onChange={(e) => setAgent({ ...agent, objectif: e.target.value })}
          />
          <input
            placeholder="Inspiration"
            className="w-full p-1 border rounded dark:bg-gray-700 dark:text-white"
            value={agent.inspiration}
            onChange={(e) => setAgent({ ...agent, inspiration: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Ajouter l'IA
          </button>
        </form>
      )}
    </div>
  );
}
