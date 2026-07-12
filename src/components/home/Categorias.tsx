import { Zap, Lightbulb, Droplets, Plug, Hammer, Wrench, Cable, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { SectionHeader } from "./SectionHeader";
import { WHATSAPP } from "@/lib/constants";

const CATEGORIAS = [
  { icon: Zap, name: "Infraestrutura elétrica", desc: "Fios, cabos, disjuntores e quadros de distribuição." },
  { icon: Lightbulb, name: "Iluminação", desc: "LED para residência, comércio e ambientes industriais." },
  { icon: Droplets, name: "Hidráulica", desc: "Conexões, tubos, registros e acessórios de banho." },
  { icon: Plug, name: "Acabamentos elétricos", desc: "Interruptores e tomadas em linhas completas." },
  { icon: Hammer, name: "Ferramentas profissionais", desc: "Marcas para o dia a dia do eletricista e do prestador." },
  { icon: Wrench, name: "Ferragens", desc: "Fixação, segurança e itens estruturais para obra." },
  { icon: Cable, name: "Redes e conectividade", desc: "Cabos de dados, conectores e acessórios para redes." },
  { icon: ShieldCheck, name: "Proteção e segurança", desc: "DPS, DR e itens de segurança elétrica." },
];

export function Categorias() {
  return (
    <section id="categorias" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Linhas de produto"
          title={<>Estoque para <span className="text-primary">projetos, obras e manutenção</span></>}
          description="Toque em uma categoria para falar direto pelo WhatsApp. Sua cotação começa antes mesmo de você chegar à loja."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
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
                className="card-premium group relative flex h-full min-h-[168px] flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary hover:shadow-[var(--shadow-card)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-display text-lg font-black tracking-tight">{name}</h3>
                <p className="mt-1 grow text-sm leading-snug text-muted-foreground">{desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
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