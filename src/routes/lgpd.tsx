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
          Em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>, a Russo Elétrica e Ferragens reafirma seu compromisso com a transparência e segurança no tratamento de dados pessoais de seus clientes, parceiros e colaboradores.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Princípios de Tratamento</h2>
        <p>
          Baseamos nosso tratamento de dados nos seguintes princípios:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Finalidade:</strong> Coletamos dados apenas para propósitos legítimos e específicos (ex: emissão de orçamentos e notas fiscais).</li>
          <li><strong>Necessidade:</strong> Limitamos a coleta ao mínimo necessário para a realização de nossas atividades.</li>
          <li><strong>Segurança:</strong> Utilizamos práticas de mercado para proteger as informações contra incidentes.</li>
          <li><strong>Transparência:</strong> Mantemos o titular informado sobre como seus dados são utilizados.</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Seus Direitos como Titular</h2>
        <p>
          De acordo com a LGPD, você pode solicitar a qualquer momento:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Confirmação da existência de tratamento de seus dados.</li>
          <li>Acesso aos seus dados pessoais.</li>
          <li>Correção de dados incompletos ou inexatos.</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
          <li>Revogação do consentimento para tratamento.</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Encarregado de Dados (DPO)</h2>
        <p>
          Para exercer seus direitos ou tirar dúvidas sobre como tratamos seus dados, você pode entrar em contato com nosso encarregado de proteção de dados através do e-mail de contato da loja ou pelo nosso WhatsApp oficial.
        </p>

        <p className="mt-12 text-sm italic">
          Esta declaração é revisada periodicamente para garantir a conformidade com as regulamentações vigentes.
        </p>
      </section>
    </LegalLayout>
  );
}
