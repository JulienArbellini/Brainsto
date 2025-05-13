import { AgentConfig } from "@/types/Agents";
import { useEffect, useState } from "react";

interface ChatBubbleProps {
  message: { role: string; content: string };
  agent?: AgentConfig;
  isUser: boolean;
  colorClass: string;
  animate?: boolean;
}

export default function ChatBubble({ message, agent, isUser, colorClass, animate }: ChatBubbleProps) {
  const [displayedText, setDisplayedText] = useState(animate ? "" : message.content);
  useEffect(() => {
    if (!animate) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(message.content.slice(0, i));
      if (i >= message.content.length) clearInterval(interval);
    }, 10); // ⏱ vitesse d'affichage (ms par lettre)

    return () => clearInterval(interval);
  }, [message.content, animate]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} text-sm pr-2`}>
      {!isUser && agent?.image && (
        <img
          src={agent.image}
          alt={agent.name}
          className="w-8 h-8 rounded-full mr-2 self-end"
        />
      )}

      <div className={`${colorClass} px-3 py-2 rounded-xl max-w-[75%]`}>
        <strong>{isUser ? "Vous" : message.role} :</strong> {message.content}
      </div>
    </div>
  );
}
