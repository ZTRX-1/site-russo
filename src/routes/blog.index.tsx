import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhats } from "@/components/shared/FloatingWhats";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { listPublishedPosts, formatDatePtBr } from "@/lib/blog.functions";
import { SITE_URL } from "@/lib/constants";

const TITLE = "Blog Russo Elétrica — Dicas técnicas e guias para a Zona Oeste de SP";
const DESCRIPTION =
  "Conteúdo prático sobre materiais elétricos, manutenção predial, dimensionamento, iluminação e obras na Zona Oeste de São Paulo. Escrito por quem atende o Rio Pequeno todos os dias.";

export const Route = createFileRoute("/blog/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/blog" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const fn = useServerFn(listPublishedPosts);
  const { data, isLoading } = useQuery({ queryKey: ["public-posts"], queryFn: () => fn() });
  const posts = data?.posts ?? [];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pb-24">
        <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/15 blur-[80px]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Blog Russo
            </span>
            <h1 className="mt-3 font-display text-4xl font-black leading-tight text-white md:text-5xl">
              Conteúdo técnico para quem constrói, mantém e reforma
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
              Guias práticos, checklists e dicas de quem atende a Zona Oeste de São Paulo
              todos os dias — sem promessa vazia, com o que realmente resolve.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl border border-border bg-card/50"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground">Novos conteúdos em breve.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-[var(--shadow-industrial)]"
                >
                  {p.cover_url && (
                    <img src={p.cover_url} alt={p.title} className="h-48 w-full object-cover" loading="lazy" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                      {p.category}
                    </span>
                    <h2 className="mt-3 font-display text-xl font-black leading-tight text-foreground group-hover:text-primary">
                      {p.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDatePtBr(p.published_at)}
                      </span>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                      Ler artigo
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <FloatingWhats />
      <MobileCtaBar />
    </div>
  );
}