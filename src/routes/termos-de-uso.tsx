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
          Ao acessar o site da <strong>Russo Elétrica e Ferragens</strong>, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Uso de Licença</h2>
        <p>
          É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Russo Elétrica e Ferragens, apenas para visualização pessoal e não comercial transitória.
        </p>
        <p>Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Modificar ou copiar os materiais;</li>
          <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública;</li>
          <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Isenção de Responsabilidade</h2>
        <p>
          Os materiais no site da Russo Elétrica e Ferragens são fornecidos 'como estão'. A Russo Elétrica e Ferragens não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização ou adequação a um fim específico.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Orçamentos e Preços</h2>
        <p>
          As informações sobre produtos e preços exibidas ou fornecidas via WhatsApp são meramente informativas e estão sujeitas a alterações sem aviso prévio. Um orçamento formal é válido apenas pelo período indicado no documento enviado por nossa equipe.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Limitações</h2>
        <p>
          Em nenhum caso a Russo Elétrica e Ferragens ou seus fornecedores serão responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar os materiais em seu site.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Lei Aplicável</h2>
        <p>
          Estes termos e condições são regidos e interpretados de acordo com as leis brasileiras e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais de São Paulo - SP.
        </p>

        <p className="mt-12 text-sm italic">
          Última atualização: 11 de Junho de 2026.
        </p>
      </section>
    </LegalLayout>
  );
}
