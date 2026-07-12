import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhats } from "@/components/shared/FloatingWhats";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { CtaButton } from "@/components/ui/CtaButton";
import {
  getPostBySlug,
  getRelatedPosts,
  formatDatePtBr,
  type BlogPost,
} from "@/lib/blog";
import { SITE_URL, WHATSAPP_URL, WHATSAPP_URL_ESPECIALISTA } from "@/lib/constants";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [
          { title: "Artigo não encontrado — Blog Russo" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const url = `${SITE_URL}/blog/${params.slug}`;
    return {
      meta: [
        { title: `${post.title} — Blog Russo Elétrica` },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(post.cover ? [{ property: "og:image" as const, content: post.cover }] : []),
        { property: "article:published_time", content: post.date },
        { property: "article:section", content: post.category },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { "@type": "Organization", name: post.author },
            publisher: {
              "@type": "Organization",
              name: "Russo Elétrica e Ferragens",
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/uploads/logo-russo.png`,
              },
            },
            mainEntityOfPage: url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: SITE_URL + "/blog" },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-black text-foreground">Artigo não encontrado</h1>
        <p className="mt-4 text-muted-foreground">
          Talvez o artigo tenha sido movido. Veja os últimos publicados.
        </p>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
        >
          Voltar ao blog
        </Link>
      </main>
      <Footer />
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-8">Erro: {error.message}</div>,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const related = getRelatedPosts(post.slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pb-24">
        <article className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 md:pt-16 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary hover:opacity-80"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao blog
          </Link>
          <span className="mt-6 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            {post.category}
          </span>
          <h1 className="mt-3 font-display text-4xl font-black leading-tight text-foreground md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {formatDatePtBr(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {post.readingMinutes} min de leitura
            </span>
            <span>Por {post.author}</span>
          </div>

          <div
            className="prose prose-slate mt-10 max-w-none prose-headings:font-display prose-headings:font-black prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <div className="mt-14 rounded-2xl border border-primary/30 bg-secondary p-8 text-secondary-foreground">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Pronto para resolver?
            </span>
            <h2 className="mt-3 font-display text-2xl font-black leading-tight text-white">
              Chama o especialista da Russo pelo WhatsApp
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Loja física na Av. Escola Politécnica, no Rio Pequeno. Atendemos consumidores,
              empresas e condomínios de toda a Zona Oeste de São Paulo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaButton
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-source="blog_post_cta"
              >
                Solicitar orçamento
              </CtaButton>
              <CtaButton
                href={WHATSAPP_URL_ESPECIALISTA}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                data-analytics-source="blog_post_specialist"
              >
                Falar com especialista
              </CtaButton>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-black text-foreground">
              Continue lendo
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r: BlogPost) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                    {r.category}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-black text-foreground group-hover:text-primary">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                    {r.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <FloatingWhats />
      <MobileCtaBar />
    </div>
  );
}