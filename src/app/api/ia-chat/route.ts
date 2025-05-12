import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const {
    messages,
    rolePrompt,
    objectif,
    inspiration,
  }: {
    messages: ChatCompletionMessageParam[];
    rolePrompt: string;
    objectif?: string;
    inspiration?: string;
  } = await req.json();

  if (!rolePrompt || typeof rolePrompt !== "string") {
    return NextResponse.json(
      { error: "Le rôle de l'IA (rolePrompt) est manquant ou invalide." },
      { status: 400 }
    );
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Le tableau de messages est vide ou invalide." },
      { status: 400 }
    );
  }

  // Construction du prompt système enrichi
  const systemPrompt: ChatCompletionMessageParam[] = [
    { role: "system", content: rolePrompt },
    ...(objectif
      ? ([{ role: "system", content: `Ton objectif dans ce débat : ${objectif}` }] as ChatCompletionMessageParam[])
      : []),
    ...(inspiration
      ? ([
          {
            role: "system",
            content: `Adopte le style, le ton et la posture de la personne ou du personnage suivant : ${inspiration}`,
          },
        ] as ChatCompletionMessageParam[])
      : []),
    {
      role: "system",
      content: "Réponds en 3 phrases maximum, de manière claire et pertinente.",
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [...systemPrompt, ...messages] as ChatCompletionMessageParam[],
      temperature: 0.9,
    });

    return NextResponse.json({
      response: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Erreur IA :", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}