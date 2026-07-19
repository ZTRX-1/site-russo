import { createFileRoute } from "@tanstack/react-router";
import { LocalLandingPage } from "@/components/seo/LocalLandingPage";
import {
  SITE_URL,
  COMPANY_NAME,
  WHATSAPP_URL,
  WHATSAPP_URL_ESPECIALISTA,
} from "@/lib/constants";

const URL_PATH = "/rio-pequeno";
const TITLE = "Material Elétrico no Rio Pequeno | Loja na Av. Escola Politécnica, Russo";
const DESCRIPTION =
  "Loja de material elétrico, ferragens, iluminação e ferramentas no Rio Pequeno, Zona Oeste de São Paulo. Av. Escola Politécnica, próxima à USP, Butantã e Raposo Tavares. Atendimento técnico e orçamento pelo WhatsApp.";

export const Route = createFileRoute("/rio-pequeno")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "material elétrico Rio Pequeno, loja elétrica Rio Pequeno, material elétrico Av. Escola Politécnica, material elétrico Butantã, ferragens Rio Pequeno, iluminação Rio Pequeno, material elétrico próximo USP, material elétrico Raposo Tavares",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + URL_PATH },
      { property: "og:image", content: SITE_URL + "/uploads/qqqq.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: SITE_URL + "/uploads/qqqq.jpg" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + URL_PATH }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["HardwareStore", "LocalBusiness"],
          "@id": SITE_URL + URL_PATH + "#localbusiness",
          name: COMPANY_NAME,
          url: SITE_URL + URL_PATH,
          image: SITE_URL + "/uploads/fachada-russo.png",
          telephone: "+551137662002",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Escola Politécnica, 2850",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            postalCode: "05386-130",
            addressCountry: "BR",
          },
          geo: { "@type": "GeoCoordinates", latitude: -23.56133, longitude: -46.74526 },
          areaServed: [
            { "@type": "Place", name: "Rio Pequeno" },
            { "@type": "Place", name: "Butantã" },
            { "@type": "Place", name: "Vila São Francisco" },
            { "@type": "Place", name: "Raposo Tavares" },
            { "@type": "Place", name: "USP" },
            { "@type": "Place", name: "Jaguaré" },
          ],
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "13:00" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: "Material Elétrico no Rio Pequeno", item: SITE_URL + URL_PATH },
          ],
        }),
      },
    ],
  }),
  component: MaterialEletricoRioPequeno,
  errorComponent: ({ error }) => <div className="p-8">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Página não encontrada.</div>,
});

function MaterialEletricoRioPequeno() {
  return (
    <LocalLandingPage
      eyebrow="Rio Pequeno, Zona Oeste"
      breadcrumbLabel="Material Elétrico no Rio Pequeno"
      h1={
        <>
          <span className="text-white">Material elétrico no </span>
          <span className="text-primary">Rio Pequeno</span>
          <span className="text-white">, direto no balcão da Escola Politécnica</span>
        </>
      }
      intro="Loja física completa em elétrica, ferragens, iluminação e ferramentas na Av. Escola Politécnica, 2850. Você vai encontrar o item que precisa e um atendimento que explica, sem enrolar, o que serve para o seu projeto. A referência do bairro para quem trabalha com elétrica."
      primaryCta={{ href: WHATSAPP_URL, label: "Solicitar orçamento" }}
      secondaryCta={{ href: WHATSAPP_URL_ESPECIALISTA, label: "Falar com especialista" }}
      benefits={[
        {
          title: "Elétrica completa",
          desc: "Fios, cabos flexíveis, disjuntores, DR, DPS, quadros, tomadas, interruptores, conectores e demais itens de instalação predial e residencial.",
        },
        {
          title: "Iluminação residencial e comercial",
          desc: "Lâmpadas LED, luminárias, spots, plafons, refletores e sensores de presença, para reforma, projeto novo ou reposição.",
        },
        {
          title: "Ferragens e ferramentas",
          desc: "Parafusos, dobradiças, fechaduras, cadeados, ferramentas manuais e itens de acabamento para obras e reparos domésticos.",
        },
        {
          title: "Proteção elétrica",
          desc: "DPS, DR, disjuntores termomagnéticos e itens de segurança elétrica para proteger a instalação, do quadro à tomada.",
        },
        {
          title: "Materiais para eletricistas",
          desc: "Estoque técnico com marcas de referência, atendimento no ritmo do profissional e condições especiais para quem compra recorrente.",
        },
        {
          title: "Retirada no mesmo dia",
          desc: "Loja física com estoque real, em geral, o que você precisa hoje pode ser retirado hoje. Sem promessa vazia de prazo.",
        },
      ]}
      differentials={[
        {
          title: "Ponto de referência do bairro",
          desc: "A Russo é referência no Rio Pequeno há anos. Quem mora, trabalha e faz manutenção na região sabe onde encontrar material sem perder tempo.",
        },
        {
          title: "Atendimento técnico de verdade",
          desc: "Nossa equipe conhece produto: bitola de fio, corrente de disjuntor, compatibilidade de luminária. Você sai da loja com o item certo.",
        },
        {
          title: "Prova social do bairro",
          desc: "Nota 5.0 no Google, com avaliações reais de moradores, eletricistas e empresas da própria Zona Oeste.",
        },
      ]}
      midCta={{
        eyebrow: "Loja no Rio Pequeno",
        title: "Está por perto? Passe na loja ou peça pelo WhatsApp",
        description:
          "Av. Escola Politécnica, 2850, próxima à USP, Butantã, Vila São Francisco e Raposo Tavares. Se preferir, envie a lista pelo WhatsApp que já separamos.",
        href: WHATSAPP_URL,
        cta: "Solicitar orçamento",
      }}
      faq={[
        {
          q: "Onde fica a loja da Russo no Rio Pequeno?",
          a: "Estamos na Av. Escola Politécnica, 2850, Rio Pequeno, Zona Oeste de São Paulo. Referência para quem vem de Butantã, Vila São Francisco, Jaguaré, USP e Raposo Tavares.",
        },
        {
          q: "Qual o horário de funcionamento?",
          a: "Segunda a sexta das 08h às 18h e sábado das 08h às 13h. Fora desses horários, atendemos com prévia combinada pelo WhatsApp para casos de emergência.",
        },
        {
          q: "Vocês vendem para eletricistas e profissionais?",
          a: "Sim. Trabalhamos com estoque técnico e condições especiais para eletricistas, prestadores de serviço e profissionais que compram com frequência.",
        },
        {
          q: "Tem estacionamento por perto?",
          a: "A Av. Escola Politécnica facilita o acesso e a parada rápida para retirada, além de opções de estacionamento nas ruas próximas.",
        },
        {
          q: "Consigo pedir pelo WhatsApp e retirar depois?",
          a: "Sim. Envie a lista pelo WhatsApp; separamos o material, confirmamos o valor e você retira no balcão sem espera.",
        },
        {
          q: "Quais formas de pagamento aceitam?",
          a: "Dinheiro, Pix, débito e crédito. Para empresas e condomínios, também trabalhamos com faturamento em nota fiscal.",
        },
      ]}
      internalLinks={[
        { to: "/empresas", label: "Atendimento para Empresas", desc: "Faturamento em nota e vendedor dedicado." },
        { to: "/condominios", label: "Atendimento para Condomínios", desc: "Manutenção predial no mesmo dia." },
        { to: "/", label: "Voltar para a Home", desc: "Conheça a estrutura completa da Russo." },
      ]}
      localContext="A loja fica na Av. Escola Politécnica, 2850, coração do Rio Pequeno, ao lado de Butantã, Vila São Francisco, Jaguaré, USP e Raposo Tavares. Um endereço fácil para quem trabalha, mora ou faz obra na Zona Oeste de São Paulo e não pode perder o dia caçando material em várias lojas."
    />
  );
}