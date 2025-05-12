"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfigPage() {
  const [agents, setAgents] = useState([
    { name: "", intro: "", objectif: "" },
  ]);

  const [topic, setTopic] = useState("");
  const router = useRouter();

  const handleAddAgent = () => {
    setAgents([...agents, { name: "", intro: "", objectif: "" }]);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newAgents = [...agents];
    newAgents[index] = { ...newAgents[index], [field]: value };
    setAgents(newAgents);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("debateTopic", topic);
    localStorage.setItem("debateAgents", JSON.stringify(agents));
    router.push("/debate");
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configurer le débat</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Sujet du débat"
          className="w-full p-2 border rounded"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />

        {agents.map((agent, index) => (
          <div key={index} className="border p-4 rounded bg-white space-y-2">
            <input
              type="text"
              placeholder="Nom de l'agent"
              className="w-full p-2 border rounded"
              value={agent.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              required
            />
            <textarea
              placeholder="Description du rôle/personnalité"
              className="w-full p-2 border rounded"
              value={agent.intro}
              onChange={(e) => handleChange(index, "intro", e.target.value)}
              required
            />
            <textarea
              placeholder="Objectif / intention de débat (facultatif)"
              className="w-full p-2 border rounded"
              value={agent.objectif}
              onChange={(e) => handleChange(index, "objectif", e.target.value)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddAgent}
          className="text-blue-600 "
        >
          ➕ Ajouter un agent
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Lancer le débat
        </button>
      </form>
    </main>
  );
}