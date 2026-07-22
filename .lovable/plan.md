# Plano estratégico — Russo Elétrica & Ferragens

Três frentes, executadas **uma por vez**, na ordem que você pediu. Nada é aplicado agora; este documento é só o mapa. Aprove e eu inicio pela Fase 1.

---

## Fase 1 — PRIORIDADE: Corrigir o tracking (analytics interno)

**Sintoma:** 14 conversões vieram pelo site e nenhuma apareceu no `/admin/analytics`.

### Diagnóstico provável (a confirmar com logs reais)
1. O filtro de "dev/preview" no `src/routes/api/public/track.ts` pode estar descartando tráfego legítimo do domínio publicado (falso positivo em `Origin`/`Referer`).
2. O cliente (`src/lib/analytics.ts`) pode estar bloqueando o envio no domínio de produção por causa da heurística de hostname.
3. Possível falha silenciosa na escrita no banco (o `catch` só faz `console.warn`, o retorno continua `ok:true` e a gente nunca fica sabendo).
4. Eventos de conversão (clique WhatsApp, envio de formulário) podem não estar sendo disparados nos handlers dos botões/forms.

### O que farei na Fase 1
- Auditar cada CTA que deveria contar conversão (WhatsApp header/hero/floating, formulário de orçamento, telefones) e garantir chamada de `track('conversion', ...)` com `target` padronizado.
- Revisar `src/routes/api/public/track.ts`: reduzir o filtro a `localhost` puro; nunca bloquear `russoeletrofer.com.br`; logar no console do servidor quando pular.
- Revisar `src/lib/analytics.ts`: só suprimir em `localhost`/`127.0.0.1`. Domínios `.lovable.app`/`.lovable.dev` só suprimir em preview do editor, não no publicado.
- Consultar `analytics_events` e `analytics_leads` das últimas 72h para validar de onde veio a perda (chegou request? gravou visitor mas não event? etc.).
- Corrigir a causa real com base nesses dados e validar via Playwright disparando conversão de produção-like.
- Backfill não é possível (dados perdidos), mas deixarei um alerta visual no dashboard caso a taxa de escrita caia a zero por >6h.

**Entrega:** conversões voltando a contar em tempo real + guarda anti-regressão.

---

## Fase 2 — Reposicionamento do acesso à área interna

Objetivo: acesso invisível para o visitante comum, óbvio para você, sem conflitar com o balão do WhatsApp/CTA mobile.

**Solução proposta:** remover o cadeado. Transformar o próprio símbolo **©** do rodapé em link para `/auth` — mesma cor do texto legal, sem sublinhado, sem tooltip. Além disso, adicionar um "atalho de teclado" (ex.: `Ctrl+Shift+A`) que abre `/auth` de qualquer página — útil para você no dia a dia.

Fallback alternativo (se preferir): dot `•` clicável entre os itens de menu do rodapé.

Aplicação: `src/components/layout/Footer.tsx` + pequeno hook global de atalho.

---

## Fase 3 — Catálogo / Estoque / Loja (base do futuro ERP interno)

Fundação pensada para escalar até virar o sistema interno oficial da Russo.

### Escopo do módulo (público)
- Página `/loja` (grade de produtos com busca, filtro por categoria, ordenação).
- Página `/loja/categoria/:slug`.
- Página `/loja/produto/:slug` com galeria, ficha técnica, preço (ou "consultar"), botão "Pedir no WhatsApp" que já leva a mensagem pronta com nome/SKU.
- SEO por produto (title, description, OG, JSON-LD `Product`).
- Sem checkout — conversão via WhatsApp/orçamento (compatível com a operação atual).

### Escopo do módulo (interno — `/admin/catalogo`)
- CRUD de **Categorias** (nome, slug, ícone, ordem).
- CRUD de **Produtos**: nome, slug, SKU, código de barras (EAN), categoria, marca, descrição rica, especificações (chave/valor), preço, preço promocional, unidade (un, m, kg, cx), imagens múltiplas (Supabase Storage), status (rascunho/publicado/inativo).
- **Estoque**: quantidade atual, estoque mínimo, localização (prateleira/gôndola), histórico de movimentações (entrada, saída, ajuste, motivo, usuário, data).
- **Leitor de código de barras**: input focado + biblioteca `@zxing/browser` para ler pela câmera do celular/webcam. Fluxos:
  - Buscar produto rapidamente (bipa e abre).
  - Dar entrada em estoque (bipa + quantidade).
  - Dar baixa (venda balcão / consumo).
- **Importação em massa** por CSV (para popular o catálogo inicial rápido).
- **Relatórios**: produtos mais vistos, mais pedidos via WhatsApp, estoque baixo, valor total do estoque.

### Arquitetura de dados (a criar quando aprovado)
```text
categories(id, name, slug, icon, sort_order, created_at)
brands(id, name, slug)
products(id, sku, barcode, name, slug, category_id, brand_id,
        description, specs jsonb, price_cents, sale_price_cents,
        unit, status, cover_url, created_at, updated_at)
product_images(id, product_id, url, sort_order)
stock_items(product_id PK, quantity, min_quantity, location, updated_at)
stock_movements(id, product_id, delta, reason, note, user_id, created_at)
product_events(id, product_id, event_type, visitor_id, created_at)
```
Tudo com RLS: leitura pública apenas de `status='published'`, escrita só para roles `admin`/`editor` (já existe `is_staff`).

### Integração com o resto
- WhatsApp: cada produto gera link `wa.me/...?text=Olá, quero orçamento do produto <NOME> (SKU <SKU>)`.
- Analytics: `product_view` e `product_whatsapp_click` já entram no funil do dashboard.
- Blog: possibilidade de linkar produtos dentro de artigos ("materiais recomendados").

### Faseamento sugerido do módulo
1. Schema + CRUD admin básico (categorias, produtos, imagens).
2. Página pública `/loja` + produto individual.
3. Estoque + movimentações + leitor de código de barras.
4. Importação CSV + relatórios internos.

Cada sub-fase é entregue e revisada antes da próxima.

---

## Ordem de execução aprovada

1. **Fase 1 — Tracking** (começamos por aqui assim que você aprovar).
2. **Fase 2 — Acesso discreto** (pequeno, entra junto ou logo depois).
3. **Fase 3 — Catálogo/Estoque** (dividido nas 4 sub-fases acima).

Confirma que posso iniciar pela Fase 1?