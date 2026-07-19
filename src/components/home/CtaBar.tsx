import { CtaButton } from "@/components/ui/CtaButton";

interface CtaBarProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href: string;
  cta: string;
  variant?: "light" | "dark";
}

/**
 * Barra de CTA contextual, colocada entre seções para não depender
 * apenas do botão principal. Redireciona para WhatsApp segmentado.
 */
export function CtaBar({
  eyebrow,
  title,
  description,
  href,
  cta,
  variant = "dark",
}: CtaBarProps) {
  const isDark = variant === "dark";
  return (
    <section className={isDark ? "bg-secondary py-12 text-secondary-foreground" : "bg-primary py-12 text-primary-foreground"}>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-8 lg:px-8">
        <div className="min-w-0">
          {eyebrow && (
            <span className={`inline-block text-[10px] font-bold uppercase tracking-[0.22em] ${isDark ? "text-primary" : "text-white/80"}`}>
              {eyebrow}
            </span>
          )}
          <h3 className={`mt-2 font-display text-2xl font-black leading-tight sm:text-3xl ${isDark ? "text-white" : "text-white"}`}>
            {title}
          </h3>
          {description && (
            <p className={`mt-2 max-w-2xl text-sm sm:text-base ${isDark ? "text-white/60" : "text-white/85"}`}>
              {description}
            </p>
          )}
        </div>
        <CtaButton
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          variant={isDark ? "primary" : "ghost"}
          className={isDark ? "" : "border-transparent bg-white text-primary hover:bg-white/95 hover:text-primary"}
          icon="whatsapp"
          trailing
        >
          {cta}
        </CtaButton>
      </div>
    </section>
  );
}