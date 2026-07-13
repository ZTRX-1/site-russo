import { Phone, MapPin, Clock } from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";
import { WHATSAPP_URL, PHONE_DISPLAY, MOBILE_DISPLAY } from "@/lib/constants";

export function Contato() {
  return (
    <section id="contato" className="relative overflow-hidden py-12 md:py-20">
      <div className="absolute inset-0 bg-secondary" />
      <div className="pointer-events-none absolute inset-x-0 top-0 red-glow-line" />
      <div className="relative mx-auto max-w-5xl px-4 text-center text-white sm:px-6 lg:px-8">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          Fale com nossa equipe
        </span>
        <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
          Se preferir, fale conosco pelo WhatsApp
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          Envie uma mensagem contando o que você precisa. Nossa equipe responde durante o horário comercial e informa disponibilidade, preços e orientações técnicas para a sua compra.
        </p>

        <div className="mt-8 flex justify-center">
          <CtaButton
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
          >
            Enviar mensagem no WhatsApp
          </CtaButton>
        </div>
        <p className="mt-3 text-[11px] uppercase tracking-widest text-white/45">
          Respondemos dentro do horário comercial
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Phone className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="mt-3 text-[11px] uppercase tracking-widest text-white/55">Telefones</p>
            <div className="mt-1 flex flex-col font-semibold">
              <a href={`tel:${PHONE_DISPLAY.replace(/\D/g, "")}`} className="transition-colors hover:text-primary">
                {PHONE_DISPLAY}
              </a>
              <a href={`tel:${MOBILE_DISPLAY.replace(/\D/g, "")}`} className="transition-colors hover:text-primary">
                {MOBILE_DISPLAY}
              </a>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="mt-3 text-[11px] uppercase tracking-widest text-white/55">Localização</p>
          <p className="mt-1 font-semibold leading-tight">Rio Pequeno, próximo à USP</p>
            <p className="mt-1 text-xs text-white/60">Av. Escola Politécnica, 2850</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Clock className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <p className="mt-3 text-[11px] uppercase tracking-widest text-white/55">Horário</p>
          <p className="mt-1 font-semibold leading-tight">Segunda a sexta, das 8h às 18h</p>
          <p className="text-sm font-semibold">Aos sábados, das 8h às 13h</p>
          </div>
        </div>
      </div>
    </section>
  );
}