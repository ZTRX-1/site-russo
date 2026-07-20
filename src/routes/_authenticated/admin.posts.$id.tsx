import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, AlertTriangle } from "lucide-react";
import { getAdminPost } from "@/lib/posts.functions";
import { PostForm } from "@/components/admin/PostForm";

export const Route = createFileRoute("/_authenticated/admin/posts/$id")({
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-post", id],
    queryFn: () => getAdminPost({ id }),
    retry: 1,
  });

  if (isLoading) {
    return <div className="py-10 text-center text-sm text-muted-foreground">Carregando...</div>;
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
        <h2 className="mt-3 font-display text-lg font-bold">Post não encontrado</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Este post pode ter sido apagado ou o link está incorreto."}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => refetch()}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => navigate({ to: "/admin/posts" })}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground"
          >
            Voltar aos posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/posts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        {post.status === "published" && (
          <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:underline">
            Ver publicado <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <h1 className="font-display text-3xl font-black">Editar post</h1>
      <PostForm
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          description: post.description ?? "",
          content_html: post.content_html ?? "",
          category: post.category,
          cover_url: post.cover_url,
          status: post.status as "draft" | "published",
          published_at: post.published_at ?? null,
        }}
      />
    </div>
  );
}