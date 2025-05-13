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

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
const [editedAgent, setEditedAgent] = useState<AgentConfig | null>(null);
const [showForm, setShowForm] = useState(false);


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

  const getShortRole = (intro: string) => {
    if (!intro) return "Agent IA";
    const keywords = ["écologiste", "entrepreneur", "philosophe", "critique", "optimiste"];
    const found = keywords.find((kw) => intro.toLowerCase().includes(kw));
    return found ? `Agent ${found}` : intro.split(" ").slice(0, 2).join(" ");
  };

  return (
    <div className="flex justify-center">
      <div className="space-y-4 text-black dark:text-white max-w-3xl"></div>
      <div className="space-y-4 text-black dark:text-white">
        <h2 className="text-xl font-semibold">👥 Configurez les agents du débat</h2>

        <div className="flex flex-wrap gap-4">
    {initialAgents.map((agent, i) => (
      <div
        key={i}
        className="relative group flex flex-col items-center w-20 text-center cursor-pointer"
      >
        <img
          src={agent.image}
          alt={`Avatar de ${agent.name}`}
          className="w-16 h-16 rounded-full border dark:border-gray-600"
        />
        <p className="text-xs mt-1 text-gray-700 dark:text-gray-300 truncate max-w-full">
          {agent.role}
        </p>

        {/* Fiche détaillée au hover */}
        <div className="absolute z-10 hidden group-hover:flex flex-col items-start text-left bg-white dark:bg-gray-800 border dark:border-gray-600 p-3 rounded shadow-lg w-64 top-20">
          <p><strong>{agent.name}</strong></p>
          <p className="text-sm">{agent.intro}</p>
          {agent.objectif && <p className="text-sm mt-1">🎯 {agent.objectif}</p>}
          {agent.inspiration && <p className="text-sm">🌟 {agent.inspiration}</p>}
          <button
            onClick={() => handleAddSuggested(agent)}
            className="text-sm text-blue-600 dark:text-blue-400 mt-2"
          >
            ➕ Ajouter cet agent
          </button>
        </div>
      </div>
    ))}
  </div>

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

  <div>
    {/* Bouton cercle + (comme une suggestion) */}
    <div
      onClick={() => setShowForm(true)}
      className="flex flex-col items-center w-20 text-center cursor-pointer"
    >
      <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-500 flex items-center justify-center text-3xl text-gray-500 dark:text-gray-300">
        +
      </div>
      <p className="text-xs mt-1 text-gray-700 dark:text-gray-300">Nouvel agent</p>
    </div>

    {/* Formulaire affiché au clic */}
    {showForm && (
      <div className="mt-4 border rounded p-4 space-y-2 bg-gray-50 dark:bg-gray-800 max-w-md">
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
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowForm(false)}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              handleAdd();
              setShowForm(false);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>
    )}
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
    </div>
  );
}