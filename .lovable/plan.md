# Plano — Sistema Interno Russo (fase 2)

Vou entregar em 4 frentes. Antes de começar, 2 pontos importantes que preciso alinhar (respondo abaixo com as decisões que vou tomar se você não disser o contrário):

**Decisões que vou assumir (me avise se quiser mudar):**

1. **Login sem Google** → passa a ser **apenas email + senha**. Como o primeiro admin (`vexxoncompany@gmail.com`) hoje só existe via Google, vou criar um fluxo onde você define uma senha na primeira entrada (ou eu já crio o usuário admin com uma senha temporária que você troca depois). **Sugiro:** eu crio agora `vexxoncompany@gmail.com` com senha temporária `Russo@2026` e você troca no primeiro login.
2. **Tracking** → será **first-party** (armazenado no seu próprio banco, sem depender de Google). Coletamos: página, referrer, UTM (source/medium/campaign/term/content), gclid/fbclid, user-agent, país/cidade aproximados (via IP → geoip leve), dispositivo, cliques em CTAs (WhatsApp, telefone, formulário), duração e origem do lead. **Sem coleta de dado sensível — em conformidade com LGPD**, respeitando o consentimento de cookies que já existe no site.

---

## 1. Autenticação — remover Google

- Desabilitar provider Google no Supabase Auth.
- Remover botão "Continuar com Google" da tela `/auth` e o wrapper `lovable.auth.signInWithOAuth`.
- Manter só o formulário email + senha.
- Criar/atualizar o usuário `vexxoncompany@gmail.com` com senha temporária e promover a admin no mesmo momento (via Auth Admin API server-side).
- Ajustar copy da tela para "Acesso restrito da equipe Russo".

## 2. Blog público — corrigir "3 cards vazios"

Investigar por que `/blog` mostra containers em branco. Causas prováveis:

- Loader isomorfico chamando função com bearer (falha em SSR anônimo).
- `ssr:false` mostrando skeleton permanente porque `useQuery` está com `enabled:false` ou key errada.
- RLS: policy `TO anon` faltando em `posts` (Data API retorna vazio).

**Correções previstas:**

- Garantir policy pública de SELECT em `posts` para status `published` (via migração se faltar).
- Ajustar `blog.index.tsx` para SSR real: loader usa `listPublishedPosts` (função pública com publishable key) via `ensureQueryData`, e componente usa `useSuspenseQuery`. Isso deixa o HTML já vir com os posts (bom para SEO também).
- Idem para `blog.$slug.tsx`.
- Adicionar estado de "nenhum post publicado ainda" só quando a query realmente retorna array vazio.

## 3. Editor de posts — capa + UX

- **Upload de imagens** via Supabase Storage:
  - Bucket público `blog-media` (criar via tool).
  - Componente de upload no `PostForm` (drag & drop + botão) → salva em `blog-media/covers/<uuid>.<ext>` → retorna URL pública para `cover_url`.
  - Mesmo componente disponível dentro do `RichTextEditor` para inserir imagens no corpo do post.
- **UX do painel:**
  - Preview lado-a-lado do post enquanto edita.
  - Botão claro de "Publicar / Despublicar / Voltar para rascunho" (pausar = mudar status para `draft`).
  - Badge de status colorido, contagem de palavras, tempo estimado de leitura.
  - Auto-save de rascunho a cada 20s (opcional; ligado por padrão).
  - Campo de "categoria" com autocomplete das categorias já usadas.
  - Slug editável com preview da URL final.

## 4. Módulo de Analytics interno (estilo UTMfy) + Relatórios PDF

### Coleta (client → server)

- Script leve `src/lib/tracker.ts` (respeita consentimento de cookies existente).
- Captura em cada page view:
  - path, referrer, UTM completos, gclid/fbclid, viewport, device, sessão (uuid em `sessionStorage`), visitor id (uuid em `localStorage`).
- Captura em eventos:
  - `whatsapp_click` (já existe no `analytics.ts`, ligar ao endpoint interno também).
  - `phone_click`, `form_submit`, `cta_click` (Hero, Contato, QuickQuote, MobileCtaBar, FloatingWhats), `outbound_click`.
- Envio para `POST /api/public/track` (server route) em batch com `navigator.sendBeacon`.

### Banco (nova migração)

- `analytics_visitors` — id anônimo, primeira visita, primeiro referrer/UTM, país/cidade (via header `cf-ipcountry` quando disponível).
- `analytics_sessions` — sessão, visitor_id, início/fim, dispositivo, UTM daquela sessão.
- `analytics_events` — session_id, tipo (`page_view` | `click` | `conversion`), path, target, meta jsonb, created_at.
- `analytics_leads` — quando envia formulário ou clica WhatsApp: registra origem completa (UTM + referrer + primeiro touch + last touch).
- Índices por `created_at`, `session_id`, `event_type`, `utm_source`.
- RLS: escrita só via server route (service_role); leitura só para admin.

### Dashboard interna (`/admin/analytics`)

- Cards principais: visitantes únicos, sessões, page views, conversões (WhatsApp + form), taxa de conversão, tempo médio.
- Filtros: intervalo (hoje / 7d / 30d / mês / trimestre / semestre / ano / custom).
- Gráficos (recharts, já disponível): série temporal, top páginas, top fontes de tráfego, top UTMs, top palavras-chave (via `utm_term` + `q` de referrers Google), mapa de dispositivos, funil (visita → clique CTA → conversão).
- Tabela de leads recentes com origem detalhada de cada um.

### Relatórios em PDF

- Página `/admin/analytics/report` com seletor de período (diário, semanal, mensal, trimestral, semestral, anual, custom).
- Botão "Gerar PDF" → chama server function que:
  - Agrega dados do período.
  - Renderiza PDF server-side com `pdf-lib` (Worker-compat) — capa com logo Russo, KPIs, gráficos (renderizados como SVG → embutidos), tabela de leads, principais campanhas.
  - Retorna download direto.
- Layout do PDF alinhado à identidade visual (preto/branco/vermelho, tipografia display).

---

## Ordem de execução

1. **Fix urgente**: blog público (RLS + loader) e remover Google login. Isso destrava você imediatamente.
2. **Upload de capas + UX editor**.
3. **Módulo de tracking** (banco + coleta + endpoint).
4. **Dashboard `/admin/analytics**`.
5. **Relatórios PDF**.

## Detalhes técnicos (para referência)

- Google Provider: `supabase--configure_social_auth` com `disable_providers: ["google"]`.
- Storage: bucket público `blog-media` via `supabase--storage_create_bucket`; policies só de INSERT para `authenticated` staff.
- Tracker: endpoint em `src/routes/api/public/track.ts`, valida payload com Zod, escreve com `supabaseAdmin` (dentro do handler).
- Consentimento: se `CookieConsent` = denied, só grava `page_view` sem cookies persistentes (id de sessão volátil).
- Geolocalização: sem serviço externo pago — usar cabeçalhos `x-vercel-ip-country` / `cf-ipcountry` quando existirem; caso contrário deixar `unknown`.
- PDF: `pdf-lib` (compatível com Cloudflare Worker), sem dependências nativas.
- Papel `editor` continua podendo publicar posts; só admin acessa `/admin/analytics` e relatórios.

## Fora do escopo (para depois)

- Estoque / código de barras / ERP interno.
- Comparativo A/B de campanhas.
- Email marketing.

**Confirma que posso seguir com a senha temporária `Russo@2026` para `vexxoncompany@gmail.com` e com essas premissas de tracking?** Se sim, sigo direto pela ordem acima. Se preferir outra senha ou outro escopo de tracking, me diz antes que eu ajusto.