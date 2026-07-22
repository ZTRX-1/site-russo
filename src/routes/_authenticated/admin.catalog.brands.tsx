import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { listBrands, upsertBrand, deleteBrand } from "@/lib/catalog.functions";

export const Route = createFileRoute("/_authenticated/admin/catalog/brands")({
  component: BrandsPage,
});

function BrandsPage() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["brands"], queryFn: listBrands });
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  async function add() {
    if (!name.trim()) return;
    try {
      await upsertBrand({ name: name.trim(), logo_url: logoUrl || null, active: true });
      setName(""); setLogoUrl("");
      qc.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Marca criada.");
    } catch (e) { toast.error((e as Error).message); }
  }

  async function remove(id: string, n: string) {
    if (!confirm(`Apagar "${n}"?`)) return;
    try { await deleteBrand(id); qc.invalidateQueries({ queryKey: ["brands"] }); }
    catch (e) { toast.error((e as Error).message); }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/admin/catalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="font-display text-3xl font-black">Marcas</h1>

      <div className="grid gap-2 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto]">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome (ex: Tramontina)"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="URL do logo (opcional)"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        <button onClick={add} className="rounded-md bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground">
          <Plus className="mr-1 inline h-3 w-3" /> Adicionar
        </button>
      </div>

      <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
        {data.map((b) => (
          <li key={b.id} className="flex items-center gap-3 px-4 py-3 text-sm">
            {b.logo_url ? <img src={b.logo_url} alt="" className="h-8 w-8 rounded object-contain ring-1 ring-border" /> : <div className="h-8 w-8 rounded bg-muted" />}
            <div className="flex-1">
              <div className="font-medium">{b.name}</div>
              <div className="text-xs text-muted-foreground">/{b.slug}</div>
            </div>
            <button onClick={() => remove(b.id, b.name)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {data.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted-foreground">Nenhuma marca ainda.</li>}
      </ul>
    </div>
  );
}