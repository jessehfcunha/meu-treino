"use client";
import { Apple } from "lucide-react";

export const DietPlan = ({ data }: any) => (
  <section id="dieta" className="scroll-mt-32">
    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-1 flex items-center gap-2 italic">
      <Apple size={14} /> Menu Nutricional
    </h3>
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
      {data
        .filter((n: any) => n["Opção A (Padrão)"])
        .map((nutri: any, idx: number) => (
          <div
            key={idx}
            className="min-w-[80vw] snap-center bg-slate-900 border border-white/5 p-7 rounded-[2.5rem] shadow-xl"
          >
            <h4 className="text-xs font-black text-white uppercase mb-4 flex items-center gap-2 italic">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />{" "}
              {nutri.Refeição}
            </h4>
            <div className="p-4 bg-slate-950 rounded-2xl border-l-4 border-blue-600">
              <p className="text-[11px] font-bold text-slate-300 leading-snug italic">
                {nutri["Opção A (Padrão)"]}
              </p>
            </div>
          </div>
        ))}
    </div>
  </section>
);
