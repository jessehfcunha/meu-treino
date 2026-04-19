"use client";
import { useState, useEffect } from "react";
import { Dumbbell, Loader2, Info, X } from "lucide-react";
import { exerciseService } from "../services/exerciseService";

interface Props {
  exerciseName: string;
  fallbackId?: number;
}

const ExerciseThumbnail = ({ exerciseName, fallbackId }: Props) => {
  const [images, setImages] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!exerciseName) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await exerciseService.getExerciseData(exerciseName);
        if (isMounted && data) {
           setImages(data.images);
           setInstructions(data.instructions);
        }
      } catch (err) {
        console.error("Erro Thumbnail:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [exerciseName]);

  // Efeito para criar o "falso gif" alternando entre as imagens do array
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1000); // 1 segundo (1000ms) de transição

    return () => clearInterval(interval);
  }, [images]);

  if (loading)
    return (
      <div className="w-full h-48 bg-slate-900 flex items-center justify-center rounded-t-[2.5rem]">
        <Loader2 className="text-blue-500 animate-spin" size={20} />
      </div>
    );

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-t-[2.5rem] border-b border-white/5 bg-slate-900/50 flex items-center justify-center group">
      {images.length > 0 ? (
        <>
          {/* Design Premium: Fundo desfocado para preencher lacunas de proporção */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={images[currentIndex]}
              alt="Fundo"
              className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
            />
          </div>

          <img
            src={images[currentIndex]}
            alt="Treino"
            className="relative z-10 w-full h-full object-contain grayscale-[0.1] group-hover:grayscale-0 transition-all duration-500 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          />
          
          {/* Botão de info (só aparece se houver instruções) */}
          {instructions.length > 0 && !showInfo && (
            <button 
              onClick={() => setShowInfo(true)}
              className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white/70 hover:text-white hover:bg-black transition-all z-10 backdrop-blur-sm"
              title="Ver Instruções"
            >
              <Info size={18} />
            </button>
          )}

          {/* Overlay de Instruções */}
          {showInfo && (
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md p-5 z-20 flex flex-col items-start justify-start overflow-y-auto">
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <h4 className="text-white/90 font-bold mb-3 text-sm flex items-center gap-2">
                <Info size={16} className="text-blue-400" />
                Como Executar
              </h4>
              <ul className="text-left text-white/70 text-xs space-y-2 list-disc pl-4 pb-4">
                {instructions.map((inst, i) => (
                  <li key={i} className="leading-tight">{inst}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 opacity-20">
          <Dumbbell size={32} className="text-white" />
          <span className="text-[10px] font-black text-white uppercase tracking-tighter">
            Preview
          </span>
        </div>
      )}
    </div>
  );
};

export default ExerciseThumbnail;
