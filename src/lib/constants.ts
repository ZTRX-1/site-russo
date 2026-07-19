export const WHATSAPP = "5511922328009";
export const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Vim pelo site da Russo e gostaria de um orçamento."
);
export const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${WHATSAPP_MSG}`;

/**
 * WhatsApp segmentado por perfil do cliente.
 * A mensagem já vai pré-preenchida para qualificar o contato antes mesmo
 * de o vendedor responder, reduz tempo de atendimento e aumenta conversão.
 */
export const buildWhatsAppUrl = (message: string) =>
  `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodeURIComponent(message)}`;

export const WHATSAPP_URL_EMPRESA = buildWhatsAppUrl(
  "Olá! Sou responsável por compras em uma empresa e gostaria de um orçamento com nota fiscal. Podem me atender?"
);
export const WHATSAPP_URL_CONDOMINIO = buildWhatsAppUrl(
  "Olá! Sou de um condomínio e preciso de orçamento para manutenção predial (elétrica e ferragens). Trabalham com faturamento e compras recorrentes?"
);
export const WHATSAPP_URL_CONSTRUTORA = buildWhatsAppUrl(
  "Olá! Sou de uma construtora e queria cotar materiais elétricos e ferragens para obra. Podem me passar as condições?"
);
export const WHATSAPP_URL_ELETRICISTA = buildWhatsAppUrl(
  "Olá! Sou eletricista e queria saber sobre condições especiais para profissionais na Russo."
);
export const WHATSAPP_URL_PRESTADOR = buildWhatsAppUrl(
  "Olá! Sou prestador de serviço e preciso de ferramentas e materiais. Podem me passar um orçamento?"
);
export const WHATSAPP_URL_CONSUMIDOR = buildWhatsAppUrl(
  "Olá! Preciso de um material para casa e queria tirar uma dúvida antes de passar na loja."
);
export const WHATSAPP_URL_ESPECIALISTA = buildWhatsAppUrl(
  "Olá! Queria conversar com alguém da Russo sobre um projeto específico. Podem me ajudar?"
);
export const PHONE_DISPLAY = "(11) 3766-2002";
export const MOBILE_DISPLAY = "(11) 92232-8009";
export const ADDRESS = "Av. Escola Politécnica, 2850 - Rio Pequeno, São Paulo - SP, 05386-130";
export const MAPS_URL = "https://maps.apple.com/?daddr=Av.+Escola+Polit%C3%A9cnica,+2850+-+Rio+Pequeno,+S%C3%A3o+Paulo+-+SP,+05386-130&dirflg=d";
export const GOOGLE_MAPS_URL = "https://www.google.com/maps/dir/?api=1&destination=Av.+Escola+Polit%C3%A9cnica,+2850+-+Rio+Pequeno,+S%C3%A3o+Paulo+-+SP,+05386-130&travelmode=driving";
export const MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197363435163!2d-46.745260123761765!3d-23.561330661502444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5666f7f2b189%3A0xc3c9f284063665a3!2sAv.%20Escola%20Polit%C3%A9cnica%2C%202850%20-%20Rio%20Pequeno%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005386-130!5e0!3m2!1spt-BR!2sbr!4v1718110000000!5m2!1spt-BR!2sbr";
export const SITE_URL = "https://russoeletrofer.com.br";
export const COMPANY_NAME = "Russo Elétrica e Ferragens";
