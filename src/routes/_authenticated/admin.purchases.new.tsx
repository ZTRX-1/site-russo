import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listProducts } from "@/lib/catalog.functions";
import { listLocations } from "@/lib/stock.functions";
import { createPurchaseOrder, listSuppliers } from "@/lib/purchases.functions";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/purchases/new")({
  component: NewPurchaseOrder,
});

type Line = { product_id: string; quantity: number; unit_cost: number; notes?: string };

function NewPurchaseOrder() {
  const router = useRouter();
  const suppliersQ = useQuery({ queryKey: ["suppliers-lite"], queryFn: () => listSuppliers() });
  const productsQ = useQuery({ queryKey: ["catalog-products-lite"], queryFn: () => listProducts({}) });
  const locationsQ = useQuery({ queryKey: ["stock-locations"], queryFn: listLocations });

  const [supplierId, setSupplierId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [expectedAt, setExpectedAt] = useState("");
  const [freight, setFreight] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Line[]>([]);
  const [pickProduct, setPickProduct] = useState("");

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, l) => s + l.quantity * l.unit_cost, 0);
    return { subtotal, total: subtotal + Number(freight || 0) - Number(discount || 0) };
  }, [items, freight, discount]);

  function addItem() {
    if (!pickProduct) return;
    if (items.some((l) => l.product_id === pickProduct)) return;
    const prod = productsQ.data?.find((p) => p.id === pickProduct);
    setItems((prev) => [...prev, { product_id: pickProduct, quantity: 1, unit_cost: Number(prod?.cost_price ?? 0) }]);
    setPickProduct("");
  }

  const create = useMutation({
    mutationFn: async () => {
      return createPurchaseOrder({
        supplier_id: supplierId,
        location_id: locationId || null,
        status: "placed",
        expected_at: expectedAt || null,
        notes: notes || null,
        freight: Number(freight) || 0,
        discount: Number(discount) || 0,
        items: items.map((l) => ({ product_id: l.product_id, quantity: Number(l.quantity), unit_cost: Number(l.unit_cost), notes: l.notes ?? null })),
      });
    },
    onSuccess: (r) => router.navigate({ to: "/admin/purchases/$id", params: { id: r.id } }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/purchases" className="rounded-md border border-border p-2 hover:bg-accent"><ArrowLeft className="h-4 w-4" /></Link>
        <div>
          <h1 className="font-display text-2xl font-black">Novo pedido de compra</h1>
          <p className="text-sm text-muted-foreground">Selecione fornecedor, itens e envie para receber depois.</p>
        </div>
      </div>

      <div className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Fornecedor *</span>
          <select required value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2">
            <option value="">Selecione…</option>
            {(suppliersQ.data ?? []).filter((s) => s.active).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <Link to="/admin/purchases/suppliers" className="text-xs text-primary hover:underline">Gerenciar fornecedores</Link>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Local de destino</span>
          <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2">
            <option value="">Definir no recebimento</option>
            {(locationsQ.data ?? []).filter((l) => l.active).map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Previsão de entrega</span>
          <input type="date" value={expectedAt} onChange={(e) => setExpectedAt(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Frete (R$)</span>
          <input type="number" step="0.01" min={0} value={freight} onChange={(e) => setFreight(Number(e.target.value))} className="rounded-md border border-border bg-background px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Desconto (R$)</span>
          <input type="number" step="0.01" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="rounded-md border border-border bg-background px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">Observações</span>
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2" />
        </label>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-1 min-w-[220px] flex-col gap-1 text-sm">
            <span className="font-medium">Adicionar produto</span>
            <select value={pickProduct} onChange={(e) => setPickProduct(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2">
              <option value="">Selecione…</option>
              {(productsQ.data ?? []).map((p) => (
                <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        </div>

        <div className="overflow-hidden rounded-md border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Produto</th>
                <th className="px-3 py-2 text-right">Qtd.</th>
                <th className="px-3 py-2 text-right">Custo un.</th>
                <th className="px-3 py-2 text-right">Subtotal</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">Nenhum item adicionado.</td></tr>
              )}
              {items.map((l, i) => {
                const p = productsQ.data?.find((x) => x.id === l.product_id);
                return (
                  <tr key={l.product_id} className="border-t border-border">
                    <td className="px-3 py-2">
                      <div className="font-medium">{p?.name}</div>
                      <div className="text-xs text-muted-foreground">{p?.sku}</div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input type="number" step="0.001" min={0} value={l.quantity} onChange={(e) => setItems((prev) => prev.map((x, j) => j === i ? { ...x, quantity: Number(e.target.value) } : x))} className="w-24 rounded-md border border-border bg-background px-2 py-1 text-right" />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input type="number" step="0.0001" min={0} value={l.unit_cost} onChange={(e) => setItems((prev) => prev.map((x, j) => j === i ? { ...x, unit_cost: Number(e.target.value) } : x))} className="w-28 rounded-md border border-border bg-background px-2 py-1 text-right" />
                    </td>
                    <td className="px-3 py-2 text-right font-mono">{(l.quantity * l.unit_cost).toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))} className="rounded-md border border-border p-1 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end gap-1 text-sm">
          <div className="text-muted-foreground">Subtotal: <span className="font-mono text-foreground">R$ {totals.subtotal.toFixed(2)}</span></div>
          <div className="text-muted-foreground">Frete: <span className="font-mono text-foreground">R$ {Number(freight || 0).toFixed(2)}</span></div>
          <div className="text-muted-foreground">Desconto: <span className="font-mono text-foreground">R$ {Number(discount || 0).toFixed(2)}</span></div>
          <div className="text-base font-semibold">Total: <span className="font-mono">R$ {totals.total.toFixed(2)}</span></div>
        </div>
      </div>

      {create.error instanceof Error && (
        <p className="text-sm text-destructive">{create.error.message}</p>
      )}

      <div className="flex justify-end gap-2">
        <Link to="/admin/purchases" className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Cancelar</Link>
        <button
          disabled={create.isPending || !supplierId || items.length === 0}
          onClick={() => create.mutate()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {create.isPending ? "Criando..." : "Criar pedido"}
        </button>
      </div>
    </div>
  );
}