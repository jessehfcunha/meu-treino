"use client";

import { useState, useEffect } from "react";
// CORREÇÃO 1: Adicionado 'Zap' nas importações
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
} from "lucide-react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [completed, setCompleted] = useState<string[]>([]);

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
    if (saved) {
      try {
        setCompleted(JSON.parse(saved));
      } catch (e) {
        console.error("Erro no parse do localStorage");
      }
    }
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 font-medium">
            Sincronizando Plano...
          </p>
        </div>
      </div>
    );

  const treinoDoDia = data.Nutricao.find((t: any) => t.Dia === hoje);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white p-6 shadow-sm sticky top-0 z-20 border-b border-slate-100">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              PERFORMANCE
            </h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
              Foco: Secagem 72kg
            </p>
          </div>
          <div className="bg-blue-50 p-2 rounded-full">
            <Target className="text-blue-600" size={20} />
          </div>
        </div>
      </header>

      <main className="p-4 space-y-8">
        {/* SEÇÃO 1: TREINO DO DIA (Destaque Premium) */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Zap className="text-blue-500" size={16} />
            <h2 className="font-extrabold text-slate-950 uppercase text-[11px] tracking-[0.15em]">
              Foco de Hoje
            </h2>
          </div>

          {treinoDoDia ? (
            <div className="relative overflow-hidden p-7 rounded-[2rem] bg-slate-950 shadow-2xl shadow-slate-300 border border-slate-800 snap-center">
              <div className="absolute -top-10 -right-10 opacity-[0.03] text-white rotate-12">
                <Dumbbell size={200} strokeWidth={1} />
              </div>

              {/* CORREÇÃO 2: Removido id="bg-gradient" duplicado que causava erro de sintaxe */}
              <div className="absolute inset-0 bg-[radial-gradient(160%_100%_at_10%_10%,#1e293b_0%,#020617_100%)] opacity-80"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-blue-950 text-blue-300 px-3 py-1 rounded-full border border-blue-800 uppercase tracking-widest">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                    {treinoDoDia.Dia}
                  </span>
                  <Target className="text-slate-700" size={16} />
                </div>

                <h3 className="text-3xl font-extrabold mt-5 text-white leading-tight tracking-tighter antialiased">
                  {treinoDoDia["Atividade Principal"]}
                </h3>

                <p className="text-slate-400 text-xs mt-4 leading-relaxed font-medium">
                  {treinoDoDia["Detalhamento do Treino (Prescrição)"]}
                </p>

                <div className="mt-7 pt-6 border-t border-slate-800 grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                    <div className="bg-blue-950 p-1.5 rounded-lg text-blue-400 border border-blue-900">
                      <Zap size={14} strokeWidth={3} />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                        Core
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-tight">
                        {treinoDoDia["Foco de Abdômen (Core)"]}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                    <div className="bg-green-950 p-1.5 rounded-lg text-green-400 border border-green-900">
                      <Apple size={14} strokeWidth={3} />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                        Nutrição
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-tight text-ellipsis overflow-hidden">
                        {treinoDoDia["Nutrição (Base: Plano PDF)"]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-center text-slate-400 text-sm font-medium">
              <Dumbbell size={30} className="mx-auto mb-3 opacity-50" />
              Nenhum treino listado para hoje.
              <br />
              Aproveite o descanso!
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-slate-400" size={18} />
            <h2 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">
              Rotina Diária
            </h2>
          </div>
          <div className="space-y-3">
            {data.Treino.map((item: any, idx: number) => (
              <div
                key={idx}
                onClick={() => toggleTask(`h-${idx}`)}
                className={`flex items-center gap-4 p-4 rounded-3xl border transition-all active:scale-[0.98] cursor-pointer ${
                  completed.includes(`h-${idx}`)
                    ? "bg-slate-100 border-transparent opacity-50"
                    : "bg-white border-slate-100 shadow-sm"
                }`}
              >
                <div className="flex flex-col items-center justify-center min-w-[50px] border-r border-slate-100 pr-2">
                  <span className="text-[11px] font-black text-blue-600">
                    {item.Horário}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">
                    {item.Categoria}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">
                    {item["Descrição da Refeição"]}
                  </p>
                </div>
                {completed.includes(`h-${idx}`) ? (
                  <CheckCircle2 className="text-blue-600" />
                ) : (
                  <Circle className="text-slate-200" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Apple className="text-slate-400" size={18} />
            <h2 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">
              Menu Nutricional
            </h2>
          </div>
          <div className="grid gap-4">
            {data.Horarios.filter(
              (h: any) => h.Refeição && h["Opção A (Padrão)"],
            ).map((nutri: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden"
              >
                <h4 className="text-xs font-black text-slate-900 mb-4 uppercase flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  {nutri.Refeição}
                </h4>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[8px] font-black text-blue-600 uppercase block mb-1 tracking-widest">
                      Opção A
                    </span>
                    <p className="text-xs font-bold text-slate-700 leading-snug">
                      {nutri["Opção A (Padrão)"]}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100">
                    <span className="text-[8px] font-black text-slate-400 uppercase block mb-1 tracking-widest">
                      Opção B
                    </span>
                    <p className="text-xs font-bold text-slate-500 leading-snug">
                      {nutri["Opção B (Variação)"]}
                    </p>
                  </div>
                  {nutri["O que evitar?"] && (
                    <div className="px-2 flex items-start gap-2">
                      <span className="text-[9px] font-bold text-red-400 uppercase">
                        Evitar:
                      </span>
                      <span className="text-[9px] font-medium text-slate-400">
                        {nutri["O que evitar?"]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100">
          <div className="flex items-center gap-2 mb-2 text-blue-700">
            <Info size={16} />
            <h3 className="text-xs font-black uppercase tracking-widest">
              Dica de Performance
            </h3>
          </div>
          <p className="text-[11px] text-blue-800 font-medium leading-relaxed italic">
            "Beba 500ml de água 30 minutos antes da corrida. Melhora a
            viscosidade do sangue e o transporte de oxigênio."
          </p>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex justify-around items-center z-30">
        <Droplets className="text-blue-600" size={20} />
        <div className="bg-slate-900 p-3 rounded-2xl -mt-10 shadow-lg border-4 border-slate-50">
          <Dumbbell className="text-white" size={24} />
        </div>
        <Apple className="text-slate-300" size={20} />
      </nav>
    </div>
  );
}
