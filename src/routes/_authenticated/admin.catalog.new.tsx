import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/_authenticated/admin/catalog/new")({
  component: NewProduct,
});

function NewProduct() {
  return (
    <div className="space-y-6">
      <Link to="/admin/catalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
      </Link>
      <h1 className="font-display text-3xl font-black">Novo produto</h1>
      <ProductForm />
    </div>
  );
}