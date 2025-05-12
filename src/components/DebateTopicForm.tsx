"use client";

import { useState } from "react";

interface Props {
  topic: string;
  onSubmit: (topic: string) => void;
}

export default function DebateTopicForm({ topic, onSubmit }: Props) {
  const [value, setValue] = useState(topic);

  return (
    <div className="space-y-4">
      <label className="block text-lg font-medium">Quel est le sujet de votre débat ?</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ex : L’IA va-t-elle remplacer l’humain ?"
        className="w-full p-2 border rounded"
        required
      />
      <button
        onClick={() => onSubmit(value)}
        disabled={!value.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Suivant
      </button>
    </div>
  );
}