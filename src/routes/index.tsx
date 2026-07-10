import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import fachada from "/uploads/fachada-russo.png";
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

import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuickQuote } from "@/components/home/QuickQuote";
import { CtaBar } from "@/components/home/CtaBar";
import { 
  WHATSAPP,
  WHATSAPP_URL, 
  PHONE_DISPLAY, 
  MOBILE_DISPLAY, 
  ADDRESS, 
  MAPS_URL, 
  GOOGLE_MAPS_URL, 
  MAPS_EMBED,
  SITE_URL,
  COMPANY_NAME,
  WHATSAPP_URL_EMPRESA,
  WHATSAPP_URL_ESPECIALISTA,
} from "@/lib/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=5",
      },
      {
        title:
          "Russo Elétrica e Ferragens | Materiais Elétricos no Rio Pequeno - Zona Oeste SP",
      },
      {
        name: "description",
        content:
          "Loja de materiais elétricos, ferragens, hidráulica e iluminação no Rio Pequeno, Zona Oeste de SP. Atendimento para eletricistas, empresas e condomínios próximo à USP, Butantã e Jaguaré. Solicite seu orçamento pelo WhatsApp.",
      },
      {
        name: "keywords",
        content:
          "material elétrico Rio Pequeno, loja de elétrica Zona Oeste SP, ferragens Rio Pequeno, materiais elétricos Butantã, loja de ferragens Jaguaré, iluminação Zona Oeste, fios e cabos São Paulo, hidráulica Rio Pequeno, eletricista Zona Oeste, material elétrico USP, material elétrico Raposo Tavares, material elétrico Vila São Francisco, fornecedor material elétrico condomínios, orçamento elétrica empresa SP, fornecedor B2B elétrica, Av. Escola Politécnica",
      },
      {
        property: "og:title",
        content: "Russo Elétrica e Ferragens — Materiais Elétricos no Rio Pequeno, Zona Oeste SP",
      },
      {
        property: "og:description",
        content:
          "Soluções completas em elétrica, ferragens, hidráulica e iluminação. Para consumidores, eletricistas, empresas e condomínios na Zona Oeste de São Paulo.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/" },
      {
        property: "og:image",
        content: SITE_URL + "/uploads/qqqq.jpg",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Fachada da Russo Elétrica e Ferragens no Rio Pequeno, Zona Oeste de São Paulo" },
      { name: "twitter:title", content: "Russo Elétrica e Ferragens — Rio Pequeno, Zona Oeste SP" },
      { name: "twitter:description", content: "Materiais elétricos, ferragens, hidráulica e iluminação na Zona Oeste de SP. Atendimento para eletricistas, empresas e condomínios." },
      { name: "twitter:image", content: SITE_URL + "/uploads/qqqq.jpg" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL + "/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["HardwareStore", "LocalBusiness"],
          "@id": SITE_URL + "/#localbusiness",
          name: COMPANY_NAME,
          alternateName: "Russo Eletro Ferragens",
          url: SITE_URL,
          image: [SITE_URL + "/uploads/qqqq.jpg", SITE_URL + "/uploads/fachada-russo.png"],
          logo: SITE_URL + "/uploads/logo-russo.png",
          telephone: "+551137662002",
          email: "contato@russoeletrofer.com.br",
          priceRange: "$$",
          currenciesAccepted: "BRL",
          paymentAccepted: "Cash, Credit Card, Debit Card, Pix",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Escola Politécnica, 2850",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            postalCode: "05386-130",
            addressCountry: "BR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -23.56133,
            longitude: -46.74526,
          },
          hasMap: GOOGLE_MAPS_URL,
          areaServed: [
            { "@type": "Place", name: "Rio Pequeno" },
            { "@type": "Place", name: "Butantã" },
            { "@type": "Place", name: "Jaguaré" },
            { "@type": "Place", name: "Vila Sônia" },
            { "@type": "Place", name: "Morumbi" },
            { "@type": "Place", name: "Lapa" },
            { "@type": "Place", name: "Osasco" },
            { "@type": "Place", name: "Zona Oeste de São Paulo" },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5.0",
            reviewCount: "127",
          },
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "13:00" },
          ],
          sameAs: [
            "https://www.instagram.com/russoeletrica/",
            "https://www.facebook.com/russoeletrica/",
          ],
          makesOffer: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Materiais Elétricos" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ferragens e Ferramentas" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Iluminação Residencial e Comercial" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Materiais Hidráulicos" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Atendimento para Condomínios e Empresas" } },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": SITE_URL + "/#website",
          url: SITE_URL,
          name: COMPANY_NAME,
          inLanguage: "pt-BR",
          publisher: { "@id": SITE_URL + "/#organization" },
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
        if (window.scrollY > 20) {
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
        <QuickQuote />
        <Sobre />
        <Atendemos />
        <CtaBar
          eyebrow="Compras corporativas"
          title="Precisa de orçamento com faturamento para empresa ou condomínio?"
          description="Estrutura preparada para compras recorrentes, notas fiscais, condições comerciais e atendimento dedicado para operações maiores."
          href={WHATSAPP_URL_EMPRESA}
          cta="Falar com o comercial"
          variant="dark"
        />
        <Categorias />
        <OrcamentoCorporativo />
        <Diferenciais />
        <CtaBar
          eyebrow="Atendimento técnico"
          title="Fale agora com um especialista da Russo"
          description="Tire dúvidas técnicas antes de comprar — nossa equipe orienta o material certo para o seu projeto."
          href={WHATSAPP_URL_ESPECIALISTA}
          cta="Falar com especialista"
          variant="light"
        />
        <Avaliacoes />
        <Localizacao />
        <Contato />
      </main>
      <Footer />
      <FloatingWhats />
    </div>
  );
}


function Hero() {
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden text-secondary-foreground"
      style={{ background: "var(--gradient-industrial-radial)" }}
    >
      {/* Grid técnico premium */}
      <div className="absolute inset-0 grid-industrial pointer-events-none" />
      {/* Halo vermelho suave */}
      <div className="absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
      {/* Linha vermelha iluminada no rodapé do hero */}
      <div className="absolute inset-x-0 bottom-0 red-glow-line" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24 lg:px-8">
        <div className="animate-fade-up">
          <span className="glass-industrial inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
            </span>
            Referência técnica na Zona Oeste de SP
          </span>
          <h1 className="mt-6 font-display text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-white">A referência em </span>
            <span className="text-primary">materiais elétricos, ferragens e iluminação</span>
            <span className="text-white"> na Zona Oeste de São Paulo</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/65 sm:text-lg leading-relaxed">
            Estrutura completa no Rio Pequeno para empresas, condomínios, construtoras, eletricistas e profissionais que não podem depender de improviso. Estoque robusto, atendimento técnico e faturamento para operações que precisam de agilidade.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-primary px-7 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-red-glow)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_25px_60px_-20px_oklch(0.55_0.22_27_/_0.7)]"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" />
              Solicitar orçamento
              <span className="absolute inset-y-0 -left-6 w-6 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-[220px]" />
            </a>
            <a
              href={WHATSAPP_URL_ESPECIALISTA}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-industrial inline-flex items-center gap-2 rounded-md px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:border-primary/40 hover:bg-white/10"
            >
              <Headset className="h-4 w-4 shrink-0" />
              Falar com especialista
            </a>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-y-3 sm:grid-cols-4 sm:gap-4">
            {[
              "Estoque robusto",
              "Faturamento B2B",
              "Atendimento técnico",
              "Av. Escola Politécnica",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/60">
                <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-2 border-t border-white/10 pt-6 sm:gap-4">
            <div className="flex flex-col items-center text-center">
              <dt className="flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-tight text-white/55 min-[400px]:text-[11px] min-[400px]:tracking-wider sm:flex-row sm:gap-1.5 sm:text-xs">
                <Star className="h-3.5 w-3.5 fill-gold text-gold shrink-0" /> Google
              </dt>
              <dd className="mt-1 font-display text-lg font-bold text-white min-[400px]:text-xl sm:text-2xl">5.0</dd>
              <dd className="text-[8px] text-white/60 min-[400px]:text-[10px] sm:text-xs">+127 avaliações</dd>
            </div>
            <div className="flex flex-col items-center text-center">
              <dt className="flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-tight text-white/55 min-[400px]:text-[11px] min-[400px]:tracking-wider sm:flex-row sm:gap-1.5 sm:text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" /> Faturamento
              </dt>
              <dd className="mt-1 font-display text-[11px] font-bold text-white leading-tight min-[400px]:text-sm sm:text-lg">Para Empresas</dd>
              <dd className="text-[8px] text-white/60 min-[400px]:text-[10px] sm:text-xs">B2B e Condomínios</dd>
            </div>
            <div className="flex flex-col items-center text-center">
              <dt className="flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-tight text-white/55 min-[400px]:text-[11px] min-[400px]:tracking-wider sm:flex-row sm:gap-1.5 sm:text-xs">
                <Users className="h-3.5 w-3.5 text-primary shrink-0" /> Atendimento
              </dt>
              <dd className="mt-1 font-display text-[11px] font-bold text-white leading-tight min-[400px]:text-sm sm:text-lg">Especializado</dd>
              <dd className="text-[8px] text-white/60 min-[400px]:text-[10px] sm:text-xs">Técnico e Próximo</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-2xl bg-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-2xl">
            <div className="aspect-[4/5] w-full">
              <img 
                src={fachada} 
                alt="Fachada da Russo Elétrica e Ferragens no Rio Pequeno" 
                className="h-full w-full object-cover opacity-60 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
            </div>
            
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
                  <Zap className="h-6 w-6 text-primary mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white">Elétrica</p>
                  <p className="text-[9px] text-white/60 leading-tight mt-1">Fios, cabos, disjuntores e muito mais.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
                  <Droplets className="h-6 w-6 text-primary mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white">Hidráulica</p>
                  <p className="text-[9px] text-white/60 leading-tight mt-1">Reparos, manutenção e instalações.</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white">Atendimento Especializado</p>
                    <p className="text-[11px] text-white/60 leading-tight">Orientação para profissionais e empresas.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white">Iluminação LED</p>
                    <p className="text-[11px] text-white/60 leading-tight">Soluções para residências e condomínios.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 p-3 backdrop-blur-xl">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] font-medium text-white/90 leading-tight">
                    <span className="block font-bold text-white uppercase tracking-tighter">Estrutura Completa</span>
                    Variedade de produtos e atendimento especializado.
                  </p>
                </div>
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
    { title: "Condomínios", icon: Award, desc: "Manutenção predial sem gargalos: síndicos e zeladores atendidos por vendedor dedicado, orçamento formal e faturamento." },
    { title: "Empresas", icon: ShieldCheck, desc: "Compras recorrentes com nota fiscal, condições comerciais e reposição rápida — sua operação não para por falta de material." },
    { title: "Construtoras", icon: Hammer, desc: "Suprimento contínuo para obras na Zona Oeste: entrega ágil, disponibilidade real e cotação em minutos." },
    { title: "Academias & Comércios", icon: Zap, desc: "Elétrica e iluminação prioritária para negócios que não podem ficar horas fora do ar." },
    { title: "Eletricistas", icon: Wrench, desc: "Parceria técnica com estoque de marcas certificadas e condições especiais para profissionais." },
    { title: "Prestadores de Serviço", icon: Users, desc: "Ferramentas profissionais e materiais para quem entrega qualidade e prazo todos os dias." },
  ];

  return (
    <section id="atendemos" className="relative py-20 sm:py-24 bg-muted/30 section-edge">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Atendimento especializado"
          title={<>Para operações que <span className="text-primary">não podem parar</span></>}
          description="Nossa estrutura foi desenhada para atender demandas técnicas e recorrentes — do reparo urgente à compra programada de grande volume."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {segmentos.map(({ title, icon: Icon, desc }) => (
            <div key={title} className="card-premium group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/40 hover:shadow-[var(--shadow-card)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6 transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[var(--shadow-red-glow)]">
                <Icon className="h-6 w-6 shrink-0" />
              </div>
              <h3 className="font-display text-2xl font-black tracking-tight mb-3">{title}</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrcamentoCorporativo() {
  return (
    <section
      id="orcamento-corporativo"
      className="relative overflow-hidden py-20 sm:py-24 text-secondary-foreground"
      style={{ background: "var(--gradient-industrial)" }}
    >
      <div className="absolute inset-0 grid-industrial pointer-events-none opacity-70" />
      <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
      <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-primary/15 blur-[110px]" />
      <div className="absolute inset-x-0 top-0 red-glow-line" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl">
          <span className="glass-industrial inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-6">
            <ShieldCheck className="h-3 w-3 shrink-0" /> Compras corporativas
          </span>
          <h2 className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl mb-6 text-white">
            Sua empresa merece um <span className="text-primary">fornecedor à altura da sua operação</span>
          </h2>
          <p className="text-lg text-white/70 mb-6 leading-relaxed max-w-2xl">
            Empresas, condomínios, construtoras e academias contam com a Russo para o que a rotina exige e para o que a emergência não avisa. Estoque profundo, vendedor dedicado, orçamento formal e faturamento — a estrutura que transforma compra de material em processo, não em problema.
          </p>
          <ul className="mb-10 grid gap-3 max-w-2xl sm:grid-cols-2">
            {[
              "Faturamento com nota fiscal",
              "Vendedor dedicado à sua conta",
              "Reposição rápida e programada",
              "Cotação formal por escrito",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-white/85">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4">
            <a
              href={WHATSAPP_URL_EMPRESA}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-primary px-10 py-5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-[var(--shadow-red-glow)] transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" />
              Solicitar orçamento empresarial
              <span className="absolute inset-y-0 -left-6 w-6 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-[320px]" />
            </a>
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Ou ligue diretamente</p>
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
    { icon: Users, label: "Atendimento humano", text: "Equipe técnica preparada para orientar sua compra com proximidade e precisão." },
    { icon: Hammer, label: "Variedade e Estrutura", text: "Ampla linha de produtos das melhores marcas em um ambiente organizado." },
    { icon: ParkingSquare, label: "Fácil acesso", text: "Loja preparada para um atendimento ágil com estacionamento próprio no local." },
    { icon: Award, label: "Tradição e Confiança", text: "Uma empresa familiar comprometida com a solução dos seus problemas diários." },
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
            <div className="absolute -bottom-6 -right-6 hidden max-w-[240px] rounded-xl bg-primary px-6 py-5 text-primary-foreground shadow-[var(--shadow-elegant)] sm:block">
              <p className="text-xs font-bold uppercase tracking-widest leading-tight">Grande variedade de marcas, modelos e opções disponíveis em estoque.</p>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Nossa História & Compromisso
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Mais do que uma loja. Um <span className="text-primary">parceiro para quem precisa resolver</span>.
            </h2>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg leading-relaxed">
              A Russo é mais do que uma loja de materiais elétricos, ferragens e itens para pequenos reparos. É um ponto de apoio para quem busca resolver problemas com confiança, encontrar os produtos certos e contar com atendimento próximo e especializado.
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              Nossa história foi construída sobre relacionamento, variedade de produtos e compromisso real com cada cliente, seja ele um morador da região, um eletricista, uma empresa, um condomínio ou um prestador de serviço. Com localização privilegiada no Rio Pequeno e fácil acesso pela Avenida Escola Politécnica, oferecemos estrutura organizada, estacionamento próprio e uma ampla variedade de produtos para atender desde pequenas necessidades do dia a dia até demandas recorrentes de profissionais e empresas.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, label, text }) => (
                <li key={label} className="flex gap-3 rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5 shrink-0" />
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
  { icon: Hammer, name: "Ferramentas Profissionais", desc: "Ferramentas para operação, manutenção e prestação de serviço." },
  { icon: Wrench, name: "Soluções em Ferragens", desc: "Fixação, segurança e infraestrutura metálica completa." },
  { icon: Cable, name: "Conectividade & Redes", desc: "Materiais para infraestrutura de dados e telecomunicações." },
  { icon: ShieldCheck, name: "Proteção & Segurança", desc: "Equipamentos para segurança elétrica e automação básica." },
];

function Categorias() {
  return (
    <section id="categorias" className="relative bg-muted/40 py-20 sm:py-28 section-edge">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Linhas de produto"
          title={<>Estoque completo para <span className="text-primary">projetos, obras e manutenção</span></>}
          description="Toque na categoria e fale direto no WhatsApp — sua cotação começa antes mesmo de você entrar na loja."
        />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIAS.map(({ icon: Icon, name, desc }) => {
            const encodedMsg = encodeURIComponent(`Olá! Estou no site da Russo Elétrica e Ferragens e gostaria de um orçamento para ${name.toLowerCase()}.`);
            const categoryWhatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodedMsg}`;
            
            return (
              <a
                key={name}
                href={categoryWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-premium group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-5 hover:border-primary hover:shadow-[var(--shadow-card)]"
              >
                <div className="absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[var(--shadow-red-glow)]">
                  <Icon className="h-6 w-6 shrink-0" />
                </span>
                <h3 className="mt-4 font-display text-lg font-black tracking-tight">{name}</h3>
                <p className="mt-1 grow text-sm text-muted-foreground leading-snug">{desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
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

const DIFERENCIAIS = [
  { icon: Headset, title: "Vendedor técnico", text: "Você conversa com quem entende de instalação, não com balconista de check-out." },
  { icon: ShieldCheck, title: "Marcas certificadas", text: "Trabalhamos apenas com fabricantes reconhecidos — segurança e conformidade garantidas." },
  { icon: Truck, title: "Reposição rápida", text: "Estoque profundo e logística local para não deixar sua obra ou operação parada." },
  { icon: Navigation, title: "Acesso privilegiado", text: "Av. Escola Politécnica — direto do Rio Pequeno, Butantã, Jaguaré e Raposo Tavares." },
  { icon: ParkingSquare, title: "Estacionamento próprio", text: "Carga, descarga e retirada sem estresse — o tempo do seu profissional é dinheiro." },
  { icon: Award, title: "5.0 no Google", text: "127+ clientes avaliaram com nota máxima. Reputação construída no balcão, todo dia." },
];

function Diferenciais() {
  return (
    <section
      id="diferenciais"
      className="relative overflow-hidden py-20 sm:py-28 text-secondary-foreground"
      style={{ background: "var(--gradient-industrial)" }}
    >
      <div className="absolute inset-0 grid-industrial pointer-events-none opacity-60" />
      <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-primary/10 [clip-path:polygon(20%_0,100%_0,100%_100%,0%_100%)] lg:block" />
      <div className="absolute inset-x-0 top-0 red-glow-line" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="glass-industrial inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            <Award className="h-3 w-3 shrink-0" /> Por que a Russo
          </span>
          <h2 className="mt-5 font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white">
            Diferenciais que <span className="text-primary">viram vantagem</span> para você
          </h2>
          <p className="mt-4 text-white/60 text-base sm:text-lg">
            Estrutura de fornecedor de médio porte com a proximidade de loja de bairro. É essa combinação que faz cliente empresarial voltar.
          </p>
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIFERENCIAIS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="card-premium group glass-industrial rounded-2xl p-7 hover:border-primary/50"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-red-glow)] transition-transform duration-500 group-hover:scale-110">
                <Icon className="h-6 w-6 shrink-0" />
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

const REVIEWS = [
  {
    name: "Carlos Mendes",
    role: "Eletricista",
    text: "Atendimento nota 10. Sempre encontro tudo que preciso para as obras e o preço é justo pela qualidade.",
  },
  {
    name: "Juliana Souza",
    role: "Moradora do bairro",
    text: "Fui trocar um chuveiro e fui super bem orientada. Loja organizada, equipe atenciosa. Recomendo demais!",
  },
  {
    name: "Roberto Lima",
    role: "Construtor",
    text: "Compro materiais elétricos aqui há anos. Variedade, qualidade e atendimento próximo. Parceiros de confiança.",
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
                <Star key={i} className="h-6 w-6 fill-gold text-gold shrink-0" />
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
                    <Star key={i} className="h-4 w-4 fill-gold text-gold shrink-0" />
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
              Conveniência & Acesso
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Fácil acesso na <span className="text-primary">Zona Oeste de São Paulo</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Estamos localizados na Avenida Escola Politécnica, uma das principais vias da região, facilitando o acesso para clientes que vêm do Rio Pequeno, USP, Jaguaré, Butantã, Osasco, Raposo Tavares e bairros próximos. Conte com estacionamento próprio e uma estrutura preparada para receber você com conforto e praticidade.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                <span>Segunda a sexta: 8h às 18h · Sábado: 8h às 13h</span>
              </li>
              <li className="flex items-start gap-3">
                <ParkingSquare className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                <span>Estacionamento próprio e gratuito no local</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                <span>{ADDRESS}</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition hover:bg-primary-dark"
              >
                <Navigation className="h-4 w-4 shrink-0" />
                Traçar rota de carro
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                Solicitar orçamento
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
          Fale com nossa equipe
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
          Atendimento <span className="text-primary">especializado</span> via WhatsApp
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          Precisa de materiais elétricos, ferragens ou iluminação? Nossa equipe está pronta para te atender com agilidade e conhecimento técnico.
        </p>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 rounded-md bg-[#25D366] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-[#128C7E]"
        >
          <WhatsAppIcon className="h-5 w-5 shrink-0" />
          Falar com Especialista agora
        </a>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Phone className="h-5 w-5 shrink-0" />
            </span>
            <p className="mt-3 text-xs uppercase tracking-widest text-white/55">Telefones</p>
            <div className="mt-1 flex flex-col font-semibold text-white">
              <a href={`tel:${PHONE_DISPLAY.replace(/\D/g, '')}`} className="hover:text-primary transition-colors">{PHONE_DISPLAY}</a>
              <a href={`tel:${MOBILE_DISPLAY.replace(/\D/g, '')}`} className="hover:text-primary transition-colors">{MOBILE_DISPLAY}</a>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <MapPin className="h-5 w-5 shrink-0" />
            </span>
            <p className="mt-3 text-xs uppercase tracking-widest text-white/55">Localização</p>
            <p className="mt-1 font-semibold text-white leading-tight">Rio Pequeno · Próximo à USP</p>
            <p className="text-xs text-white/60 mt-1">Av. Escola Politécnica, 2850</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Clock className="h-5 w-5 shrink-0" />
            </span>
            <p className="mt-3 text-xs uppercase tracking-widest text-white/55">Horário</p>
            <p className="mt-1 font-semibold text-white leading-tight">Seg–Sex: 8h às 18h</p>
            <p className="text-sm font-semibold text-white">Sáb: 8h às 13h</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingWhats() {
  const [showPopup, setShowPopup] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setShowPopup(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPopup(false);
    setIsDismissed(true);
  };

  const message = encodeURIComponent("Olá, estou no site da Russo Elétrica e Ferragens e gostaria de um orçamento.");
  const whatsappUrl = `https://api.whatsapp.com/send?phone=5511922328009&text=${message}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 group">
      {(showPopup && !isDismissed) && (
        <div className="relative mr-2 max-w-[220px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={handleDismiss}
            className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 ring-1 ring-black/5"
            aria-label="Fechar popup"
          >
            <X className="h-3 w-3 text-secondary" />
          </button>
          
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-2xl bg-white p-3 text-xs font-bold text-secondary shadow-xl ring-1 ring-black/5 after:absolute after:bottom-[-8px] after:right-6 after:h-4 after:w-4 after:rotate-45 after:bg-white after:content-[''] transition-transform hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-start gap-2 text-left">
              <img 
                src="/uploads/mascote.png" 
                alt="Mascote Russo" 
                className="h-10 w-10 shrink-0 rounded-full border-2 border-primary bg-secondary p-0.5 object-contain"
              />
              <p className="leading-tight">
                Olá, sou o <span className="text-primary">Russo</span>! <br />
                Precisa de ajuda com seu orçamento?
              </p>
            </div>
          </a>
        </div>
      )}
      
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        <WhatsAppIcon className="h-8 w-8 shrink-0" />
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
      </a>
    </div>
  );
}



