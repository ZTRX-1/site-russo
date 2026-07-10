import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

/**
 * Botão flutuante do WhatsApp — usa o mascote da Russo em vez do círculo padrão.
 * Diferencia a marca e reforça identidade visual.
 */
export function FloatingWhats() {
  const [showPopup, setShowPopup] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!isDismissed) setShowPopup(true);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [isDismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPopup(false);
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-5 sm:right-5">
      {showPopup && !isDismissed && (
        <div className="relative mr-2 max-w-[220px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={handleDismiss}
            className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 hover:bg-gray-100"
            aria-label="Fechar popup"
          >
            <X className="h-3 w-3 text-secondary" />
          </button>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block rounded-2xl bg-white p-3 text-xs font-bold text-secondary shadow-xl ring-1 ring-black/5 transition-transform after:absolute after:bottom-[-8px] after:right-6 after:h-4 after:w-4 after:rotate-45 after:bg-white after:content-[''] hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-start gap-2 text-left">
              <img
                src="/uploads/mascote.png"
                alt="Mascote Russo"
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full border-2 border-primary bg-secondary object-contain p-0.5"
              />
              <p className="leading-tight">
                Olá, sou o <span className="text-primary">Russo</span>!<br />
                Precisa de ajuda com seu orçamento?
              </p>
            </div>
          </a>
        </div>
      )}

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-[0_12px_30px_-8px_oklch(0.55_0.22_27_/_0.55)] ring-2 ring-white transition-transform hover:scale-110 active:scale-95"
      >
        <img
          src="/uploads/mascote.png"
          alt=""
          width={64}
          height={64}
          className="h-14 w-14 rounded-full object-contain"
        />
        <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-primary/40" />
      </a>
    </div>
  );
}