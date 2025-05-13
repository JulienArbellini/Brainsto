"use client";

import { useState } from "react";
import { useEffect } from "react";
import DebateTopicForm from "@/components/DebateTopicForm";
// import UserOpinionForm from "@/components/UserOpinionForm"; // plus utilisé
import AgentBuilder from "@/components/AgentBuilder";
import ChatWithIA from "@/components/ChatWithIA";
import { AgentConfig } from "@/types/Agents";

export default function DebatePage() {
  const [step, setStep] = useState<"topic" | "agent" | "chat">("chat");
  const [topic, setTopic] = useState("");
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [suggestedAgents, setSuggestedAgents] = useState<AgentConfig[] | null>(null);
  

//   useEffect(() => {
//     if (step === "agent" && topic && suggestedAgents === null) {
//       fetch("/api/generate-agents", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ topic }),
//       })
//         .then((res) => res.json())
//         .then((data) => setSuggestedAgents(data.agents || []))
//         .catch((err) => {
//           console.error("Erreur de génération des agents :", err);
//           setSuggestedAgents([]); // pour éviter de boucler
//         });
//     }
//   }, [step, topic, suggestedAgents]);

// POUR TEST UNIQUEMENT
useEffect(() => {
    if (step === "chat" && agents.length === 0) {
      setTopic("Faut-il interdire les trottinettes électriques ?");
      setAgents([
        {
          name: "Lucie",
          intro: "Lucie est écologiste convaincue et souhaite limiter les véhicules motorisés.",
          objectif: "Démontrer que les trottinettes sont nuisibles à l’environnement urbain.",
          inspiration: "Greta Thunberg",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucie"
        },
        {
          name: "Marc",
          intro: "Marc est un entrepreneur qui défend l’innovation et la mobilité douce.",
          objectif: "Prouver que les trottinettes sont un progrès nécessaire.",
          inspiration: "Elon Musk",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc"
        }
      ]);
    }
  }, [step]);
  

  return (
    <main className={step === "chat" ? "h-screen flex flex-col" : "max-w-3xl mx-auto p-6 space-y-6"}>
      {step !== "chat" && <h1 className="text-2xl font-bold">🧠 Démarrez votre débat</h1>}
  
      {step === "topic" && (
        <DebateTopicForm
          topic={topic}
          onSubmit={(newTopic) => {
            setTopic(newTopic);
            setStep("agent");
          }}
        />
      )}
  
      {step === "agent" && (
        suggestedAgents === null ? (
          <p className="text-center text-gray-500">Chargement des suggestions d'agents...</p>
        ) : (
          <AgentBuilder
            initialAgents={suggestedAgents}
            onSubmit={(createdAgents) => {
              setAgents(createdAgents);
              setStep("chat");
            }}
            onBack={() => setStep("topic")}
          />
        )
      )}
  
      {step === "chat" && agents.length > 0 && (
        <ChatWithIA
          topic={topic}
          userOpinion={""}
          agents={agents}
          isMock={true}
          onRestart={() => {
            setStep("topic");
            setTopic("");
            setAgents([]);
          }}
        />
      )}
    </main>
  );
  
}
