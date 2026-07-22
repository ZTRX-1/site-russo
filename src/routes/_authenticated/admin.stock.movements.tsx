import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { KIND_LABEL, MovementKind, createMovement, listLocations, listMovements } from "@/lib/stock.functions";
import { listProducts } from "@/lib/catalog.functions";
import { ScanLine, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/stock/movements")({
  component: MovementsPage,
});

function MovementsPage() {
  const qc = useQueryClient();
  const [kind, setKind] = useState<MovementKind | "all">("all");
  const [locationId, setLocationId] = useState("");
  const [showForm, setShowForm] = useState(false);

  const locationsQ = useQuery({ queryKey: ["stock-locations"], queryFn: listLocations });
  const productsQ = useQuery({ queryKey: ["catalog-products-lite"], queryFn: () => listProducts({}) });
  const movementsQ = useQuery({
    queryKey: ["stock-movements", kind, locationId],
    queryFn: () => listMovements({ kind, locationId: locationId || undefined }),
  });

  const [form, setForm] = useState({
    product_id: "",
    location_id: "",
    kind: "in" as MovementKind,
    quantity: 1,
    reason: "",
    document: "",
    unit_cost: "",
  });

  const create = useMutation({
    mutationFn: () =>
      createMovement({
        product_id: form.product_id,
        location_id: form.location_id,
        kind: form.kind,
        quantity: Number(form.quantity),
        reason: form.reason || null,
        document: form.document || null,
        unit_cost: form.unit_cost ? Number(form.unit_cost) : null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stock-movements"] });
      qc.invalidateQueries({ queryKey: ["stock-balances"] });
      setShowForm(false);
      setForm({ ...form, quantity: 1, reason: "", document: "", unit_cost: "" });
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">Movimentações</h1>
          <p className="text-sm text-muted-foreground">Histórico imutável de entradas, saídas e ajustes.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/stock/scan" className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-accent">
            <ScanLine className="h-4 w-4" /> Bipar
          </Link>
          <button onClick={() => setShowForm((v) => !v)} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Nova
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
          className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Field label="Produto">
            <select required value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm">
              <option value="">Selecione...</option>
              {(productsQ.data ?? []).map((p) => <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>)}
            </select>
          </Field>
          <Field label="Local">
            <select required value={form.location_id} onChange={(e) => setForm({ ...form, location_id: e.target.value })} className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm">
              <option value="">Selecione...</option>
              {(locationsQ.data ?? []).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </Field>
          <Field label="Tipo">
            <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as MovementKind })} className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm">
              <option value="in">Entrada</option>
              <option value="out">Saída</option>
              <option value="adjust">Ajuste</option>
              <option value="count">Contagem</option>
            </select>
          </Field>
          <Field label="Quantidade">
            <input required type="number" step="0.001" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm" />
          </Field>
          <Field label="Custo unit. (opcional)">
            <input type="number" step="0.01" value={form.unit_cost} onChange={(e) => setForm({ ...form, unit_cost: e.target.value })} className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm" />
          </Field>
          <Field label="Documento (NF, pedido...)">
            <input value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm" />
          </Field>
          <Field label="Motivo / observação" className="lg:col-span-3">
            <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm" />
          </Field>
          <div className="lg:col-span-3 flex items-center justify-end gap-2">
            {create.error && <span className="text-sm text-red-600">{(create.error as Error).message}</span>}
            <button type="button" onClick={() => setShowForm(false)} className="rounded-md border border-border px-3 py-2 text-sm">Cancelar</button>
            <button type="submit" disabled={create.isPending} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {create.isPending ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
        <select value={kind} onChange={(e) => setKind(e.target.value as MovementKind | "all")} className="rounded-md border border-border bg-background px-2 py-2 text-sm">
          <option value="all">Todos os tipos</option>
          {(Object.keys(KIND_LABEL) as MovementKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
        </select>
        <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="rounded-md border border-border bg-background px-2 py-2 text-sm">
          <option value="">Todos os locais</option>
          {(locationsQ.data ?? []).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Quando</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Produto</th>
              <th className="px-3 py-2">Local</th>
              <th className="px-3 py-2 text-right">Qtd.</th>
              <th className="px-3 py-2">Documento</th>
              <th className="px-3 py-2">Motivo</th>
            </tr>
          </thead>
          <tbody>
            {movementsQ.isLoading && <tr><td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">Carregando...</td></tr>}
            {!movementsQ.isLoading && (movementsQ.data ?? []).length === 0 && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">Nenhuma movimentação por enquanto.</td></tr>
            )}
            {(movementsQ.data ?? []).map((m) => {
              const negative = m.kind === "out" || m.kind === "transfer_out";
              return (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-3 py-2 text-muted-foreground">{new Date(m.created_at).toLocaleString("pt-BR")}</td>
                  <td className="px-3 py-2">{KIND_LABEL[m.kind as MovementKind]}</td>
                  <td className="px-3 py-2">{m.product?.name ?? "—"} <span className="text-xs text-muted-foreground">{m.product?.sku ? `(${m.product.sku})` : ""}</span></td>
                  <td className="px-3 py-2">{m.location?.name ?? "—"}</td>
                  <td className={`px-3 py-2 text-right font-semibold ${negative ? "text-red-600" : "text-emerald-600"}`}>
                    {negative ? "-" : "+"}{Number(m.quantity).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{m.document ?? "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{m.reason ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}