import { useEffect, useRef, useState } from "react";
import { Clock, ParkingSquare, MapPin, Navigation } from "lucide-react";
import { CtaButton } from "@/components/ui/CtaButton";
import { ADDRESS, GOOGLE_MAPS_URL, MAPS_EMBED, WHATSAPP_URL } from "@/lib/constants";

export function Localizacao() {
  const [showMap, setShowMap] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setShowMap(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShowMap(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="localizacao" className="bg-muted/40 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Conveniência & acesso
            </span>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Fácil acesso na <span className="text-primary">Zona Oeste de São Paulo</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Estamos na Avenida Escola Politécnica, uma das principais vias da região — facilitando o acesso para quem vem do Rio Pequeno, USP, Jaguaré, Butantã, Osasco, Raposo Tavares e bairros próximos. Estacionamento próprio e estrutura preparada para receber com conforto.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>Segunda a sexta: 8h às 18h · Sábado: 8h às 13h</span>
              </li>
              <li className="flex items-start gap-3">
                <ParkingSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>Estacionamento próprio e gratuito no local</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{ADDRESS}</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <CtaButton
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                icon={<Navigation className="h-4 w-4 shrink-0" />}
              >
                Traçar rota de carro
              </CtaButton>
              <CtaButton
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
              >
                Solicitar orçamento
              </CtaButton>
            </div>
          </div>

          <div
            ref={ref}
            className="overflow-hidden rounded-2xl border border-border bg-muted shadow-[var(--shadow-card)]"
          >
            {showMap ? (
              <iframe
                title="Mapa Russo Elétrica e Ferragens — Rio Pequeno, SP"
                src={MAPS_EMBED}
                width="100%"
                height="450"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[420px] w-full border-0"
              />
            ) : (
              <div className="h-[420px] w-full animate-pulse bg-muted" aria-hidden />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}