import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export type PurchaseOrderStatus = "draft" | "placed" | "partial" | "received" | "canceled";

export const PO_STATUS_LABEL: Record<PurchaseOrderStatus, string> = {
  draft: "Rascunho",
  placed: "Enviado",
  partial: "Parcial",
  received: "Recebido",
  canceled: "Cancelado",
};

/* ================= SUPPLIERS ================= */

const supplierSchema = z.object({
  name: z.string().min(2).max(120),
  legal_name: z.string().max(160).optional().nullable(),
  document: z.string().max(30).optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  phone: z.string().max(30).optional().nullable(),
  contact_name: z.string().max(120).optional().nullable(),
  payment_terms: z.string().max(120).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  active: z.boolean().default(true),
});

export type SupplierInput = z.infer<typeof supplierSchema>;

export async function listSuppliers(search?: string) {
  let q = supabase
    .from("suppliers")
    .select("id, name, legal_name, document, email, phone, contact_name, payment_terms, active, updated_at")
    .order("name", { ascending: true })
    .limit(500);
  if (search?.trim()) {
    const s = search.trim();
    q = q.or(`name.ilike.%${s}%,legal_name.ilike.%${s}%,document.ilike.%${s}%`);
  }
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSupplier(id: string) {
  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Fornecedor não encontrado.");
  return data;
}

export async function upsertSupplier(input: SupplierInput & { id?: string }) {
  const parsed = supplierSchema.parse(input);
  const payload = { ...parsed, email: parsed.email || null };
  if (input.id) {
    const { error } = await supabase.from("suppliers").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
    return { id: input.id };
  }
  const { data, error } = await supabase.from("suppliers").insert(payload).select("id").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSupplier(id: string) {
  const { error } = await supabase.from("suppliers").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ================= PURCHASE ORDERS ================= */

export async function listPurchaseOrders(filters: { status?: PurchaseOrderStatus | "all"; supplierId?: string } = {}) {
  let q = supabase
    .from("purchase_orders")
    .select("id, code, status, expected_at, received_at, freight, discount, created_at, supplier:suppliers(id, name), location:stock_locations(id, name)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.supplierId) q = q.eq("supplier_id", filters.supplierId);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPurchaseOrder(id: string) {
  const { data, error } = await supabase
    .from("purchase_orders")
    .select("*, supplier:suppliers(id, name, phone, email), location:stock_locations(id, name), items:purchase_order_items(id, product_id, quantity, received_quantity, unit_cost, notes, product:products(id, sku, name, unit))")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Pedido não encontrado.");
  return data;
}

const poItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().positive(),
  unit_cost: z.number().nonnegative(),
  notes: z.string().max(240).optional().nullable(),
});

const poSchema = z.object({
  supplier_id: z.string().uuid(),
  location_id: z.string().uuid().optional().nullable(),
  status: z.enum(["draft", "placed", "partial", "received", "canceled"]).default("draft"),
  expected_at: z.string().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  freight: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  items: z.array(poItemSchema).min(1, "Adicione ao menos um item."),
});

export type PurchaseOrderInput = z.infer<typeof poSchema>;

function nextCode() {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OC${y}${m}-${r}`;
}

export async function createPurchaseOrder(input: PurchaseOrderInput) {
  const parsed = poSchema.parse(input);
  const { data: userData } = await supabase.auth.getUser();
  const code = nextCode();
  const { data: po, error } = await supabase
    .from("purchase_orders")
    .insert({
      code,
      supplier_id: parsed.supplier_id,
      location_id: parsed.location_id || null,
      status: parsed.status,
      expected_at: parsed.expected_at || null,
      notes: parsed.notes || null,
      freight: parsed.freight,
      discount: parsed.discount,
      created_by: userData.user?.id ?? null,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const itemsPayload = parsed.items.map((it) => ({ ...it, purchase_order_id: po.id }));
  const { error: itErr } = await supabase.from("purchase_order_items").insert(itemsPayload);
  if (itErr) throw new Error(itErr.message);
  return { id: po.id, code };
}

export async function updatePurchaseOrderHeader(id: string, patch: {
  status?: PurchaseOrderStatus;
  expected_at?: string | null;
  notes?: string | null;
  freight?: number;
  discount?: number;
  location_id?: string | null;
}) {
  const { error } = await supabase.from("purchase_orders").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deletePurchaseOrder(id: string) {
  const { error } = await supabase.from("purchase_orders").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function receivePurchaseOrderItem(itemId: string, quantity: number, locationId: string | null) {
  const { error } = await supabase.rpc("receive_purchase_order_item", {
    _item_id: itemId,
    _quantity: quantity,
    _location_id: locationId,
  });
  if (error) throw new Error(error.message);
}

export async function listSupplierCosts(supplierId: string, productId?: string) {
  let q = supabase
    .from("supplier_product_costs")
    .select("id, unit_cost, recorded_at, product:products(id, sku, name), purchase_order:purchase_orders(id, code)")
    .eq("supplier_id", supplierId)
    .order("recorded_at", { ascending: false })
    .limit(100);
  if (productId) q = q.eq("product_id", productId);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}