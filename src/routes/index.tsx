import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import fachada from "/uploads/fachada.webp";
import logoRusso from "/uploads/logo-russo.png";
import lojaInterior from "@/assets/loja-interior.jpg";
import {
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

// Custom WhatsApp Icon Component for consistent use
function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

const WHATSAPP = "5511922328009";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vim pelo site da Russo Elétrica e Ferragens e gostaria de um orçamento."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP}?text=${WHATSAPP_MSG}`;
const PHONE_DISPLAY = "(11) 3766-2002";
const MOBILE_DISPLAY = "(11) 92232-8009";
const ADDRESS = "R. Jorge Ward, 193 (Acesso pela Av. Escola Politécnica, 2850) — Rio Pequeno, São Paulo — SP";
const MAPS_URL = "https://maps.apple.com/?daddr=R.+Jorge+Ward,+193+-+Rio+Pequeno,+S%C3%A3o+Paulo+-+SP,+05386-130&dirflg=d";
const GOOGLE_MAPS_URL = "https://www.google.com/maps/dir/?api=1&destination=R.++Jorge+Ward,+193+-+Rio+Pequeno,+S%C3%A3o+Paulo+-+SP,+05386-130&travelmode=driving";
const MAPS_EMBED =
  "https://www.google.com/maps?q=R.+Jorge+Ward,+193+-+Rio+Pequeno,+S%C3%A3o+Paulo+-+SP&output=embed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Russo Elétrica e Ferragens: Soluções Técnicas na Zona Oeste de SP",
      },
      {
        name: "description",
        content:
          "Fornecedora de soluções em elétrica, ferragens e iluminação. Atendimento especializado para condomínios, empresas e profissionais na região da Escola Politécnica e USP.",
      },
      {
        name: "keywords",
        content:
          "material elétrico Zona Oeste, loja de elétrica Rio Pequeno, ferragens São Paulo, materiais elétricos Escola Politécnica, ferragens Zona Oeste SP, fornecedor elétrica SP, soluções elétricas corporativas",
      },
      {
        property: "og:title",
        content: "Russo Elétrica e Ferragens — Soluções na Zona Oeste de SP",
      },
      {
        property: "og:description",
        content:
          "Atendimento especializado e soluções completas em elétrica, ferragens e iluminação. Para condomínios, empresas e profissionais na Zona Oeste de SP.",
      },
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
          image: "/uploads/fachada.webp",
          telephone: "+551137662002",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: "R. Jorge Ward, 193",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            postalCode: "05386-130",
            addressCountry: "BR",
          },
          areaServed: "Rio Pequeno, Zona Oeste de São Paulo",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5.0",
            reviewCount: "127",
          },
          openingHours: ["Mo-Fr 08:00-18:00", "Sa 08:00-13:00"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero-section');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        if (rect.top < 0) {
          document.body.classList.add('scrolled');
        } else {
          document.body.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <ClientesParceiros />
        <Sobre />
        <Atendemos />
        <Categorias />
        <OrcamentoCorporativo />
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
    <a href="#top" className={`flex items-center gap-3 ${className}`}>
      <img 
        src={logoRusso} 
        alt="Russo Elétrica e Ferragens" 
        className="h-10 w-10 object-contain"
      />
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
      className="sticky top-0 z-40 w-full border-b border-transparent bg-transparent transition-all duration-300"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 md:flex">
          <a href="#atendemos" className="hover:text-primary transition-colors">Públicos</a>
          <a href="#categorias" className="hover:text-primary transition-colors">Soluções</a>
          <a href="#orcamento-corporativo" className="hover:text-primary transition-colors font-bold text-primary">Corporativo</a>
          <a href="#localizacao" className="hover:text-primary transition-colors">Localização</a>
        </nav>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-dark"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="hero-section" className="relative overflow-hidden bg-secondary text-secondary-foreground">
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:py-24 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/80">
            <MapPin className="h-3 w-3 text-primary shrink-0" /> Localização estratégica na Zona Oeste de SP
          </span>
          <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
            Soluções Técnicas em <span className="text-primary italic">Elétrica, Ferragens e Iluminação</span>.
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/75 sm:text-xl leading-relaxed">
            Estrutura consolidada para atender com precisão desde demandas residenciais até o fornecimento técnico para condomínios e empresas.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-sm transition hover:bg-primary-dark"
            >
              Consultar Orçamento
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" />
              WhatsApp
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-y-3 sm:grid-cols-4 sm:gap-4">
            {[
              "Atendimento especializado",
              "Grande variedade em estoque",
              "Estacionamento próprio",
              "Fácil acesso (Politécnica)",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/60">
                <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-left">
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/55">
                <Star className="h-3.5 w-3.5 fill-gold text-gold shrink-0" /> Google
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold text-white">5.0</dd>
              <dd className="text-xs text-white/60">5.0 / +127 avaliações</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/55">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" /> Faturamento
              </dt>
              <dd className="mt-1 font-display text-lg font-bold text-white leading-none">Para Empresas</dd>
              <dd className="text-xs text-white/60">B2B e Condomínios</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/55">
                <Users className="h-3.5 w-3.5 text-primary shrink-0" /> Atendimento
              </dt>
              <dd className="mt-1 font-display text-lg font-bold text-white leading-none">Especializado</dd>
              <dd className="text-xs text-white/60">Técnico e Próximo</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-2xl bg-primary/20 blur-3xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-secondary to-black shadow-2xl">
            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
            
            {/* Elementos visuais de solução */}
            <div className="absolute inset-0 flex flex-col justify-center gap-4 p-6 sm:p-10 pb-16">
              <div className="grid grid-cols-2 gap-4">
                <div className="group flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:bg-primary/20">
                  <Zap className="h-10 w-10 text-primary mb-3 transition group-hover:scale-110 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 text-center">Elétrica</span>
                </div>
                <div className="group flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:bg-primary/20">
                  <Droplets className="h-10 w-10 text-primary mb-3 transition group-hover:scale-110 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 text-center">Hidráulica</span>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Plug className="h-6 w-6 shrink-0" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white">Consulte Agora</p>
                    <p className="text-sm text-white/60 leading-tight">Disjuntores e Fios a pronta entrega.</p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Lightbulb className="h-6 w-6 shrink-0" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white">Iluminação LED</p>
                    <p className="text-sm text-white/60 leading-tight">Economia para sua casa.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selo de Confiança Local - Movido para fora do fluxo principal dos cards */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 pt-10">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-secondary/80 p-3 backdrop-blur-xl">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                </div>
                <p className="text-[10px] font-medium text-white/90 leading-tight">
                  <span className="block font-bold text-white uppercase tracking-tighter">Russo Elétrica</span>
                  Confiança no Rio Pequeno
                </p>
              </div>
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

function ClientesParceiros() {
  return (
    <section className="bg-background py-10 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-8">
          Soluções confiadas por empresas, condomínios e profissionais da região
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
          {["Condomínios", "Empresas", "Academias", "Eletricistas", "Escolas", "Indústrias"].map((tipo) => (
            <span key={tipo} className="text-xl md:text-2xl font-display font-black tracking-tighter uppercase italic">
              {tipo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Atendemos() {
  const segmentos = [
    { title: "Condomínios", icon: Award, desc: "Suporte completo para manutenção predial e compras recorrentes com faturamento." },
    { title: "Empresas", icon: ShieldCheck, desc: "Infraestrutura e manutenção para escritórios, galpões e operações comerciais." },
    { title: "Academias", icon: Zap, desc: "Soluções ágeis em iluminação e elétrica para manter sua operação sempre ativa." },
    { title: "Eletricistas", icon: Wrench, desc: "Parceria técnica com estoque variado e as melhores marcas para seus projetos." },
    { title: "Prestadores de Serviço", icon: Hammer, desc: "Ferramentas e materiais de qualidade para garantir a excelência do seu trabalho." },
    { title: "Consumidor Residencial", icon: Users, desc: "Atendimento especializado para reformas e pequenos reparos com orientação técnica." },
  ];

  return (
    <section id="atendemos" className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Segmentos de Atendimento"
          title={<>Soluções sob medida para <span className="text-primary">cada necessidade</span></>}
          description="Nossa estrutura está preparada para atender desde o consumidor final até grandes demandas corporativas."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {segmentos.map(({ title, icon: Icon, desc }) => (
            <div key={title} className="group relative rounded-2xl border border-border bg-card p-8 transition hover:border-primary/40 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6 transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6 shrink-0" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrcamentoCorporativo() {
  return (
    <section id="orcamento-corporativo" className="py-20 bg-secondary text-secondary-foreground relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            Área do Cliente Corporativo
          </span>
          <h2 className="font-display text-4xl font-black leading-tight sm:text-5xl lg:text-6xl mb-6">
            Precisa de orçamento para sua <span className="text-primary">empresa ou condomínio?</span>
          </h2>
          <p className="text-lg text-white/70 mb-10 leading-relaxed">
            Atendemos compras recorrentes, manutenção predial, faturamento para empresas e suporte técnico para grandes projetos. Fale com nosso consultor especializado.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-10 py-5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-2xl transition hover:bg-primary-dark hover:translate-y-[-2px]"
            >
              Solicitar Orçamento
            </a>
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Atendimento Direto</p>
              <a href={`tel:${PHONE_DISPLAY.replace(/\D/g, '')}`} className="font-display text-lg font-bold hover:text-primary transition-colors">{PHONE_DISPLAY}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sobre() {
  const pillars = [
    { icon: Users, label: "Atendimento especializado", text: "Equipe técnica preparada para orientar sua compra com precisão." },
    { icon: Hammer, label: "Variedade e Estoque", text: "Ampla linha de produtos das melhores marcas a pronta entrega." },
    { icon: ParkingSquare, label: "Estrutura organizada", text: "Loja preparada para um atendimento ágil e estacionamento fácil." },
    { icon: Award, label: "Relacionamento e Confiança", text: "Tradição em atender bem, do profissional ao consumidor final." },
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
              Nossa História & Compromisso
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Tradição e conhecimento técnico a serviço da <span className="text-primary">Zona Oeste</span>.
            </h2>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
              A Russo é uma empresa familiar construída sobre os pilares da confiança e do relacionamento próximo com seus clientes. Mais do que fornecer materiais, entregamos soluções baseadas em anos de experiência técnica e um compromisso real com o sucesso de cada obra ou projeto.
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              Localizada em uma das regiões mais estratégicas da Zona Oeste de São Paulo, oferecemos fácil acesso pela Avenida Escola Politécnica e USP, consolidando-nos como um parceiro sólido para profissionais, empresas e moradores da região.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, label, text }) => (
                <li key={label} className="flex gap-3 rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold text-foreground">{label}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground leading-snug">{text}</p>
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
  { icon: Zap, name: "Infraestrutura Elétrica", desc: "Soluções para manutenção, fios, cabos e quadros de energia." },
  { icon: Lightbulb, name: "Sistemas de Iluminação", desc: "LED industrial, comercial e residencial para alta performance." },
  { icon: Droplets, name: "Manutenção Hidráulica", desc: "Componentes para redes de água e soluções para banho." },
  { icon: Plug, name: "Acabamentos Elétricos", desc: "Linhas completas de interruptores e tomadas para obras." },
  { icon: Hammer, name: "Ferramental Profissional", desc: "Ferramentas para operação, manutenção e prestação de serviço." },
  { icon: Wrench, name: "Soluções em Ferragens", desc: "Fixação, segurança e infraestrutura metálica completa." },
  { icon: Cable, name: "Conectividade & Redes", desc: "Materiais para infraestrutura de dados e telecomunicações." },
  { icon: ShieldCheck, name: "Proteção & Segurança", desc: "Equipamentos para segurança elétrica e automação básica." },
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
                <Icon className="h-6 w-6 shrink-0" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Consultar <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const DIFERENCIAIS = [
  { icon: Headset, title: "Atendimento Especializado", text: "Suporte técnico qualificado para tirar dúvidas e indicar os melhores componentes." },
  { icon: ShieldCheck, title: "Qualidade Garantida", text: "Trabalhamos apenas com marcas homologadas e certificadas pelo mercado." },
  { icon: Navigation, title: "Fácil Acesso", text: "Localização estratégica com entrada facilitada pela Avenida Escola Politécnica." },
  { icon: ParkingSquare, title: "Estrutura Completa", text: "Amplo estoque e estacionamento próprio para sua total comodidade." },
  { icon: Users, title: "Foco no Cliente", text: "Atendimento personalizado para condomínios, empresas e profissionais da área." },
  { icon: Wrench, title: "Suporte Técnico", text: "Orientação técnica especializada para garantir a segurança da sua instalação." },
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
                <Icon className="h-6 w-6 shrink-0" />
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
              Localização Estratégica
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Fácil acesso via <span className="text-primary">Escola Politécnica</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Situada em uma das regiões mais estratégicas da Zona Oeste de São Paulo, a Russo oferece fácil acesso pela Avenida Escola Politécnica, facilitando a logística para clientes vindo da USP, Raposo Tavares e vias principais.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-primary" />
                <span>Segunda a sexta: 8h às 18h · Sábado: 8h às 13h</span>
              </li>
              <li className="flex items-start gap-3">
                <ParkingSquare className="mt-0.5 h-5 w-5 text-primary" />
                <span>Estacionamento próprio no local</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <span>Acesso facilitado pela Av. Escola Politécnica, 2850</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={GOOGLE_MAPS_URL}
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
                <WhatsAppIcon className="h-4 w-4" />
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
          className="mt-8 inline-flex items-center gap-3 rounded-md bg-whatsapp px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-[#128C7E]"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          Falar com Especialista
        </a>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Phone className="h-5 w-5 shrink-0" />
            </span>
            <p className="mt-3 text-xs uppercase tracking-widest text-white/55">Telefone</p>
            <div className="mt-1 flex flex-col font-semibold text-white">
              <a href="tel:1137662002" className="hover:text-primary transition-colors">{PHONE_DISPLAY}</a>
              <a href="tel:11922328009" className="hover:text-primary transition-colors">{MOBILE_DISPLAY}</a>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5 shrink-0" />
            </span>
            <p className="mt-3 text-xs uppercase tracking-widest text-white/55">Endereço</p>
            <p className="mt-1 font-semibold text-white">Rio Pequeno · Zona Oeste SP</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Clock className="h-5 w-5 shrink-0" />
            </span>
            <p className="mt-3 text-xs uppercase tracking-widest text-white/55">Horário</p>
            <p className="mt-1 font-semibold text-white">Seg–Sex 8h–18h · Sáb 8h–13h</p>
          </div>
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
            Soluções técnicas em materiais elétricos, ferragens e iluminação. Tradição e atendimento especializado para condomínios, empresas e profissionais na Zona Oeste de São Paulo.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="https://www.instagram.com/russoeletrofer/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground/70 transition hover:border-primary hover:text-primary">
              <Instagram className="h-5 w-5 shrink-0" />
            </a>
            <a href="https://web.facebook.com/russoeletrofer/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground/70 transition hover:border-primary hover:text-primary">
              <Facebook className="h-5 w-5 shrink-0" />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground/70 transition hover:border-primary hover:text-primary">
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">Soluções</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#atendemos" className="hover:text-primary transition-colors">Para Condomínios</a></li>
            <li><a href="#atendemos" className="hover:text-primary transition-colors">Para Empresas</a></li>
            <li><a href="#orcamento-corporativo" className="hover:text-primary transition-colors">Orçamento Corporativo</a></li>
            <li><a href="#categorias" className="hover:text-primary transition-colors">Infraestrutura Elétrica</a></li>
            <li><a href="#localizacao" className="hover:text-primary transition-colors">Localização</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground">Institucional</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><button onClick={() => alert('Políticas de Privacidade')} className="hover:text-primary text-left cursor-pointer">Privacidade</button></li>
            <li><button onClick={() => alert('Termos de Uso')} className="hover:text-primary text-left cursor-pointer">Termos de Uso</button></li>
            <li><button onClick={() => alert('Conformidade LGPD')} className="hover:text-primary text-left cursor-pointer">LGPD</button></li>
            <li><button onClick={() => alert('Direitos do Consumidor')} className="hover:text-primary text-left cursor-pointer">Direitos do Consumidor</button></li>
            <li><a href="#contato" className="hover:text-primary transition-colors">Contato</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-[10px] uppercase tracking-widest text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Russo Elétrica e Ferragens. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>Zona Oeste · São Paulo · SP</span>
            <span className="hidden sm:inline text-border">|</span>
            <a 
              href="https://vexxon.company" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 transition hover:text-primary"
            >
              Desenvolvido com <span className="text-red-500 group-hover:animate-pulse">💙</span> pela <span className="font-bold text-foreground">Vexxon Company</span>
            </a>
          </div>
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
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      <WhatsAppIcon className="h-8 w-8 shrink-0" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
    </a>
  );
}
