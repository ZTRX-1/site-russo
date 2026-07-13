import { Building2, Home, Wrench, HardHat, Hammer, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import {
  WHATSAPP_URL_EMPRESA,
  WHATSAPP_URL_CONDOMINIO,
  WHATSAPP_URL_CONSUMIDOR,
  WHATSAPP_URL_ELETRICISTA,
  WHATSAPP_URL_PRESTADOR,
} from "@/lib/constants";

const OPCOES = [
  {
    label: "Empresa",
    desc: "Compras recorrentes, nota fiscal e condição comercial combinada.",
    icon: Building2,
    href: WHATSAPP_URL_EMPRESA,
    highlight: true,
  },
  {
    label: "Condomínio",
    desc: "Materiais para manutenção predial e apoio a síndicos e zeladores.",
    icon: Building2,
    href: WHATSAPP_URL_CONDOMINIO,
    highlight: true,
  },
  {
    label: "Eletricista",
    desc: "Estoque abastecido e condição especial para o profissional.",
    icon: Wrench,
    href: WHATSAPP_URL_ELETRICISTA,
  },
  {
    label: "Prestador de serviço",
    desc: "Ferramentas e materiais para você entregar o serviço no prazo.",
    icon: Hammer,
    href: WHATSAPP_URL_PRESTADOR,
  },
  {
    label: "Uso em casa",
    desc: "Reforma, reparo ou aquela dúvida antes de comprar. Pode chamar.",
    icon: Home,
    href: WHATSAPP_URL_CONSUMIDOR,
  },
];

export function QuickQuote() {
  return (
    <section
      id="solicitar-orcamento"
      className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-secondary/95 py-20 text-secondary-foreground sm:py-24"
    >
      {/* linha vermelha iluminada — reforço da identidade industrial */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
            <HardHat className="h-3 w-3 shrink-0" /> Peça seu orçamento
          </span>
          <h2 className="mt-5 font-display text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            Como <span className="text-primary">podemos ajudar?</span>
          </h2>
          <p className="mt-4 text-base text-white/60 sm:text-lg">
            Escolha seu perfil e fale diretamente com nossa equipe pelo WhatsApp. A mensagem já é enviada com as informações necessárias para agilizar seu atendimento.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {OPCOES.map(({ label, desc, icon: Icon, href, highlight }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 ${
                highlight
                  ? "border-primary/40 bg-gradient-to-br from-primary/[0.12] to-white/[0.02] hover:border-primary hover:shadow-[0_20px_60px_-15px] hover:shadow-primary/30"
                  : "border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.06]"
              }`}
            >
              {highlight && (
                <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-primary-foreground">
                  B2B
                </span>
              )}
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
                  highlight
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-white/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                }`}
              >
                <Icon className="h-6 w-6 shrink-0" />
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-white">{label}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-snug text-white/60">{desc}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
                <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                Falar agora
                <ArrowRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>

        <p className="mt-8 text-center text-xs uppercase tracking-widest text-white/40">
          Atendimento humano · Loja física no Rio Pequeno · Zona Oeste de São Paulo
        </p>
      </div>
    </section>
  );
}