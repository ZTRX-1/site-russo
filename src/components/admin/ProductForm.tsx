import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, X, Plus, Trash2 } from "lucide-react";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  listBrands,
  uploadProductImage,
  addProductImage,
  deleteProductImage,
  addBarcode,
  deleteBarcode,
  type ProductInput,
  type ProductStatus,
} from "@/lib/catalog.functions";

type ImgRow = { id: string; url: string; is_primary?: boolean | null };
type BarcodeRow = { id: string; code: string; pack_size: number; label?: string | null };

export interface ProductFormInitial extends ProductInput {
  id?: string;
  images?: ImgRow[];
  barcodes?: BarcodeRow[];
}

const emptyProduct: ProductInput = {
  sku: "",
  slug: "",
  name: "",
  short_description: "",
  description: "",
  category_id: null,
  brand_id: null,
  unit: "un",
  ncm: "",
  weight_kg: null,
  cost_price: null,
  sale_price: null,
  promo_price: null,
  min_stock: 0,
  status: "draft",
  featured: false,
  cover_image_url: null,
};

export function ProductForm({ initial }: { initial?: ProductFormInitial }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<ProductInput>({ ...emptyProduct, ...(initial ?? {}) } as ProductInput);
  const [images, setImages] = useState<ImgRow[]>(initial?.images ?? []);
  const [barcodes, setBarcodes] = useState<BarcodeRow[]>(initial?.barcodes ?? []);
  const [newBarcode, setNewBarcode] = useState({ code: "", pack_size: 1, label: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: listCategories });
  const { data: brands = [] } = useQuery({ queryKey: ["brands"], queryFn: listBrands });

  useEffect(() => { if (initial) setForm({ ...emptyProduct, ...initial } as ProductInput); }, [initial?.id]);

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["products"] });
    if (initial?.id) qc.invalidateQueries({ queryKey: ["product", initial.id] });
  }

  async function handleUpload(file: File, asPrimary: boolean) {
    if (!file.type.startsWith("image/")) return toast.error("Arquivo precisa ser imagem.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Máximo 5MB.");
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      if (asPrimary || !form.cover_image_url) setForm((f) => ({ ...f, cover_image_url: url }));
      if (initial?.id) {
        await addProductImage(initial.id, url, asPrimary);
        setImages((prev) => [...prev, { id: crypto.randomUUID(), url, is_primary: asPrimary }]);
        invalidate();
      } else {
        setImages((prev) => [...prev, { id: `pending-${prev.length}`, url, is_primary: asPrimary }]);
      }
      toast.success("Imagem enviada.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removeImage(img: ImgRow) {
    if (!confirm("Remover essa imagem?")) return;
    try {
      if (initial?.id && !img.id.startsWith("pending-")) await deleteProductImage(img.id);
      setImages((prev) => prev.filter((i) => i.id !== img.id));
      if (form.cover_image_url === img.url) setForm((f) => ({ ...f, cover_image_url: null }));
    } catch (e) { toast.error((e as Error).message); }
  }

  async function handleAddBarcode() {
    const code = newBarcode.code.trim();
    if (!code) return;
    try {
      if (initial?.id) {
        await addBarcode(initial.id, code, newBarcode.pack_size || 1, newBarcode.label || undefined);
      }
      setBarcodes((prev) => [...prev, { id: crypto.randomUUID(), code, pack_size: newBarcode.pack_size || 1, label: newBarcode.label || null }]);
      setNewBarcode({ code: "", pack_size: 1, label: "" });
    } catch (e) { toast.error((e as Error).message); }
  }

  async function removeBarcodeRow(b: BarcodeRow) {
    try {
      if (initial?.id && !b.id.startsWith("pending-")) await deleteBarcode(b.id);
      setBarcodes((prev) => prev.filter((x) => x.id !== b.id));
    } catch (e) { toast.error((e as Error).message); }
  }

  async function save(status?: ProductStatus) {
    if (!form.name.trim() || !form.sku.trim()) return toast.error("Nome e SKU são obrigatórios.");
    setSaving(true);
    try {
      const payload = { ...form, status: status ?? form.status };
      if (isEdit && initial?.id) {
        await updateProduct(initial.id, payload);
        setForm((f) => ({ ...f, status: payload.status }));
        toast.success("Produto salvo.");
        invalidate();
      } else {
        const created = await createProduct(payload);
        toast.success("Produto criado.");
        // Persist pending images & barcodes now that we have an ID
        for (const img of images) await addProductImage(created.id, img.url, !!img.is_primary);
        for (const bc of barcodes) await addBarcode(created.id, bc.code, bc.pack_size, bc.label ?? undefined);
        invalidate();
        navigate({ to: "/admin/catalog/$id", params: { id: created.id } });
      }
    } catch (e) { toast.error((e as Error).message); } finally { setSaving(false); }
  }

  async function onDelete() {
    if (!initial?.id || !confirm("Apagar este produto? Não pode ser desfeito.")) return;
    try {
      await deleteProduct(initial.id);
      toast.success("Produto apagado.");
      invalidate();
      navigate({ to: "/admin/catalog" });
    } catch (e) { toast.error((e as Error).message); }
  }

  const inputCls = "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
  const labelCls = "text-xs font-bold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="space-y-8">
      {/* IDENTIFICAÇÃO */}
      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className={labelCls}>Nome do produto</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls + " text-lg font-semibold"} placeholder="Ex: Disjuntor DIN 20A Tramontina" />
        </div>
        <div>
          <label className={labelCls}>SKU interno</label>
          <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={inputCls + " font-mono"} placeholder="DJT-020" />
        </div>
        <div>
          <label className={labelCls}>Slug (URL futura)</label>
          <input value={form.slug ?? ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} placeholder="deixe em branco para gerar" />
        </div>
        <div>
          <label className={labelCls}>Categoria</label>
          <select value={form.category_id ?? ""} onChange={(e) => setForm({ ...form, category_id: e.target.value || null })} className={inputCls}>
            <option value="">— sem categoria —</option>
            {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Marca</label>
          <select value={form.brand_id ?? ""} onChange={(e) => setForm({ ...form, brand_id: e.target.value || null })} className={inputCls}>
            <option value="">— sem marca —</option>
            {brands.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Unidade</label>
          <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className={inputCls}>
            <option value="un">Unidade</option>
            <option value="m">Metro</option>
            <option value="kg">Quilo</option>
            <option value="cx">Caixa</option>
            <option value="pc">Peça</option>
            <option value="pct">Pacote</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>NCM</label>
          <input value={form.ncm ?? ""} onChange={(e) => setForm({ ...form, ncm: e.target.value })} className={inputCls + " font-mono"} placeholder="00000000" />
        </div>
        <div>
          <label className={labelCls}>Peso (kg)</label>
          <input type="number" step="0.001" value={form.weight_kg ?? ""} onChange={(e) => setForm({ ...form, weight_kg: e.target.value ? parseFloat(e.target.value) : null })} className={inputCls} />
        </div>
        <div className="flex items-end gap-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Destaque
          </label>
        </div>
        <div className="sm:col-span-3">
          <label className={labelCls}>Descrição curta</label>
          <input value={form.short_description ?? ""} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className={inputCls} maxLength={300} placeholder="Aparece em listagens" />
        </div>
        <div className="sm:col-span-3">
          <label className={labelCls}>Ficha técnica / descrição completa</label>
          <textarea rows={6} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
        </div>
      </section>

      {/* PREÇOS */}
      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4">
        <div className="sm:col-span-4">
          <h2 className="font-display text-lg font-bold">Preços</h2>
        </div>
        <div>
          <label className={labelCls}>Custo (R$)</label>
          <input type="number" step="0.01" value={form.cost_price ?? ""} onChange={(e) => setForm({ ...form, cost_price: e.target.value ? parseFloat(e.target.value) : null })} className={inputCls + " font-mono tabular-nums"} />
        </div>
        <div>
          <label className={labelCls}>Venda (R$)</label>
          <input type="number" step="0.01" value={form.sale_price ?? ""} onChange={(e) => setForm({ ...form, sale_price: e.target.value ? parseFloat(e.target.value) : null })} className={inputCls + " font-mono tabular-nums"} />
        </div>
        <div>
          <label className={labelCls}>Promoção (R$)</label>
          <input type="number" step="0.01" value={form.promo_price ?? ""} onChange={(e) => setForm({ ...form, promo_price: e.target.value ? parseFloat(e.target.value) : null })} className={inputCls + " font-mono tabular-nums"} />
        </div>
        <div>
          <label className={labelCls}>Estoque mínimo</label>
          <input type="number" step="0.001" value={form.min_stock ?? ""} onChange={(e) => setForm({ ...form, min_stock: e.target.value ? parseFloat(e.target.value) : 0 })} className={inputCls + " font-mono tabular-nums"} />
        </div>
        {form.cost_price && form.sale_price ? (
          <div className="sm:col-span-4 text-xs text-muted-foreground">
            Margem bruta: <b className="font-mono">{(((form.sale_price - form.cost_price) / form.sale_price) * 100).toFixed(1)}%</b>
          </div>
        ) : null}
      </section>

      {/* IMAGENS */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Imagens</h2>
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-60">
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
            Enviar imagem
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, images.length === 0); }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-lg border border-border">
              <img src={img.url} alt="" className="aspect-square w-full object-cover" />
              {form.cover_image_url === img.url && (
                <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">Capa</span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-1 opacity-0 transition group-hover:opacity-100">
                <button type="button" onClick={() => setForm({ ...form, cover_image_url: img.url })}
                  className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase text-black">Capa</button>
                <button type="button" onClick={() => removeImage(img)}
                  className="rounded bg-red-600/90 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  <X className="inline h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
              Nenhuma imagem ainda.
            </div>
          )}
        </div>
      </section>

      {/* CÓDIGOS DE BARRAS */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-bold">Códigos de barras</h2>
        <p className="text-xs text-muted-foreground">Adicione EAN/UPC. Múltiplos códigos por produto (unidade, caixa, etc).</p>
        <div className="mt-4 space-y-2">
          {barcodes.map((b) => (
            <div key={b.id} className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
              <span className="font-mono">{b.code}</span>
              <span className="text-xs text-muted-foreground">× {b.pack_size} {form.unit}</span>
              {b.label && <span className="text-xs text-muted-foreground">· {b.label}</span>}
              <button type="button" onClick={() => removeBarcodeRow(b)} className="ml-auto text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_120px_1fr_auto]">
          <input value={newBarcode.code} onChange={(e) => setNewBarcode({ ...newBarcode, code: e.target.value })}
            placeholder="Bipar ou digitar código" className={inputCls + " font-mono"} />
          <input type="number" step="0.001" value={newBarcode.pack_size}
            onChange={(e) => setNewBarcode({ ...newBarcode, pack_size: parseFloat(e.target.value) || 1 })}
            className={inputCls + " font-mono tabular-nums"} placeholder="Qtd" />
          <input value={newBarcode.label} onChange={(e) => setNewBarcode({ ...newBarcode, label: e.target.value })}
            placeholder="Rótulo (ex: caixa 100un)" className={inputCls} />
          <button type="button" onClick={handleAddBarcode}
            className="rounded-md bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            <Plus className="mr-1 inline h-3 w-3" /> Adicionar
          </button>
        </div>
      </section>

      {/* BARRA DE AÇÕES */}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-md sm:border sm:px-6">
        <div className="flex items-center gap-3 text-xs">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs font-bold uppercase">
            <option value="draft">Rascunho</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="discontinued">Descontinuado</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {isEdit && (
            <button type="button" onClick={onDelete}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
              Apagar
            </button>
          )}
          <button type="button" disabled={saving} onClick={() => save()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-60">
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}