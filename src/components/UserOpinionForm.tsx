"use client";

import { useState } from "react";

interface Props {
  opinion: string;
  onSubmit: (opinion: string) => void;
  onBack: () => void;
}

export default function UserOpinionForm({ opinion, onSubmit, onBack }: Props) {
  const [value, setValue] = useState(opinion);

  return (
    <div className="space-y-4">
      <label className="block text-lg font-medium">
        Exprimez brièvement votre avis sur le sujet
      </label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ex : Je pense que l’IA peut être bénéfique si elle est bien encadrée..."
        className="w-full p-2 border rounded h-32"
        required
      />
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="text-gray-600 border px-4 py-2 rounded hover:bg-gray-100"
        >
          ⬅ Retour
        </button>
        <button
          onClick={() => onSubmit(value)}
          disabled={!value.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}