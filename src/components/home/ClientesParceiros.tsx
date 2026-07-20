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
    <section className="border-y border-border/40 bg-muted/30 py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          Marcas que trabalhamos
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-12">
          {marcas.map((marca) => (
            <span
              key={marca}
              className="font-display text-base font-black uppercase tracking-tight text-foreground/50 transition-colors duration-300 hover:text-foreground md:text-xl"
            >
              {marca}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}