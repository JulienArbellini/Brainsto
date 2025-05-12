"use client";

import { useState } from "react";

type AgentProfile = {
  name: string;
  rolePrompt: string;
};

const availableAgents: AgentProfile[] = [
  {
    name: "Lucie (Pessimiste)",
    rolePrompt: "Tu es une IA très sceptique et critique. Tu remets en question tout ce qu'on te dit.",
  },
  {
    name: "Victor (Réaliste)",
    rolePrompt: "Tu es une IA réaliste et pondérée. Tu mets en avant les faits et les limites.",
  },
  {
    name: "Léna (Visionnaire)",
    rolePrompt: "Tu es une IA visionnaire et imaginative. Tu projettes le sujet dans le futur avec audace.",
  },
];

export default function InteractPage() {
  const [step, setStep] = useState<"subject" | "opinion" | "agent" | "chat">("subject");

  const [topic, setTopic] = useState("");
  const [userOpinion, setUserOpinion] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<AgentProfile | null>(null);

  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);

  const startDebate = async () => {
    if (!selectedAgent) return;

    const res = await fetch("/api/ia-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: selectedAgent.rolePrompt },
          { role: "user", content: userOpinion },
        ],
      }),
    });

    const data = await res.json();
    setChatHistory([
      { role: "user", content: userOpinion },
      { role: "assistant", content: data.response },
    ]);

    setStep("chat");
  };

  const handleUserReply = async (message: string) => {
    const newMessages = [...chatHistory, { role: "user", content: message }];
    setChatHistory(newMessages);

    const res = await fetch("/api/ia-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: selectedAgent?.rolePrompt },
          ...newMessages,
        ],
      }),
    });

    const data = await res.json();
    setChatHistory([...newMessages, { role: "assistant", content: data.response }]);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">💬 Débattez avec une IA</h1>

      {step === "subject" && (
        <div className="space-y-4">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Quel est le sujet du débat ?"
            className="w-full p-2 border rounded"
          />
          <button onClick={() => setStep("opinion")} className="bg-blue-600 text-white px-4 py-2 rounded">
            Suivant
          </button>
        </div>
      )}

      {step === "opinion" && (
        <div className="space-y-4">
          <textarea
            value={userOpinion}
            onChange={(e) => setUserOpinion(e.target.value)}
            placeholder="Donnez votre point de vue personnel"
            className="w-full p-2 border rounded h-32"
          />
          <button onClick={() => setStep("agent")} className="bg-blue-600 text-white px-4 py-2 rounded">
            Suivant
          </button>
        </div>
      )}

      {step === "agent" && (
        <div className="space-y-4">
          <p>Choisissez l'IA qui va vous contredire :</p>
          {availableAgents.map((agent) => (
            <button
              key={agent.name}
              onClick={() => {
                setSelectedAgent(agent);
                startDebate();
              }}
              className="block w-full text-left border px-4 py-2 rounded hover:bg-gray-100"
            >
              {agent.name}
            </button>
          ))}
        </div>
      )}

      {step === "chat" && selectedAgent && (
        <div className="space-y-4">
          <h2 className="font-semibold">💬 Débat avec {selectedAgent.name}</h2>
          <div className="space-y-2 bg-white border p-4 rounded h-96 overflow-y-auto">
            {chatHistory.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                <p className="bg-gray-100 inline-block px-3 py-1 rounded">
                  <strong>{msg.role === "user" ? "Vous" : selectedAgent.name} :</strong> {msg.content}
                </p>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.elements.namedItem("reply") as HTMLInputElement;
              const value = input.value;
              input.value = "";
              handleUserReply(value);
            }}
            className="flex space-x-2"
          >
            <input
              name="reply"
              className="flex-1 p-2 border rounded"
              placeholder="Votre réponse..."
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Envoyer
            </button>
          </form>
        </div>
      )}
    </main>
  );
}