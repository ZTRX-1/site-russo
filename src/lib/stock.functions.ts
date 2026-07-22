import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export type MovementKind = "in" | "out" | "adjust" | "transfer_in" | "transfer_out" | "count";

export const KIND_LABEL: Record<MovementKind, string> = {
  in: "Entrada",
  out: "Saída",
  adjust: "Ajuste",
  transfer_in: "Transf. entrada",
  transfer_out: "Transf. saída",
  count: "Contagem",
};

/* LOCATIONS */

export async function listLocations() {
  const { data, error } = await supabase
    .from("stock_locations")
    .select("id, name, kind, active, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

const locationSchema = z.object({
  name: z.string().min(2).max(80),
  kind: z.enum(["store", "warehouse", "counter", "other"]).default("store"),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export async function upsertLocation(input: z.infer<typeof locationSchema> & { id?: string }) {
  const parsed = locationSchema.parse(input);
  if (input.id) {
    const { error } = await supabase.from("stock_locations").update(parsed).eq("id", input.id);
    if (error) throw new Error(error.message);
    return { id: input.id };
  }
  const { data, error } = await supabase.from("stock_locations").insert(parsed).select("id").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteLocation(id: string) {
  const { error } = await supabase.from("stock_locations").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* MOVEMENTS */

const movementSchema = z.object({
  product_id: z.string().uuid(),
  location_id: z.string().uuid(),
  kind: z.enum(["in", "out", "adjust", "transfer_in", "transfer_out", "count"]),
  quantity: z.number().refine((n) => n !== 0, { message: "Quantidade não pode ser zero." }),
  reason: z.string().max(200).optional().nullable(),
  document: z.string().max(80).optional().nullable(),
  unit_cost: z.number().nonnegative().optional().nullable(),
});

export type MovementInput = z.infer<typeof movementSchema>;

export async function createMovement(input: MovementInput) {
  const parsed = movementSchema.parse(input);
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user?.id) throw new Error("Sessão expirada.");
  const payload = { ...parsed, created_by: userData.user.id };
  const { data, error } = await supabase
    .from("stock_movements")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Transferência: gera saída no local origem + entrada no destino. */
export async function createTransfer(input: {
  product_id: string;
  from_location_id: string;
  to_location_id: string;
  quantity: number;
  reason?: string | null;
  document?: string | null;
}) {
  if (input.from_location_id === input.to_location_id) {
    throw new Error("Origem e destino precisam ser diferentes.");
  }
  if (input.quantity <= 0) throw new Error("Quantidade deve ser positiva.");
  const doc = input.document || `TRF-${Date.now().toString(36).toUpperCase()}`;
  await createMovement({
    product_id: input.product_id,
    location_id: input.from_location_id,
    kind: "transfer_out",
    quantity: input.quantity,
    reason: input.reason ?? null,
    document: doc,
    unit_cost: null,
  });
  await createMovement({
    product_id: input.product_id,
    location_id: input.to_location_id,
    kind: "transfer_in",
    quantity: input.quantity,
    reason: input.reason ?? null,
    document: doc,
    unit_cost: null,
  });
  return { document: doc };
}

export async function listMovements(filters: {
  productId?: string;
  locationId?: string;
  kind?: MovementKind | "all";
  limit?: number;
} = {}) {
  let q = supabase
    .from("stock_movements")
    .select(
      "id, kind, quantity, reason, document, unit_cost, created_at, product:products(id, sku, name), location:stock_locations(id, name)"
    )
    .order("created_at", { ascending: false })
    .limit(filters.limit ?? 200);
  if (filters.productId) q = q.eq("product_id", filters.productId);
  if (filters.locationId) q = q.eq("location_id", filters.locationId);
  if (filters.kind && filters.kind !== "all") q = q.eq("kind", filters.kind);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

/* BALANCES */

export async function listBalances(filters: { locationId?: string; lowStockOnly?: boolean } = {}) {
  let q = supabase
    .from("stock_balances")
    .select("product_id, location_id, balance, last_movement_at");
  if (filters.locationId) q = q.eq("location_id", filters.locationId);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  if (rows.length === 0) return [] as Array<{
    product_id: string;
    location_id: string;
    balance: number;
    last_movement_at: string | null;
    product: { id: string; sku: string; name: string; min_stock: number | null; sale_price: number | null } | null;
    location: { id: string; name: string } | null;
  }>;
  const productIds = Array.from(new Set(rows.map((r) => r.product_id)));
  const locationIds = Array.from(new Set(rows.map((r) => r.location_id)));
  const [{ data: products }, { data: locations }] = await Promise.all([
    supabase.from("products").select("id, sku, name, min_stock, sale_price").in("id", productIds),
    supabase.from("stock_locations").select("id, name").in("id", locationIds),
  ]);
  const pMap = new Map((products ?? []).map((p) => [p.id, p]));
  const lMap = new Map((locations ?? []).map((l) => [l.id, l]));
  const merged = rows.map((r) => ({
    ...r,
    balance: Number(r.balance),
    product: pMap.get(r.product_id) ?? null,
    location: lMap.get(r.location_id) ?? null,
  }));
  if (filters.lowStockOnly) {
    return merged.filter((r) => {
      const min = r.product?.min_stock ?? 0;
      return min > 0 && r.balance <= Number(min);
    });
  }
  return merged;
}

export async function getProductBalance(productId: string) {
  const { data, error } = await supabase
    .from("stock_balances")
    .select("location_id, balance, last_movement_at")
    .eq("product_id", productId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ ...r, balance: Number(r.balance) }));
}

/** Busca rápida para o scanner: por SKU exato, código de barras ou parte do nome. */
export async function searchProductQuick(term: string) {
  const t = term.trim();
  if (!t) return null;
  // 1) Código de barras exato
  const { data: bc } = await supabase
    .from("product_barcodes")
    .select("code, pack_size, product:products(id, sku, name, sale_price, cover_image_url, min_stock, unit)")
    .eq("code", t)
    .maybeSingle();
  if (bc?.product) {
    return { via: "barcode" as const, packSize: bc.pack_size ?? 1, product: bc.product };
  }
  // 2) SKU exato
  const { data: bySku } = await supabase
    .from("products")
    .select("id, sku, name, sale_price, cover_image_url, min_stock, unit")
    .ilike("sku", t)
    .maybeSingle();
  if (bySku) return { via: "sku" as const, packSize: 1, product: bySku };
  // 3) Nome contém
  const { data: byName } = await supabase
    .from("products")
    .select("id, sku, name, sale_price, cover_image_url, min_stock, unit")
    .ilike("name", `%${t}%`)
    .limit(1)
    .maybeSingle();
  if (byName) return { via: "name" as const, packSize: 1, product: byName };
  return null;
}