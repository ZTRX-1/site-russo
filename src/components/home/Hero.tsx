import { ShieldCheck, Star, Headset, Check, Zap, Droplets, Users, Lightbulb } from "lucide-react";
import fachada from "/uploads/fachada-russo.png";
import { CtaButton } from "@/components/ui/CtaButton";
import { WHATSAPP_URL, WHATSAPP_URL_ESPECIALISTA } from "@/lib/constants";

export function Hero() {
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden text-secondary-foreground"
      style={{ background: "var(--gradient-industrial-radial)" }}
    >
      {/* Efeitos: apenas 2 — halo vermelho + linha inferior */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-[80px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 red-glow-line" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-16 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="animate-fade-up">
          <span className="glass-industrial inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Loja física no Rio Pequeno, Zona Oeste de SP
          </span>

          <h1 className="mt-6 font-display text-5xl font-black leading-[1.03] tracking-tight text-white md:text-6xl lg:text-7xl">
            Materiais elétricos, ferragens e iluminação{" "}
            <span className="text-primary">para quem precisa resolver com segurança</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Loja de bairro no Rio Pequeno, tradicional na Zona Oeste. Atendemos do reparo doméstico à demanda recorrente de eletricistas, condomínios e empresas, com equipe pronta para orientar sua compra.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <CtaButton href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" variant="primary">
              Solicitar orçamento
            </CtaButton>
            <CtaButton
              href={WHATSAPP_URL_ESPECIALISTA}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              icon={<Headset className="h-4 w-4 shrink-0" />}
            >
              Falar com especialista
            </CtaButton>
          </div>

          <p className="mt-3 text-[11px] uppercase tracking-widest text-white/45">
            Atendimento durante o horário comercial
          </p>

          {/* Pills de confiança — legíveis em mobile */}
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
            {[
              "Estoque abastecido no dia a dia",
              "Emitimos nota fiscal",
              "Equipe que orienta a compra",
              "Av. Escola Politécnica, 2850",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-[11px] font-bold uppercase leading-tight tracking-wider text-white/60"
              >
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Prova social — acima da dobra em desktop, logo abaixo em mobile */}
          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:gap-6">
            <div className="text-center sm:text-left">
              <dt className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/55 sm:justify-start">
                <Star className="h-3.5 w-3.5 fill-gold text-gold shrink-0" /> Google
              </dt>
              <dd className="mt-1 font-display text-2xl font-black text-white">5.0</dd>
              <dd className="text-[11px] text-white/55">Avaliações reais de clientes</dd>
            </div>
            <div className="text-center sm:text-left">
              <dt className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/55 sm:justify-start">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" /> Perfil
              </dt>
              <dd className="mt-1 font-display text-base font-black leading-tight text-white sm:text-lg">
                Empresas e condomínios
              </dd>
              <dd className="text-[11px] text-white/55">Nota fiscal e faturamento</dd>
            </div>
            <div className="text-center sm:text-left">
              <dt className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/55 sm:justify-start">
                <Headset className="h-3.5 w-3.5 shrink-0 text-primary" /> Atendimento
              </dt>
              <dd className="mt-1 font-display text-base font-black leading-tight text-white sm:text-lg">
                No balcão
              </dd>
              <dd className="text-[11px] text-white/55">Presencial e por WhatsApp</dd>
            </div>
          </dl>
        </div>

        {/* Imagem — LCP */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-4 rounded-2xl bg-primary/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-[var(--shadow-industrial)]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[4/5]">
              <img
                src={fachada}
                alt="Fachada da Russo Elétrica e Ferragens no Rio Pequeno, Zona Oeste de São Paulo"
                width={800}
                height={1000}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover opacity-90 lg:opacity-70"
              />
              <div className="absolute inset-0 hidden bg-gradient-to-t from-secondary via-secondary/30 to-transparent lg:block" />
            </div>

            {/* Overlay: fica abaixo da imagem em mobile/tablet, sobreposto apenas em desktop */}
            <div className="p-4 sm:p-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:p-8">
              <div className="space-y-2.5">
                {/* Linha superior — 2 categorias principais */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: Zap, title: "Elétrica", desc: "Fios, cabos, disjuntores e muito mais." },
                    { icon: Droplets, title: "Hidráulica", desc: "Reparos, manutenção e instalações." },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div
                      key={title}
                      className="rounded-xl border border-white/10 bg-secondary/75 p-3 backdrop-blur-xl sm:p-3.5"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-white">
                        {title}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-white/65">{desc}</p>
                    </div>
                  ))}
                </div>

                {/* Linhas cheias — 3 diferenciais */}
                {[
                  {
                    icon: Users,
                    title: "Atendimento especializado",
                    desc: "Orientação para profissionais e empresas.",
                    highlight: false,
                  },
                  {
                    icon: Lightbulb,
                    title: "Iluminação LED",
                    desc: "Soluções para residências e condomínios.",
                    highlight: false,
                  },
                  {
                    icon: ShieldCheck,
                    title: "Estrutura completa",
                    desc: "Variedade de produtos e atendimento especializado.",
                    highlight: true,
                  },
                ].map(({ icon: Icon, title, desc, highlight }) => (
                  <div
                    key={title}
                    className={
                      highlight
                        ? "flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-3 backdrop-blur-xl sm:p-3.5"
                        : "flex items-center gap-3 rounded-xl border border-white/10 bg-secondary/75 p-3 backdrop-blur-xl sm:p-3.5"
                    }
                  >
                    <div
                      className={
                        highlight
                          ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white"
                          : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
                      }
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-white">
                        {title}
                      </p>
                      <p className="text-[11px] leading-snug text-white/70">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD PREMIUM DE CREDIBILIDADE — integrado ao Hero */}
      <div className="relative mx-auto max-w-7xl px-6 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div
          className="animate-fade-up relative overflow-hidden rounded-3xl border p-8 sm:p-10 lg:p-12"
          style={{
            background: "#181818",
            borderColor: "rgba(255,255,255,0.08)",
            boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset",
          }}
        >
          {/* Selo Google — canto superior direito */}
          <div className="mb-6 flex justify-center sm:absolute sm:right-8 sm:top-8 sm:mb-0 lg:right-10 lg:top-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
              <span className="flex items-center gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                ))}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">5.0 no Google</span>
            </span>
          </div>

          <div className="max-w-2xl text-center sm:text-left">
            <h2 className="font-display text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Mais do que uma loja.
              <br />
              <span className="text-primary">Seu fornecedor de confiança.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">
              Produtos originais, atendimento especializado e estrutura preparada para consumidores, empresas, condomínios e profissionais.
            </p>
          </div>

          <ul className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {[
              "Loja física no Rio Pequeno",
              "Atendimento técnico especializado",
              "Emissão de Nota Fiscal",
              "Estacionamento próprio",
              "Fácil acesso pela Av. Escola Politécnica",
              "Grande variedade em estoque",
              "Atendimento para empresas e condomínios",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/80 sm:text-[15px]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-center sm:justify-start">
            <CtaButton href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" variant="primary">
              Solicitar orçamento
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}