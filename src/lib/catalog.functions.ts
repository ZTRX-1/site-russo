import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export type ProductStatus = "draft" | "active" | "inactive" | "discontinued";

/* ==================== CATEGORIES ==================== */

export async function listCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, sort_order, active, icon")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

const categorySchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().max(120).optional(),
  parent_id: z.string().uuid().nullable().optional(),
  icon: z.string().max(40).optional().nullable(),
  sort_order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export async function upsertCategory(input: z.infer<typeof categorySchema> & { id?: string }) {
  const parsed = categorySchema.parse(input);
  const slug = parsed.slug?.trim() ? slugify(parsed.slug) : slugify(parsed.name);
  const payload = { ...parsed, slug, parent_id: parsed.parent_id || null };
  if (input.id) {
    const { error } = await supabase.from("categories").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
    return { id: input.id };
  }
  const { data, error } = await supabase.from("categories").insert(payload).select("id").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ==================== BRANDS ==================== */

export async function listBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("id, name, slug, logo_url, active")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

const brandSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().max(120).optional(),
  logo_url: z.string().max(1000).optional().nullable(),
  active: z.boolean().default(true),
});

export async function upsertBrand(input: z.infer<typeof brandSchema> & { id?: string }) {
  const parsed = brandSchema.parse(input);
  const slug = parsed.slug?.trim() ? slugify(parsed.slug) : slugify(parsed.name);
  const payload = { ...parsed, slug };
  if (input.id) {
    const { error } = await supabase.from("brands").update(payload).eq("id", input.id);
    if (error) throw new Error(error.message);
    return { id: input.id };
  }
  const { data, error } = await supabase.from("brands").insert(payload).select("id").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteBrand(id: string) {
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ==================== PRODUCTS ==================== */

export async function listProducts(filters: {
  search?: string;
  status?: ProductStatus | "all";
  categoryId?: string | null;
  brandId?: string | null;
} = {}) {
  let q = supabase
    .from("products")
    .select("id, sku, slug, name, status, sale_price, cost_price, cover_image_url, category_id, brand_id, updated_at, featured")
    .order("updated_at", { ascending: false })
    .limit(200);
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.categoryId) q = q.eq("category_id", filters.categoryId);
  if (filters.brandId) q = q.eq("brand_id", filters.brandId);
  if (filters.search?.trim()) {
    const s = filters.search.trim();
    q = q.or(`name.ilike.%${s}%,sku.ilike.%${s}%`);
  }
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, images:product_images(id, url, alt, sort_order, is_primary), barcodes:product_barcodes(id, code, pack_size, label)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Produto não encontrado.");
  return data;
}

export async function findProductByBarcode(code: string) {
  const cleaned = code.trim();
  if (!cleaned) return null;
  const { data, error } = await supabase
    .from("product_barcodes")
    .select("code, pack_size, product:products(id, sku, name, sale_price, status, cover_image_url)")
    .eq("code", cleaned)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

const productSchema = z.object({
  sku: z.string().min(1).max(60),
  slug: z.string().max(120).optional(),
  name: z.string().min(2).max(200),
  short_description: z.string().max(300).optional().nullable(),
  description: z.string().max(20000).optional().nullable(),
  category_id: z.string().uuid().nullable().optional(),
  brand_id: z.string().uuid().nullable().optional(),
  unit: z.string().max(10).default("un"),
  ncm: z.string().max(20).optional().nullable(),
  weight_kg: z.number().nonnegative().nullable().optional(),
  cost_price: z.number().nonnegative().nullable().optional(),
  sale_price: z.number().nonnegative().nullable().optional(),
  promo_price: z.number().nonnegative().nullable().optional(),
  min_stock: z.number().nonnegative().nullable().optional(),
  status: z.enum(["draft", "active", "inactive", "discontinued"]).default("draft"),
  featured: z.boolean().default(false),
  cover_image_url: z.string().max(2000).nullable().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export async function createProduct(input: ProductInput) {
  const parsed = productSchema.parse(input);
  const slug = parsed.slug?.trim() ? slugify(parsed.slug) : slugify(parsed.name);
  const { data: userData } = await supabase.auth.getUser();
  const payload: Record<string, unknown> = {
    ...parsed,
    slug,
    category_id: parsed.category_id || null,
    brand_id: parsed.brand_id || null,
    created_by: userData.user?.id ?? null,
  };
  const { data, error } = await supabase.from("products").insert(payload).select("id, slug").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id: string, input: ProductInput) {
  const parsed = productSchema.parse(input);
  const slug = parsed.slug?.trim() ? slugify(parsed.slug) : slugify(parsed.name);
  const payload: Record<string, unknown> = {
    ...parsed,
    slug,
    category_id: parsed.category_id || null,
    brand_id: parsed.brand_id || null,
  };
  const { error } = await supabase.from("products").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  return { id };
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ==================== IMAGES ==================== */

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  const { data: signed, error: signErr } = await supabase.storage
    .from("product-images")
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signErr) throw new Error(signErr.message);
  return signed.signedUrl;
}

export async function addProductImage(productId: string, url: string, isPrimary = false) {
  const { error } = await supabase.from("product_images").insert({ product_id: productId, url, is_primary: isPrimary });
  if (error) throw new Error(error.message);
}

export async function deleteProductImage(id: string) {
  const { error } = await supabase.from("product_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ==================== BARCODES ==================== */

export async function addBarcode(productId: string, code: string, packSize = 1, label?: string) {
  const { error } = await supabase.from("product_barcodes").insert({
    product_id: productId,
    code: code.trim(),
    pack_size: packSize,
    label: label || null,
  });
  if (error) throw new Error(error.message);
}

export async function deleteBarcode(id: string) {
  const { error } = await supabase.from("product_barcodes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}