"use client";
import { Clock, CheckCircle2 } from "lucide-react";

export const DailyRoutine = ({ data, completed, toggleTask }: any) => (
  <section id="rotina" className="scroll-mt-32">
    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-1 flex items-center gap-2 italic">
      <Clock size={14} /> Cronograma Diário
    </h3>
    <div className="space-y-4 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-[1px] before:bg-slate-800">
      {data.map((item: any, idx: number) => (
        <div
          key={idx}
          onClick={() => toggleTask(`h-${idx}`)}
          className={`relative pl-12 flex items-center transition-all cursor-pointer ${completed.includes(`h-${idx}`) ? "opacity-30 scale-[0.98]" : "opacity-100"}`}
        >
          <div
            className={`absolute left-0 w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-slate-950 z-10 ${completed.includes(`h-${idx}`) ? "bg-blue-600 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-slate-900 border-slate-800"}`}
          >
            {completed.includes(`h-${idx}`) ? (
              <CheckCircle2 size={18} className="text-white" />
            ) : (
              <div className="w-1 h-1 bg-slate-700 rounded-full" />
            )}
          </div>
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded-[2rem] flex-1">
            <span className="text-[9px] font-black text-blue-500 block mb-0.5 italic">
              {item.Horário}
            </span>
            <h4 className="text-[13px] font-black text-white uppercase tracking-tight leading-none mb-1 italic">
              {item.Categoria}
            </h4>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">
              {item["Descrição da Refeição"]}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
