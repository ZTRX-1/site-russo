
# Refino Premium — Home Russo (v2, com foco em conversão)

Nenhuma página nova. Foco: **percepção de valor, performance, conversão e consistência**. Copy revisada conforme suas correções — nenhuma promessa operacional que não possamos garantir.

---

## 1. Performance (auditoria e enxugamento)

**Hoje pesa:** `index.tsx` monolítico (~950 linhas), 8 pesos de fonte, imagens sem `width/height`/`lazy`, blur pesado, mapa embed eager, scroll listener sem `passive`.

**Ações:**
- Fontes: reduzir a Barlow Condensed **700, 900** + Inter **400, 600**. `font-display: swap` + `<link rel="preload">` para o WOFF2 da display.
- LCP: fachada do hero com `fetchpriority="high"`, `width`/`height` explícitos, `decoding="async"`.
- `loading="lazy"` + `decoding="async"` em toda imagem fora do hero.
- Blur reduzido `[120px] → [80px]` (idêntico visualmente, muito mais leve em GPU mobile).
- Iframe do Google Maps com `loading="lazy"` e montado só quando a seção entra em viewport.
- Scroll listener com `{ passive: true }` + `requestAnimationFrame`.
- Componentizar a Home: cada seção em `src/components/home/*.tsx` — habilita code-splitting automático do TanStack e enxuga o bundle inicial.

## 2. Identidade visual — refinar, não redesenhar

- **Regra "2 efeitos premium por seção"**: hoje há grid + halos + glass + linhas glow + card-premium + shine simultâneos. Reduzir para no máximo 2 por seção.
- **Radius padrão**: apenas `rounded-md` (botões/inputs), `rounded-xl` (cards médios), `rounded-2xl` (cards hero). Nada fora disso.
- **Sombras padrão**: apenas `--shadow-card`, `--shadow-elegant`, `--shadow-industrial`. Remover uso ad-hoc.
- **Respiro vertical uniforme**: `py-16 md:py-24` em todas as seções.
- **Divisores**: apenas 1 `red-glow-line` (hero → primeira seção). Resto usa alternância sutil de background.

## 3. Tipografia — escala estrita e única

- H1: `text-5xl md:text-7xl leading-[1.02]`
- H2: `text-3xl md:text-5xl leading-tight`
- H3: `text-xl md:text-2xl`
- Corpo: `text-base md:text-lg leading-relaxed text-muted-foreground`
- Eyebrow: `text-[11px] font-bold uppercase tracking-[0.22em] text-primary`
- **Eliminar** `text-[8px]`/`text-[9px]` (ilegíveis em mobile). Mínimo `text-[11px]`.

## 4. Copy revisada (com suas correções)

**Hero (mantido, com pequeno polimento):**
- H1: **"A referência em materiais elétricos, ferragens e soluções para obras na Zona Oeste de São Paulo."**
- Sub: **"Atendimento técnico, grande variedade de produtos e estrutura preparada para consumidores, empresas, condomínios e profissionais."**

**Diferenciais (sem promessas operacionais):**
- ✅ "Atendimento especializado" (não "vendedor técnico no balcão")
- ✅ "Grande variedade em estoque" (não "retirada em X minutos")
- ✅ "Emissão de nota fiscal" (fato, sem prazo)
- ✅ "Faturamento para empresas e condomínios"
- ✅ "Loja física no Rio Pequeno há décadas"
- ✅ "5.0 no Google — mais de 127 avaliações" (prova real)

**Micro-copy sob CTAs:** *"Atendimento durante o horário comercial."* (não "resposta em minutos").

**CTAs padronizados em toda a Home — apenas 2:**
- Primário: **Solicitar orçamento**
- Secundário: **Falar com especialista**

Cada seção revisada perguntando: *"esta frase reduz objeção ou gera autoridade?"* Se não, cortada.

## 5. UX — fluxo de decisão

Reordenar a Home para funil claro:
1. Hero
2. Clientes/parceiros (prova social visual)
3. QuickQuote (segmentação de perfil)
4. Categorias (o que vendemos)
5. Diferenciais (por que Russo)
6. Atendemos (para quem — B2B em destaque)
7. Orçamento corporativo (conversão B2B)
8. Avaliações (prova textual)
9. Localização + Contato

Manter **apenas 1 CtaBar** (entre Diferenciais e Avaliações). Remover a duplicada.

## 6. Mobile — sensação de app

- Botões mínimo `h-12` (target Apple/Google).
- H1 mobile: `text-5xl leading-[1.05]`, copy encurtada para caber em 3 linhas no iPhone SE.
- Hero: cards flutuantes (Elétrica/Hidráulica/LED/Estrutura) só a partir de `lg`. Em mobile, apenas imagem + 1 badge.
- Header mobile: botão WhatsApp visível ao lado do logo.
- Footer mobile: barra CTA fixa inferior discreta ("Solicitar orçamento").
- **FloatingWhats mantido** — trocar o círculo padrão pelo **mascote da Russo** (você me envia o PNG, ou reutilizo o logo enquanto o mascote não chega). Diferencia e reforça marca.
- Todos os links de nav/footer com `min-h-11`.

## 7. SEO técnico (sem novas páginas)

- Preload da fonte display + `dns-prefetch` para `fonts.gstatic.com` e `maps.google.com`.
- `og:image` absoluto único e validado por página.
- Schema `LocalBusiness` já bom — adicionar `hasOfferCatalog` com categorias reais.
- `alt` descritivo em todas as imagens (revisar duplicados).
- Auditar hierarquia: 1 H1, H2s consecutivos.
- `preconnect` para o iframe do Maps.

## 8. Otimização de conversão (nova etapa)

Auditoria seção-por-seção com 4 perguntas:
- *ajuda a decidir?* / *reduz objeção?* / *aumenta confiança?* / *incentiva contato?*

Se uma seção não responde "sim" a pelo menos 2, é simplificada ou removida. Resultado esperado:
- Prova social **acima da dobra** em mobile (badge 5.0 Google visível sem scroll).
- QuickQuote com destaque nos 2 perfis de maior ticket (Empresa, Condomínio) — cards B2B com selo dourado.
- CTA de WhatsApp presente em: header, hero, quickquote, categorias, orçamento corporativo, ctabar, contato, floating, mobile bar. Nunca mais de 8s de scroll sem CTA visível.
- Números concretos onde possível: "5.0 Google · 127 avaliações · Av. Escola Politécnica · Rio Pequeno".
- Objeções B2B endereçadas explicitamente: faturamento NF, cotação formal, vendedor dedicado, condições comerciais.

## 9. Consistência visual (nova etapa)

Passe global antes de finalizar:
- **Botões:** 1 componente `<CtaButton variant="primary|secondary|ghost" size="md|lg">` — todos os CTAs migram para ele. Fim das variações ad-hoc.
- **Cards:** 1 componente `<PremiumCard>` padrão (border, radius, sombra, hover). Variações por prop, não por className solta.
- **Ícones:** todos Lucide, `strokeWidth={1.75}`, tamanhos apenas `h-4/5/6`.
- **Espaçamentos:** stack vertical em múltiplos de 4 (`gap-2/4/6/8/12/16`).
- **Animações:** apenas 3 padrões — `animate-fade-up` (entrada), `hover-lift` (cards), `hover:bg-primary-dark` (botões). Nada mais.
- **Cores:** proibido `text-white`, `bg-black` fora dos tokens. Tudo via `text-foreground`, `bg-secondary`, etc.

## 10. Auditoria final (nova etapa)

Antes de encerrar, revisão em 4 lentes:
- **Diretor de UX:** cada seção tem propósito? Hierarquia clara? CTAs óbvios? Fluxo mobile fluido?
- **Diretor de Branding:** parece um sistema único? Nenhum componente "solto"? Fotos condizentes? Voz consistente?
- **SEO:** heading hierarchy, alts, schema, canonical, meta, performance (LCP/CLS).
- **Usuário comum:** entendo em 3s o que é? Sei como pedir orçamento? Sinto confiança?

Cada ponto encontrado é implementado antes de entregar.

---

## Entrega técnica

**Novos:**
- `src/components/home/{Hero,ClientesParceiros,Sobre,Atendemos,Categorias,OrcamentoCorporativo,Diferenciais,Avaliacoes,Localizacao,Contato}.tsx`
- `src/components/ui/CtaButton.tsx`
- `src/components/ui/PremiumCard.tsx`
- `src/components/layout/MobileCtaBar.tsx`

**Editados:**
- `src/routes/index.tsx` (orquestração + head, ~150 linhas)
- `src/routes/__root.tsx` (preload fonte, preconnect, pesos reduzidos)
- `src/components/layout/Header.tsx` (WhatsApp mobile)
- `src/components/shared/FloatingWhats` (mascote/logo em vez do círculo)
- `src/styles.css` (escala, tokens padronizados, remoção de utilitários órfãos)

**Não mexemos:**
- Rotas legais, landing pages criadas, sitemap, WhatsApp constants, cookie consent, GA/GTM, error boundaries, rotas `/atendimento-*` e `/material-eletrico-rio-pequeno`.

**Verificação:**
- Typecheck (`tsgo`).
- Playwright screenshots desktop (1280) e mobile (390) da Home.
- Checagem visual: LCP visível < 2.5s, sem CLS perceptível, cada CTA a ≤ 1 dobra de distância.

---

**Pergunta rápida antes de executar:** você tem o PNG do mascote pronto? Se sim, me passa (drag & drop). Se não, uso o logo Russo no FloatingWhats como transição e trocamos pelo mascote quando você tiver.
