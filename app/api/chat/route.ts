// app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // CORREÇÃO: Usamos 'request' para pegar os dados que o frontend enviou
  const { message, context } = await request.json();

  try {
    // Chamada ao Ollama local
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3", // Verifique se você baixou o llama3 ou mude para o seu modelo
        prompt: `Você é o PerformanceAI, um treinador de elite. 
                 Contexto do Plano do Usuário: ${JSON.stringify(context)}
                 Pergunta do Usuário: ${message}
                 Responda de forma curta, técnica e motivadora.`,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error("Ollama respondeu com erro");
    }

    const data = await ollamaResponse.json();
    return NextResponse.json({ text: data.response });
  } catch (error) {
    console.error("Erro na rota de chat:", error);
    return NextResponse.json(
      {
        text: "O Agente IA está offline. Certifique-se de que o Ollama está rodando (ollama serve).",
      },
      { status: 500 },
    );
  }
}
