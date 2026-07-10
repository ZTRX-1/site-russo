import { Headset, ShieldCheck, Truck, Navigation, ParkingSquare, Award } from "lucide-react";

const DIFERENCIAIS = [
  {
    icon: Headset,
    title: "Atendimento especializado",
    text: "Equipe orienta o material certo para o seu projeto — antes, durante e depois da compra.",
  },
  {
    icon: ShieldCheck,
    title: "Marcas certificadas",
    text: "Apenas fabricantes reconhecidos. Segurança e conformidade para instalações profissionais.",
  },
  {
    icon: Truck,
    title: "Grande variedade em estoque",
    text: "Estoque profundo para não deixar sua obra ou operação parada por falta de material.",
  },
  {
    icon: Navigation,
    title: "Acesso privilegiado",
    text: "Av. Escola Politécnica — direto para Rio Pequeno, Butantã, Jaguaré e Raposo Tavares.",
  },
  {
    icon: ParkingSquare,
    title: "Estacionamento próprio",
    text: "Carga, descarga e retirada sem estresse — o tempo do seu profissional é dinheiro.",
  },
  {
    icon: Award,
    title: "5.0 no Google",
    text: "Mais de 127 clientes avaliaram com nota máxima. Reputação construída no balcão.",
  },
];

export function Diferenciais() {
  return (
    <section
      id="diferenciais"
      className="relative overflow-hidden py-16 text-secondary-foreground md:py-24"
      style={{ background: "var(--gradient-industrial)" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 red-glow-line" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="glass-industrial inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            <Award className="h-3 w-3 shrink-0" /> Por que a Russo
          </span>
          <h2 className="mt-5 font-display text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
            Diferenciais que <span className="text-primary">viram vantagem</span> para você
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/65 md:text-lg">
            Estrutura de fornecedor de médio porte com a proximidade de uma loja de bairro. É essa combinação que faz o cliente empresarial voltar.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIFERENCIAIS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="card-premium glass-industrial rounded-2xl p-7 transition-colors hover:border-primary/50"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-red-glow)]">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 font-display text-xl font-black tracking-tight text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}