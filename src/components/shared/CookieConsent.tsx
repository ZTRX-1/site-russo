import React, { useState, useEffect } from "react";
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
    <div className="fixed bottom-4 left-1/2 z-[9999] w-[94%] -translate-x-1/2 sm:right-6 sm:bottom-6 sm:left-auto sm:w-full sm:max-w-sm sm:translate-x-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-lg border border-white/10 bg-secondary p-5 shadow-xl">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Este site usa cookies
            </h3>
            <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
              Utilizamos cookies para melhorar sua navegação e entender como
              podemos atender melhor. Você pode aceitar ou recusar.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleAccept}
              className="flex-1 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Aceitar
            </button>
            <button
              onClick={handleReject}
              className="flex-1 rounded-md border border-white/15 bg-transparent px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/5"
            >
              Recusar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
