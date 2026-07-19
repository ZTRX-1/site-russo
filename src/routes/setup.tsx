import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createSuperAdmin, hasAnyAdmin, loginWithIdentifier } from "@/lib/auth.functions";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Cadastro do super administrador" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SetupPage,
});

function SetupPage() {
  const navigate = useNavigate();
  const check = useServerFn(hasAnyAdmin);
  const create = useServerFn(createSuperAdmin);
  const doLogin = useServerFn(loginWithIdentifier);

  const { data: status, isLoading } = useQuery({
    queryKey: ["setup-status"],
    queryFn: () => check(),
  });

  const [form, setForm] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("As senhas não conferem.");
      return;
    }
    setSubmitting(true);
    try {
      await create({
        data: {
          email: form.email.trim(),
          username: form.username.trim(),
          password: form.password,
          displayName: form.displayName.trim() || undefined,
        },
      });
      // login automático
      const tokens = await doLogin({
        data: { identifier: form.username.trim(), password: form.password },
      });
      await supabase.auth.setSession({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
      toast.success("Super administrador criado com sucesso.");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao criar administrador.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <h1 className="font-display text-3xl font-black text-foreground">
            Cadastro do super administrador
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta página só funciona uma vez. Após criar o administrador, o cadastro é bloqueado.
          </p>

          {isLoading ? (
            <p className="mt-8 text-sm text-muted-foreground">Verificando...</p>
          ) : status?.hasAdmin ? (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-foreground">
                Já existe um administrador cadastrado. O cadastro inicial está bloqueado.
              </p>
              <Link
                to="/auth"
                className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground"
              >
                Ir para o login
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <Field label="Nome de exibição">
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  placeholder="Ex: Vitor Russo"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label="Usuário">
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="ex: vitor"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label="Senha (mínimo 8 caracteres)">
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label="Confirmar senha">
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-red-glow)] transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? "Criando..." : "Criar super administrador"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}