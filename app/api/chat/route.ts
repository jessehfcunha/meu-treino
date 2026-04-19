import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    const isProd = process.env.NODE_ENV === "production";

    // Prioriza Groq se a chave estiver disponível, senão usa Ollama local
    const useGroq = !!apiKey;

    const apiUrl = useGroq
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "http://localhost:11434/v1/chat/completions";

    const model = useGroq ? "llama-3.1-8b-instant" : "llama3";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (useGroq) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const aiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: `Você é o PerformanceAI, um treinador de elite focado em biohacking e performance. 
                      Use este contexto do usuário para responder: ${JSON.stringify(context)}.
                      Responda de forma curta, técnica, direta e motivadora.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("Erro da API de IA:", errorText);
      throw new Error(`Falha na API: ${aiResponse.status} - ${errorText}`);
    }

    const data = await aiResponse.json();

    // No padrão OpenAI/Groq/Ollama v1, a resposta está em choices[0].message.content
    const reply =
      data.choices[0]?.message?.content || "Não consegui gerar uma resposta.";

    return NextResponse.json({ text: reply });
  } catch (error) {
    console.error("Erro na rota de chat:", error);
    return NextResponse.json(
      {
        text: "O Agente IA está temporariamente indisponível. Verifique a conexão ou se o Ollama/Groq está configurado.",
      },
      { status: 500 },
    );
  }
}
