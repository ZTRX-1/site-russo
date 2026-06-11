import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const Route = createFileRoute("/cdc")({
  component: CDC,
});

function CDC() {
  return (
    <LegalLayout title="Direitos do Consumidor (CDC)">
      <section className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Na <strong>Russo Elétrica e Ferragens</strong>, respeitamos integralmente o <strong>Código de Defesa do Consumidor (Lei nº 8.078/1990)</strong>. Nosso objetivo é oferecer uma experiência de compra justa, transparente e segura para todos os nossos clientes.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Garantia de Produtos</h2>
        <p>
          Todos os produtos comercializados seguem os prazos de garantia legal estabelecidos pelo CDC:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>30 dias</strong> para produtos não duráveis.</li>
          <li><strong>90 dias</strong> para produtos duráveis (como ferramentas e materiais elétricos).</li>
        </ul>
        <p>Muitos de nossos fornecedores oferecem garantias contratuais estendidas. Nestes casos, as informações constam na embalagem ou manual do produto.</p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Trocas e Devoluções</h2>
        <p>
          Para compras realizadas presencialmente em nossa loja, as trocas por arrependimento não são obrigatórias por lei, mas a Russo Elétrica e Ferragens preza pelo bom relacionamento e avalia cada caso, desde que o produto esteja em sua embalagem original, sem sinais de uso e com a respectiva nota fiscal.
        </p>
        <p>Em caso de produtos com defeito técnico ou de fabricação, seguimos o procedimento de encaminhamento para assistência técnica ou substituição imediata, conforme previsto no Art. 18 do CDC.</p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Transparência de Preços</h2>
        <p>
          Garantimos que todos os preços em nossa loja física e informados em nossos canais digitais sejam claros e precisos. Em caso de divergência de preços para o mesmo produto, prevalecerá o menor valor, conforme a legislação vigente.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Atendimento ao Cliente</h2>
        <p>
          Estamos à disposição para resolver qualquer questão relacionada à sua compra. Nosso atendimento prioriza a conciliação e a satisfação do consumidor.
        </p>

        <p className="mt-12 text-sm italic">
          Russo Elétrica e Ferragens — Compromisso com a ética e o respeito ao consumidor.
        </p>
      </section>
    </LegalLayout>
  );
}
