"use client";
import { ShoppingCart, Store, Tag } from "lucide-react";

export const ShoppingList = ({ data }: any) => (
  <section id="compras" className="scroll-mt-32">
    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-1 flex items-center gap-2 italic">
      <ShoppingCart size={14} /> Guia de Mercado
    </h3>
    <div className="grid gap-4">
      {data.map((compra: any, idx: number) => {
        const titulo = compra.Secao || compra.Seçao;
        if (!titulo) return null;
        return (
          <div
            key={idx}
            className="bg-slate-900/60 border border-white/5 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 text-white/10">
              <Store size={60} />
            </div>
            <div className="flex items-center gap-3 mb-3 text-blue-500 font-black relative z-10 italic">
              <Store size={16} />
              <h4 className="text-xs uppercase tracking-tight text-white italic">
                {titulo}
              </h4>
            </div>
            {compra.Itens ? (
              <p className="text-[11px] text-slate-400 leading-relaxed italic relative z-10">
                {compra.Itens}
              </p>
            ) : (
              <div className="space-y-2 mt-2 text-[10px] text-slate-500 font-bold border-t border-white/5 pt-3 relative z-10 italic">
                {compra["Mais indicado Lanches"] && (
                  <p> LANCHE: {compra["Mais indicado Lanches"]}</p>
                )}
                {compra["Mais indicado Janta"] && (
                  <p> JANTA: {compra["Mais indicado Janta"]}</p>
                )}
                {compra["Meta de Hidratação"] && (
                  <p className="text-blue-500/80 uppercase">
                    {compra["Meta de Hidratação"]}
                  </p>
                )}
              </div>
            )}
            {compra.Marcas && (
              <div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-black text-slate-600 flex items-center gap-2 relative z-10 italic">
                <Tag size={12} className="text-blue-500" /> {compra.Marcas}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </section>
);
