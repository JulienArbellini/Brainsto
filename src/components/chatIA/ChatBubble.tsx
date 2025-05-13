import { AgentConfig } from "@/types/Agents";

interface ChatBubbleProps {
  message: { role: string; content: string };
  agent?: AgentConfig;
  isUser: boolean;
  colorClass: string;
}

export default function ChatBubble({ message, agent, isUser, colorClass }: ChatBubbleProps) {
  return (
    <div className={`text-sm ${isUser ? "text-right" : "text-left"}`}>
      <div className={`inline-block px-3 py-2 rounded ${colorClass}`}>
        {!isUser && agent?.image && (
          <img src={agent.image} alt={agent.name} className="inline w-6 h-6 rounded-full mr-2 align-middle" />
        )}
        <strong>{isUser ? "Vous" : message.role} :</strong> {message.content}
      </div>
    </div>
  );
}
