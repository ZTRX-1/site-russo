import { createFileRoute } from "@tanstack/react-router";
import fachada from "@/assets/fachada.jpg";
import lojaInterior from "@/assets/loja-interior.jpg";
import {
  MessageCircle,
  MapPin,
  Phone,
  Clock,
  Star,
  Zap,
  Lightbulb,
  Wrench,
  Hammer,
  Cable,
  ShieldCheck,
  Plug,
  Droplets,
  Users,
  Truck,
  ParkingSquare,
  Headset,
  Navigation,
  Instagram,
  Facebook,
  Award,
} from "lucide-react";

const WHATSAPP = "5511999999999";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vim pelo site da Russo Elétrica e Ferragens e gostaria de um atendimento."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP}?text=${WHATSAPP_MSG}`;
const PHONE_DISPLAY = "(11) 99999-9999";
const ADDRESS = "Av. Eng. Heitor Antônio Eiras Garcia, 1234 — Rio Pequeno, São Paulo — SP";
const MAPS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Russo+Eletrica+e+Ferragens+Rio+Pequeno+Sao+Paulo";
const MAPS_EMBED =
  "https://www.google.com/maps?q=Rio+Pequeno,+S%C3%A3o+Paulo+-+SP&output=embed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Russo Elétrica e Ferragens | Rio Pequeno - Zona Oeste de SP",
      },
      {
        name: "description",
        content:
          "Materiais elétricos, ferragens, ferramentas, iluminação, fios, disjuntores e chuveiros no Rio Pequeno, Zona Oeste de São Paulo. Atendimento especializado e melhores preços da região.",
      },
      { name: "keywords", content: "material elétrico Rio Pequeno, ferragens Zona Oeste SP, loja elétrica São Paulo, disjuntores, fios e cabos, chuveiros, ferramentas Rio Pequeno" },
      { property: "og:title", content: "Russo Elétrica e Ferragens — Rio Pequeno, SP" },
      { property: "og:description", content: "Atendimento especializado, produtos de qualidade e os melhores preços da Zona Oeste de SP." },
      { property: "og:type", content: "business.business" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HardwareStore",
          name: "Russo Elétrica e Ferragens",
          image: "/og-image.jpg",
          telephone: "+5511999999999",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Eng. Heitor Antônio Eiras Garcia, 1234",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            postalCode: "05553-001",
            addressCountry: "BR",
          },
          areaServed: "Rio Pequeno, Zona Oeste de São Paulo",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5.0",
            reviewCount: "127",
          },
          openingHours: ["Mo-Fr 08:00-18:00", "Sa 08:00-14:00"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Categorias />
        <Diferenciais />
        <Avaliacoes />
        <Localizacao />
        <Contato />
      </main>
      <Footer />
      <FloatingWhats />
    </div>
  );
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-display text-xl font-black shadow-[var(--shadow-elegant)]">
        R
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-tight">RUSSO</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Elétrica & Ferragens
        </span>
      </span>
    </a>
  );
}

function Header() {
  return (
    <header
      id="top"
      className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 md:flex">
          <a href="#sobre" className="hover:text-primary transition-colors">Sobre</a>
          <a href="#categorias" className="hover:text-primary transition-colors">Categorias</a>
          <a href="#diferenciais" className="hover:text-primary transition-colors">Diferenciais</a>
          <a href="#localizacao" className="hover:text-primary transition-colors">Localização</a>
          <a href="#contato" className="hover:text-primary transition-colors">Contato</a>
        </nav>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-dark"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/80">
            <MapPin className="h-3 w-3 text-primary" /> Rio Pequeno · Zona Oeste SP
          </span>
          <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
            Materiais Elétricos, Ferragens e Soluções para sua{" "}
            <span className="text-primary">Obra</span>.
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/75 sm:text-lg">
            Atendimento especializado, produtos de qualidade e os melhores preços da região.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition hover:translate-y-[-1px] hover:bg-primary-dark"
            >
              <MessageCircle className="h-5 w-5" />
              Solicitar Atendimento no WhatsApp
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Navigation className="h-5 w-5" />
              Como Chegar
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-left">
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/55">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" /> Google
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-white">5.0</dd>
              <dd className="text-xs text-white/60">+127 avaliações</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/55">
                <Clock className="h-3.5 w-3.5 text-primary" /> Aberto
              </dt>
              <dd className="mt-1 font-display text-sm font-semibold text-white">Seg–Sex 8h–18h</dd>
              <dd className="text-xs text-white/60">Sáb 8h–14h</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/55">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Local
              </dt>
              <dd className="mt-1 font-display text-sm font-semibold text-white">Rio Pequeno</dd>
              <dd className="text-xs text-white/60">Zona Oeste de SP</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-2xl bg-primary/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src={fachada}
              alt="Fachada da loja Russo Elétrica e Ferragens no Rio Pequeno, São Paulo"
              width={1536}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-white/10 bg-secondary px-4 py-3 shadow-xl sm:flex sm:items-center sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-white">Tradição no bairro</p>
              <p className="text-xs text-white/60">Atendendo profissionais e moradores</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: React.ReactNode; description?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
    </div>
  );
}

function Sobre() {
  const pillars = [
    { icon: Users, label: "Atendimento especializado", text: "Equipe que entende de obra e te orienta na escolha certa." },
    { icon: Hammer, label: "Variedade de produtos", text: "Materiais elétricos, ferragens, ferramentas e iluminação." },
    { icon: ParkingSquare, label: "Estacionamento próprio", text: "Comodidade para carga rápida e atendimento ágil." },
    { icon: Wrench, label: "Profissional & consumidor", text: "Eletricistas, construtores e clientes finais bem atendidos." },
  ];
  return (
    <section id="sobre" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
              <img
                src={lojaInterior}
                alt="Interior da loja Russo Elétrica com materiais elétricos organizados"
                width={1280}
                height={896}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-xl bg-primary px-6 py-5 text-primary-foreground shadow-[var(--shadow-elegant)] sm:block">
              <p className="font-display text-3xl font-black">+10mil</p>
              <p className="text-xs uppercase tracking-widest">itens em estoque</p>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Sobre a Russo
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Uma loja consolidada no coração do{" "}
              <span className="text-primary">Rio Pequeno</span>.
            </h2>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              A Russo Elétrica e Ferragens é referência na Zona Oeste de São Paulo. Trabalhamos com as
              melhores marcas do mercado e oferecemos uma estrutura completa para atender desde o pequeno
              reparo doméstico até as demandas de eletricistas, construtores e empresas.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, label, text }) => (
                <li key={label} className="flex gap-3 rounded-xl border border-border/70 bg-card p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{label}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
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

const CATEGORIAS = [
  { icon: Zap, name: "Materiais Elétricos", desc: "Linha completa para instalações residenciais e comerciais." },
  { icon: Lightbulb, name: "Iluminação", desc: "Lâmpadas LED, luminárias, spots e refletores." },
  { icon: Wrench, name: "Ferragens", desc: "Fechaduras, dobradiças, parafusos e acessórios." },
  { icon: Hammer, name: "Ferramentas", desc: "Manuais e elétricas das melhores marcas." },
  { icon: Cable, name: "Fios e Cabos", desc: "Diversas bitolas e voltagens, com nota fiscal." },
  { icon: ShieldCheck, name: "Disjuntores", desc: "Monopolares, bipolares e tripolares de marcas certificadas." },
  { icon: Plug, name: "Tomadas", desc: "Padrão novo, antigo, USB e linhas premium." },
  { icon: Droplets, name: "Chuveiros", desc: "Elétricos, blindados e de alta potência." },
];

function Categorias() {
  return (
    <section id="categorias" className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Categorias"
          title={<>Tudo o que sua <span className="text-primary">obra precisa</span></>}
          description="Uma curadoria completa de produtos para profissionais e consumidores finais."
        />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIAS.map(({ icon: Icon, name, desc }) => (
            <a
              key={name}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-card)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-primary opacity-0 transition group-hover:opacity-100" />
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Consultar <MessageCircle className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const DIFERENCIAIS = [
  { icon: Headset, title: "Atendimento especializado", text: "Equipe técnica preparada para tirar dúvidas e indicar a solução certa." },
  { icon: ShieldCheck, title: "Produtos de qualidade", text: "Marcas reconhecidas, certificadas e com garantia de fábrica." },
  { icon: MapPin, title: "Localização estratégica", text: "Bem no centro do Rio Pequeno, fácil acesso pela Zona Oeste." },
  { icon: Truck, title: "Entrega rápida", text: "Entregamos em obras e residências da região com agilidade." },
  { icon: ParkingSquare, title: "Estacionamento próprio", text: "Comodidade para carga rápida e atendimento sem stress." },
  { icon: Wrench, title: "Suporte técnico", text: "Orientação para eletricistas, profissionais e moradores." },
];

function Diferenciais() {
  return (
    <section id="diferenciais" className="relative overflow-hidden bg-secondary py-20 text-secondary-foreground sm:py-28">
      <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-primary/10 [clip-path:polygon(20%_0,100%_0,100%_100%,0%_100%)] lg:block" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Diferenciais
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Por que a <span className="text-primary">Russo</span> é referência na região
          </h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIFERENCIAIS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition hover:border-primary/50 hover:bg-white/[0.07]"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-elegant)]">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm text-white/65">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  {
    name: "Carlos Mendes",
    role: "Eletricista",
    text: "Atendimento nota 10. Sempre encontro tudo que preciso para as obras e o preço é o melhor da região.",
  },
  {
    name: "Juliana Souza",
    role: "Moradora do bairro",
    text: "Fui trocar um chuveiro e fui super bem orientada. Loja organizada, equipe atenciosa. Recomendo demais!",
  },
  {
    name: "Roberto Lima",
    role: "Construtor",
    text: "Compro materiais elétricos aqui há anos. Variedade, qualidade e entrega rápida. Parceiros da nossa construtora.",
  },
];

function Avaliacoes() {
  return (
    <section id="avaliacoes" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Avaliações
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Nota <span className="text-primary">5.0</span> no Google
            </h2>
            <div className="mt-4 flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-gold text-gold" />
              ))}
            </div>
            <p className="mt-4 text-muted-foreground">
              Mais de 127 clientes avaliaram a Russo Elétrica com a nota máxima. Confiança construída
              no balcão, dia após dia.
            </p>
            <a
              href="https://www.google.com/maps/search/Russo+Eletrica+e+Ferragens+Rio+Pequeno"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Ver todas as avaliações no Google →
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure
                key={r.name}
                className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-4 border-t border-border pt-3">
                  <p className="font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Localizacao() {
  return (
    <section id="localizacao" className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Localização
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Estamos no <span className="text-primary">Rio Pequeno</span>, fácil de chegar
            </h2>
            <p className="mt-4 text-muted-foreground">{ADDRESS}</p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-primary" />
                <span>Segunda a sexta: 8h às 18h · Sábado: 8h às 14h</span>
              </li>
              <li className="flex items-start gap-3">
                <ParkingSquare className="mt-0.5 h-5 w-5 text-primary" />
                <span>Estacionamento próprio para clientes</span>
              </li>
              <li className="flex items-start gap-3">
                <Truck className="mt-0.5 h-5 w-5 text-primary" />
                <span>Entregas para toda a Zona Oeste de São Paulo</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition hover:bg-primary-dark"
              >
                <Navigation className="h-4 w-4" />
                Traçar Rota
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]">
            <iframe
              title="Mapa Russo Elétrica e Ferragens — Rio Pequeno, SP"
              src={MAPS_EMBED}
              width="100%"
              height="450"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[420px] w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Contato() {
  return (
    <section id="contato" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 bg-secondary" />
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
      <div className="relative mx-auto max-w-5xl px-4 text-center text-white sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Fale com a gente
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
          Atendimento <span className="text-primary">rápido</span> pelo WhatsApp
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          Tire dúvidas, peça orçamento, consulte disponibilidade. Respondemos no horário comercial.
        </p>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 rounded-xl bg-whatsapp px-7 py-4 text-base font-bold text-white shadow-[var(--shadow-elegant)] transition hover:scale-[1.02]"
        >
          <MessageCircle className="h-6 w-6" />
          Conversar no WhatsApp agora
        </a>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Phone, label: "Telefone", value: PHONE_DISPLAY },
            { icon: MapPin, label: "Endereço", value: "Rio Pequeno · Zona Oeste SP" },
            { icon: Clock, label: "Horário", value: "Seg–Sex 8h–18h · Sáb 8h–14h" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-xs uppercase tracking-widest text-white/55">{label}</p>
              <p className="mt-1 font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Materiais elétricos, ferragens, ferramentas e iluminação no Rio Pequeno, Zona Oeste de São
            Paulo. Atendimento especializado para profissionais e consumidores finais.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground/70 transition hover:border-primary hover:text-primary">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground/70 transition hover:border-primary hover:text-primary">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground/70 transition hover:border-primary hover:text-primary">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest">Navegação</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#sobre" className="hover:text-primary">Sobre</a></li>
            <li><a href="#categorias" className="hover:text-primary">Categorias</a></li>
            <li><a href="#diferenciais" className="hover:text-primary">Diferenciais</a></li>
            <li><a href="#localizacao" className="hover:text-primary">Localização</a></li>
            <li><a href="#contato" className="hover:text-primary">Contato</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest">Contato</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" />{PHONE_DISPLAY}</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" />Rio Pequeno, Zona Oeste — SP</li>
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-primary" />Seg–Sex 8h–18h · Sáb 8h–14h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Russo Elétrica e Ferragens. Todos os direitos reservados.</p>
          <p>Rio Pequeno · São Paulo · SP</p>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhats() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[var(--shadow-elegant)] transition hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40" />
    </a>
  );
}
