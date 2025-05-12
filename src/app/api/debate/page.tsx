"use client";

import { useEffect, useState } from "react";
import AgentResponse from "@/components/AgentResponse";

interface DebateTurn {
  phase: string;
  responses: { name: string; content: string }[];
}

export default function DebatePage() {
  const [turns, setTurns] = useState<DebateTurn[]>([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const agentsRaw = localStorage.getItem("debateAgents");
    const topicRaw = localStorage.getItem("debateTopic");

    if (!agentsRaw || !topicRaw) return;

    const agents = JSON.parse(agentsRaw);
    setTopic(topicRaw);

    const runDebate = async () => {
      setLoading(true);
      const res = await fetch("/api/debate/structured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicRaw, agents }),
      });
      const data = await res.json();
      setTurns(data.turns);
      setLoading(false);
    };

    runDebate();
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Débat : {topic}</h1>

      {loading ? (
        <p>Chargement du débat en cours...</p>
      ) : (
        turns.map((turn, index) => (
          <section key={index} className="mb-10">
            <h2 className="text-xl font-semibold mb-4">🔁 {turn.phase}</h2>
            <div className="space-y-4">
              {turn.responses.map((res, i) => (
                <AgentResponse
                  key={i}
                  name={res.name}
                  content={res.content}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
}