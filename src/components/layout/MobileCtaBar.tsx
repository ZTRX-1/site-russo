import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { WHATSAPP_URL, PHONE_DISPLAY } from "@/lib/constants";
import { trackWhatsAppClick, trackEvent } from "@/lib/analytics";

export function MobileCtaBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-10% 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="animate-fade-up fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 shadow-[0_-10px_30px_-12px_oklch(0_0_0_/_0.2)] backdrop-blur-md sm:hidden">
      <div className="grid grid-cols-[auto_1fr] items-center gap-2 px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
        <a
          href={`tel:${PHONE_DISPLAY.replace(/\D/g, "")}`}
          aria-label="Ligar para a loja"
          onClick={() => trackEvent("phone_click", { source: "mobile_cta_bar" })}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border text-foreground transition-all hover:border-primary hover:text-primary active:scale-95"
        >
          <Phone className="h-5 w-5" strokeWidth={1.75} />
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick("mobile_cta_bar", { href: WHATSAPP_URL })}
          className="inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-red-glow)] transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">Solicitar orçamento</span>
        </a>
      </div>
    </div>
  );
}