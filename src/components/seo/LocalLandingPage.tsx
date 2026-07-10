import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CtaBar } from "@/components/home/CtaBar";
import {
  ADDRESS,
  MAPS_EMBED,
  MOBILE_DISPLAY,
  PHONE_DISPLAY,
  WHATSAPP_URL,
  WHATSAPP_URL_ESPECIALISTA,
} from "@/lib/constants";
import fachada from "/uploads/fachada-russo.png";

export interface FaqItem {
  q: string;
  a: string;
}

export interface Benefit {
  title: string;
  desc: string;
}

export interface InternalLink {
  to: string;
  label: string;
  desc: string;
}

export interface LocalLandingPageProps {
  eyebrow: string;
  h1: React.ReactNode;
  intro: string;
  breadcrumbLabel: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  benefits: Benefit[];
  /** "Por que empresas escolhem a Russo" — mostrado quando fornecido */
  whyChoose?: Benefit[];
  differentials: Benefit[];
  midCta: {
    eyebrow: string;
    title: string;
    description: string;
    href: string;
    cta: string;
  };
  faq: FaqItem[];
  internalLinks: InternalLink[];
  localContext: string;
}

export function LocalLandingPage(props: LocalLandingPageProps) {
  const {
    eyebrow,
    h1,
    intro,
    breadcrumbLabel,
    primaryCta,
    secondaryCta,
    benefits,
    whyChoose,
    differentials,
    midCta,
    faq,
    internalLinks,
    localContext,
  } = props;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-border/60 bg-secondary/95 text-secondary-foreground"
        >
          <ol className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-white/60 sm:px-6 lg:px-8">
            <li>
              <Link to="/" className="hover:text-primary">Home</Link>
            </li>
            <ChevronRight className="h-3 w-3 text-white/30" />
            <li className="text-white">{breadcrumbLabel}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section
          className="relative overflow-hidden text-secondary-foreground"
          style={{ background: "var(--gradient-industrial-radial)" }}
        >
          <div className="absolute inset-0 grid-industrial pointer-events-none" />
          <div className="absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute inset-x-0 bottom-0 red-glow-line" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24 lg:px-8">
            <div className="animate-fade-up">
              <span className="glass-industrial inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                </span>
                {eyebrow}
              </span>
              <h1 className="mt-6 font-display text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {h1}
              </h1>
              <p className="mt-6 max-w-xl text-base text-white/70 sm:text-lg leading-relaxed">
                {intro}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-primary px-7 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-red-glow)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  {primaryCta.label}
                  <span className="absolute inset-y-0 -left-6 w-6 -skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-[220px]" />
                </a>
                {secondaryCta && (
                  <a
                    href={secondaryCta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-industrial inline-flex items-center gap-2 rounded-md px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:border-primary/40 hover:bg-white/10"
                  >
                    <WhatsAppIcon className="h-4 w-4 shrink-0" />
                    {secondaryCta.label}
                  </a>
                )}
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-2 border-t border-white/10 pt-6 sm:gap-4">
                <div className="flex flex-col items-center text-center">
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/55">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold shrink-0" /> Google
                  </dt>
                  <dd className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">5.0</dd>
                  <dd className="text-[10px] text-white/60 sm:text-xs">+127 avaliações</dd>
                </div>
                <div className="flex flex-col items-center text-center">
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/55">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" /> Faturamento
                  </dt>
                  <dd className="mt-1 font-display text-sm font-bold text-white sm:text-lg">B2B</dd>
                  <dd className="text-[10px] text-white/60 sm:text-xs">Empresas e Condomínios</dd>
                </div>
                <div className="flex flex-col items-center text-center">
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/55">
                    <Users className="h-3.5 w-3.5 text-primary shrink-0" /> Atendimento
                  </dt>
                  <dd className="mt-1 font-display text-sm font-bold text-white sm:text-lg">Especializado</dd>
                  <dd className="text-[10px] text-white/60 sm:text-xs">Técnico e próximo</dd>
                </div>
              </dl>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-primary/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-2xl">
                <div className="aspect-[4/5] w-full">
                  <img
                    src={fachada}
                    alt="Fachada da Russo Elétrica e Ferragens no Rio Pequeno, Zona Oeste de São Paulo"
                    className="h-full w-full object-cover opacity-70"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <div className="rounded-xl border border-white/10 bg-black/50 p-5 backdrop-blur-md">
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                      <MapPin className="h-3.5 w-3.5 shrink-0" /> Loja física
                    </p>
                    <p className="mt-2 font-display text-lg font-bold leading-tight text-white">
                      Av. Escola Politécnica, 2850
                    </p>
                    <p className="text-sm text-white/70">Rio Pequeno · Zona Oeste de SP</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-white/60">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                      Seg a Sex 08h–18h · Sáb 08h–13h
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="bg-background py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                O que você resolve com a Russo
              </span>
              <h2 className="mt-3 font-display text-3xl font-black leading-tight text-foreground sm:text-4xl">
                Estrutura pronta para as demandas que <span className="text-primary">não podem esperar</span>
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div key={b.title} className="card-premium rounded-2xl border border-border bg-card p-6">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por que empresas escolhem a Russo */}
        {whyChoose && whyChoose.length > 0 && (
          <section
            className="relative overflow-hidden text-secondary-foreground py-20 sm:py-24"
            style={{ background: "var(--gradient-industrial)" }}
          >
            <div className="absolute inset-0 grid-industrial pointer-events-none" />
            <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                  <Sparkles className="h-3 w-3 shrink-0" /> Diferencial B2B
                </span>
                <h2 className="mt-4 font-display text-3xl font-black leading-tight text-white sm:text-4xl">
                  Por que empresas escolhem a <span className="text-primary">Russo</span>?
                </h2>
                <p className="mt-4 text-base text-white/65 sm:text-lg">
                  Fornecedores fáceis existem em todo canto — o difícil é achar um que sustente o ritmo da sua operação sem quebrar entrega, faturamento ou atendimento.
                </p>
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {whyChoose.map((item) => (
                  <div
                    key={item.title}
                    className="glass-industrial card-premium rounded-2xl p-6"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-[var(--shadow-red-glow)]">
                      <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA intermediário */}
        <CtaBar {...midCta} variant="dark" />

        {/* Diferenciais Russo */}
        <section className="bg-muted/40 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Diferenciais Russo
              </span>
              <h2 className="mt-3 font-display text-3xl font-black leading-tight text-foreground sm:text-4xl">
                A diferença entre <span className="text-primary">um fornecedor comum</span> e a Russo
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {differentials.map((d) => (
                <div key={d.title} className="card-premium rounded-2xl border border-border bg-card p-6">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Localização / contexto local */}
        <section className="bg-background py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Zona Oeste de São Paulo
              </span>
              <h2 className="mt-3 font-display text-3xl font-black leading-tight text-foreground sm:text-4xl">
                Loja física na <span className="text-primary">Avenida Escola Politécnica</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {localContext}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-foreground">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {ADDRESS}
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {PHONE_DISPLAY} · {MOBILE_DISPLAY}
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Segunda a Sexta · 08h às 18h · Sábado · 08h às 13h
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:bg-primary-dark"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  {primaryCta.label}
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-industrial)]">
              <iframe
                src={MAPS_EMBED}
                title="Mapa da Russo Elétrica e Ferragens"
                loading="lazy"
                className="h-full min-h-[380px] w-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-muted/40 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Dúvidas frequentes
            </span>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight text-foreground sm:text-4xl">
              Perguntas que <span className="text-primary">recebemos todos os dias</span>
            </h2>
            <div className="mt-10 space-y-3">
              {faq.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-border bg-card p-5 open:border-primary/40 open:shadow-[var(--shadow-industrial)]"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold text-foreground">
                    {f.q}
                    <ChevronRight className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Internal links */}
        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-black text-foreground sm:text-3xl">
              Continue navegando
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {internalLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <div>
                    <p className="font-display text-base font-bold text-foreground">{l.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{l.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section
          className="relative overflow-hidden py-20 text-secondary-foreground sm:py-24"
          style={{ background: "var(--gradient-industrial-radial)" }}
        >
          <div className="absolute inset-0 grid-industrial pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 red-glow-line" />
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              Fale agora com a <span className="text-primary">Russo</span> e receba seu orçamento
            </h2>
            <p className="mt-4 text-base text-white/65 sm:text-lg">
              Atendimento humano, técnico e rápido — direto pelo WhatsApp da loja.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-red-glow)] transition hover:bg-primary-dark"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                {primaryCta.label}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-industrial inline-flex items-center gap-2 rounded-md px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:border-primary/40 hover:bg-white/10"
              >
                Enviar mensagem geral
              </a>
            </div>
            <div className="mt-6 text-xs uppercase tracking-widest text-white/50">
              Ou fale com um especialista:&nbsp;
              <a href={WHATSAPP_URL_ESPECIALISTA} className="text-primary hover:underline">
                {MOBILE_DISPLAY}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}