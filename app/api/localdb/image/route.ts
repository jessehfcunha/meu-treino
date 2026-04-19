import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term");

  if (!term) return NextResponse.json({ images: [], instructions: [] });

  try {
    const jsonPath = path.join(process.cwd(), "public", "exercises.json");
    const fileContents = await fs.readFile(jsonPath, "utf8");
    const exercises = JSON.parse(fileContents);

    const searchTerm = term.toLowerCase().trim();

    // Busca o exercício no JSON (Busca exata ou flexível para slugs)
    const match = exercises.find((ex: any) => {
      const id = (ex.id || "").toLowerCase();
      const name = (ex.name || "").toLowerCase();
      
      // 1. Tenta correspondência exata
      if (id === searchTerm || name === searchTerm) return true;
      
      // 2. Tenta correspondência parcial no ID (ex: "recovery_walk" bate com "recovery_walk_sunday")
      if (id.startsWith(searchTerm + "_") || searchTerm.startsWith(id + "_")) return true;

      // 3. Tenta comparar com o nome substituindo underscores por espaços
      const searchTermSpaces = searchTerm.replace(/_/g, " ");
      if (name === searchTermSpaces || name.includes(searchTermSpaces)) return true;

      return false;
    });

    if (match && match.images && match.images.length > 0) {
      // Extrai a pasta do primeiro item de imagem listado (ex: "Burpee")
      const folder = match.images[0].split("/")[0];

      // PRIORIDADE 1: Procurar por um GIF (0.gif) na pasta do exercício
      const gifRel = `/exercises/${folder}/0.gif`;
      const gifAbs = path.join(process.cwd(), "public", "exercises", folder, "0.gif");

      try {
        await fs.access(gifAbs);
        // Se o GIF existir, retornamos apenas ele (Prioridade Máxima)
        return NextResponse.json({
          images: [gifRel],
          instructions: match.instructionsPT || match.instructions || [],
        });
      } catch {
        // PRIORIDADE 2 (FALLBACK): Retorna o array de imagens JPG
        const fallbackImages = match.images.map((img: string) => `/exercises/${img}`);
        
        return NextResponse.json({
          images: fallbackImages,
          instructions: match.instructionsPT || match.instructions || [],
        });
      }
    }

    return NextResponse.json(
      { error: "Exercício não encontrado" },
      { status: 404 },
    );
  } catch (error) {
    console.error("ERRO CRÍTICO NA ROTA:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
