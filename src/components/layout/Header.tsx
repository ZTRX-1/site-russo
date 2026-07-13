import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import logoRusso from "/uploads/logo-russo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <img 
        src={logoRusso} 
        alt="Russo Elétrica e Ferragens" 
        className="h-10 w-10 object-contain shrink-0"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-tight">RUSSO</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Elétrica & Ferragens
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Início" },
    { to: "/empresas", label: "Empresas" },
    { to: "/condominios", label: "Condomínios" },
    { to: "/rio-pequeno", label: "Loja" },
    { to: "/blog", label: "Blog" },
    { to: "/#contato", label: "Contato" },
  ] as const;
  return (
    <header
      id="top"
      className="sticky top-0 z-40 w-full border-b border-transparent bg-transparent transition-all duration-300 scrolled:bg-white/90 scrolled:backdrop-blur-md scrolled:border-border/60"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/80 lg:flex xl:gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="transition-colors hover:text-primary">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-3 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-red-glow)] transition-transform hover:-translate-y-0.5 md:h-10 md:px-4 md:text-xs"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Orçamento</span>
        </a>
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border/60 bg-white/70 text-foreground backdrop-blur-md transition-colors hover:bg-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-white/95 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
