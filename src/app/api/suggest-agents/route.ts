// app/api/suggest-agents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const { topic } = await req.json();

  if (!topic || typeof topic !== 'string') {
    return NextResponse.json({ error: 'Invalid topic' }, { status: 400 });
  }

  const systemPrompt = `
Tu es un assistant qui conçoit des personnages d’intelligence artificielle pour débattre entre eux.
Pour le sujet suivant : "${topic}", propose une panoplie de 3 agents.
Pour chacun, fournis un nom, un intro (rôle), un objectif et une inspiration.
Réponds uniquement au format JSON strict suivant :
[
  {
    "name": "Nom de l'agent",
    "intro": "Description de son rôle dans le débat",
    "objectif": "Son objectif dans le débat",
    "inspiration": "Une personne ou une approche connue dont il s’inspire"
  },
  ...
]`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt }
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;

    const agents = JSON.parse(raw!);
    return NextResponse.json(agents);
  } catch (err: any) {
    console.error("Erreur dans /api/suggest-agents:", err);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}
