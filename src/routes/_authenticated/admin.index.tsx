import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { FileText, Plus, ExternalLink } from "lucide-react";
import { listAdminPosts } from "@/lib/posts.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const fn = useServerFn(listAdminPosts);
  const { data } = useQuery({ queryKey: ["admin-posts"], queryFn: () => fn() });
  const posts = data ?? [];
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.length - published;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral do blog Russo.</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Novo post
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Publicados" value={published} />
        <Stat label="Rascunhos" value={drafts} />
        <Stat label="Total" value={posts.length} />
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-black">Últimos posts</h2>
          <Link to="/admin/posts" className="text-sm text-primary hover:underline">Ver todos</Link>
        </div>
        <ul className="divide-y divide-border">
          {posts.slice(0, 5).map((p) => (
            <li key={p.id} className="flex items-center justify-between px-6 py-3 text-sm">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <Link to="/admin/posts/$id" params={{ id: p.id }} className="font-medium hover:text-primary">{p.title}</Link>
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${p.status === "published" ? "text-green-600" : "text-yellow-600"}`}>
                {p.status === "published" ? "Publicado" : "Rascunho"}
              </span>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="px-6 py-6 text-center text-sm text-muted-foreground">
              Nenhum post ainda. <Link to="/admin/posts/new" className="text-primary">Criar o primeiro</Link>
            </li>
          )}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-black">Ver o blog público</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O que os visitantes estão vendo agora em /blog.
        </p>
        <a href="/blog" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          Abrir blog <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-4xl font-black text-foreground">{value}</div>
    </div>
  );
}