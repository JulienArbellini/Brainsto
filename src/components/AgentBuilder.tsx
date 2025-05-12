"use client";

import { useState } from "react";
import { AgentConfig } from "@/types/Agents";

interface Props {
  onSubmit: (agent: AgentConfig) => void;
  onBack: () => void;
}

export default function AgentBuilder({ onSubmit, onBack }: Props) {
  const [name, setName] = useState("Lucie");
  const [intro, setIntro] = useState(
    "Tu es une IA contradictrice, sceptique mais intelligente. Tu identifies les failles des raisonnements avec pertinence."
  );
  const [objectif, setObjectif] = useState(
    "Remettre en question les certitudes de ton interlocuteur."
  );
  const [inspiration, setInspiration] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Configurez votre contradicteur IA</h2>

      <div className="space-y-2">
        <label>Nom</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Ex : Lucie, Victor..."
          required
        />
      </div>

      <div className="space-y-2">
        <label>Rôle / personnalité (prompt system)</label>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          className="w-full p-2 border rounded h-24"
          placeholder="Ex : Tu es un contradicteur cynique, toujours à l'affût de contradictions logiques."
          required
        />
      </div>

      <div className="space-y-2">
        <label>Inspire-toi de... (facultatif)</label>
        <input
            value={inspiration}
            onChange={(e) => setInspiration(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex : Zemmour, Elon Musk, Socrate, ta grand-mère…"
        />
        </div>

      <div className="space-y-2">
        <label>Objectif dans ce débat (facultatif)</label>
        <textarea
          value={objectif}
          onChange={(e) => setObjectif(e.target.value)}
          className="w-full p-2 border rounded h-20"
          placeholder="Ex : Pousser l’utilisateur à remettre en question ses croyances"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="text-gray-600 border px-4 py-2 rounded hover:bg-gray-100"
        >
          ⬅ Retour
        </button>

        <button
          onClick={() =>
            onSubmit({
              name,
              intro,
              objectif,
              inspiration,
            })
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Démarrer le débat
        </button>
      </div>
    </div>
  );
}