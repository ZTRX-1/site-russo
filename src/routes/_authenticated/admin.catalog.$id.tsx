import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { getProduct } from "@/lib/catalog.functions";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/_authenticated/admin/catalog/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    retry: 1,
  });

  if (isLoading) return <div className="py-10 text-center text-sm text-muted-foreground">Carregando...</div>;

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
        <h2 className="mt-3 font-display text-lg font-bold">Produto não encontrado</h2>
        <p className="mt-2 text-sm text-muted-foreground">{error instanceof Error ? error.message : ""}</p>
        <button onClick={() => navigate({ to: "/admin/catalog" })}
          className="mt-4 rounded-md bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
          Voltar ao catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/catalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
      </Link>
      <div>
        <div className="text-xs font-mono text-muted-foreground">SKU {data.sku}</div>
        <h1 className="font-display text-3xl font-black">{data.name}</h1>
      </div>
      <ProductForm
        initial={{
          id: data.id,
          sku: data.sku,
          slug: data.slug,
          name: data.name,
          short_description: data.short_description ?? "",
          description: data.description ?? "",
          category_id: data.category_id,
          brand_id: data.brand_id,
          unit: data.unit,
          ncm: data.ncm ?? "",
          weight_kg: data.weight_kg == null ? null : Number(data.weight_kg),
          cost_price: data.cost_price == null ? null : Number(data.cost_price),
          sale_price: data.sale_price == null ? null : Number(data.sale_price),
          promo_price: data.promo_price == null ? null : Number(data.promo_price),
          min_stock: data.min_stock == null ? 0 : Number(data.min_stock),
          status: data.status,
          featured: data.featured,
          cover_image_url: data.cover_image_url,
          images: data.images ?? [],
          barcodes: (data.barcodes ?? []).map((b: { id: string; code: string; pack_size: number | string; label: string | null }) => ({ ...b, pack_size: Number(b.pack_size) })),
        }}
      />
    </div>
  );
}