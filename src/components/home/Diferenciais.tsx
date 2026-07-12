import { Headset, ShieldCheck, Truck, Navigation, ParkingSquare, Award } from "lucide-react";

const DIFERENCIAIS = [
  {
    icon: Headset,
    title: "Equipe que orienta a compra",
    text: "Nossa equipe ajuda você a escolher o material certo antes, durante e depois da compra, sem pressa.",
  },
  {
    icon: ShieldCheck,
    title: "Marcas reconhecidas",
    text: "Trabalhamos com fabricantes conhecidos do mercado, adequados a instalações residenciais e profissionais.",
  },
  {
    icon: Truck,
    title: "Estoque abastecido",
    text: "Você encontra desde pequenos reparos até compras maiores, sem precisar procurar em duas ou três lojas.",
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
    title: "Nota 5,0 no Google",
    text: "Mais de 127 clientes avaliaram com nota máxima. Uma reputação construída no balcão, cliente a cliente.",
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
            <Award className="h-3 w-3 shrink-0" /> Por que comprar aqui
          </span>
          <h2 className="mt-5 font-display text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
            Vantagens reais para <span className="text-primary">o seu dia a dia</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/65 md:text-lg">
            A estrutura de um fornecedor de porte, com a proximidade de uma loja de bairro. É essa combinação que faz o cliente voltar sempre.
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