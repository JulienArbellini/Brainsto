interface ChatHeaderProps {
    agentNames: string[];
    onRestart: () => void;
  }
  
  export default function ChatHeader({ agentNames, onRestart }: ChatHeaderProps) {
    return (
      <div className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">💬 Débat avec {agentNames.join(", ")}</h2>
          <button
            onClick={onRestart}
            className="text-sm text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            🔁 Recommencer
          </button>
        </div>
      </div>
    );
  }
  