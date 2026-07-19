# Refino do Painel Administrativo — Russo Elétrica & Ferragens

Vou evoluir o painel em 4 frentes, sem quebrar nada existente nem sair do escopo pedido.

---

## 1. Dashboard operacional (novo)

Substituir o dashboard atual (só do blog) por uma central de gestão estilo SaaS moderno, usando os dados reais que já são coletados pelo tracking (`analytics_visitors`, `analytics_sessions`, `analytics_events`, `analytics_leads`) + tabela `posts`.

**Cards e indicadores (com dados reais quando existirem):**
- Visitantes únicos (7d)
- Sessões ativas nas últimas 24h ("usuários ativos")
- Cliques no botão do WhatsApp (eventos `target = whatsapp_*`)
- Total de posts publicados
- Total de visualizações de artigos (`page_view` em `/blog/*`)
- Origem do tráfego (Google Ads, Orgânico, Direto, Referência) — gráfico donut
- Últimos acessos (últimos 8 pageviews)
- Comparativo 7d / 30d / 90d com **variação % vs. período anterior**
- Placeholder "Produtos/categorias mais acessadas" já estruturado para quando existir catálogo

**Ações Rápidas:** botões para Criar post, Gerenciar posts, Ver Analytics, Gerenciar equipe, Configurações (as futuras já pré-linkadas).

Toda a lógica fica em uma nova server function `getDashboardOverview()` reaproveitando padrão existente. Layout responsivo, mesma identidade visual do admin atual.

---

## 2. Posts (Blog)

O formulário de edição (`PostForm.tsx`) **já suporta** título, slug, categoria, conteúdo, meta descrição, capa e status. Vou complementar com:

- Campo **"Data de publicação"** editável (novo).
- Ação de **excluir** direto na listagem (`admin/posts`) — sem precisar abrir cada post.
- Botão de **editar rápido** na listagem.
- Coluna com **capa em miniatura** na tabela.

**Server functions:** adicionar `published_at` no schema `updatePost`/`createPost`.

**Imagens dos 5 posts existentes sem capa** + **5 novos posts:**
- Gerar 10 imagens de capa 1600×900 com identidade visual da Russo (vermelho `#e11d2e`, tipografia bold, tema técnico/elétrico), salvas via `lovable-assets`.
- Fazer UPDATE nos 5 posts sem capa com as novas URLs.
- Criar 5 novos posts SEO-first (~800-1200 palavras cada) com H2/H3, CTA e palavras-chave, sobre:
  1. Como economizar energia em condomínios
  2. Principais erros em instalações elétricas comerciais
  3. Como escolher materiais elétricos de qualidade
  4. Quando trocar disjuntores e componentes elétricos
  5. Como empresas reduzem custos com manutenção elétrica
- Publicados via `supabase--insert` com `status='published'`, autor "Equipe Russo".

---

## 3. Analytics — filtrar tráfego de desenvolvimento

Hoje o endpoint `/api/public/track` aceita qualquer origem. Vou:

- No **cliente** (`src/lib/analytics.ts`): não disparar tracking quando `window.location.hostname` for `localhost`, `127.0.0.1`, terminar em `.lovable.dev`, `.lovable.app` (preview), ou conter `preview--`.
- No **servidor** (`src/routes/api/public/track.ts`): defesa em profundidade — inspecionar `Origin`/`Referer` do request e descartar (200 OK sem gravar) quando vier dessas mesmas origens de dev/preview.
- Os relatórios existentes (`getAnalyticsOverview`, PDF) não mudam — passam a receber só dados reais automaticamente.

Só **novos** eventos serão filtrados. Registros antigos ficam no banco (posso adicionar uma limpeza opcional se você pedir).

---

## 4. Código

- Não mexer em componentes fora dos arquivos citados.
- Manter responsividade e tokens de design atuais.
- Reaproveitar `useServerFn` + TanStack Query no padrão que já existe.
- Nenhuma alteração de auth, layout público, home, ou site externo.

---

## Arquivos afetados

**Novos**
- `src/lib/dashboard.functions.ts` — server fn de agregação para o Dashboard
- 10 imagens de capa via `lovable-assets`
- Migração `supabase--insert` com 5 novos posts + UPDATE das 5 capas faltantes

**Modificados**
- `src/routes/_authenticated/admin.index.tsx` — dashboard reformulado
- `src/routes/_authenticated/admin.posts.index.tsx` — miniatura, editar rápido, excluir
- `src/components/admin/PostForm.tsx` — campo data de publicação
- `src/lib/posts.functions.ts` — aceitar `published_at`
- `src/lib/analytics.ts` — filtro de origens dev/preview
- `src/routes/api/public/track.ts` — filtro server-side de origens dev/preview

Confirma que posso seguir?
