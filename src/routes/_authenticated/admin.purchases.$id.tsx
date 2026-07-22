import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  PO_STATUS_LABEL,
  PurchaseOrderStatus,
  deletePurchaseOrder,
  getPurchaseOrder,
  receivePurchaseOrderItem,
  updatePurchaseOrderHeader,
} from "@/lib/purchases.functions";
import { listLocations } from "@/lib/stock.functions";
import { ArrowLeft, Trash2, PackageCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/purchases/$id")({
  component: PurchaseOrderDetail,
});

function PurchaseOrderDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const router = useRouter();
  const q = useQuery({ queryKey: ["purchase-order", id], queryFn: () => getPurchaseOrder(id) });
  const locationsQ = useQuery({ queryKey: ["stock-locations"], queryFn: listLocations });
  const [receiveQty, setReceiveQty] = useState<Record<string, number>>({});
  const [receiveLoc, setReceiveLoc] = useState("");

  const receive = useMutation({
    mutationFn: async (itemId: string) => {
      const qty = Number(receiveQty[itemId] || 0);
      const loc = receiveLoc || q.data?.location?.id || null;
      if (!loc) throw new Error("Selecione um local de destino.");
      await receivePurchaseOrderItem(itemId, qty, loc);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-order", id] }),
  });

  const updateStatus = useMutation({
    mutationFn: (status: PurchaseOrderStatus) => updatePurchaseOrderHeader(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["purchase-order", id] }),
  });

  const remove = useMutation({
    mutationFn: () => deletePurchaseOrder(id),
    onSuccess: () => router.navigate({ to: "/admin/purchases" }),
  });

  if (q.isLoading) return <div>Carregando...</div>;
  if (q.error instanceof Error) return <div className="text-destructive">{q.error.message}</div>;
  const po = q.data!;
  const items = (po.items ?? []) as Array<{
    id: string; product_id: string; quantity: number; received_quantity: number; unit_cost: number; notes: string | null;
    product: { id: string; sku: string; name: string; unit: string | null } | null;
  }>;
  const subtotal = items.reduce((s, l) => s + Number(l.quantity) * Number(l.unit_cost), 0);
  const total = subtotal + Number(po.freight || 0) - Number(po.discount || 0);
  const canReceive = po.status !== "canceled" && po.status !== "received";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/admin/purchases" className="rounded-md border border-border p-2 hover:bg-accent"><ArrowLeft className="h-4 w-4" /></Link>
          <div>
            <h1 className="font-display text-2xl font-black">{po.code}</h1>
            <p className="text-sm text-muted-foreground">{po.supplier?.name} · {PO_STATUS_LABEL[po.status as PurchaseOrderStatus]}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {po.status === "draft" && (
            <button onClick={() => updateStatus.mutate("placed")} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">Marcar como enviado</button>
          )}
          {po.status !== "canceled" && po.status !== "received" && (
            <button onClick={() => { if (confirm("Cancelar este pedido?")) updateStatus.mutate("canceled"); }} className="rounded-md border border-border px-3 py-2 text-sm text-destructive hover:bg-destructive/10">Cancelar</button>
          )}
          <button onClick={() => { if (confirm("Excluir pedido? Esta ação não pode ser desfeita.")) remove.mutate(); }} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" /> Excluir
          </button>
        </div>
      </div>

      <div className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-4">
        <div><div className="text-xs uppercase text-muted-foreground">Fornecedor</div><div className="font-medium">{po.supplier?.name}</div></div>
        <div><div className="text-xs uppercase text-muted-foreground">Destino padrão</div><div className="font-medium">{po.location?.name ?? "—"}</div></div>
        <div><div className="text-xs uppercase text-muted-foreground">Previsão</div><div className="font-medium">{po.expected_at ?? "—"}</div></div>
        <div><div className="text-xs uppercase text-muted-foreground">Recebido em</div><div className="font-medium">{po.received_at ? new Date(po.received_at).toLocaleString("pt-BR") : "—"}</div></div>
        {po.notes && <div className="sm:col-span-4 text-sm"><span className="text-muted-foreground">Obs.:</span> {po.notes}</div>}
      </div>

      {canReceive && (
        <div className="rounded-lg border border-border bg-card p-3">
          <label className="flex flex-col gap-1 text-sm sm:max-w-xs">
            <span className="font-medium">Local para o recebimento</span>
            <select value={receiveLoc || po.location?.id || ""} onChange={(e) => setReceiveLoc(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2">
              <option value="">Selecione…</option>
              {(locationsQ.data ?? []).filter((l) => l.active).map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Produto</th>
              <th className="px-3 py-2 text-right">Pedido</th>
              <th className="px-3 py-2 text-right">Recebido</th>
              <th className="px-3 py-2 text-right">Pendente</th>
              <th className="px-3 py-2 text-right">Custo un.</th>
              {canReceive && <th className="px-3 py-2" />}
            </tr>
          </thead>
          <tbody>
            {items.map((l) => {
              const pending = Number(l.quantity) - Number(l.received_quantity);
              return (
                <tr key={l.id} className="border-t border-border">
                  <td className="px-3 py-2">
                    <div className="font-medium">{l.product?.name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{l.product?.sku}</div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{Number(l.quantity)}</td>
                  <td className="px-3 py-2 text-right font-mono">{Number(l.received_quantity)}</td>
                  <td className={`px-3 py-2 text-right font-mono ${pending > 0 ? "text-amber-700" : "text-muted-foreground"}`}>{pending}</td>
                  <td className="px-3 py-2 text-right font-mono">R$ {Number(l.unit_cost).toFixed(2)}</td>
                  {canReceive && (
                    <td className="px-3 py-2 text-right">
                      {pending > 0 ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            step="0.001"
                            min={0}
                            max={pending}
                            value={receiveQty[l.id] ?? pending}
                            onChange={(e) => setReceiveQty((prev) => ({ ...prev, [l.id]: Number(e.target.value) }))}
                            className="w-20 rounded-md border border-border bg-background px-2 py-1 text-right"
                          />
                          <button
                            disabled={receive.isPending}
                            onClick={() => receive.mutate(l.id)}
                            className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
                          >
                            <PackageCheck className="h-3.5 w-3.5" /> Receber
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-emerald-700">Completo</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {receive.error instanceof Error && (
        <p className="text-sm text-destructive">{receive.error.message}</p>
      )}

      <div className="flex flex-col items-end gap-1 text-sm">
        <div className="text-muted-foreground">Subtotal: <span className="font-mono text-foreground">R$ {subtotal.toFixed(2)}</span></div>
        <div className="text-muted-foreground">Frete: <span className="font-mono text-foreground">R$ {Number(po.freight || 0).toFixed(2)}</span></div>
        <div className="text-muted-foreground">Desconto: <span className="font-mono text-foreground">R$ {Number(po.discount || 0).toFixed(2)}</span></div>
        <div className="text-base font-semibold">Total: <span className="font-mono">R$ {total.toFixed(2)}</span></div>
      </div>
    </div>
  );
}