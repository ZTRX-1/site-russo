import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const Route = createFileRoute("/politica-de-privacidade")({
  component: PoliticaPrivacidade,
});

function PoliticaPrivacidade() {
  return (
    <LegalLayout title="Política de Privacidade">
      <section className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          A <strong>Russo Elétrica e Ferragens</strong> está comprometida com a proteção de sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos e protegemos as informações que você nos fornece ao utilizar nosso site ou entrar em contato via WhatsApp.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Coleta de Informações</h2>
        <p>
          Coletamos informações básicas quando você interage conosco, tais como:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Dados de contato (nome, telefone/WhatsApp) para fins de orçamento e atendimento.</li>
          <li>Informações técnicas de navegação através de cookies para melhorar a experiência no site.</li>
          <li>Dados de localização para facilitar a prestação de serviços e rotas até nossa loja.</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Uso das Informações</h2>
        <p>
          As informações coletadas são utilizadas exclusivamente para:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Fornecer orçamentos de materiais elétricos, ferragens e iluminação.</li>
          <li>Atendimento personalizado e suporte técnico aos nossos clientes.</li>
          <li>Comunicação sobre pedidos, novos produtos ou serviços.</li>
          <li>Melhoria contínua das funcionalidades do nosso site.</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Proteção de Dados</h2>
        <p>
          Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado, perda ou alteração. Não vendemos ou compartilhamos suas informações com terceiros para fins de marketing.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Seus Direitos</h2>
        <p>
          Você tem o direito de solicitar o acesso, correção ou exclusão de seus dados pessoais em posse da Russo Elétrica e Ferragens. Para isso, entre em contato conosco através de nossos canais oficiais de atendimento.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Alterações nesta Política</h2>
        <p>
          Podemos atualizar esta política periodicamente. Recomendamos que você revise esta página regularmente para estar ciente de qualquer alteração.
        </p>

        <p className="mt-12 text-sm italic">
          Última atualização: 11 de Junho de 2026.
        </p>
      </section>
    </LegalLayout>
  );
}
