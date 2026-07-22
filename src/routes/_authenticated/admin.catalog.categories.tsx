import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { listCategories, upsertCategory, deleteCategory } from "@/lib/catalog.functions";

export const Route = createFileRoute("/_authenticated/admin/catalog/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["categories"], queryFn: listCategories });
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");

  async function add() {
    if (!name.trim()) return;
    try {
      await upsertCategory({ name: name.trim(), parent_id: parentId || null, sort_order: 0, active: true });
      setName(""); setParentId("");
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria criada.");
    } catch (e) { toast.error((e as Error).message); }
  }

  async function remove(id: string, n: string) {
    if (!confirm(`Apagar "${n}"?`)) return;
    try { await deleteCategory(id); qc.invalidateQueries({ queryKey: ["categories"] }); }
    catch (e) { toast.error((e as Error).message); }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/admin/catalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="font-display text-3xl font-black">Categorias</h1>

      <div className="grid gap-2 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto]">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome (ex: Cabos flexíveis)"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        <select value={parentId} onChange={(e) => setParentId(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm">
          <option value="">— sem categoria pai —</option>
          {data.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={add} className="rounded-md bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground">
          <Plus className="mr-1 inline h-3 w-3" /> Adicionar
        </button>
      </div>

      <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
        {data.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">/{c.slug}{c.parent_id ? ` · sub de ${data.find(x => x.id === c.parent_id)?.name ?? ""}` : ""}</div>
            </div>
            <button onClick={() => remove(c.id, c.name)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {data.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted-foreground">Nenhuma categoria ainda.</li>}
      </ul>
    </div>
  );
}