"use client";
import { Info } from "lucide-react";

export const MasterNotes = ({ data }: any) => (
  <section
    id="notas"
    className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-[2.5rem] scroll-mt-32"
  >
    <h3 className="text-[11px] font-black text-white uppercase mb-8 flex items-center gap-2 italic">
      <Info className="text-blue-500" size={18} /> Notas do Mestre
    </h3>
    <div className="space-y-8 italic leading-relaxed">
      {Object.entries(data).map(([key, value]: [string, any]) => (
        <div key={key} className="pl-3 border-l border-slate-800">
          <span className="text-[9px] font-black text-slate-600 uppercase block mb-1 tracking-widest italic">
            {key}
          </span>
          <p className="text-[11px] font-medium text-slate-300">{value}</p>
        </div>
      ))}
    </div>
  </section>
);
