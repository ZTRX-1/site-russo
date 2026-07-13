import { ShieldCheck } from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";
import { WHATSAPP_URL_EMPRESA, PHONE_DISPLAY } from "@/lib/constants";

const BENEFICIOS = [
  "Nota fiscal e faturamento",
  "Atendimento dedicado para sua empresa",
  "Reposição programada de itens recorrentes",
  "Cotação por escrito e resposta ágil",
];

export function OrcamentoCorporativo() {
  return (
    <section
      id="orcamento-corporativo"
      className="relative overflow-hidden py-16 text-secondary-foreground md:py-24"
      style={{ background: "var(--gradient-industrial)" }}
    >
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-primary/15 blur-[80px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 red-glow-line" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="glass-industrial mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            <ShieldCheck className="h-3 w-3 shrink-0" /> Compras para empresas
          </span>
          <h2 className="mb-6 font-display text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
            Um fornecedor{" "}
            <span className="text-primary">à altura da sua operação</span>
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            Empresas, condomínios, construtoras e academias contam com a Russo para a rotina e para a emergência. Ampla variedade de produtos, orientação técnica, cotação por escrito e nota fiscal em dia. Comprar material vira processo, não problema.
          </p>

          <ul className="mb-10 grid max-w-2xl gap-3 sm:grid-cols-2">
            {BENEFICIOS.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/85">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-6">
            <CtaButton
              href={WHATSAPP_URL_EMPRESA}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
            >
              Solicitar orçamento para empresa
            </CtaButton>
            <div className="flex flex-col">
              <p className="text-[11px] uppercase tracking-widest text-white/50">Prefere falar por telefone?</p>
              <a
                href={`tel:${PHONE_DISPLAY.replace(/\D/g, "")}`}
                className="font-display text-lg font-bold text-white transition-colors hover:text-primary"
              >
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-widest text-white/40">
            Nossa equipe responde durante o horário comercial
          </p>
        </div>
      </div>
    </section>
  );
}