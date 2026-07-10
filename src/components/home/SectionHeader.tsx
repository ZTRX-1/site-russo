import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  invert?: boolean;
  align?: "center" | "left";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  invert = false,
  align = "center",
}: SectionHeaderProps) {
  const alignCls = align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl";
  const titleCls = invert ? "text-white" : "text-foreground";
  const descCls = invert ? "text-white/60" : "text-muted-foreground";
  return (
    <div className={alignCls}>
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
        {eyebrow}
      </span>
      <h2
        className={`mt-3 font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl ${titleCls}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${descCls}`}>{description}</p>
      )}
    </div>
  );
}