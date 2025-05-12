import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, voice = "nova" } = await req.json();

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1", // ou "tts-1-hd"
      input: text,
      voice,
      response_format: "mp3",
    }),
  });

  const audioBuffer = await response.arrayBuffer();
  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}