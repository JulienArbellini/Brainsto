"use client";

import { useState } from "react";
import DebateTopicForm from "@/components/DebateTopicForm";
import UserOpinionForm from "@/components/UserOpinionForm";
import AgentBuilder from "@/components/AgentBuilder";
import ChatWithIA from "@/components/ChatWithIA";
import { AgentConfig } from "@/types/Agents";

export default function DebatePage() {
  const [step, setStep] = useState<"topic" | "opinion" | "agent" | "chat">("topic");

  const [topic, setTopic] = useState("");
  const [userOpinion, setUserOpinion] = useState("");
  const [agents, setAgents] = useState<AgentConfig[]>([]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧠 Démarrez votre débat</h1>

      {step === "topic" && (
        <DebateTopicForm
          topic={topic}
          onSubmit={(newTopic) => {
            setTopic(newTopic);
            setStep("opinion");
          }}
        />
      )}

      {step === "opinion" && (
        <UserOpinionForm
          opinion={userOpinion}
          onSubmit={(opinion) => {
            setUserOpinion(opinion);
            setStep("agent");
          }}
          onBack={() => setStep("topic")}
        />
      )}

      {step === "agent" && (
        <AgentBuilder
          onSubmit={(createdAgent) => {
            setAgents([createdAgent]);
            setStep("chat");
          }}
          onBack={() => setStep("opinion")}
        />
      )}

      {step === "chat" && agents.length > 0 && (
        <ChatWithIA
          topic={topic}
          userOpinion={userOpinion}
          agents={agents}
          onRestart={() => {
            setStep("topic");
            setTopic("");
            setUserOpinion("");
            setAgents([]);
          }}
        />
      )}
    </main>
  );
}