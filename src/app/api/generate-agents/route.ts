// src/app/api/generate-agents/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Missing or invalid topic" }, { status: 400 });
    }

    const prompt = `Tu es un générateur de personnages IA pour un débat. 
Crée 3 agents d'intelligence artificielle avec des points de vue variés sur le sujet suivant : "${topic}".
Pour chaque agent, donne un nom, une phrase d'introduction qui décrit son rôle dans le débat, un objectif, et une inspiration facultative (une personne ou personnage connu). 
Retourne le tout au format JSON dans un tableau avec les clés : name, intro, objectif, inspiration.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Tu es un assistant qui formate la sortie uniquement en JSON valide."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.9,
    });

    const text = completion.choices[0].message?.content || "";

    const agentsRaw = JSON.parse(text);

    // Ajout d'une image avatar IA à chaque agent
    const agents = agentsRaw.map((agent: any) => ({
      ...agent,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(agent.name)}`,
    }));
    
    return NextResponse.json({ agents });

  } catch (err) {
    console.error("Erreur dans /generate-agents:", err);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}
