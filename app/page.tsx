"use client";

import { useState, useEffect } from "react";
import {
  Dumbbell,
  Apple,
  Clock,
  Target,
  Info,
  Zap,
  ShoppingCart,
} from "lucide-react";

// Importações dos Componentes (Ajuste o caminho se necessário)
import ExerciseThumbnail from "./src/components/ExerciseThumbnail";
import { DailyRoutine } from "./src/components/DailyRoutine";
import { DietPlan } from "./src/components/DietPlan";
import { ShoppingList } from "./src/components/ShoppingList";
import { MasterNotes } from "./src/components/MasterNotes";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeNav, setActiveNav] = useState("treino");

  const diasSemana: { [key: number]: string } = {
    0: "DOM",
    1: "SEG",
    2: "TER",
    3: "QUA",
    4: "QUI",
    5: "SEX",
    6: "SÁB",
  };
  const hojeOriginal = diasSemana[new Date().getDay()];

  useEffect(() => {
    fetch("/database.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Erro ao carregar banco:", err));

    const saved = localStorage.getItem("performance-progresso");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const toggleTask = (id: string) => {
    const newCompleted = completed.includes(id)
      ? completed.filter((i) => i !== id)
      : [...completed, id];
    setCompleted(newCompleted);
    localStorage.setItem("performance-progresso", JSON.stringify(newCompleted));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 110, behavior: "smooth" });
      setActiveNav(id);
    }
  };

  if (!data)
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <Zap className="text-blue-500 animate-pulse" size={40} />
      </div>
    );

  const treinoDoDia = data?.Treino?.find(
    (t: any) =>
      t.Dia.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase() ===
      hojeOriginal
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase(),
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-44 scroll-smooth selection:bg-blue-500/30">
      {/* HEADER */}
      <header className="p-6 pt-12 sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter italic uppercase">
              Performance <span className="text-blue-500 italic">Jesse</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
              Status: Ativo
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-blue-500 uppercase block leading-none">
              {hojeOriginal}
            </span>
            <span className="text-lg font-black text-white uppercase tracking-tighter italic">
              {new Date().getDate()}{" "}
              {new Date()
                .toLocaleString("pt-BR", { month: "short" })
                .replace(".", "")}
            </span>
          </div>
        </div>
      </header>

      <main className="px-5 space-y-12 mt-10">
        {/* SEÇÃO TREINO (CARROSSEL) */}
        <section id="treino" className="scroll-mt-32">
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 italic">
              <Target size={14} className="text-blue-500" /> Foco de Hoje
            </h2>
            <span className="text-[9px] font-bold text-slate-700 animate-pulse italic">
              Arraste ➔
            </span>
          </div>

          {treinoDoDia?.Exercicios ? (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
              {treinoDoDia.Exercicios.map((ex: any, idx: number) => (
                <div
                  key={idx}
                  className="min-w-[85vw] md:min-w-[400px] snap-center bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                  {/* CHAMADA DO COMPONENTE DE IMAGEM */}
                  <ExerciseThumbnail
                    exerciseName={ex.slug}
                    fallbackId={ex.wgerId}
                  />

                  <div className="p-7">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-blue-600/10 text-blue-400 text-[8px] font-black px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest italic">
                        Exercício {idx + 1}
                      </span>
                      <span className="text-white font-black text-xs italic">
                        {ex.series}
                      </span>
                    </div>
                    <h4 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">
                      {ex.nome}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-bold italic border-l border-slate-800 pl-3 leading-relaxed">
                      {ex.obs}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 bg-slate-900/40 border border-dashed border-white/10 rounded-[2.5rem] text-center italic text-slate-500 text-xs">
              Nenhum treino listado para hoje.
            </div>
          )}
        </section>

        {/* COMPONENTES SEPARADOS */}
        <DailyRoutine
          data={data.Horario}
          completed={completed}
          toggleTask={toggleTask}
        />
        <DietPlan data={data.Nutriçao} />
        <ShoppingList data={data.Compras} />
        <MasterNotes data={data.Notas} />
      </main>

      {/* DOCK NAVEGAÇÃO FLUTUANTE */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] flex items-center gap-1 shadow-2xl z-50">
        <button
          onClick={() => scrollToSection("treino")}
          className={`p-4 rounded-full transition-all ${activeNav === "treino" ? "bg-blue-600 text-white" : "text-slate-500"}`}
        >
          <Dumbbell size={22} />
        </button>
        <div className="w-[1px] h-6 bg-white/10 mx-2" />
        <button
          onClick={() => scrollToSection("rotina")}
          className={`p-4 rounded-full ${activeNav === "rotina" ? "text-blue-400" : "text-slate-500"}`}
        >
          <Clock size={20} />
        </button>
        <button
          onClick={() => scrollToSection("dieta")}
          className={`p-4 rounded-full ${activeNav === "dieta" ? "text-blue-400" : "text-slate-500"}`}
        >
          <Apple size={20} />
        </button>
        <button
          onClick={() => scrollToSection("compras")}
          className={`p-4 rounded-full ${activeNav === "compras" ? "text-blue-400" : "text-slate-500"}`}
        >
          <ShoppingCart size={20} />
        </button>
        <button
          onClick={() => scrollToSection("notas")}
          className={`p-4 rounded-full ${activeNav === "notas" ? "text-blue-400" : "text-slate-500"}`}
        >
          <Info size={20} />
        </button>
      </nav>
    </div>
  );
}
