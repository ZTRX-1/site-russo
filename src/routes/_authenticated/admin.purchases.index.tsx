import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PO_STATUS_LABEL, PurchaseOrderStatus, listPurchaseOrders } from "@/lib/purchases.functions";
import { Plus, Users, FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/purchases/")({
  component: PurchasesList,
});

const STATUS_COLORS: Record<PurchaseOrderStatus, string> = {
  draft: "bg-muted text-foreground",
  placed: "bg-blue-100 text-blue-800",
  partial: "bg-amber-100 text-amber-800",
  received: "bg-emerald-100 text-emerald-800",
  canceled: "bg-red-100 text-red-800",
};

function PurchasesList() {
  const [status, setStatus] = useState<PurchaseOrderStatus | "all">("all");
  const q = useQuery({ queryKey: ["purchase-orders", status], queryFn: () => listPurchaseOrders({ status }) });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">Compras</h1>
          <p className="text-sm text-muted-foreground">Pedidos de compra e recebimento no estoque.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/purchases/suppliers" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
            <Users className="h-4 w-4" /> Fornecedores
          </Link>
          <Link to="/admin/purchases/new" className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> Novo pedido
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "draft", "placed", "partial", "received", "canceled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              status === s ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"
            }`}
          >
            {s === "all" ? "Todos" : PO_STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left">Código</th>
              <th className="px-4 py-2 text-left">Fornecedor</th>
              <th className="px-4 py-2 text-left">Destino</th>
              <th className="px-4 py-2 text-left">Previsão</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {q.isLoading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Carregando...</td></tr>
            )}
            {!q.isLoading && (q.data ?? []).length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                <FileText className="mx-auto mb-2 h-6 w-6 opacity-50" />
                Nenhum pedido ainda.
              </td></tr>
            )}
            {(q.data ?? []).map((po) => (
              <tr key={po.id} className="border-t border-border hover:bg-accent/40">
                <td className="px-4 py-2 font-mono text-xs">{po.code}</td>
                <td className="px-4 py-2">{po.supplier?.name ?? "—"}</td>
                <td className="px-4 py-2 text-muted-foreground">{po.location?.name ?? "—"}</td>
                <td className="px-4 py-2 text-muted-foreground">{po.expected_at ?? "—"}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[po.status as PurchaseOrderStatus]}`}>
                    {PO_STATUS_LABEL[po.status as PurchaseOrderStatus]}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link to="/admin/purchases/$id" params={{ id: po.id }} className="text-sm font-medium text-primary hover:underline">
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}