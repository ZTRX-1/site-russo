import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteSupplier, listSuppliers, upsertSupplier, SupplierInput } from "@/lib/purchases.functions";
import { Plus, Trash2, ArrowLeft, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/purchases/suppliers")({
  component: SuppliersPage,
});

const EMPTY: SupplierInput & { id?: string } = {
  name: "",
  legal_name: "",
  document: "",
  email: "",
  phone: "",
  contact_name: "",
  payment_terms: "",
  notes: "",
  active: true,
};

function SuppliersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<SupplierInput & { id?: string }>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const q = useQuery({ queryKey: ["suppliers", search], queryFn: () => listSuppliers(search) });

  const save = useMutation({
    mutationFn: () => upsertSupplier(form),
    onSuccess: () => {
      setForm(EMPTY);
      setShowForm(false);
      qc.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["suppliers"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/admin/purchases" className="rounded-md border border-border p-2 hover:bg-accent"><ArrowLeft className="h-4 w-4" /></Link>
          <div>
            <h1 className="font-display text-2xl font-black">Fornecedores</h1>
            <p className="text-sm text-muted-foreground">Cadastro de parceiros de compra.</p>
          </div>
        </div>
        <button onClick={() => { setForm(EMPTY); setShowForm((v) => !v); }} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> {showForm ? "Fechar" : "Novo fornecedor"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
          className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium">Nome *</span>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Razão social</span>
            <input value={form.legal_name ?? ""} onChange={(e) => setForm({ ...form, legal_name: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">CNPJ / documento</span>
            <input value={form.document ?? ""} onChange={(e) => setForm({ ...form, document: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Contato</span>
            <input value={form.contact_name ?? ""} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Telefone</span>
            <input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">E-mail</span>
            <input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Condição de pagamento</span>
            <input placeholder="ex.: 30/60/90" value={form.payment_terms ?? ""} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium">Observações</span>
            <textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="rounded-md border border-border bg-background px-3 py-2" />
          </label>
          <div className="flex items-center justify-between sm:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Ativo
            </label>
            <button type="submit" disabled={save.isPending} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
              {save.isPending ? "Salvando..." : "Salvar"}
            </button>
          </div>
          {save.error instanceof Error && (
            <p className="text-sm text-destructive sm:col-span-2">{save.error.message}</p>
          )}
        </form>
      )}

      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome, razão social ou CNPJ" className="w-full bg-transparent text-sm outline-none" />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Contato</th>
              <th className="px-4 py-2 text-left">Telefone</th>
              <th className="px-4 py-2 text-left">Pagamento</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {(q.data ?? []).length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Nenhum fornecedor cadastrado.</td></tr>
            )}
            {(q.data ?? []).map((s) => (
              <tr key={s.id} className="border-t border-border hover:bg-accent/40">
                <td className="px-4 py-2">
                  <div className="font-medium">{s.name}</div>
                  {s.legal_name && <div className="text-xs text-muted-foreground">{s.legal_name}</div>}
                </td>
                <td className="px-4 py-2 text-muted-foreground">{s.contact_name ?? "—"}</td>
                <td className="px-4 py-2 text-muted-foreground">{s.phone ?? "—"}</td>
                <td className="px-4 py-2 text-muted-foreground">{s.payment_terms ?? "—"}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}`}>
                    {s.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="inline-flex gap-1">
                    <button
                      onClick={() => { setForm({ ...s, notes: "", email: s.email ?? "", legal_name: s.legal_name ?? "", document: s.document ?? "", phone: s.phone ?? "", contact_name: s.contact_name ?? "", payment_terms: s.payment_terms ?? "" }); setShowForm(true); }}
                      className="rounded-md border border-border px-2 py-1 text-xs hover:bg-accent"
                    >Editar</button>
                    <button
                      onClick={() => { if (confirm(`Remover fornecedor "${s.name}"?`)) remove.mutate(s.id); }}
                      className="rounded-md border border-border px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                    ><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}