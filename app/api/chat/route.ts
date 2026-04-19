import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    // Detecta se o ambiente é produção (Vercel)
    const isProd = process.env.NODE_ENV === "production";

    // Configurações de endpoint e modelo
    // No Groq usamos o modelo Llama 3 8b. No Ollama, o que você tiver baixado.
    const apiUrl = isProd
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "http://localhost:11434/v1/chat/completions";

    const model = isProd ? "llama3-8b-8192" : "llama3";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Adiciona a chave de API apenas se estiver em produção
    if (isProd && process.env.GROQ_API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.GROQ_API_KEY}`;
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
                      Use este contexto do plano do usuário para responder: ${JSON.stringify(context)}.
                      Responda de forma curta, técnica, direta e motivadora.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error("Erro da API de IA:", errorData);
      throw new Error("Falha na comunicação com o provedor de IA");
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
