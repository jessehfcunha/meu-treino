"use client";
import { useState, useRef, useEffect } from "react";
import { Send, X, Loader2, Bot } from "lucide-react";

interface AIAgentProps {
  userContext: any;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AIAgent = ({ userContext, isOpen, setIsOpen }: AIAgentProps) => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  // Se o chat for fechado, limpamos a conversa
  useEffect(() => {
    if (!isOpen) {
      setChat([]);
    }
  }, [isOpen]);

  const handleAsk = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setChat((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: userContext,
        }),
      });

      const data = await res.json();
      setChat((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao conectar com a IA." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Se o estado 'isOpen' for false, não renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-32 md:right-6 md:w-96 md:h-[500px] bg-slate-950/95 backdrop-blur-2xl border border-white/10 md:rounded-[3rem] z-[70] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600/20 rounded-xl flex items-center justify-center">
            <Bot size={18} className="text-blue-500" />
          </div>
          <span className="text-xs font-black text-white uppercase italic tracking-tighter">
            Performance AI
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-500 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Mensagens */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar"
      >
        {chat.length === 0 && (
          <p className="text-[11px] text-slate-500 italic text-center mt-10">
            Olá! Sou seu assistente de performance. <br /> Pergunte sobre seu
            treino ou dieta.
          </p>
        )}
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-[2rem] text-[11px] leading-relaxed italic ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-slate-900 text-slate-300 rounded-tl-none border border-white/5"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 p-4 rounded-[2rem] rounded-tl-none border border-white/5">
              <Loader2 size={14} className="text-blue-500 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/5">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Como otimizar meu treino?"
            className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-5 pr-14 text-xs text-white outline-none focus:border-blue-500/50 transition-all italic"
          />
          <button
            onClick={handleAsk}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
