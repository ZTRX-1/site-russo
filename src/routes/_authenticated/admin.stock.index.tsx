import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { listBalances, listLocations } from "@/lib/stock.functions";
import { AlertTriangle, ScanLine, PlusCircle, ArrowLeftRight, MapPin, Package } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/stock/")({
  component: StockOverview,
});

function StockOverview() {
  const [locationId, setLocationId] = useState<string>("");
  const [lowOnly, setLowOnly] = useState(false);
  const [search, setSearch] = useState("");

  const locationsQ = useQuery({ queryKey: ["stock-locations"], queryFn: listLocations });
  const balancesQ = useQuery({
    queryKey: ["stock-balances", locationId, lowOnly],
    queryFn: () => listBalances({ locationId: locationId || undefined, lowStockOnly: lowOnly }),
  });

  const filtered = useMemo(() => {
    const rows = balancesQ.data ?? [];
    if (!search.trim()) return rows;
    const s = search.trim().toLowerCase();
    return rows.filter(
      (r) =>
        r.product?.name?.toLowerCase().includes(s) ||
        r.product?.sku?.toLowerCase().includes(s)
    );
  }, [balancesQ.data, search]);

  const totalSkus = new Set((balancesQ.data ?? []).map((r) => r.product_id)).size;
  const lowCount = (balancesQ.data ?? []).filter((r) => {
    const min = Number(r.product?.min_stock ?? 0);
    return min > 0 && r.balance <= min;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-foreground">Estoque</h1>
          <p className="text-sm text-muted-foreground">
            Saldo atual por local, movimentações e entrada por código de barras.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/stock/scan"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:brightness-95"
          >
            <ScanLine className="h-4 w-4" /> Bipar / Entrada rápida
          </Link>
          <Link
            to="/admin/stock/movements"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <ArrowLeftRight className="h-4 w-4" /> Movimentações
          </Link>
          <Link
            to="/admin/stock/locations"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <MapPin className="h-4 w-4" /> Locais
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card icon={Package} label="Itens com saldo" value={totalSkus} />
        <Card icon={AlertTriangle} label="Abaixo do mínimo" value={lowCount} tone={lowCount > 0 ? "warn" : "default"} />
        <Card icon={MapPin} label="Locais ativos" value={(locationsQ.data ?? []).filter((l) => l.active).length} />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou SKU..."
          className="min-w-[180px] flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos os locais</option>
          {(locationsQ.data ?? []).map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} />
          Só abaixo do mínimo
        </label>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Produto</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Local</th>
              <th className="px-3 py-2 text-right">Saldo</th>
              <th className="px-3 py-2 text-right">Mínimo</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {balancesQ.isLoading && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Carregando saldo...</td></tr>
            )}
            {!balancesQ.isLoading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                Nenhum saldo por aqui ainda. Registre uma <Link className="underline" to="/admin/stock/scan">entrada</Link>.
              </td></tr>
            )}
            {filtered.map((r) => {
              const min = Number(r.product?.min_stock ?? 0);
              const low = min > 0 && r.balance <= min;
              return (
                <tr key={`${r.product_id}-${r.location_id}`} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{r.product?.name ?? "(produto removido)"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.product?.sku ?? "—"}</td>
                  <td className="px-3 py-2">{r.location?.name ?? "—"}</td>
                  <td className={`px-3 py-2 text-right font-semibold ${low ? "text-red-600" : ""}`}>
                    {r.balance.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{min || "—"}</td>
                  <td className="px-3 py-2 text-right">
                    {r.product && (
                      <Link
                        to="/admin/catalog/$id"
                        params={{ id: r.product.id }}
                        className="text-xs text-primary hover:underline"
                      >Abrir</Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Link
          to="/admin/stock/scan"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <PlusCircle className="h-4 w-4" /> Nova movimentação
        </Link>
      </div>
    </div>
  );
}

function Card({ icon: Icon, label, value, tone = "default" }: {
  icon: typeof Package; label: string; value: number; tone?: "default" | "warn";
}) {
  return (
    <div className={`rounded-lg border p-4 ${tone === "warn" ? "border-red-300 bg-red-50" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className={`mt-2 text-2xl font-black ${tone === "warn" ? "text-red-700" : "text-foreground"}`}>
        {value.toLocaleString("pt-BR")}
      </div>
    </div>
  );
}