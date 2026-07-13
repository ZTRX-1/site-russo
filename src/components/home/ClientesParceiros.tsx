export function ClientesParceiros() {
  const tipos = ["Condomínios", "Empresas", "Academias", "Eletricistas", "Escolas", "Indústrias"];
  return (
    <section className="border-b border-border/40 bg-background py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground/70">
          Quem confia na Russo
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-45 grayscale md:gap-14">
          {tipos.map((tipo) => (
            <span
              key={tipo}
              className="font-display text-lg font-black uppercase tracking-tight italic md:text-2xl"
            >
              {tipo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}