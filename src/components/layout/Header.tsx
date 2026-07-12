import { Link } from "@tanstack/react-router";
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
  return (
    <header
      id="top"
      className="sticky top-0 z-40 w-full border-b border-transparent bg-transparent transition-all duration-300 scrolled:bg-white/90 scrolled:backdrop-blur-md scrolled:border-border/60"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 md:flex">
          <Link to="/" className="transition-colors hover:text-primary">Início</Link>
          <Link to="/empresas" className="transition-colors hover:text-primary">Empresas</Link>
          <Link to="/condominios" className="transition-colors hover:text-primary">Condomínios</Link>
          <Link to="/rio-pequeno" className="transition-colors hover:text-primary">Loja</Link>
          <Link to="/blog" className="transition-colors hover:text-primary">Blog</Link>
          <Link to="/#contato" className="transition-colors hover:text-primary">Contato</Link>
        </nav>
        {/* WhatsApp sempre visível — pill em desktop, ícone quadrado em mobile */}
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
      </div>
    </header>
  );
}
