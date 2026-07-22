import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ScanLine, Search, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { BarcodeScanner } from "@/components/admin/BarcodeScanner";
import { createMovement, listLocations, searchProductQuick, getProductBalance, MovementKind, KIND_LABEL } from "@/lib/stock.functions";

export const Route = createFileRoute("/_authenticated/admin/stock/scan")({
  component: ScanPage,
});

type FoundProduct = {
  id: string;
  sku: string;
  name: string;
  sale_price: number | null;
  cover_image_url: string | null;
  min_stock: number | null;
  unit: string;
};

function ScanPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [found, setFound] = useState<{ via: string; packSize: number; product: FoundProduct } | null>(null);
  const [kind, setKind] = useState<MovementKind>("in");
  const [locationId, setLocationId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [document, setDocument] = useState("");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const locationsQ = useQuery({ queryKey: ["stock-locations"], queryFn: listLocations });
  const balanceQ = useQuery({
    queryKey: ["product-balance", found?.product.id],
    queryFn: () => (found ? getProductBalance(found.product.id) : Promise.resolve([])),
    enabled: !!found,
  });

  async function handleTerm(t: string) {
    setFeedback(null);
    setTerm(t);
    const result = await searchProductQuick(t);
    if (!result) {
      setFound(null);
      setFeedback({ ok: false, msg: `Nenhum produto encontrado para "${t}".` });
      return;
    }
    setFound(result as { via: string; packSize: number; product: FoundProduct });
    setQuantity(result.packSize || 1);
  }

  const register = useMutation({
    mutationFn: async () => {
      if (!found) throw new Error("Escolha um produto primeiro.");
      if (!locationId) throw new Error("Selecione o local.");
      await createMovement({
        product_id: found.product.id,
        location_id: locationId,
        kind,
        quantity: Number(quantity),
        document: document || null,
        reason: reason || null,
        unit_cost: null,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stock-balances"] });
      qc.invalidateQueries({ queryKey: ["stock-movements"] });
      qc.invalidateQueries({ queryKey: ["product-balance", found?.product.id] });
      setFeedback({ ok: true, msg: `${KIND_LABEL[kind]} de ${quantity} ${found?.product.unit ?? "un"} registrada.` });
      setTerm(""); setDocument(""); setReason(""); setQuantity(1);
      setFound(null);
    },
    onError: (e: Error) => setFeedback({ ok: false, msg: e.message }),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/admin/stock" className="rounded-md border border-border p-2 hover:bg-accent"><ArrowLeft className="h-4 w-4" /></Link>
        <div>
          <h1 className="font-display text-2xl font-black">Bipar / Entrada rápida</h1>
          <p className="text-sm text-muted-foreground">Use a câmera, um leitor USB ou digite o código.</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            <ScanLine className="h-4 w-4" /> Abrir câmera
          </button>
          <form
            onSubmit={(e) => { e.preventDefault(); if (term.trim()) handleTerm(term.trim()); }}
            className="flex flex-1 items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Código de barras, SKU ou nome..."
                className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm"
              />
            </div>
            <button type="submit" className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent">Buscar</button>
          </form>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Dica: leitores USB funcionam como teclado — bipar aqui já preenche o campo.
        </p>
      </div>

      {feedback && (
        <div className={`flex items-center gap-2 rounded-md border p-3 text-sm ${feedback.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>
          {feedback.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {feedback.msg}
        </div>
      )}

      {found && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            {found.product.cover_image_url ? (
              <img src={found.product.cover_image_url} alt="" className="h-16 w-16 rounded-md object-cover" />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-md bg-muted text-xs text-muted-foreground">sem foto</div>
            )}
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">SKU {found.product.sku} · encontrado por {found.via}</div>
              <div className="font-semibold">{found.product.name}</div>
              <div className="text-sm text-muted-foreground">
                Preço: {found.product.sale_price != null ? `R$ ${Number(found.product.sale_price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
                {" · "}Mínimo: {found.product.min_stock ?? "—"} {found.product.unit}
              </div>
            </div>
            <Link to="/admin/catalog/$id" params={{ id: found.product.id }} className="text-xs text-primary hover:underline">ver ficha</Link>
          </div>

          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
            {(balanceQ.data ?? []).length === 0 && (
              <div className="rounded-md border border-dashed border-border p-2 text-muted-foreground sm:col-span-3">Sem saldo ainda em nenhum local.</div>
            )}
            {(balanceQ.data ?? []).map((b) => {
              const loc = (locationsQ.data ?? []).find((l) => l.id === b.location_id);
              return (
                <div key={b.location_id} className="rounded-md border border-border bg-background p-2">
                  <div className="text-xs text-muted-foreground">{loc?.name ?? "Local"}</div>
                  <div className="font-semibold">{b.balance.toLocaleString("pt-BR")} {found.product.unit}</div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); register.mutate(); }}
            className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Tipo</span>
              <select value={kind} onChange={(e) => setKind(e.target.value as MovementKind)} className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm">
                <option value="in">Entrada</option>
                <option value="out">Saída</option>
                <option value="adjust">Ajuste</option>
                <option value="count">Contagem</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Local</span>
              <select required value={locationId} onChange={(e) => setLocationId(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm">
                <option value="">Selecione...</option>
                {(locationsQ.data ?? []).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Quantidade</span>
              <input type="number" step="0.001" required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Documento</span>
              <input value={document} onChange={(e) => setDocument(e.target.value)} placeholder="NF, pedido..." className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm" />
            </label>
            <label className="block sm:col-span-2 lg:col-span-4">
              <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Motivo / observação</span>
              <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm" />
            </label>
            <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
              <button type="submit" disabled={register.isPending} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {register.isPending ? "Registrando..." : "Registrar movimentação"}
              </button>
            </div>
          </form>
        </div>
      )}

      {open && (
        <BarcodeScanner
          onDetected={(code) => { setOpen(false); handleTerm(code); }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}