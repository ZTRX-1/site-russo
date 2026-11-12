export function ClientesParceiros() {
  const marcas = [
    "WEG",
    "Schneider",
    "Intelbras",
    "Lorenzetti",
    "Steck",
    "Legrand",
    "Pial",
    "Tigre",
    "Tramontina",
  ];
  return (
    <section className="border-y border-border/40 bg-muted/30 py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-7 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          Marcas que trabalhamos
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5">
          {marcas.map((marca) => (
            <span
              key={marca}
              className="rounded-lg border border-border/70 bg-background px-4 py-2.5 font-display text-lg font-black uppercase tracking-tight text-foreground/65 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:text-foreground sm:px-5 sm:text-xl md:text-2xl"
            >
              {marca}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}