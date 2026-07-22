import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteLocation, listLocations, upsertLocation } from "@/lib/stock.functions";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/stock/locations")({
  component: LocationsPage,
});

function LocationsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["stock-locations"], queryFn: listLocations });
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"store" | "warehouse" | "counter" | "other">("store");

  const create = useMutation({
    mutationFn: () => upsertLocation({ name, kind, active: true, sort_order: 99 }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["stock-locations"] }); setName(""); },
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteLocation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stock-locations"] }),
  });
  const toggle = useMutation({
    mutationFn: (l: { id: string; active: boolean; name: string; kind: "store" | "warehouse" | "counter" | "other"; sort_order: number }) =>
      upsertLocation({ id: l.id, name: l.name, kind: l.kind, active: !l.active, sort_order: l.sort_order }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stock-locations"] }),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black">Locais de estoque</h1>
        <p className="text-sm text-muted-foreground">Loja, depósito ou pontos internos onde os itens ficam guardados.</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (name.trim()) create.mutate(); }}
        className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-card p-4"
      >
        <label className="flex-1 min-w-[200px]">
          <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Nome do local</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Tipo</span>
          <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="rounded-md border border-border bg-background px-2 py-2 text-sm">
            <option value="store">Loja</option>
            <option value="counter">Balcão</option>
            <option value="warehouse">Depósito</option>
            <option value="other">Outro</option>
          </select>
        </label>
        <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="px-3 py-2">Nome</th><th className="px-3 py-2">Tipo</th><th className="px-3 py-2">Status</th><th className="px-3 py-2"></th></tr>
          </thead>
          <tbody>
            {(q.data ?? []).map((l) => (
              <tr key={l.id} className="border-t border-border">
                <td className="px-3 py-2 font-medium">{l.name}</td>
                <td className="px-3 py-2 text-muted-foreground">{l.kind}</td>
                <td className="px-3 py-2">
                  <button onClick={() => toggle.mutate({ id: l.id, name: l.name, kind: l.kind as "store" | "warehouse" | "counter" | "other", active: l.active, sort_order: l.sort_order })} className={`rounded-full px-2 py-0.5 text-xs ${l.active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                    {l.active ? "Ativo" : "Inativo"}
                  </button>
                </td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => { if (confirm(`Remover "${l.name}"?`)) remove.mutate(l.id); }} className="text-red-600 hover:opacity-80" title="Remover">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}