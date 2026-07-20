import { Zap, Lightbulb, Radio, Plug, Hammer, Wrench, Cable, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { SectionHeader } from "./SectionHeader";
import { WHATSAPP } from "@/lib/constants";

const CATEGORIAS = [
  { icon: Zap, name: "Infraestrutura elétrica", desc: "Fios, cabos, disjuntores e quadros de distribuição." },
  { icon: Lightbulb, name: "Iluminação", desc: "LED para residência, comércio e ambientes industriais." },
  { icon: Radio, name: "Automação e sensores", desc: "Sensores de presença, timers, minuterias e módulos para instalações." },
  { icon: Plug, name: "Acabamentos elétricos", desc: "Interruptores e tomadas em linhas completas." },
  { icon: Hammer, name: "Ferramentas profissionais", desc: "Marcas para o dia a dia do eletricista e do prestador." },
  { icon: Wrench, name: "Ferragens", desc: "Fixação, segurança e itens estruturais para obra." },
  { icon: Cable, name: "Redes e conectividade", desc: "Cabos de dados, conectores e acessórios para redes." },
  { icon: ShieldCheck, name: "Proteção e segurança", desc: "DPS, DR e itens de segurança elétrica." },
];

export function Categorias() {
  return (
    <section id="categorias" className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Linhas de produto"
          title={<>Estoque para projetos, obras e manutenção</>}
          description="Escolha uma categoria e fale diretamente com um especialista da Russo. Sua cotação começa antes mesmo de você chegar à loja."
          align="left"
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {CATEGORIAS.map(({ icon: Icon, name, desc }) => {
            const msg = encodeURIComponent(
              `Olá! Vim pelo site da Russo e gostaria de um orçamento na linha de ${name.toLowerCase()}.`,
            );
            const href = `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${msg}`;
            return (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-premium group relative flex h-full min-h-[148px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-[var(--shadow-card)] sm:min-h-[168px] sm:p-5"
              >
                <span className="icon-lift flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:h-12 sm:w-12">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-3 font-display text-base font-black tracking-tight sm:mt-4 sm:text-lg">{name}</h3>
                <p className="mt-1 grow text-xs leading-snug text-muted-foreground sm:text-sm">{desc}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary transition-transform group-hover:translate-x-0.5 sm:mt-4 sm:text-[11px]">
                  Consultar <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}