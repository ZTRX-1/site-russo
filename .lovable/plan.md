
# ERP Interno Russo — Planejamento Estratégico

Objetivo: construir, dentro do próprio painel administrativo, um núcleo operacional completo (catálogo, estoque, preços, fornecedores, movimentações) inspirado em como redes como Leroy Merlin operam. Tudo nasce **privado**, escondido do site público, e só vira vitrine/e-commerce quando o Ricardo aprovar a próxima proposta.

Princípio norteador: nada entra "só visual". Cada tela é ligada a tabelas reais no Cloud, com RLS, histórico e integração com o que já existe (tracking, WhatsApp, blog).

---

## 1. Arquitetura de acesso

- Tudo mora em `/admin/*` (já protegido pelo login super-admin).
- Novas rotas ficam sob `_authenticated/admin/` → nunca indexáveis, nunca públicas.
- Uma futura vitrine pública (`/catalogo`, `/produto/:slug`) só é criada quando o Ricardo aprovar. Enquanto isso, o mesmo dado já está estruturado para virar vitrine em 1 chave.
- Papéis: `admin` (Ricardo/você, tudo), `editor` (equipe da loja, sem apagar histórico nem mexer em preço de custo), `caixa` (futuro, só consulta e movimentação de saída). Reaproveita a tabela `user_roles` existente.

## 2. Núcleo do catálogo (Fase A — base)

Modelagem pensada pra escalar de 200 a 20.000 SKUs:

- **Categorias** hierárquicas (Elétrica > Cabos > Flexível 750V), com slug, ícone e ordem.
- **Marcas / Fabricantes** (Tramontina, Legrand, Tigre…).
- **Produtos**: SKU interno, nome, descrição, marca, categoria, unidade (un, m, kg, cx), NCM, peso, dimensões, imagens múltiplas, ficha técnica em rich text (reaproveita o editor do blog).
- **Variações** opcionais (bitola, cor, tensão) sem virar produto novo.
- **Códigos de barras** (EAN/UPC) — múltiplos por produto (caixa + unidade).
- **Preços**: custo, margem, preço de venda, preço promocional com validade.
- **Status**: rascunho, ativo, inativo, descontinuado. Só "ativo" apareceria numa futura vitrine.

Interface: lista com busca instantânea, filtros por categoria/marca/status, edição em página dedicada (padrão dos posts), upload de imagens no bucket `product-images` (novo, privado com URL assinada).

## 3. Estoque e movimentação (Fase B)

- **Depósitos/Locais** (Loja, Estoque interno, Balcão).
- **Movimentações**: entrada (compra, devolução, ajuste), saída (venda balcão, perda, uso interno, transferência). Cada movimento grava usuário, motivo, documento e timestamp — histórico auditável, jamais editado, só estornado.
- **Saldo por local** calculado por view materializada (rápido mesmo com muitos itens).
- **Alertas** de estoque mínimo no dashboard.
- **Inventário/contagem** com divergência lançada como ajuste.

## 4. Leitor de código de barras (Fase B)

- No navegador: câmera do celular via `BarcodeDetector` nativo (Android/Chrome) com fallback `@zxing/browser` para iOS.
- Fluxos que já valem a pena hoje: **entrada rápida** (bipar caixa → soma quantidade), **conferência de inventário**, **consulta rápida** (bipa e mostra preço/estoque).
- Roda 100% no navegador do celular, sem app. Se o Ricardo quiser leitor USB depois, o mesmo campo aceita — leitores USB entram como teclado.

## 5. Fornecedores e compras (Fase C)

- Cadastro de fornecedor (CNPJ, contato, condição de pagamento).
- **Pedido de compra** simples: seleciona itens, quantidades, custo. Ao receber, vira entrada de estoque com um clique.
- Histórico de custo por fornecedor → ajuda decisão de recompra.

## 6. Orçamentos / balcão (Fase D)

- Tela de "novo orçamento": bipa/pesquisa itens, monta carrinho, gera PDF com identidade Russo (reaproveita o gerador que já usamos no analytics).
- Enviar orçamento por WhatsApp com um clique (link `wa.me` já formatado). Isso conecta com o tracking: cada orçamento enviado vira `event_type = 'quote_sent'`.
- Base pronta pra virar "venda balcão" depois (baixa estoque + registra caixa).

## 7. Integração com o que já existe

- **Tracking**: eventos `product_view`, `quote_sent`, `barcode_scan` entram na mesma tabela `analytics_events` — o dashboard atual passa a mostrar "produtos mais consultados internamente" sem obra nova.
- **Blog**: posts podem referenciar produtos (linkar SKU). Quando a vitrine for pública, vira link natural, ótimo pra SEO.
- **WhatsApp**: cada produto tem botão "Pedir por WhatsApp" pré-formatado com nome + SKU. Dispara o mesmo `trackWhatsAppClick` recém-corrigido, agora com origem `catalog`.

## 8. Preparação pra virar vitrine/e-commerce (Fase E — só depois da aprovação)

Como a base já nasce com slug, imagens, descrição, categoria e status "ativo", ligar a vitrine é:
1. Criar rotas públicas `/catalogo` e `/produto/:slug` com SSR (bom pra SEO local).
2. Adicionar policy `TO anon` de SELECT só nos campos seguros de produtos ativos.
3. Botão de conversão continua sendo WhatsApp (não vira checkout até o Ricardo decidir).

Se um dia virar e-commerce de verdade, entra Stripe/Paddle + carrinho + frete — nada disso é feito agora, mas o modelo de dados já suporta.

## 9. O que **não** cabe (para não inflar o projeto)

- Emissão de NF-e / SAT fiscal — exige contador, certificado A1 e integração paga. Fora de escopo até virar operação fiscal oficial.
- Financeiro completo (contas a pagar/receber, DRE) — outro módulo, outra proposta.
- App nativo — o painel web já roda perfeito no celular do balcão.
- Integração com marketplaces (ML, Shopee) — só depois que a vitrine existir.

## 10. Ordem de execução proposta

1. **Fase A — Catálogo base** (categorias, marcas, produtos, imagens, preços). Entrega usável sozinha: já dá pra cadastrar e organizar o mix da loja.
2. **Fase B — Estoque + leitor de código de barras**.
3. **Fase C — Fornecedores e compras**.
4. **Fase D — Orçamentos/balcão com PDF e WhatsApp**.
5. **Fase E — Vitrine pública** (só após aprovação do Ricardo).

Cada fase é entregue fechada, testada e integrada ao dashboard antes da próxima começar.

---

## Detalhes técnicos (resumo pra referência)

- Tabelas novas no schema `public`: `categories`, `brands`, `products`, `product_images`, `product_barcodes`, `stock_locations`, `stock_movements`, `suppliers`, `purchase_orders`, `purchase_order_items`, `quotes`, `quote_items`. Todas com RLS + GRANT explícito (leitura pública só na Fase E e só em `products` ativos).
- Bucket `product-images` privado, servido por URL assinada no admin; público apenas na Fase E.
- Views materializadas para saldo de estoque e "top produtos consultados".
- Leitor de código de barras: `BarcodeDetector` + fallback `@zxing/browser`.
- Toda escrita passa por server functions com `requireSupabaseAuth` + checagem de papel.

## Confirmação

Se aprovar, começo pela **Fase A (catálogo base)** já no próximo passo: modelagem no banco, tela de listagem, formulário de produto e upload de imagens. Nada disso vaza pro site público.
