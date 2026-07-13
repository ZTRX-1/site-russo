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
    <section className="border-b border-border/40 bg-background py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground/70">
          Marcas que trabalhamos
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-60 md:gap-x-12">
          {marcas.map((marca) => (
            <span
              key={marca}
              className="font-display text-base font-black uppercase tracking-tight text-foreground/80 md:text-xl"
            >
              {marca}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}