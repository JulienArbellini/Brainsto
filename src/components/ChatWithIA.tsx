"use client";

import { useEffect, useState } from "react";
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

function generateMessagesForAgent(agent: AgentConfig, agents: AgentConfig[], chat: ChatMessage[]) {
    const personalityPrompt = `Tu es ${agent.name}, un agent d’intelligence artificielle.
  Ton rôle dans ce débat est : ${agent.intro}
  Ton objectif est : ${agent.objectif || "participer au débat avec ton propre point de vue"}.
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

  const startDebate = async () => {
    setLoading(true);
    const initialChat: ChatMessage[] = [{ role: "user", content: userOpinion }];
    const updatedChat = [...initialChat];

    for (const agent of agents) {
      const res = await fetch("/api/ia-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rolePrompt: agent.intro || "Tu es une IA contradictrice.",
          objectif: agent.objectif || "",
          inspiration: agent.inspiration || "",
          messages: updatedChat.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setLoading(false); // <-- Tu termines la fonction ici
  };

  const handleAgentResponse = async (agent: AgentConfig) => {

    if (!agent.intro || agent.intro.trim() === "") {
        alert(`L'agent "${agent.name}" n'a pas de rôle (intro) défini.`);
        return;
      }

    if (!agent.intro || agent.intro.trim() === "") {
        console.warn("Cet agent n’a pas d’intro, donc pas de rôle clair !");
        alert("L’agent sélectionné n’a pas de rôle défini (‘intro’).");
        setLoading(false);
        return;
      }
    setLoading(true);
  
    const previousIAComments = chat
      .filter((m) => m.role !== "user" && m.role !== agent.name)
      .map((m) => `${m.role} a dit : "${m.content}"`)
      .join("\n\n");
  
    const lastUserMsg = [...chat].reverse().find((m) => m.role === "user")?.content || "";
  
    const userContent =
      previousIAComments || lastUserMsg
        ? `Voici ce que les autres ont dit avant toi :\n${previousIAComments}\n\nEt voici le dernier message de l'utilisateur : "${lastUserMsg}". Que réponds-tu ?`
        : "Donne ton opinion sur le sujet.";
  
    const messages = generateMessagesForAgent(agent, agents, chat);
  
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">💬 Débat avec {agents.map(a => a.name).join(", ")}</h2>
        <button
          onClick={onRestart}
          className="text-sm text-red-600 underline hover:text-red-800"
        >
          🔁 Recommencer
        </button>
      </div>

      <div className="bg-white border rounded p-4 h-96 overflow-y-auto space-y-3">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`text-sm ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-3 py-2 rounded ${
                msg.role === "user"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <strong>{msg.role === "user" ? "Vous" : msg.role} :</strong>{" "}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-center text-gray-400">L’IA réfléchit...</p>}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">💡 Faire intervenir un agent :</p>
        <div className="flex flex-wrap gap-2">
            {agents.map((agent) => (
            <button
                key={agent.name}
                onClick={() => handleAgentResponse(agent)}
                className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                disabled={loading}
            >
                💬 {agent.name}
            </button>
            ))}
        </div>
        </div>

      <div className="border p-3 rounded bg-gray-50">
  <button
    onClick={() => setShowNewAgentForm(!showNewAgentForm)}
    className="text-sm text-blue-600 underline mb-2"
    type="button"
  >
    ➕ Ajouter un intervenant IA
  </button>

  {showNewAgentForm && (
    <form
    onSubmit={async (e) => {
        e.preventDefault();
        if (!newAgent.name || !newAgent.intro) return;
      
        const agentToAdd = { ...newAgent }; // clone indépendant
        setNewAgent({ name: "", intro: "", objectif: "", inspiration: "" });
        setShowNewAgentForm(false);
      
        // On génère d'abord sa réponse avec le contexte du chat
        const res = await fetch("/api/ia-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rolePrompt: agentToAdd.intro,
            objectif: agentToAdd.objectif || "",
            inspiration: agentToAdd.inspiration || "",
            messages: chat.map((m) => ({
              role: m.role === "user" ? "user" : "assistant",
              content: m.content,
            })),
          }),
        });
      
        const data = await res.json();
      
        // Puis on l’ajoute aux agents et au chat
        setAgents((prev) => [...prev, agentToAdd]);
        setChat((prev) => [...prev, { role: agentToAdd.name, content: data.response }]);
      }}
      className="space-y-2 text-sm"
    >
      <input
        placeholder="Nom"
        className="w-full p-1 border rounded"
        value={newAgent.name}
        onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
      />
      <input
        placeholder="Intro / rôle (obligatoire)"
        className="w-full p-1 border rounded"
        value={newAgent.intro}
        onChange={(e) => setNewAgent({ ...newAgent, intro: e.target.value })}
      />
      <input
        placeholder="Objectif"
        className="w-full p-1 border rounded"
        value={newAgent.objectif}
        onChange={(e) => setNewAgent({ ...newAgent, objectif: e.target.value })}
      />
      <input
        placeholder="Inspiration"
        className="w-full p-1 border rounded"
        value={newAgent.inspiration}
        onChange={(e) => setNewAgent({ ...newAgent, inspiration: e.target.value })}
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

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          name="reply"
          className="flex-1 p-2 border rounded"
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