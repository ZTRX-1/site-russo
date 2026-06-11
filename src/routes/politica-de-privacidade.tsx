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
          A <strong>Russo Elétrica e Ferragens</strong>, localizada em São Paulo - SP, leva a sua privacidade a sério. Esta política detalha como tratamos seus dados pessoais em conformidade com as leis brasileiras.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Coleta e Finalidade</h2>
        <p>
          Coletamos dados necessários para o atendimento comercial e a prestação de nossos serviços de varejo:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Atendimento via WhatsApp:</strong> Nome e telefone para elaboração de orçamentos e acompanhamento de pedidos.</li>
          <li><strong>Vendas Corporativas e Condomínios:</strong> Dados cadastrais para faturamento (CNPJ, Razão Social, Endereço).</li>
          <li><strong>Navegação no Site:</strong> Cookies técnicos e de análise (Google Analytics) para entender o desempenho de nossas campanhas de tráfego pago e melhorar a experiência do usuário.</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Compartilhamento de Dados</h2>
        <p>
          Seus dados são utilizados exclusivamente para as finalidades descritas. Não comercializamos dados pessoais. O compartilhamento ocorre apenas com:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Órgãos governamentais (emissão de Nota Fiscal).</li>
          <li>Plataformas de tráfego pago (dados anonimizados de conversão).</li>
          <li>Parceiros logísticos, quando houver necessidade de entrega.</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Segurança</h2>
        <p>
          Adotamos medidas organizacionais e técnicas para proteger suas informações contra acessos indevidos. Nossas comunicações via WhatsApp seguem a criptografia da plataforma, e nosso site utiliza protocolo HTTPS seguro.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Contato</h2>
        <p>
          Para dúvidas sobre seus dados ou para exercer seus direitos de exclusão/correção, entre em contato através de nossa loja física ou pelo WhatsApp oficial.
        </p>

        <p className="mt-12 text-sm italic border-t pt-4">
          Última atualização: 11 de Junho de 2026.
        </p>
      </section>
    </LegalLayout>
  );
}
