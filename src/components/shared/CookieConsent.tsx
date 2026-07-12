import React, { useState, useEffect } from "react";
import { Zap, ShieldCheck, Droplets, Wrench } from "lucide-react";
import { setConsent } from "@/lib/analytics";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") {
      setConsent(true);
    } else if (!consent) {
      // Pequeno delay para não assustar no primeiro frame
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setConsent(true);
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setConsent(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] w-[92%] -translate-x-1/2 sm:right-6 sm:left-auto sm:w-full sm:max-w-md sm:translate-x-0 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-secondary p-6 shadow-[0_20px_60px_-15px_rgba(196,30,58,0.3)] ring-1 ring-white/10 backdrop-blur-xl">
        {/* Decoração Estilo Painel Elétrico / Industrial */}
        <div className="absolute -right-6 -bottom-6 opacity-[0.03]">
          <Zap size={180} className="text-primary rotate-12" />
        </div>
        
        {/* Parafusos decorativos nas quinas */}
        <div className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner border border-zinc-500/50 opacity-40"></div>
        <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner border border-zinc-500/50 opacity-40"></div>
        <div className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner border border-zinc-500/50 opacity-40"></div>
        <div className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner border border-zinc-500/50 opacity-40"></div>

        <div className="relative flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 border border-primary/40 shadow-[0_0_15px_rgba(196,30,58,0.2)]">
              <ShieldCheck className="h-7 w-7 text-primary" />
              {/* Pequeno LED de status piscando */}
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-display text-xl font-black uppercase tracking-tight text-white leading-none">
                Uso de cookies
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Sua privacidade</span>
                <div className="h-1 w-1 rounded-full bg-zinc-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">LGPD</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              Usamos cookies para entender como você navega pelo site e melhorar a sua experiência. Você decide se aceita ou não.
            </p>
            
            <div className="flex flex-wrap gap-3 opacity-40">
              <div className="flex items-center gap-1.5">
                <Zap size={12} className="text-primary" />
                <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-tighter">Elétrica</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Droplets size={12} className="text-blue-400" />
                <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-tighter">Hidráulica</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wrench size={12} className="text-zinc-300" />
                <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-tighter">Reparos</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              onClick={handleAccept}
              className="group relative flex flex-[2] items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-3.5 text-sm font-black text-white transition-all hover:bg-primary-dark hover:scale-[1.02] active:scale-95 shadow-[0_8px_20px_-6px_rgba(196,30,58,0.4)]"
            >
              {/* Brilho interno do botão */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              <Zap className="h-4 w-4 fill-white animate-pulse" />
              <span className="tracking-wide">Aceitar cookies</span>
            </button>
            <button
              onClick={handleReject}
              className="flex-1 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs font-bold text-zinc-500 transition-all hover:bg-white/10 hover:text-zinc-300"
            >
              Recusar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
