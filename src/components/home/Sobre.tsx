import { Users, Hammer, ParkingSquare, Award } from "lucide-react";
import lojaInterior from "@/assets/loja-interior.jpg";

const PILLARS = [
  { icon: Users, label: "Atendimento humano", text: "Equipe preparada para orientar sua compra com proximidade e precisão." },
  { icon: Hammer, label: "Variedade e estrutura", text: "Ampla linha de produtos das melhores marcas, em ambiente organizado." },
  { icon: ParkingSquare, label: "Fácil acesso", text: "Loja preparada para atendimento ágil, com estacionamento próprio." },
  { icon: Award, label: "Tradição e confiança", text: "Empresa familiar comprometida com a solução dos seus problemas diários." },
];

export function Sobre() {
  return (
    <section id="sobre" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
              <img
                src={lojaInterior}
                alt="Interior da loja Russo Elétrica com materiais organizados"
                width={1280}
                height={896}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden max-w-[240px] rounded-xl bg-primary px-6 py-5 text-primary-foreground shadow-[var(--shadow-elegant)] sm:block">
              <p className="text-xs font-bold uppercase leading-tight tracking-widest">
                Grande variedade de marcas, modelos e opções disponíveis em estoque.
              </p>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Nossa história & compromisso
            </span>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Mais do que uma loja. Um{" "}
              <span className="text-primary">parceiro para quem precisa resolver</span>.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              A Russo é ponto de apoio para quem busca resolver problemas com confiança, encontrar os produtos certos e contar com atendimento próximo e especializado — para moradores, eletricistas, empresas, condomínios e prestadores de serviço.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Com localização privilegiada no Rio Pequeno e fácil acesso pela Avenida Escola Politécnica, oferecemos estrutura organizada, estacionamento próprio e uma ampla variedade de produtos para atender do reparo do dia a dia à demanda recorrente de profissionais e empresas.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {PILLARS.map(({ icon: Icon, label, text }) => (
                <li
                  key={label}
                  className="flex gap-3 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground">{label}</p>
                    <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}