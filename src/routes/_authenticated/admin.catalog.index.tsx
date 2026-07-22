import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Package, Tag, Layers, Search } from "lucide-react";
import { listProducts, type ProductStatus } from "@/lib/catalog.functions";

export const Route = createFileRoute("/_authenticated/admin/catalog/")({
  component: CatalogList,
});

const statusLabels: Record<ProductStatus | "all", string> = {
  all: "Todos",
  draft: "Rascunho",
  active: "Ativo",
  inactive: "Inativo",
  discontinued: "Descontinuado",
};

function statusBadge(status: string) {
  const map: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    inactive: "bg-gray-200 text-gray-700",
    discontinued: "bg-red-100 text-red-700",
  };
  return map[status] ?? "bg-muted";
}

function CatalogList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus | "all">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["products", { search, status }],
    queryFn: () => listProducts({ search, status }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black">Catálogo</h1>
          <p className="text-sm text-muted-foreground">Produtos, categorias e marcas da loja.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/catalog/categories" className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-accent">
            <Layers className="h-3 w-3" /> Categorias
          </Link>
          <Link to="/admin/catalog/brands" className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-accent">
            <Tag className="h-3 w-3" /> Marcas
          </Link>
          <Link to="/admin/catalog/new" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground">
            <Plus className="h-4 w-4" /> Novo produto
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou SKU..."
            className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-primary" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus | "all")}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm">
          {Object.entries(statusLabels).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3 hidden md:table-cell">SKU</th>
              <th className="px-4 py-3 text-right">Preço</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (<tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Carregando...</td></tr>)}
            {(data ?? []).map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  {p.cover_image_url ? (
                    <img src={p.cover_image_url} alt="" className="h-10 w-10 rounded object-cover ring-1 ring-border" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-muted-foreground ring-1 ring-border">
                      <Package className="h-4 w-4" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link to="/admin/catalog/$id" params={{ id: p.id }} className="font-medium hover:text-primary">
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 hidden md:table-cell font-mono text-xs text-muted-foreground">{p.sku}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">
                  {p.sale_price != null ? `R$ ${Number(p.sale_price).toFixed(2)}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase ${statusBadge(p.status)}`}>
                    {statusLabels[p.status as ProductStatus] ?? p.status}
                  </span>
                </td>
              </tr>
            ))}
            {data && data.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                Nenhum produto ainda. <Link to="/admin/catalog/new" className="text-primary">Cadastrar o primeiro</Link>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}