import { Link } from "@tanstack/react-router";
import { Award, ShieldCheck, Hammer, Zap, Wrench, Users, ArrowRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

type Segmento = {
  title: string;
  icon: typeof Award;
  desc: string;
  to?: "/empresas" | "/condominios" | "/rio-pequeno";
};

const SEGMENTOS: Segmento[] = [
  { title: "Condomínios", icon: Award, desc: "Síndicos e zeladores com uma pessoa fixa para conversar, orçamento por escrito e faturamento em nota fiscal.", to: "/condominios" },
  { title: "Empresas", icon: ShieldCheck, desc: "Compras recorrentes com nota fiscal, condição comercial combinada e reposição para a sua operação não parar.", to: "/empresas" },
  { title: "Construtoras", icon: Hammer, desc: "Fornecimento contínuo para obras na Zona Oeste, com disponibilidade real e cotação em poucas horas." },
  { title: "Academias e comércios", icon: Zap, desc: "Elétrica e iluminação para o seu negócio, atendendo urgências dentro do horário comercial." },
  { title: "Eletricistas", icon: Wrench, desc: "Estoque de marcas conhecidas do mercado e condição especial para quem trabalha na rua todo dia." },
  { title: "Prestadores de serviço", icon: Users, desc: "Ferramentas e materiais para quem precisa entregar o serviço no prazo combinado com o cliente." },
];

export function Atendemos() {
  return (
    <section id="atendemos" className="relative bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Quem já compra na Russo"
          title={<>Para operações que <span className="text-primary">não podem parar</span></>}
          description="Do reparo pontual à compra programada de grande volume, adaptamos o atendimento ao tamanho e à frequência da sua demanda."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SEGMENTOS.map(({ title, icon: Icon, desc, to }) => {
            const inner = (
              <>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="mb-3 font-display text-2xl font-black tracking-tight">{title}</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{desc}</p>
                {to && (
                  <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                    Ver página <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </>
            );
            const className =
              "card-premium group rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40 hover:shadow-[var(--shadow-card)]";
            return to ? (
              <Link key={title} to={to} className={className}>
                {inner}
              </Link>
            ) : (
              <div key={title} className={className}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}