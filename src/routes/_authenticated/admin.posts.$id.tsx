import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getAdminPost } from "@/lib/posts.functions";
import { PostForm } from "@/components/admin/PostForm";

export const Route = createFileRoute("/_authenticated/admin/posts/$id")({
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  const fn = useServerFn(getAdminPost);
  const { data: post, isLoading } = useQuery({
    queryKey: ["admin-post", id],
    queryFn: () => fn({ data: { id } }),
  });

  if (isLoading || !post) return <div>Carregando...</div>;

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