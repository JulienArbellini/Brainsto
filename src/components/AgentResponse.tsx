import React from "react";

interface Props {
  name: string;
  content: string;
}

export default function AgentResponse({ name, content }: Props) {

    const playVoice = async () => {
        const res = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: `${name} dit : ${content}`, voice: "nova" }),
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
      };  
  return (
    <div className="border-l-4 border-blue-500 bg-white p-4 rounded shadow">
    <h2 className="font-semibold text-blue-700 mb-2">{name}</h2>
    <button onClick={playVoice} className="ml-2 text-sm text-blue-600 ">
    🔊 Voix IA
    </button>
    <p className="text-gray-800 whitespace-pre-line">{content}</p>
    </div>
  );
}