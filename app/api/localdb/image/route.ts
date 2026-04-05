import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    let term = searchParams.get("term");

    if (!term) {
        return NextResponse.json({ image: null }, { status: 200 });
    }

    try {
        // Obter o diretório atual da build ou public
        // Como estamos num ambiente Next.js no App Router:
        const jsonPath = path.join(process.cwd(), 'public', 'exercises.json');
        const fileContents = await fs.readFile(jsonPath, 'utf8');
        const exercises = JSON.parse(fileContents);

        term = term!.toLowerCase().trim();

        // Encontrar a melhor correspondência (pode ser contendo o termo)
        const match = exercises.find((ex: any) => 
            ex.id.toLowerCase() === term || 
            ex.name.toLowerCase() === term ||
            ex.name.toLowerCase().includes(term) ||
            ex.id.toLowerCase().includes(term!.replace(/ /g, '_'))
        );

        if (match && match.images && match.images.length > 0) {
             return NextResponse.json({ 
                 images: match.images.map((img: string) => `/exercises/${img}`),
                 instructions: match.instructionsPT || match.instructions || []
             });
        }

        return NextResponse.json({ images: [], instructions: [] }, { status: 200 });
    } catch (error) {
        console.error("Local Exercise DB Error", error);
        return NextResponse.json({ images: [], instructions: [] }, { status: 200 });
    }
}
