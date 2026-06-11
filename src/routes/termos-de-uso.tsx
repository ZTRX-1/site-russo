import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const Route = createFileRoute("/termos-de-uso")({
  component: TermosDeUso,
});

function TermosDeUso() {
  return (
    <LegalLayout title="Termos de Uso">
      <section className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Bem-vindo ao site da <strong>Russo Elétrica e Ferragens</strong>. Ao navegar ou interagir com nossos canais, você concorda com os seguintes termos:
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Orçamentos e Preços</h2>
        <p>
          Os orçamentos fornecidos via WhatsApp ou formulários têm validade determinada no momento da emissão. Devido à volatilidade de preços de commodities (como cobre em fios elétricos), os valores podem sofrer alterações sem aviso prévio caso o orçamento expire.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Disponibilidade de Estoque</h2>
        <p>
          As informações de estoque fornecidas são dinâmicas. A reserva de materiais só é confirmada mediante pagamento ou autorização formal de faturamento para empresas e condomínios cadastrados.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo deste site, incluindo fotos da fachada, textos descritivos e logotipos, são de propriedade da Russo Elétrica e Ferragens. O uso não autorizado para fins comerciais é proibido.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Atendimento Corporativo</h2>
        <p>
          O faturamento para empresas e condomínios está sujeito à análise de crédito e apresentação de documentos societários/cadastrais válidos.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Foro</h2>
        <p>
          Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias oriundas destes termos.
        </p>

        <p className="mt-12 text-sm italic border-t pt-4">
          Última atualização: 11 de Junho de 2026.
        </p>
      </section>
    </LegalLayout>
  );
}
