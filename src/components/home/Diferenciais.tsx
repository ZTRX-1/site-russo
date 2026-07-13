import { Headset, ShieldCheck, Truck, Navigation, ParkingSquare, Award } from "lucide-react";

const DIFERENCIAIS = [
  {
    icon: Headset,
    title: "Orientação técnica no balcão",
    text: "Nossa equipe ajuda você a escolher o material certo antes, durante e depois da compra, com orientação técnica.",
  },
  {
    icon: ShieldCheck,
    title: "Marcas reconhecidas",
    text: "Trabalhamos com fabricantes conhecidos do mercado, adequados a instalações residenciais e profissionais.",
  },
  {
    icon: Truck,
    title: "Amplo estoque",
    text: "Produtos à pronta entrega, de pequenos reparos a compras maiores, sem precisar procurar em outras lojas.",
  },
  {
    icon: Navigation,
    title: "Fácil de chegar",
    text: "Estamos na Av. Escola Politécnica, com acesso direto para Rio Pequeno, Butantã, Jaguaré e Raposo Tavares.",
  },
  {
    icon: ParkingSquare,
    title: "Estacionamento próprio",
    text: "Espaço para carga, descarga e retirada com calma, sem depender de vaga na rua.",
  },
  {
    icon: Award,
    title: "Nota máxima no Google",
    text: "Avaliações reais de clientes com nota máxima. Uma reputação construída no balcão, cliente a cliente.",
  },
];

export function Diferenciais() {
  return (
    <section
      id="diferenciais"
      className="relative overflow-hidden py-12 text-secondary-foreground md:py-20"
      style={{ background: "var(--gradient-industrial)" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 red-glow-line" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="glass-industrial inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            <Award className="h-3 w-3 shrink-0" /> Por que comprar aqui
          </span>
          <h2 className="mt-5 font-display text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
            Motivos para escolher a Russo
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/65 md:text-lg">
            Quem compra na Russo encontra orientação técnica, disponibilidade de produtos e um atendimento pensado para facilitar cada compra.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {DIFERENCIAIS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="card-premium glass-industrial rounded-2xl p-5 transition-colors hover:border-primary/50 sm:p-7"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-red-glow)] sm:h-12 sm:w-12">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-display text-lg font-black tracking-tight text-white sm:mt-5 sm:text-xl">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/65">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}