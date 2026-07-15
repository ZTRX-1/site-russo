import { createFileRoute } from "@tanstack/react-router";
import { LocalLandingPage } from "@/components/seo/LocalLandingPage";
import {
  SITE_URL,
  COMPANY_NAME,
  WHATSAPP_URL_EMPRESA,
  WHATSAPP_URL_ESPECIALISTA,
} from "@/lib/constants";

const URL_PATH = "/empresas";
const TITLE = "Atendimento para Empresas | Loja Especializada em Material Elétrico com Faturamento — Russo";
const DESCRIPTION =
  "Loja especializada em materiais elétricos, ferragens, iluminação e ferramentas para empresas na Zona Oeste de São Paulo. Faturamento em nota fiscal, vendedor dedicado, compras recorrentes e reposição rápida. Solicite orçamento pelo WhatsApp.";

export const Route = createFileRoute("/empresas")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "material elétrico para empresas, atendimento corporativo elétrica, faturamento em nota fiscal, compras corporativas elétrica, ferragens para empresas São Paulo, material elétrico Zona Oeste empresas, cabos, disjuntores, quadros elétricos, Av. Escola Politécnica",
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
          "@type": "Service",
          serviceType: "Atendimento em material elétrico e ferragens para empresas",
          provider: { "@type": "LocalBusiness", name: COMPANY_NAME, url: SITE_URL },
          areaServed: [
            { "@type": "Place", name: "Rio Pequeno" },
            { "@type": "Place", name: "Butantã" },
            { "@type": "Place", name: "Jaguaré" },
            { "@type": "Place", name: "Vila Sônia" },
            { "@type": "Place", name: "Zona Oeste de São Paulo" },
          ],
          audience: { "@type": "BusinessAudience", audienceType: "Empresas e Indústrias" },
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
            url: SITE_URL + URL_PATH,
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: "Atendimento para Empresas", item: SITE_URL + URL_PATH },
          ],
        }),
      },
    ],
  }),
  component: AtendimentoEmpresas,
  errorComponent: ({ error }) => <div className="p-8">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Página não encontrada.</div>,
});

function AtendimentoEmpresas() {
  return (
    <LocalLandingPage
      eyebrow="Atendimento para empresas"
      breadcrumbLabel="Atendimento para Empresas"
      h1={
        <>
          <span className="text-white">A loja de material elétrico que sua </span>
          <span className="text-primary">empresa precisa ter no radar</span>
        </>
      }
      intro="Sua operação não pode parar por causa de um cabo em falta ou um disjuntor errado. A Russo é a estrutura por trás das empresas da Zona Oeste que precisam de faturamento em nota, reposição rápida e um vendedor que entenda de elétrica de verdade."
      primaryCta={{ href: WHATSAPP_URL_EMPRESA, label: "Falar com o comercial" }}
      secondaryCta={{ href: WHATSAPP_URL_ESPECIALISTA, label: "Falar com especialista" }}
      benefits={[
        {
          title: "Faturamento em NF-e",
          desc: "Emissão fiscal correta, com dados da sua empresa, para compras recorrentes ou pontuais — sem burocracia adicional para o financeiro.",
        },
        {
          title: "Vendedor dedicado",
          desc: "Um ponto de contato fixo que já conhece o padrão da sua obra, do seu prédio ou da sua manutenção — nada de recomeçar a explicação todo pedido.",
        },
        {
          title: "Cotação formal por escrito",
          desc: "Enviamos orçamentos completos, com marcas, quantidades e prazos, prontos para aprovação da diretoria ou processo de compras.",
        },
        {
          title: "Grande variedade em estoque",
          desc: "Fios, cabos, disjuntores, iluminação, ferragens e ferramentas em estoque real, o que reduz o risco da sua obra ou manutenção parar.",
        },
        {
          title: "Reposição rápida",
          desc: "Loja física na Av. Escola Politécnica, no Rio Pequeno — a poucos minutos de Butantã, Jaguaré, USP e Raposo Tavares.",
        },
        {
          title: "Atendimento técnico",
          desc: "Não vendemos por catálogo. Se seu técnico está em dúvida sobre bitola, corrente ou compatibilidade, orientamos direto.",
        },
      ]}
      whyChoose={[
        {
          title: "Compras recorrentes",
          desc: "Padronizamos seus pedidos: você reabastece sem precisar refazer cotação toda semana.",
        },
        {
          title: "Atendimento rápido",
          desc: "Contato direto pelo WhatsApp com quem realmente resolve — não passa por 3 níveis até chegar uma resposta.",
        },
        {
          title: "Estoque disponível",
          desc: "Loja física com giro alto: se está no seu pedido, muito provavelmente está no balcão.",
        },
        {
          title: "Agilidade na reposição",
          desc: "Emergência de manutenção? Estamos na Av. Escola Politécnica — retirada no mesmo dia é comum.",
        },
        {
          title: "Atendimento especializado",
          desc: "Nossos vendedores conhecem o produto. Entendem de instalação predial, industrial e comercial.",
        },
        {
          title: "Facilidade para orçamentos",
          desc: "Envie sua lista pelo WhatsApp; devolvemos com preços, marcas e disponibilidade prontos para aprovação.",
        },
      ]}
      differentials={[
        {
          title: "Loja especializada com proximidade de bairro",
          desc: "Você conta com a estrutura de uma loja especializada e, ao mesmo tempo, com a agilidade de quem atende no balcão e conhece o cliente pelo nome.",
        },
        {
          title: "Marcas reconhecidas",
          desc: "Trabalhamos com fabricantes consolidados no mercado elétrico brasileiro — nada de material de origem duvidosa em obra crítica.",
        },
        {
          title: "Prova social real",
          desc: "Nota 5.0 no Google, com avaliações reais de empresas, condomínios e profissionais da região.",
        },
      ]}
      midCta={{
        eyebrow: "Pronto para comprar",
        title: "Envie sua lista de material — devolvemos o orçamento",
        description:
          "Pedidos de empresa recebem atendimento prioritário. Mande a lista pelo WhatsApp e o comercial responde com preço, prazo e nota.",
        href: WHATSAPP_URL_EMPRESA,
        cta: "Enviar lista de material",
      }}
      faq={[
        {
          q: "A Russo emite nota fiscal para empresa?",
          a: "Sim. Emitimos NF-e com os dados da sua empresa em todos os pedidos — pontuais ou recorrentes — para que o financeiro registre a compra sem retrabalho.",
        },
        {
          q: "Vocês atendem empresas em toda a Zona Oeste de SP?",
          a: "Sim. Atendemos empresas de Rio Pequeno, Butantã, Jaguaré, Vila Sônia, Morumbi, Lapa, Osasco e demais bairros da Zona Oeste. Retirada na loja da Av. Escola Politécnica ou combinação de entrega conforme o pedido.",
        },
        {
          q: "Como funciona o pedido corporativo?",
          a: "Você envia a lista pelo WhatsApp (ou fecha direto na loja). Um vendedor dedicado revisa marcas e quantidades, envia a cotação formal, você aprova e nós separamos e emitimos a nota.",
        },
        {
          q: "É possível abrir cadastro de faturamento?",
          a: "Sim. Fazemos o cadastro da sua empresa para operar com faturamento recorrente e histórico de pedidos consolidado — assim as próximas compras rodam ainda mais rápido.",
        },
        {
          q: "Vocês têm estoque para pedidos maiores?",
          a: "Trabalhamos com estoque real de fios, cabos, disjuntores, quadros, iluminação e ferragens. Para grandes volumes, alinhamos disponibilidade e prazo antes de fechar.",
        },
        {
          q: "Quais formas de pagamento aceitam para empresa?",
          a: "Dinheiro, Pix, débito, crédito e faturamento — as condições comerciais são combinadas de acordo com o volume e o histórico do cliente corporativo.",
        },
      ]}
      internalLinks={[
        { to: "/condominios", label: "Atendimento para Condomínios", desc: "Manutenção predial, síndicos e zeladores." },
        { to: "/rio-pequeno", label: "Material Elétrico no Rio Pequeno", desc: "Loja física na Av. Escola Politécnica." },
        { to: "/", label: "Voltar para a Home", desc: "Conheça a estrutura completa da Russo." },
      ]}
      localContext="Estamos na Av. Escola Politécnica, no Rio Pequeno — ponto estratégico para atender empresas de Butantã, Jaguaré, Vila São Francisco, USP, Raposo Tavares e toda a Zona Oeste de São Paulo. Reposição rápida quando cada hora parada da sua operação conta."
    />
  );
}