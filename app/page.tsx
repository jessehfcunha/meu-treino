"use client"; // Indica que o componente tem interatividade

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Dumbbell, Apple, Clock, Droplets } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  
  // 1. Carregar os dados do JSON e o progresso do LocalStorage
  useEffect(() => {
    fetch('/database.json')
      .then(res => res.json())
      .then(json => setData(json));

    const saved = localStorage.getItem('dieta-progresso');
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const toggleTask = (id: string) => {
    const newCompleted = completed.includes(id) 
      ? completed.filter(i => i !== id) 
      : [...completed, id];
    setCompleted(newCompleted);
    localStorage.setItem('dieta-progresso', JSON.stringify(newCompleted));
  };

  if (!data) return <div className="p-10 text-center">Carregando plano...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Estilo App */}
      <header className="bg-white p-6 shadow-sm sticky top-0 z-20">
        <h1 className="text-xl font-black text-slate-800 tracking-tight">PERFORMANCE APP</h1>
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
            <Droplets size={14} /> 3L Água
          </div>
          <div className="bg-slate-800 text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
             Secagem
          </div>
        </div>
      </header>

      <main className="p-4 space-y-8">
        
        {/* SEÇÃO: CRONOGRAMA (Vem da aba Treino do seu JSON) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-slate-400" size={20} />
            <h2 className="font-black text-slate-400 uppercase text-xs tracking-widest">Cronograma Diário</h2>
          </div>
          <div className="space-y-3">
            {data.Treino.map((item: any, idx: number) => (
              <div 
                key={idx}
                onClick={() => toggleTask(`h-${idx}`)}
                className={`flex items-center gap-4 p-4 rounded-3xl border transition-all active:scale-95 ${
                  completed.includes(`h-${idx}`) ? 'bg-slate-200 border-transparent opacity-50' : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <span className="text-xs font-black text-blue-600 w-10">{item.Horário}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 uppercase leading-none mb-1">{item.Categoria}</h4>
                  <p className="text-xs text-slate-500 font-medium">{item["Descrição da Refeição"]}</p>
                </div>
                {completed.includes(`h-${idx}`) ? <CheckCircle2 className="text-blue-600" /> : <Circle className="text-slate-200" />}
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO: TREINOS (Vem da aba Performance do seu JSON) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell className="text-slate-400" size={20} />
            <h2 className="font-black text-slate-400 uppercase text-xs tracking-widest">Plano de Treino</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {data.Performance.map((treino: any, idx: number) => (
              <div key={idx} className="min-w-[85%] snap-center bg-slate-800 text-white p-6 rounded-[2rem] shadow-xl">
                <span className="text-[10px] font-black bg-blue-500 px-2 py-1 rounded-md uppercase tracking-widest">{treino.Dia}</span>
                <h3 className="text-lg font-bold mt-3 leading-tight">{treino["Atividade Principal"]}</h3>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed line-clamp-3">{treino["Detalhamento do Treino (Prescrição)"]}</p>
                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center text-[10px] font-bold text-blue-400">
                  <span>CORE: {treino["Foco de Abdômen (Core)"]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO: NUTRIÇÃO (Vem da aba Horarios do seu JSON) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Apple className="text-slate-400" size={20} />
            <h2 className="font-black text-slate-400 uppercase text-xs tracking-widest">Substituições</h2>
          </div>
          <div className="grid gap-4">
            {data.Horarios.map((nutri: any, idx: number) => (
              <div key={idx} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
                <h4 className="text-sm font-black text-slate-800 mb-3 uppercase tracking-tighter">{nutri.Refeição}</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                    <span className="text-[9px] font-black text-blue-500 uppercase block mb-1">Opção A (Padrão)</span>
                    <p className="text-xs font-bold text-blue-900">{nutri["Opção A (Padrão)"]}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Opção B (Variação)</span>
                    <p className="text-xs font-bold text-slate-700">{nutri["Opção B (Variação)"]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}