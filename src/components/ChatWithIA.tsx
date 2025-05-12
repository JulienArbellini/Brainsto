"use client";

import { useEffect, useRef, useState } from "react";
import { AgentConfig } from "@/types/Agents";
import { ChatMessage } from "@/types/ChatMessage";

interface Props {
  topic: string;
  userOpinion: string;
  agents: AgentConfig[];
  onRestart: () => void;
}

export default function ChatWithIA(props: Props) {
  const { topic, userOpinion, onRestart } = props;
  const [agents, setAgents] = useState<AgentConfig[]>(props.agents);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewAgentForm, setShowNewAgentForm] = useState(false);
  const [newAgent, setNewAgent] = useState<AgentConfig>({
    name: "",
    intro: "",
    objectif: "",
    inspiration: "",
  });
  const chatEndRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [chat]);

  function generateMessagesForAgent(
    agent: AgentConfig,
    agents: AgentConfig[],
    chat: ChatMessage[],
    topic: string,
    userOpinion: string
  ) {
    const personalityPrompt = `Tu es ${agent.name}, un agent d’intelligence artificielle.
  Ton rôle dans ce débat est : ${agent.intro}
  Ton objectif est : ${agent.objectif || "participer au débat avec ton propre point de vue"}.
  Le sujet du débat est : \"${topic}\".
  Voici l’avis exprimé par l'utilisateur au début du débat : \"${userOpinion}\".
  Tu ne dois jamais sortir de ton personnage ni adopter un ton neutre ou généralisé.
  Exprime-toi toujours avec cohérence, dans le style et les intentions de ce personnage.`.trim();

    if (agents.length === 1) {
      return [
        { role: "system", content: personalityPrompt },
        ...(agent.inspiration ? [{ role: "system", content: `Inspire-toi de ${agent.inspiration}` }] : []),
        ...chat.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
      ];
    }

    const others = agents.filter((a) => a.name !== agent.name);
    return [
      { role: "system", content: personalityPrompt },
      ...(agent.inspiration ? [{ role: "system", content: `Inspire-toi de ${agent.inspiration}` }] : []),
      {
        role: "system",
        content: `Tu participes à un débat avec les agents suivants : ${others.map((a) => a.name).join(", ")}.
  Voici l’historique du débat :\n\n${chat.map((m) => `${m.role} a dit : ${m.content}`).join("\n\n")}`,
      },
      {
        role: "user",
        content: `Exprime ta réponse maintenant.`,
      },
    ];
  }

  function getColorClassForAgent(name: string): string {
    const colors = [
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    ];
  
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
  

  const startDebate = async () => {
    setLoading(true);
    const updatedChat: ChatMessage[] = [];

    for (const agent of agents) {
      const messages = generateMessagesForAgent(agent, agents, updatedChat, topic, userOpinion);

      const res = await fetch("/api/ia-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rolePrompt: agent.intro?.trim() || `Tu es ${agent.name}, une IA d'opinion.`,
          objectif: agent.objectif || "",
          inspiration: agent.inspiration || "",
          messages,
        }),
      });

      const data = await res.json();
      updatedChat.push({ role: agent.name, content: data.response });
    }

    setChat(updatedChat);
    setLoading(false);
  };

  useEffect(() => {
    startDebate();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("reply") as HTMLInputElement;
    const value = input.value.trim();
    if (!value) return;

    input.value = "";
    const newChat: ChatMessage[] = [...chat, { role: "user", content: value }];
    setChat(newChat);
    setLoading(false);
  };

  const handleAgentResponse = async (agent: AgentConfig) => {
    if (!agent.intro || agent.intro.trim() === "") {
      alert(`L'agent \"${agent.name}\" n'a pas de rôle (intro) défini.`);
      return;
    }

    setLoading(true);

    const messages = generateMessagesForAgent(agent, agents, chat, topic, userOpinion);

    try {
      const res = await fetch("/api/ia-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rolePrompt: agent.intro?.trim() || `Tu es ${agent.name}, une IA d'opinion.`,
          objectif: agent.objectif || "",
          inspiration: agent.inspiration || "",
          messages,
        }),
      });

      const data = await res.json();

      if (data.response) {
        setChat((prev) => [...prev, { role: agent.name, content: data.response }]);
      } else {
        console.error("Erreur de réponse IA :", data);
      }
    } catch (err) {
      console.error("Erreur de requête IA :", err);
    }

    setLoading(false);
  };

  return (
<div className="flex flex-col h-screen text-gray-900 dark:text-gray-100">

{/* Header (fixe) */}
<div className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-bold">💬 Débat avec {agents.map((a) => a.name).join(", ")}</h2>
    <button onClick={onRestart} className="text-sm text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
      🔁 Recommencer
    </button>
  </div>
</div>

{/* Zone de chat (scrollable) */}
<div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
  {chat.map((msg, i) => (
    <div key={i} className={`text-sm ${msg.role === "user" ? "text-right" : "text-left"}`}>
      <div className={`inline-block px-3 py-2 rounded ${msg.role === "user" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" : getColorClassForAgent(msg.role)}`}>
        <strong>{msg.role === "user" ? "Vous" : msg.role} :</strong> {msg.content}
      </div>
    </div>
  ))}
  {loading && <p className="text-center text-gray-400 dark:text-gray-500">L’IA réfléchit...</p>}
  <div ref={chatEndRef} />
</div>

{/* Actions agents */}
<div className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 space-y-2">
  <p className="text-sm font-semibold">💡 Faire intervenir un agent :</p>
  <div className="flex flex-wrap gap-2">
    {agents.map((agent) => (
      <button
        key={agent.name}
        onClick={() => handleAgentResponse(agent)}
        className="flex items-center gap-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded"
        disabled={loading}
      >
        {agent.image && <img src={agent.image} alt={agent.name} className="w-5 h-5 rounded-full" />}
        💬 {agent.name}
      </button>
    ))}
  </div>
</div>

{/* Formulaire de réponse (fixe en bas) */}
<form onSubmit={handleSubmit} className="px-4 py-2 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex space-x-2">
  <input
    name="reply"
    className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
    placeholder="Votre réponse..."
    disabled={loading}
  />
  <button
    type="submit"
    disabled={loading}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Envoyer
  </button>
</form>
</div>

  );
}
