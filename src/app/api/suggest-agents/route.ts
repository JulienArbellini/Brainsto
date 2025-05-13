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
  Pour chacun, fournis :
  - "name" : un prénom simple en francais rigolo,
  - "intro" : une description de son rôle dans le débat (1 à 2 phrases),
  - "objectif" : ce qu’il cherche à défendre ou démontrer,
  - "inspiration" : une personnalité ou approche célèbre dont il s’inspire,
  - "role" : un seul mot résumant sa posture ou son rôle (ex : "Écologiste", "Optimiste", "Libéral", "Critique")
  
  Réponds uniquement au format JSON strict suivant :
  [
    {
      "name": "Nom de l'agent",
      "intro": "Description de son rôle dans le débat",
      "objectif": "Son objectif dans le débat",
      "inspiration": "Une personne ou une approche connue dont il s’inspire",
      "role": "Un seul mot résumant son rôle"
    }
  ]`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.7,
    });
    
    const raw = completion.choices[0].message.content;
    console.log("Réponse OpenAI :", raw);
    
    let parsed;
    try {
      parsed = JSON.parse(raw!);
    } catch (err) {
      console.error("Erreur JSON :", raw);
      return NextResponse.json({ error: "Réponse OpenAI invalide" }, { status: 500 });
    }
    
    // Cas 1 : la réponse est un tableau (ancien comportement)
    let agents = Array.isArray(parsed) ? parsed : parsed.agents;
    
    // Ajoute les images et un fallback role si nécessaire
    agents = agents.map((agent: any) => ({
      ...agent,
      image: agent.image ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(agent.name)}`,
    }));
    
    return NextResponse.json(agents);
  } catch (err: any) {
    console.error("Erreur dans /api/suggest-agents:", err);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}