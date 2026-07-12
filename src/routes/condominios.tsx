import { createFileRoute } from "@tanstack/react-router";
import { LocalLandingPage } from "@/components/seo/LocalLandingPage";
import {
  SITE_URL,
  COMPANY_NAME,
  WHATSAPP_URL_CONDOMINIO,
  WHATSAPP_URL_ESPECIALISTA,
} from "@/lib/constants";

const URL_PATH = "/condominios";
const TITLE = "Atendimento para Condomínios | Manutenção Predial Elétrica — Russo Zona Oeste SP";
const DESCRIPTION =
  "Fornecedor de materiais elétricos, ferragens e iluminação para condomínios da Zona Oeste de SP. Suporte para síndicos, zeladores e administradoras. Faturamento em nota, atendimento técnico e reposição rápida no Rio Pequeno.";

export const Route = createFileRoute("/condominios")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "material elétrico condomínio, fornecedor condomínio Zona Oeste, manutenção predial elétrica SP, síndico material elétrico, iluminação condomínio Rio Pequeno, faturamento condomínio material elétrico",
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
          serviceType: "Fornecimento de material elétrico e ferragens para condomínios",
          provider: { "@type": "LocalBusiness", name: COMPANY_NAME, url: SITE_URL },
          areaServed: [
            { "@type": "Place", name: "Rio Pequeno" },
            { "@type": "Place", name: "Butantã" },
            { "@type": "Place", name: "Jaguaré" },
            { "@type": "Place", name: "Vila Sônia" },
            { "@type": "Place", name: "Morumbi" },
            { "@type": "Place", name: "Zona Oeste de São Paulo" },
          ],
          audience: { "@type": "Audience", audienceType: "Síndicos, administradoras e zeladores" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: "Atendimento para Condomínios", item: SITE_URL + URL_PATH },
          ],
        }),
      },
    ],
  }),
  component: AtendimentoCondominios,
  errorComponent: ({ error }) => <div className="p-8">Erro: {error.message}</div>,
  notFoundComponent: () => <div className="p-8">Página não encontrada.</div>,
});

function AtendimentoCondominios() {
  return (
    <LocalLandingPage
      eyebrow="Atendimento para condomínios"
      breadcrumbLabel="Atendimento para Condomínios"
      h1={
        <>
          <span className="text-white">Condomínio </span>
          <span className="text-primary">não pode ficar sem luz</span>
          <span className="text-white"> esperando o material chegar</span>
        </>
      }
      intro="Reator queimado na garagem, disjuntor disparando, refletor da fachada apagado. Síndicos, zeladores e administradoras da Zona Oeste contam com a Russo para resolver a manutenção elétrica no mesmo dia — com nota fiscal e atendimento técnico direto no WhatsApp."
      primaryCta={{ href: WHATSAPP_URL_CONDOMINIO, label: "Falar sobre meu condomínio" }}
      secondaryCta={{ href: WHATSAPP_URL_ESPECIALISTA, label: "Falar com especialista" }}
      benefits={[
        {
          title: "Iluminação de áreas comuns",
          desc: "Lâmpadas LED, refletores, luminárias de garagem, sensores de presença e reatores em estoque — o essencial para hall, escada, fachada e garagem.",
        },
        {
          title: "Quadros e proteção",
          desc: "Disjuntores, DR, DPS, barramentos e quadros de distribuição para manutenção preventiva e correção de sobrecargas no prédio.",
        },
        {
          title: "Fios, cabos e infraestrutura",
          desc: "Fios e cabos flexíveis, eletrodutos, canaletas e acessórios para pequenos reparos e reformas elétricas dos condomínios.",
        },
        {
          title: "Interfones e portaria",
          desc: "Reposição de itens de baixa tensão que fazem o dia a dia da portaria funcionar — botoeiras, campainhas, cabos e acessórios.",
        },
        {
          title: "Ferragens e ferramentas",
          desc: "Cadeados, dobradiças, fechaduras, parafusos e ferramentas manuais para a manutenção geral que o zelador precisa ter à mão.",
        },
        {
          title: "Hidráulica básica",
          desc: "Conexões, registros, reparos e acessórios para consertos rápidos em áreas comuns — sem precisar acionar mais um fornecedor.",
        },
      ]}
      whyChoose={[
        {
          title: "Compras recorrentes",
          desc: "Cadastro do condomínio para pedidos frequentes de manutenção, sem retrabalho a cada ocorrência.",
        },
        {
          title: "Atendimento rápido",
          desc: "Zelador manda foto pelo WhatsApp, nós identificamos o item e confirmamos disponibilidade em minutos.",
        },
        {
          title: "Estoque disponível",
          desc: "Loja física com giro alto — o item de manutenção do prédio quase sempre já está no balcão.",
        },
        {
          title: "Agilidade na reposição",
          desc: "Loja no Rio Pequeno, a poucos minutos dos principais condomínios da Zona Oeste — retirada no mesmo dia.",
        },
        {
          title: "Atendimento especializado",
          desc: "Nossa equipe orienta o síndico e o zelador sobre o material certo — sem enrolação técnica.",
        },
        {
          title: "Facilidade para orçamentos",
          desc: "Cotação formal por escrito, pronta para aprovação em assembleia ou na administradora.",
        },
      ]}
      differentials={[
        {
          title: "Emissão de nota para o condomínio",
          desc: "NF-e em nome do condomínio para prestação de contas transparente e correta com moradores e administradora.",
        },
        {
          title: "Vendedor que fala a língua da manutenção",
          desc: "Foto da peça queimada resolve. Não exigimos que o zelador saiba código do fabricante para identificar o material.",
        },
        {
          title: "Prova social de síndicos e zeladores",
          desc: "5.0 no Google com mais de 127 avaliações de clientes recorrentes — muitos deles gestores prediais da Zona Oeste.",
        },
      ]}
      midCta={{
        eyebrow: "Manutenção do condomínio",
        title: "Mande a foto do que está queimado — respondemos com o item certo",
        description:
          "Zelador, síndico ou administradora: envie a foto ou descrição da peça pelo WhatsApp e devolvemos com disponibilidade, preço e nota fiscal.",
        href: WHATSAPP_URL_CONDOMINIO,
        cta: "Falar com o comercial",
      }}
      faq={[
        {
          q: "A Russo emite nota fiscal em nome do condomínio?",
          a: "Sim. Emitimos NF-e diretamente no CNPJ do condomínio, o que facilita a prestação de contas do síndico e o repasse à administradora.",
        },
        {
          q: "Vocês atendem condomínios em quais bairros?",
          a: "Atendemos condomínios de Rio Pequeno, Butantã, Vila Sônia, Morumbi, Jaguaré, Vila São Francisco, Raposo Tavares e demais bairros da Zona Oeste de São Paulo.",
        },
        {
          q: "Como funciona o pedido de manutenção?",
          a: "O zelador ou síndico manda foto ou descrição pelo WhatsApp. Identificamos o item, confirmamos preço e disponibilidade e emitimos a nota. Retirada na loja ou combinação de entrega conforme o pedido.",
        },
        {
          q: "Vocês têm iluminação de áreas comuns em estoque?",
          a: "Sim. Trabalhamos com lâmpadas LED, refletores, luminárias de garagem, sensores de presença, reatores e demais itens de iluminação predial — todos em estoque real.",
        },
        {
          q: "É possível cadastrar o condomínio para compras recorrentes?",
          a: "Sim. Fazemos o cadastro do condomínio (ou da administradora) para agilizar pedidos futuros — histórico consolidado e faturamento recorrente sem retrabalho.",
        },
        {
          q: "Quais formas de pagamento aceitam?",
          a: "Dinheiro, Pix, débito, crédito e faturamento. Para condomínios, ajustamos a condição comercial de acordo com a recorrência e o volume.",
        },
      ]}
      internalLinks={[
        { to: "/empresas", label: "Atendimento para Empresas", desc: "Fornecedor B2B com faturamento e vendedor dedicado." },
        { to: "/rio-pequeno", label: "Material Elétrico no Rio Pequeno", desc: "Loja física na Zona Oeste de SP." },
        { to: "/", label: "Voltar para a Home", desc: "Conheça toda a estrutura da Russo." },
      ]}
      localContext="Nossa loja fica na Av. Escola Politécnica, no Rio Pequeno — dentro de raio curto para os principais condomínios de Butantã, Vila São Francisco, Vila Sônia, Morumbi, Jaguaré e proximidades da USP e Raposo Tavares. Isso significa reposição no mesmo dia quando algo essencial do prédio para."
    />
  );
}