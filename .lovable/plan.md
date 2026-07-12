
# Ajustes estratégicos: SEO, Analytics e Blog

Três frentes, executadas em uma leva só. Zero formulário — todo caminho de conversão termina no WhatsApp.

---

## 1. Reposicionamento das landing pages (SEO Local)

Hoje existem 3 rotas órfãs — criadas, mas sem link em lugar nenhum do site:
- `/atendimento-empresas`
- `/atendimento-condominios`
- `/material-eletrico-rio-pequeno`

Google até indexa, mas sem link interno elas viram "ilhas" — pesam pouco no ranking e não capturam o tráfego que já chega na home.

**Decisão:** transformar em **páginas de verdade**, integradas à arquitetura do site.

**O que muda:**
- **Renomear e reposicionar:**
  - `/atendimento-empresas` → **`/empresas`** (mais curto, mais forte comercialmente)
  - `/atendimento-condominios` → **`/condominios`**
  - `/material-eletrico-rio-pequeno` → **`/rio-pequeno`** (âncora geográfica, ranqueia igual mas fica limpa no menu)
  - Redirect 301 das rotas antigas → sem perda de SEO.
- **Menu do Header:** adicionar link direto para **Empresas** e **Condomínios** (públicos B2B de maior ticket).
- **Footer:** bloco "Soluções" linkando todas as 3 páginas + âncoras da home.
- **Home:** cards da seção `Atendemos` viram links reais para `/empresas` e `/condominios` (hoje só rolam para uma âncora).
- **CTA de cada landing:** só WhatsApp (mensagem pré-preenchida segmentada por perfil — "Olá, sou responsável por um condomínio…"). Sem formulário.
- **Interlinking:** cada landing referencia as outras duas + home. Estrutura de link interno bem feita = Google entende que é um site institucional coeso, não um portal de landing pages.

**Por que isso é melhor que criar mais landings:**
- Concentra autoridade nas páginas certas (menos, mas mais fortes).
- Cada página vira parte real da navegação → tempo de sessão sobe → sinal de qualidade para o Google.
- URLs mais curtas ranqueiam melhor e são mais fáceis de compartilhar.

---

## 2. Analytics & Tag Manager — infraestrutura pronta para o Ricardo colar as tags

Preparar tudo tecnicamente, sem tag ativa ainda. Quando o Ricardo passar os IDs, você só cola em 2 lugares.

**O que fica montado:**
- **`GoogleTagManager` component** carregado no `__root.tsx` — lê `VITE_GTM_ID` do env. Se vazio, não injeta nada (zero impacto em dev/preview). Quando você preencher o ID, GTM aparece automaticamente em `<head>` + `<noscript>` no body, no padrão oficial.
- **`GoogleAnalytics` component** (GA4) — mesma lógica com `VITE_GA_ID`. Suporta rota-a-rota (SPA precisa disparar `page_view` manual em cada navegação — vou wire isso no router).
- **Camada de eventos (`trackEvent`)** — um helper único que dispara para GTM `dataLayer` e GA4. Todos os CTAs do site (WhatsApp header, hero, cards, floating, mobile bar, landing pages) passam a chamar `trackEvent('whatsapp_click', { source: 'hero' })`. Quando o GA estiver ativo, você já tem métricas por origem do clique — sem tocar em nenhum componente depois.
- **Google Search Console + verificação:** adicionar `<meta name="google-site-verification">` no `<head>` do root, controlado por env `VITE_GSC_VERIFICATION`. Ricardo cola o token, deploy, verifica.
- **Consentimento (LGPD):** o `CookieConsent` já existe — vou plugar nele o "Consent Mode v2" do Google (`gtag('consent', 'default', ...)`). Sem consentimento, tags carregam em modo anônimo. Com consentimento, viram tracking completo. Compliance nativa.

**Arquivos:**
- `src/lib/analytics.ts` — helper `trackEvent`, `pageView`, `setConsent`.
- `src/components/analytics/GoogleTagManager.tsx`
- `src/components/analytics/GoogleAnalytics.tsx`
- `.env.example` documentando `VITE_GTM_ID`, `VITE_GA_ID`, `VITE_GSC_VERIFICATION`.

---

## 3. Blog — estrutura pronta, conteúdo depois

Blog institucional focado em intenção local + autoridade técnica. Ricardo escreve, você publica.

**Arquitetura simples e escalável (sem CMS externo):**
- **Rota `/blog`** — listagem com cards (título, resumo, imagem, categoria, data, tempo de leitura).
- **Rota `/blog/$slug`** — post individual com H1, sumário, corpo em markdown, autor, CTA final para WhatsApp segmentado pelo tema do post.
- **Fonte de conteúdo:** arquivos `.md` em `src/content/blog/`. Cada post tem frontmatter (título, slug, data, categoria, resumo, cover, keyword-alvo). Zero backend, zero banco. Adicionar post = adicionar arquivo.
- **SEO on-page automático:** `head()` de cada post gera title, description, `og:image`, JSON-LD `Article`, canonical.
- **Sitemap:** posts entram automaticamente no `sitemap.xml`.
- **Sidebar/Related:** últimos 3 posts + link para landing relacionada (post sobre "disjuntor em condomínio" → link para `/condominios`).
- **Menu:** "Blog" no header desktop + no footer.

**Pauta sugerida para o Ricardo** (2-3 posts iniciais para você mostrar a ele):
- "Como escolher o disjuntor certo para o seu apartamento no Rio Pequeno"
- "Manutenção elétrica preventiva em condomínios: checklist do síndico"
- "Materiais elétricos para reforma na Zona Oeste: o que comprar antes de começar"

Cada post vem com CTA final direto para WhatsApp com mensagem contextualizada.

---

## 4. Auditoria SEO final (junto com as mudanças)

- Confirmar `canonical` self-referencing em todas as rotas.
- `hreflang` = pt-BR consistente.
- `robots.txt` já OK, mas incluir `Sitemap:` (já tá).
- Adicionar `BreadcrumbList` JSON-LD em landings e posts do blog.
- Schema `LocalBusiness` estendido com `areaServed` (Rio Pequeno, Butantã, Vila São Francisco, Raposo Tavares, USP).

---

## Entrega técnica

**Novos:**
- `src/components/analytics/GoogleTagManager.tsx`
- `src/components/analytics/GoogleAnalytics.tsx`
- `src/lib/analytics.ts`
- `src/routes/empresas.tsx` + `src/routes/condominios.tsx` + `src/routes/rio-pequeno.tsx`
- `src/routes/atendimento-empresas.tsx` etc. → **redirect 301** para as novas.
- `src/routes/blog.tsx` (listagem) + `src/routes/blog.$slug.tsx` (post)
- `src/content/blog/*.md` (2-3 posts iniciais de exemplo)
- `src/lib/blog.ts` (loader/parser dos markdowns)
- `.env.example`

**Editados:**
- `src/components/layout/Header.tsx` — links Empresas, Condomínios, Blog
- `src/components/layout/Footer.tsx` — bloco Soluções + Blog
- `src/components/home/Atendemos.tsx` — cards viram links
- `src/routes/__root.tsx` — inject GTM/GA/GSC via env
- `src/components/shared/CookieConsent.tsx` — Consent Mode v2
- Todos os CTAs de WhatsApp → passam a chamar `trackEvent`
- `src/routes/sitemap[.]xml.ts` — inclui blog posts + novas rotas
- `src/router.tsx` — hook de `pageView` no route change

**Verificação:**
- `tsgo` typecheck.
- Playwright: navegar home → clicar "Empresas" no menu → verificar landing → clicar CTA → confirmar `dataLayer.push` no console.
- Confirmar que sem `VITE_GTM_ID` nada é injetado (dev limpo).

---

**Confirma que posso executar?** Assim que aprovar, entrego tudo em uma leva. Blog vai com 2 posts de exemplo (você depois substitui pelos do Ricardo).
