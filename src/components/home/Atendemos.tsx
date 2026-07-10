import { Award, ShieldCheck, Hammer, Zap, Wrench, Users } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const SEGMENTOS = [
  { title: "Condomínios", icon: Award, desc: "Manutenção predial sem gargalos: síndicos e zeladores com atendimento dedicado, orçamento formal e faturamento." },
  { title: "Empresas", icon: ShieldCheck, desc: "Compras recorrentes com nota fiscal, condições comerciais e reposição — sua operação não para por falta de material." },
  { title: "Construtoras", icon: Hammer, desc: "Suprimento contínuo para obras na Zona Oeste: disponibilidade real e cotação em minutos." },
  { title: "Academias & comércios", icon: Zap, desc: "Elétrica e iluminação para negócios que não podem ficar horas fora do ar." },
  { title: "Eletricistas", icon: Wrench, desc: "Parceria técnica com estoque de marcas certificadas e condições especiais." },
  { title: "Prestadores de serviço", icon: Users, desc: "Ferramentas profissionais e materiais para quem entrega qualidade e prazo todos os dias." },
];

export function Atendemos() {
  return (
    <section id="atendemos" className="relative bg-muted/30 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Atendimento especializado"
          title={<>Para operações que <span className="text-primary">não podem parar</span></>}
          description="Nossa estrutura foi desenhada para atender demandas técnicas e recorrentes — do reparo urgente à compra programada de grande volume."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SEGMENTOS.map(({ title, icon: Icon, desc }) => (
            <div
              key={title}
              className="card-premium group rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mb-3 font-display text-2xl font-black tracking-tight">{title}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}