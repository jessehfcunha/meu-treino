// 1. Instale o pacote 'framer-motion' para animações suaves de app nativo:
// npm install framer-motion

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Dumbbell,
  Apple,
  Clock,
  Droplets,
  Target,
  Info,
  Zap,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("treino"); // 'rotina' | 'treino' | 'dieta'

  const diasSemana: { [key: number]: string } = {
    0: "DOM",
    1: "SEG",
    2: "TER",
    3: "QUA",
    4: "QUI",
    5: "SEX",
    6: "SÁB",
  };
  const hoje = diasSemana[new Date().getDay()];

  useEffect(() => {
    fetch("/database.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Erro ao carregar JSON:", err));

    const saved = localStorage.getItem("dieta-progresso");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const toggleTask = (id: string) => {
    const newCompleted = completed.includes(id)
      ? completed.filter((i) => i !== id)
      : [...completed, id];
    setCompleted(newCompleted);
    localStorage.setItem("dieta-progresso", JSON.stringify(newCompleted));
  };

  if (!data)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-blue-500"
        >
          <Zap size={40} fill="currentColor" />
        </motion.div>
      </div>
    );

  const treinoDoDia = data.Nutricao.find((t: any) => t.Dia === hoje);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-32">
      {/* HEADER PREMIUM */}
      <header className="p-6 pt-12 bg-gradient-to-b from-slate-900 to-slate-950 sticky top-0 z-30">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-blue-500 font-black text-[10px] tracking-[0.3em] uppercase mb-1 block">
              Status: Secagem
            </span>
            <h1 className="text-3xl font-black text-white tracking-tighter">
              Performance
            </h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long" })}
            </span>
            <span className="text-sm font-black text-white">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
        </div>

        {/* PROGRESS BAR DE HIDRATAÇÃO RÁPIDA */}
        <div className="mt-6 bg-slate-800/50 h-1.5 rounded-full overflow-hidden border border-slate-700/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "65%" }}
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          />
        </div>
        <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          <span>Hidratação</span>
          <span className="text-blue-400">1.8L / 3L</span>
        </div>
      </header>

      <main className="px-5 space-y-8 mt-4">
        {/* CARD DE FOCO - REDESENHADO */}
        <section>
          {treinoDoDia && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[2.5rem] transform group-active:scale-95 transition-transform duration-200" />

              {/* Pattern de Fundo */}
              <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
                <Dumbbell size={180} strokeWidth={1} />
              </div>

              <div className="relative p-7 z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">
                    Treino Ativo
                  </div>
                  <Target className="text-white/40" size={18} />
                </div>

                <h2 className="text-3xl font-black text-white leading-none tracking-tighter mb-2">
                  {treinoDoDia["Atividade Principal"]}
                </h2>
                <p className="text-blue-100/70 text-xs font-medium leading-relaxed line-clamp-2">
                  {treinoDoDia["Detalhamento do Treino (Prescrição)"]}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="bg-black/20 backdrop-blur-sm p-3 rounded-2xl border border-white/5">
                    <span className="text-[8px] font-black text-blue-300 uppercase block mb-1">
                      Foco Core
                    </span>
                    <span className="text-[11px] font-bold text-white leading-tight block line-clamp-1">
                      {treinoDoDia["Foco de Abdômen (Core)"]}
                    </span>
                  </div>
                  <div className="bg-black/20 backdrop-blur-sm p-3 rounded-2xl border border-white/5">
                    <span className="text-[8px] font-black text-emerald-300 uppercase block mb-1">
                      Nutrição
                    </span>
                    <span className="text-[11px] font-bold text-white leading-tight block line-clamp-1">
                      {treinoDoDia["Nutrição (Base: Plano PDF)"]}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* TIMELINE DE ROTINA - MAIS LIMPA */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Timeline do Dia
            </h3>
            <span className="text-[10px] font-bold text-blue-500">
              {completed.length}/{data.Treino.length} Concluído
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
            {data.Treino.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                onClick={() => toggleTask(`h-${idx}`)}
                whileTap={{ scale: 0.98 }}
                className={`relative pl-10 flex items-center group transition-opacity ${completed.includes(`h-${idx}`) ? "opacity-40" : "opacity-100"}`}
              >
                <div
                  className={`absolute left-0 w-10 h-10 rounded-full border-4 border-slate-950 z-10 flex items-center justify-center transition-colors ${completed.includes(`h-${idx}`) ? "bg-blue-500 border-blue-500" : "bg-slate-900 border-slate-800"}`}
                >
                  {completed.includes(`h-${idx}`) ? (
                    <CheckCircle2 size={16} className="text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-slate-700 rounded-full" />
                  )}
                </div>

                <div className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-3xl flex-1 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-blue-500 block mb-0.5">
                      {item.Horário}
                    </span>
                    <h4 className="text-sm font-bold text-white tracking-tight uppercase">
                      {item.Categoria}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {item["Descrição da Refeição"]}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-slate-700" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SUBSTITUIÇÕES - ESTILO SLIDE */}
        <section className="pb-10">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Apple size={14} /> Guia Nutricional
          </h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
            {data.Horarios.filter(
              (h: any) => h.Refeição && h["Opção A (Padrão)"],
            ).map((nutri: any, idx: number) => (
              <div
                key={idx}
                className="min-w-[280px] snap-center bg-slate-900 border border-slate-800 p-5 rounded-[2rem]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-black">
                    {idx + 1}
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-tighter">
                    {nutri.Refeição}
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/50 group active:border-blue-500/50 transition-colors">
                    <span className="text-[8px] font-black text-blue-500 uppercase block mb-1">
                      Opção Principal
                    </span>
                    <p className="text-[11px] font-bold text-slate-300 leading-snug">
                      {nutri["Opção A (Padrão)"]}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/50">
                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-1 tracking-widest">
                      Variação B
                    </span>
                    <p className="text-[11px] font-bold text-slate-500 leading-snug">
                      {nutri["Opção B (Variação)"]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* NAV BAR FLUTUANTE (DOCK STYLE) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-full flex items-center gap-1 shadow-2xl z-40">
        <button
          onClick={() => setActiveTab("rotina")}
          className={`p-4 rounded-full transition-all ${activeTab === "rotina" ? "bg-blue-600 text-white" : "text-slate-500"}`}
        >
          <Clock size={20} />
        </button>
        <button
          onClick={() => setActiveTab("treino")}
          className={`p-4 rounded-full transition-all ${activeTab === "treino" ? "bg-blue-600 text-white" : "text-slate-500"}`}
        >
          <Dumbbell size={20} />
        </button>
        <button
          onClick={() => setActiveTab("dieta")}
          className={`p-4 rounded-full transition-all ${activeTab === "dieta" ? "bg-blue-600 text-white" : "text-slate-500"}`}
        >
          <Apple size={20} />
        </button>
        <div className="w-[1px] h-6 bg-slate-800 mx-2" />
        <button className="p-4 text-blue-400">
          <Droplets size={20} />
        </button>
      </nav>
    </div>
  );
}
