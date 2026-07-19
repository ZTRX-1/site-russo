import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, ImageOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { listAdminPosts, deletePost } from "@/lib/posts.functions";

export const Route = createFileRoute("/_authenticated/admin/posts/")({
  component: PostsList,
});

function PostsList() {
  const fn = useServerFn(listAdminPosts);
  const delFn = useServerFn(deletePost);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-posts"], queryFn: () => fn() });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Apagar "${title}"?\n\nEssa ação não pode ser desfeita.`)) return;
    setDeletingId(id);
    try {
      await delFn({ data: { id } });
      toast.success("Post apagado.");
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      qc.invalidateQueries({ queryKey: ["dashboard-overview"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black">Posts</h1>
          <p className="text-sm text-muted-foreground">Gerencie os artigos do blog.</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Novo post
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Capa</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3 hidden md:table-cell">Categoria</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 hidden sm:table-cell">Atualizado</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Carregando...</td></tr>}
            {(data ?? []).map((p: any) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  {p.cover_url ? (
                    <img
                      src={p.cover_url}
                      alt=""
                      loading="lazy"
                      width={64}
                      height={40}
                      className="h-10 w-16 rounded object-cover ring-1 ring-border"
                    />
                  ) : (
                    <div className="flex h-10 w-16 items-center justify-center rounded bg-muted text-muted-foreground ring-1 ring-border">
                      <ImageOff className="h-4 w-4" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link to="/admin/posts/$id" params={{ id: p.id }} className="font-medium hover:text-primary">
                    {p.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">/blog/{p.slug}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">{p.category}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded px-2 py-0.5 text-xs font-bold uppercase ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {p.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                  {p.updated_at ? new Date(p.updated_at).toLocaleDateString("pt-BR") : ","}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {p.status === "published" && (
                      <a
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Ver no site"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <Link
                      to="/admin/posts/$id"
                      params={{ id: p.id }}
                      title="Editar"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={deletingId === p.id}
                      title="Apagar"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                    >
                      {deletingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data && data.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                Nenhum post ainda. <Link to="/admin/posts/new" className="text-primary">Criar o primeiro</Link>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}