import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/layout/LegalLayout";

export const Route = createFileRoute("/lgpd")({
  component: LGPD,
});

function LGPD() {
  return (
    <LegalLayout title="Conformidade LGPD">
      <section className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          A <strong>Russo Elétrica e Ferragens</strong> reafirma seu compromisso com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>, garantindo que o tratamento de dados pessoais em nossa operação varejista seja feito de forma ética e transparente.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Nossa Atuação como Controladora</h2>
        <p>
          Como controladora dos dados, a Russo garante:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Minimização:</strong> Coletamos apenas o CPF/CNPJ para obrigações fiscais e telefone para comunicação comercial.</li>
          <li><strong>Direitos do Titular:</strong> Você pode solicitar a confirmação, o acesso, a correção ou a exclusão de seus dados a qualquer momento através de nossos canais oficiais.</li>
          <li><strong>Transparência no Tráfego Pago:</strong> Utilizamos ferramentas de rastreamento (como pixels de conversão) que processam dados de forma anonimizada para otimização de nossos anúncios no Google e Meta.</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Tratamento de Dados de Contato</h2>
        <p>
          Ao iniciar um atendimento via WhatsApp através de nosso site, você consente com o tratamento de seu número e nome para fins de envio de orçamentos e informações técnicas solicitadas por você.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Segurança da Informação</h2>
        <p>
          Nossos sistemas de gestão de vendas e faturamento possuem controle de acesso restrito, garantindo que apenas colaboradores autorizados tenham acesso aos dados cadastrais para finalidades estritamente profissionais.
        </p>

        <p className="mt-12 text-sm italic border-t pt-4">
          Compromisso Russo com a transparência e segurança digital.
        </p>
      </section>
    </LegalLayout>
  );
}
