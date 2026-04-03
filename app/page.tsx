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
  AlertCircle,
  ShoppingCart,
  Store,
  Tag,
  Calendar,
} from "lucide-react";

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
  const hoje = diasSemana[new Date().getDay()];

  useEffect(() => {
    fetch("/database.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Erro ao carregar JSON:", err));

    const saved = localStorage.getItem("performance-progresso");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 110;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setActiveNav(id);
    }
  };

  const toggleTask = (id: string) => {
    const newCompleted = completed.includes(id)
      ? completed.filter((i) => i !== id)
      : [...completed, id];
    setCompleted(newCompleted);
    localStorage.setItem("performance-progresso", JSON.stringify(newCompleted));
  };

  if (!data)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <Zap size={40} className="text-blue-500 animate-pulse" />
      </div>
    );

  const treinoDoDia = data.Treino.find((t: any) => t.Dia === hoje);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-44 scroll-smooth">
      {/* HEADER PREMIUM */}
      <header className="p-6 pt-12 sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter italic">
              Objetivo Semanal{" "}
              <span className="text-blue-500"> Jesse Figueiredo</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
              Status: Queima Ativa
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-blue-500 uppercase block leading-none">
              {hoje}
            </span>
            <span className="text-lg font-black text-white uppercase tracking-tighter">
              {new Date().getDate()}{" "}
              {new Date()
                .toLocaleString("pt-BR", { month: "short" })
                .replace(".", "")}
            </span>
          </div>
        </div>
      </header>

      <main className="px-5 space-y-14 mt-8">
        {/* SEÇÃO TREINO (ID: treino) */}
        <section id="treino" className="scroll-mt-32">
          <div className="flex items-center gap-2 mb-4 px-1 text-slate-500">
            <Target size={14} className="text-blue-500" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em]">
              Foco de Hoje
            </h2>
          </div>

          {treinoDoDia && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative bg-slate-900 border border-white/5 p-7 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="absolute -right-6 -bottom-6 text-white/5 -rotate-12">
                  <Dumbbell size={160} strokeWidth={1} />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between mb-4">
                    <span className="bg-blue-600/10 text-blue-400 text-[9px] font-black px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">
                      {treinoDoDia.Dia}
                    </span>
                    <Zap size={18} className="text-blue-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-4 uppercase italic">
                    {treinoDoDia["Atividade Principal"]}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium mb-8">
                    {treinoDoDia["Detalhamento do Treino (Prescrição)"]}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">
                        Foco Core
                      </span>
                      <span className="text-[10px] font-bold text-blue-400 leading-tight block">
                        {treinoDoDia["Foco de Abdômen (Core)"]}
                      </span>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-black text-slate-500 uppercase block mb-1 tracking-widest text-emerald-500">
                        Nutrição
                      </span>
                      <span className="text-[10px] font-bold text-slate-200 leading-tight block">
                        {treinoDoDia["Nutrição (Base: Plano PDF)"]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        {/* SEÇÃO TIMELINE (ID: rotina) */}
        <section id="rotina" className="scroll-mt-32">
          <div className="flex items-center justify-between px-1 mb-6">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock size={14} /> Rotina Diária
            </h3>
            <span className="text-[10px] font-black text-blue-500">
              {completed.length}/{data.Horario.length}
            </span>
          </div>

          <div className="space-y-4 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-[1px] before:bg-slate-800">
            {data.Horario.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                onClick={() => toggleTask(`h-${idx}`)}
                className={`relative pl-12 flex items-center transition-all cursor-pointer ${completed.includes(`h-${idx}`) ? "opacity-30" : "opacity-100"}`}
              >
                <div
                  className={`absolute left-0 w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-slate-950 z-10 transition-colors ${completed.includes(`h-${idx}`) ? "bg-blue-600" : "bg-slate-900 border-slate-800"}`}
                >
                  {completed.includes(`h-${idx}`) ? (
                    <CheckCircle2 size={18} className="text-white" />
                  ) : (
                    <div className="w-1 h-1 bg-slate-700 rounded-full" />
                  )}
                </div>
                <div className="bg-slate-900/40 border border-white/5 p-5 rounded-[2rem] flex-1 flex justify-between items-center group">
                  <div className="flex-1 pr-4">
                    <span className="text-[9px] font-black text-blue-500 block mb-0.5 tracking-widest">
                      {item.Horário}
                    </span>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">
                      {item.Categoria}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight">
                      {item["Descrição da Refeição"]}
                    </p>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-800 group-hover:text-blue-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SEÇÃO DIETA (ID: dieta) */}
        <section id="dieta" className="scroll-mt-32">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 mb-6 flex items-center gap-2">
            <Apple size={14} /> Menu Nutricional
          </h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
            {data.Nutriçao.filter((n: any) => n["Opção A (Padrão)"]).map(
              (nutri: any, idx: number) => (
                <div
                  key={idx}
                  className="min-w-[310px] snap-center bg-slate-900 border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                    <Apple size={80} />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-tighter mb-5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {nutri.Refeição}
                  </h4>
                  <div className="space-y-3 relative z-10">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-black text-blue-500 uppercase block mb-1 tracking-widest">
                        Opção Principal
                      </span>
                      <p className="text-[11px] font-bold text-slate-300 leading-snug">
                        {nutri["Opção A (Padrão)"]}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-black text-slate-600 uppercase block mb-1 tracking-widest">
                        Variação B
                      </span>
                      <p className="text-[11px] font-bold text-slate-500 leading-snug">
                        {nutri["Opção B (Variação)"]}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* SEÇÃO COMPRAS (ID: compras) */}
        <section id="compras" className="scroll-mt-32">
          <div className="flex items-center justify-between px-1 mb-6 text-slate-500">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <ShoppingCart size={14} className="text-blue-500" /> Lista de
              Compras
            </h3>
          </div>

          <div className="grid gap-4">
            {/* LÓGICA FULL STACK: 
      1. data?.Compras || [] -> Garante que não dê erro se a chave não existir.
      2. item["Seçao"] || item["Secao"] || item["Seção"] -> Tenta todas as variações possíveis de escrita.
    */}
            {(data?.Compras || []).map((compra: any, idx: number) => {
              // Normalizamos o título da seção para garantir que o render aconteça
              const tituloSecao =
                compra["Seçao"] || compra["Secao"] || compra["Seção"];

              // Se não encontrar nenhum título, não renderiza este card específico
              if (!tituloSecao) return null;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-slate-900/60 border border-white/5 p-6 rounded-[2.5rem] shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-600/10 p-2 rounded-xl text-blue-500">
                      <Store size={16} />
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">
                      {tituloSecao}
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-2">
                        Itens para o Carrinho
                      </span>
                      <p className="text-[11px] font-medium text-slate-300 leading-relaxed">
                        {compra.Itens}
                      </p>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Tag size={12} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {compra.Marcas}
                        </span>
                      </div>

                      {/* Fallback para Base Calórica caso seja o item de recomendação */}
                      {compra["Base Calorica"] && (
                        <div className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded italic">
                          {compra["Base Calorica"]}
                        </div>
                      )}
                    </div>

                    {/* Renderização especial para itens de Recomendação que não têm 'Itens' */}
                    {!compra.Itens && (
                      <div className="space-y-2 mt-2">
                        {compra["Mais indicado Lanches"] && (
                          <p className="text-[10px] text-slate-400">
                            🥗 <strong>Lanche:</strong>{" "}
                            {compra["Mais indicado Lanches"]}
                          </p>
                        )}
                        {compra["Mais indicado Janta"] && (
                          <p className="text-[10px] text-slate-400">
                            🥩 <strong>Janta:</strong>{" "}
                            {compra["Mais indicado Janta"]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* NOTAS ESTRATÉGICAS (ID: notas) */}
        <section
          id="notas"
          className="bg-gradient-to-br from-slate-900 to-black border border-white/5 p-8 rounded-[2.5rem] scroll-mt-32"
        >
          <div className="flex items-center gap-2 mb-8">
            <Info className="text-blue-500" size={18} />
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
              Notas do Mestre
            </h3>
          </div>
          <div className="space-y-8">
            {Object.entries(data.Notas).map(([key, value]: [string, any]) => (
              <div key={key}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-1 bg-blue-600 rounded-full" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {key}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-300 leading-relaxed pl-3 border-l border-slate-800 italic">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* DOCK DE NAVEGAÇÃO SUPER FUNCIONAL */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] flex items-center gap-1 shadow-2xl z-50">
        <button
          onClick={() => scrollToSection("treino")}
          className={`p-4 rounded-full transition-all active:scale-75 ${activeNav === "treino" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40" : "text-slate-500"}`}
        >
          <Dumbbell size={22} />
        </button>
        <div className="w-[1px] h-6 bg-white/10 mx-2" />
        <div className="flex gap-1 pr-1">
          <button
            onClick={() => scrollToSection("rotina")}
            className={`p-4 rounded-full ${activeNav === "rotina" ? "text-blue-400 bg-white/5" : "text-slate-500"}`}
          >
            <Clock size={20} />
          </button>
          <button
            onClick={() => scrollToSection("dieta")}
            className={`p-4 rounded-full ${activeNav === "dieta" ? "text-blue-400 bg-white/5" : "text-slate-500"}`}
          >
            <Apple size={20} />
          </button>
          <button
            onClick={() => scrollToSection("compras")}
            className={`p-4 rounded-full ${activeNav === "compras" ? "text-blue-400 bg-white/5" : "text-slate-500"}`}
          >
            <ShoppingCart size={20} />
          </button>
          <button
            onClick={() => scrollToSection("notas")}
            className={`p-4 rounded-full ${activeNav === "notas" ? "text-blue-400 bg-white/5" : "text-slate-500"}`}
          >
            <Info size={20} />
          </button>
        </div>
      </nav>
    </div>
  );
}
