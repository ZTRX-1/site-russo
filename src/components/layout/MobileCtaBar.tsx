import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { WHATSAPP_URL, PHONE_DISPLAY } from "@/lib/constants";

/**
 * Barra fixa inferior mobile — CTA sempre visível.
 * Some no desktop (sm+).
 */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 shadow-[0_-8px_24px_-12px_oklch(0_0_0_/_0.15)] backdrop-blur-md sm:hidden">
      <div className="grid grid-cols-[auto_1fr] items-center gap-2 px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
        <a
          href={`tel:${PHONE_DISPLAY.replace(/\D/g, "")}`}
          aria-label="Ligar para a loja"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Phone className="h-5 w-5" strokeWidth={1.75} />
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-red-glow)] transition-transform active:scale-[0.98]"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">Solicitar orçamento</span>
        </a>
      </div>
    </div>
  );
}