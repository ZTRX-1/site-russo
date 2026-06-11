import { Link } from "@tanstack/react-router";
import { WHATSAPP_URL } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import logoRusso from "/uploads/logo-russo.png";

export function Logo({ className = "" }: { className?: string }) {
  const isInverted = className.includes("invert");
  return (
    <Link to="/" className={`group flex items-center gap-3 ${className} ${isInverted ? "invert-colors" : ""}`}>
      <img 
        src={logoRusso} 
        alt="Russo Elétrica e Ferragens" 
        className="h-10 w-10 object-contain shrink-0 group-[.invert]:brightness-0 group-[.invert]:invert group-[.invert]:grayscale-0"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-tight text-foreground group-[.invert]:text-white">RUSSO</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground group-[.invert]:text-white/60">
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 md:flex">
          <Link to="/" className="hover:text-primary transition-colors">Início</Link>
          <Link to="/#sobre" className="hover:text-primary transition-colors">Quem Somos</Link>
          <Link to="/#categorias" className="hover:text-primary transition-colors">Soluções</Link>
          <Link to="/#orcamento-corporativo" className="hover:text-primary transition-colors">Corporativo</Link>
          <Link to="/#localizacao" className="hover:text-primary transition-colors">Localização</Link>
          <Link to="/#contato" className="hover:text-primary transition-colors">Contato</Link>
        </nav>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-dark"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
