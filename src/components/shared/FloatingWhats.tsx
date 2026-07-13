import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

export function FloatingWhats() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isVisible) return;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setIsVisible(true);
    };

    const timer = window.setTimeout(reveal, 15000);

    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && scrolled / total >= 0.25) reveal();
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) reveal();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || isDismissed) return;
    const timer = window.setTimeout(() => setShowPopup(true), 800);
    return () => window.clearTimeout(timer);
  }, [isVisible, isDismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPopup(false);
    setIsDismissed(true);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-3 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {showPopup && !isDismissed && (
        <div className="relative mr-1 max-w-[200px] animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            className="relative block rounded-2xl bg-white p-3 text-[12px] font-semibold leading-snug text-secondary shadow-xl ring-1 ring-black/5 transition-transform after:absolute after:bottom-[-8px] after:right-6 after:h-4 after:w-4 after:rotate-45 after:bg-white after:content-[''] hover:scale-[1.02] active:scale-95"
          >
            <p className="text-left">
              <span aria-hidden>👋</span> Posso ajudar?
              <br />
              <span className="font-normal text-secondary/80">
                Informe o material que procura e nossa equipe responde pelo WhatsApp.
              </span>
            </p>
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