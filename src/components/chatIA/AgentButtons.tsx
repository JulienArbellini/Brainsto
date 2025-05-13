import { AgentConfig } from "@/types/Agents";

interface AgentButtonsProps {
  agents: AgentConfig[];
  loading: boolean;
  onAgentClick: (agent: AgentConfig) => void;
}

export default function AgentButtons({ agents, loading, onAgentClick }: AgentButtonsProps) {
  return (
    <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
      <p className="text-sm font-semibold">💡 Faire intervenir un agent :</p>
      <div className="flex flex-wrap gap-2">
        {agents.map((agent) => (
          <button
            key={agent.name}
            onClick={() => onAgentClick(agent)}
            className="flex items-center gap-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded"
            disabled={loading}
          >
            {agent.image && <img src={agent.image} alt={agent.name} className="w-5 h-5 rounded-full" />}
            💬 {agent.name}
          </button>
        ))}
      </div>
    </div>
  );
}
