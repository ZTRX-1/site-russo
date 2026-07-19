import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const Route = createFileRoute("/cdc")({
  head: () => ({
    meta: [
      { title: "Direitos do Consumidor (CDC) | Russo Elétrica e Ferragens" },
      { name: "description", content: "Direitos do consumidor, garantias, trocas e devoluções da Russo Elétrica e Ferragens conforme o Código de Defesa do Consumidor." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Direitos do Consumidor (CDC) | Russo Elétrica e Ferragens" },
      { property: "og:url", content: "https://russoeletrofer.com.br/cdc" },
    ],
    links: [{ rel: "canonical", href: "https://russoeletrofer.com.br/cdc" }],
  }),
  component: CDC,
});

function CDC() {
  return (
    <LegalLayout title="Direitos do Consumidor (CDC)">
      <section className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Em conformidade com a <strong>Lei nº 8.078/1990</strong>, a <strong>Russo Elétrica e Ferragens</strong> estabelece as diretrizes para garantir a melhor experiência e segurança jurídica em suas compras.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Garantias</h2>
        <p>
          Respeitamos os prazos legais de garantia:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>90 dias</strong> para produtos duráveis (ferramentas, lustres, painéis elétricos).</li>
          <li><strong>30 dias</strong> para produtos não duráveis.</li>
        </ul>
        <p>Observação: Fios e cabos cortados sob medida podem ter restrições de devolução caso não apresentem defeito, devido à personalização do corte conforme solicitação do cliente.</p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Trocas por Defeito</h2>
        <p>
          Caso um produto apresente vício de fabricação, o consumidor deve entrar em contato conosco munido da Nota Fiscal. Seguiremos o trâmite legal de reparo ou substituição conforme previsto no Artigo 18 do CDC.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Transparência</h2>
        <p>
          Todos os produtos expostos em nossa loja física possuem preços visíveis. Para orçamentos digitais, garantimos a clareza nas especificações técnicas para evitar erros de aplicação ou instalação.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Atendimento de Reclamações</h2>
        <p>
          Priorizamos a resolução amigável de qualquer conflito. Nossos gerentes estão autorizados a mediar soluções rápidas para garantir que o cliente não seja prejudicado em sua obra ou manutenção.
        </p>

        <p className="mt-12 text-sm italic border-t pt-4">
          Russo Elétrica e Ferragens, Tradição e respeito ao consumidor.
        </p>
      </section>
    </LegalLayout>
  );
}
