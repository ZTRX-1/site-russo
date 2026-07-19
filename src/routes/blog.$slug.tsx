import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhats } from "@/components/shared/FloatingWhats";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { CtaButton } from "@/components/ui/CtaButton";
import { getPublishedPost, formatDatePtBr } from "@/lib/blog.functions";
import { SITE_URL, WHATSAPP_URL, WHATSAPP_URL_ESPECIALISTA } from "@/lib/constants";

const publishedPostQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["public-post", slug],
    queryFn: () => getPublishedPost({ data: { slug } }),
  });

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(publishedPostQueryOptions(params.slug));
    if (!data.post) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    if (!post) {
      const url = `${SITE_URL}/blog/${params.slug}`;
      return {
        meta: [
          { title: `Artigo, Blog Russo Elétrica` },
          { property: "og:url", content: url },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const url = `${SITE_URL}/blog/${post.slug}`;
    return {
      meta: [
        { title: `${post.title}, Blog Russo Elétrica` },
        { name: "description", content: post.description || "Artigo técnico da Russo Elétrica e Ferragens." },
        { property: "og:title", content: `${post.title}, Blog Russo Elétrica` },
        { property: "og:description", content: post.description || "Artigo técnico da Russo Elétrica e Ferragens." },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(post.cover_url ? [{ property: "og:image", content: post.cover_url }] : []),
        { name: "twitter:card", content: post.cover_url ? "summary_large_image" : "summary" },
      ],
      links: [{ rel: "canonical", href: url }],
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
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(publishedPostQueryOptions(slug));

  const post = data?.post;
  if (!post) {
    throw notFound();
  }

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
              <Calendar className="h-3.5 w-3.5" /> {formatDatePtBr(post.published_at)}
            </span>
            {post.author_name && <span>Por {post.author_name}</span>}
          </div>

          {post.cover_url && (
            <img src={post.cover_url} alt={post.title} className="mt-8 w-full rounded-2xl object-cover" />
          )}

          <div
            className="prose prose-slate mt-10 max-w-none prose-headings:font-display prose-headings:font-black prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
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
      </main>
      <Footer />
      <FloatingWhats />
      <MobileCtaBar />
    </div>
  );
}