import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { listAdminPosts } from "@/lib/posts.functions";

export const Route = createFileRoute("/_authenticated/admin/posts/")({
  component: PostsList,
});

function PostsList() {
  const fn = useServerFn(listAdminPosts);
  const { data, isLoading } = useQuery({ queryKey: ["admin-posts"], queryFn: () => fn() });

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
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3 hidden md:table-cell">Categoria</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 hidden sm:table-cell">Atualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">Carregando...</td></tr>}
            {(data ?? []).map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
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
                  {p.updated_at ? new Date(p.updated_at).toLocaleDateString("pt-BR") : "—"}
                </td>
              </tr>
            ))}
            {data && data.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                Nenhum post ainda. <Link to="/admin/posts/new" className="text-primary">Criar o primeiro</Link>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}