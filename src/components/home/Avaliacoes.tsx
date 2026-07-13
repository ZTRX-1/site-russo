import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Carlos Mendes",
    role: "Eletricista",
    text: "Atendimento nota 10. Sempre acho o que preciso para as obras e o preço é honesto pelo que entregam.",
  },
  {
    name: "Juliana Souza",
    role: "Moradora do bairro",
    text: "Fui trocar um chuveiro e me explicaram tudo com paciência. Loja organizada, gente atenciosa. Recomendo.",
  },
  {
    name: "Roberto Lima",
    role: "Construtor",
    text: "Compro material elétrico aqui há anos. Variedade, qualidade e atendimento de gente que conhece o produto.",
  },
];

export function Avaliacoes() {
  return (
    <section id="avaliacoes" className="bg-background py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">O que dizem sobre a Russo</span>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Nota <span className="text-primary">5,0</span> no Google
            </h2>
            <div className="mt-4 flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-6 w-6 shrink-0 fill-gold text-gold" />
              ))}
            </div>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Avaliações reais de clientes com nota máxima. Confiança construída no balcão, dia após dia.
            </p>
            <a
              href="https://www.google.com/maps/search/Russo+Eletrica+e+Ferragens+Rio+Pequeno"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Ver as avaliações no Google →
            </a>
          </div>
          <div>
            {/* Mobile: carrossel horizontal com snap. Desktop: grid. */}
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
              {REVIEWS.map((r) => (
                <figure
                  key={r.name}
                  className="flex h-full min-w-[85%] shrink-0 snap-center flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:min-w-0 sm:shrink sm:snap-align-none sm:p-6"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 shrink-0 fill-gold text-gold" />
                    ))}
                  </div>
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">
                    &ldquo;{r.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 border-t border-border pt-3">
                    <p className="font-semibold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground/70 sm:hidden">
              Arraste para o lado →
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}