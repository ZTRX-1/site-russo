import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Award, Hammer, Navigation, ParkingSquare, Users } from "lucide-react";
import fachada from "/uploads/fachada-russo.jpg";
import lojaInterior from "@/assets/loja-interior.jpg";
import { CtaButton } from "@/components/ui/CtaButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const PILLARS = [
  { icon: Users, label: "Atendimento humano", text: "Você conversa com quem entende do produto e ajuda a escolher o certo para a sua necessidade." },
  { icon: Hammer, label: "Variedade organizada", text: "Boa parte do que você procura está aqui, das marcas conhecidas do mercado, em ambiente organizado." },
  { icon: ParkingSquare, label: "Fácil de chegar", text: "Loja de rua na Av. Escola Politécnica, com estacionamento próprio para você parar e ser atendido sem correria." },
  { icon: Award, label: "Empresa familiar", text: "Um negócio de família consolidado no Rio Pequeno, com o compromisso de resolver o problema de quem entra pela porta." },
];

const FOTOS_LOJA = [
  {
    src: lojaInterior,
    alt: "Interior da loja Russo Elétrica com materiais organizados",
  },
  {
    src: fachada,
    alt: "Fachada da Russo Elétrica e Ferragens na Avenida Escola Politécnica",
  },
];

export function Sobre() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateSelection = () => setSelectedIndex(api.selectedScrollSnap());
    updateSelection();
    api.on("select", updateSelection);
    api.on("reInit", updateSelection);

    const timer = window.setInterval(() => api.scrollNext(), 6000);
    return () => {
      window.clearInterval(timer);
      api.off("select", updateSelection);
      api.off("reInit", updateSelection);
    };
  }, [api]);

  return (
    <section id="sobre" className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <Carousel
              setApi={setApi}
              opts={{ loop: true, duration: 28 }}
              className="overflow-hidden rounded-2xl shadow-[var(--shadow-card)]"
              aria-label="Galeria da loja Russo Elétrica"
            >
              <CarouselContent className="ml-0">
                {FOTOS_LOJA.map((foto) => (
                  <CarouselItem key={foto.alt} className="basis-full pl-0">
                    <div className="aspect-[4/3] overflow-hidden bg-muted sm:aspect-[16/11]">
                      <img
                        src={foto.src}
                        alt={foto.alt}
                        width={1280}
                        height={896}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/55 to-transparent px-4 pb-4 pt-12">
                <button
                  type="button"
                  onClick={() => api?.scrollPrev()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition-colors hover:bg-primary focus-visible:bg-primary"
                  aria-label="Ver foto anterior"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2" aria-label="Selecionar foto">
                  {FOTOS_LOJA.map((foto, index) => (
                    <button
                      key={foto.alt}
                      type="button"
                      onClick={() => api?.scrollTo(index)}
                      className={`h-2 rounded-full transition-all ${selectedIndex === index ? "w-6 bg-primary" : "w-2 bg-white/70 hover:bg-white"}`}
                      aria-label={`Ver foto ${index + 1}`}
                      aria-current={selectedIndex === index ? "true" : undefined}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => api?.scrollNext()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition-colors hover:bg-primary focus-visible:bg-primary"
                  aria-label="Ver próxima foto"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Carousel>

            <div className="absolute -bottom-6 -right-6 hidden max-w-[240px] rounded-xl bg-primary px-6 py-5 text-primary-foreground shadow-[var(--shadow-elegant)] sm:block">
              <p className="text-xs font-bold uppercase leading-tight tracking-widest">
                Loja abastecida com marcas reconhecidas para reparos, obras e manutenção.
              </p>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Nossa história
            </span>
            <h2 className="mt-3 font-display text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Tradição e referência técnica na Zona Oeste.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              Há anos atendendo moradores, empresas, condomínios e profissionais da Zona Oeste de São Paulo, a Russo construiu sua reputação oferecendo atendimento próximo, produtos de qualidade e orientação técnica para cada compra.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Nossa localização na Avenida Escola Politécnica facilita o acesso de quem vem do Rio Pequeno, Butantã, Jaguaré, Vila São Francisco, USP e Raposo Tavares. A estrutura foi pensada para que você seja bem atendido e saia da loja com o material certo em mãos.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {PILLARS.map(({ icon: Icon, label, text }) => (
                <li
                  key={label}
                  className="flex gap-3 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground">{label}</p>
                    <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <CtaButton href="#localizacao" variant="ghost" icon={<Navigation className="h-4 w-4 shrink-0" />}>
                Como chegar até a loja
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
