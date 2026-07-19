import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";
import { trackWhatsAppClick } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface CtaButtonProps extends ComponentPropsWithoutRef<"a"> {
  variant?: Variant;
  size?: Size;
  icon?: "whatsapp" | "arrow" | "none" | ReactNode;
  trailing?: boolean;
  children: ReactNode;
  /** Origem do clique, usada nos eventos do GTM/GA4 */
  "data-analytics-source"?: string;
}

/**
 * CTA único do site, padroniza estados, tamanhos e ícones.
 * Toda ação de conversão da Home passa por aqui.
 */
export function CtaButton({
  variant = "primary",
  size = "lg",
  icon = "whatsapp",
  trailing = false,
  className = "",
  children,
  onClick,
  ...rest
}: CtaButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-md font-bold uppercase tracking-wider transition-all duration-300 focus-visible:outline-primary";
  const sizes: Record<Size, string> = {
    md: "h-11 px-5 text-xs",
    lg: "min-h-12 px-7 py-4 text-sm",
  };
  const variants: Record<Variant, string> = {
    primary:
      "bg-primary text-primary-foreground shadow-[var(--shadow-red-glow)] hover:-translate-y-0.5 hover:bg-primary-dark",
    secondary:
      "border border-white/15 bg-white/5 text-white backdrop-blur-md hover:border-primary/50 hover:bg-white/10",
    ghost:
      "border border-border bg-card text-foreground hover:border-primary hover:text-primary",
  };

  const renderIcon = () => {
    if (icon === "none") return null;
    if (icon === "whatsapp") return <WhatsAppIcon className="h-4 w-4 shrink-0" />;
    if (icon === "arrow")
      return <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />;
    return icon;
  };

  const source =
    (rest as Record<string, unknown>)["data-analytics-source"] as string | undefined;
  const href = (rest as { href?: string }).href;
  const isWhats = typeof href === "string" && href.includes("whatsapp");

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (isWhats) trackWhatsAppClick(source || "cta_button", { href });
    onClick?.(e);
  };

  return (
    <a
      {...rest}
      onClick={handleClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {!trailing && renderIcon()}
      <span>{children}</span>
      {trailing && renderIcon()}
    </a>
  );
}