import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions"; // 👈 ajoute cette ligne

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Agent {
  name: string;
  intro: string;
  objectif?: string;
}

const debatePhases = [
  "Introduction",
  "Confrontation",
  "Réactions croisées",
];

export async function POST(req: NextRequest) {
  const { topic, agents }: { topic: string; agents: Agent[] } = await req.json();

  const turns = [];
  let memory: { name: string; content: string }[] = [];

  for (const phase of debatePhases) {
    const results = await Promise.all(
      agents.map(async (agent) => {
        const others = memory
          .filter((m) => m.name !== agent.name)
          .map((m) => `${m.name} a dit : ${m.content}`)
          .join("\n\n");

        const messages: ChatCompletionMessageParam[] = [
          { role: "system", content: agent.intro },
        ];

        if (agent.objectif) {
          messages.push({
            role: "system",
            content: `Ton objectif dans ce débat est : ${agent.objectif}`,
          });
        }

        const userPrompt =
          phase === "Introduction"
            ? `Donne ton point de vue initial sur ce sujet : "${topic}" en **3 phrases maximum**, en allant droit à l'essentiel.`
            : `Voici ce que les autres agents ont dit :\n\n${others}\n\n${
          phase === "Confrontation"
            ? "Réfute, critique ou interroge leurs arguments en restant concis (3 phrases max)."
            : "Réagis aux critiques et renforce ta position en 3 phrases maximum."
        }`;

        messages.push({ role: "user", content: userPrompt });

        const res = await openai.chat.completions.create({
          model: "gpt-4o",
          messages,
        });

        return {
          name: agent.name,
          content: res.choices[0].message.content || "",
        };
      })
    );

    memory = results;
    turns.push({ phase, responses: results });
  }

  return NextResponse.json({ turns });
}