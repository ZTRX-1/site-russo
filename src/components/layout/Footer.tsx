import { Link } from "@tanstack/react-router";
import { 
  Instagram, 
  Facebook, 
  Phone, 
  MapPin, 
  Clock 
} from "lucide-react";
import { Logo } from "./Header";
import { 
  WHATSAPP_URL, 
  PHONE_DISPLAY, 
  MOBILE_DISPLAY, 
  ADDRESS 
} from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary pt-16 pb-8 text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="/uploads/logo-russo.png" alt="Russo Elétrica" className="h-10 w-10 object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-extrabold tracking-tight text-white">RUSSO</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/60">Elétrica & Ferragens</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-white/60">
              Empresa familiar localizada no Rio Pequeno, referência em materiais elétricos, ferragens, iluminação, ferramentas e proteção elétrica para consumidores, empresas, condomínios e profissionais da Zona Oeste de São Paulo.
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-primary hover:text-primary-foreground">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-primary hover:text-primary-foreground">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white">Para quem atendemos</h4>
            <ul className="mt-6 space-y-1 text-sm text-white/60">
              <li><Link to="/empresas" className="inline-block py-1.5 hover:text-primary transition-colors">Empresas</Link></li>
              <li><Link to="/condominios" className="inline-block py-1.5 hover:text-primary transition-colors">Condomínios</Link></li>
              <li><Link to="/rio-pequeno" className="inline-block py-1.5 hover:text-primary transition-colors">Loja no Rio Pequeno</Link></li>
              <li><Link to="/#categorias" className="inline-block py-1.5 hover:text-primary transition-colors">Linhas de produto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white">Conteúdo</h4>
            <ul className="mt-6 space-y-1 text-sm text-white/60">
              <li><Link to="/blog" className="inline-block py-1.5 hover:text-primary transition-colors">Blog da Russo</Link></li>
              <li><Link to="/#atendemos" className="inline-block py-1.5 hover:text-primary transition-colors">Quem atendemos</Link></li>
              <li><Link to="/#localizacao" className="inline-block py-1.5 hover:text-primary transition-colors">Como chegar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white">Contato e horário</h4>
            <ul className="mt-6 space-y-4 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Av. Escola Politécnica, 2850<br />
                  Rio Pequeno, São Paulo/SP
                </span>
              </li>
              <li className="flex items-start gap-3 text-numeric">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="flex flex-col">
                  <a href={`tel:${PHONE_DISPLAY.replace(/\D/g, '')}`} className="hover:text-white transition-colors">{PHONE_DISPLAY}</a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp: (11) 92232-8009</a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-numeric">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p>Segunda a sexta, das 8h às 18h</p>
                  <p>Sábado, das 8h às 13h</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-white">Institucional</h4>
            <ul className="mt-6 space-y-1 text-sm text-white/60">
              <li><Link to="/politica-de-privacidade" className="inline-block py-1.5 hover:text-primary transition-colors">Política de privacidade</Link></li>
              <li><Link to="/termos-de-uso" className="inline-block py-1.5 hover:text-primary transition-colors">Termos de uso</Link></li>
              <li><Link to="/lgpd" className="inline-block py-1.5 hover:text-primary transition-colors">LGPD</Link></li>
              <li><Link to="/cdc" className="inline-block py-1.5 hover:text-primary transition-colors">Código de Defesa do Consumidor</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-xs text-white/40">
          <div className="flex flex-col items-center gap-4 pb-20 text-center sm:flex-row sm:justify-between sm:pb-0 sm:text-left">
            <p>
              <Link
                to="/auth"
                aria-label="Acesso interno"
                title="Acesso interno"
                className="cursor-default text-white/40 no-underline transition hover:text-white/60"
              >
                ©
              </Link>{" "}
              {currentYear} Russo Elétrica e Ferragens, CNPJ 62.093.783/0001-52. Todos os direitos reservados.
            </p>
            <p>
              Desenvolvido com 💙 pela{" "}
              <a
                href="https://vexxoncompany.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white transition hover:text-primary"
              >
                Vexxon Company
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
