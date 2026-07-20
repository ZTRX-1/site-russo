import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { loginWithIdentifier } from "@/lib/auth.functions";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Entrar, Painel Russo" },
      { name: "description", content: "Área restrita do time editorial da Russo Elétrica." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (search.redirect && search.redirect.startsWith("/")) ? search.redirect : "/admin";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: redirectTo, replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: redirectTo, replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, redirectTo]);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginWithIdentifier({ identifier: identifier.trim(), password });
      navigate({ to: redirectTo, replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no login.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <h1 className="font-display text-3xl font-black text-foreground">Acesso restrito da equipe Russo</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com seu usuário ou email e senha para administrar o site.
          </p>

          <form onSubmit={handleEmailLogin} className="mt-6 space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Usuário ou email</label>
              <input
                type="text" required autoComplete="username"
                value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Senha</label>
              <input
                type="password" required autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit" disabled={submitting}
              className="mt-2 w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-red-glow)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {submitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground">
            O acesso é apenas para membros autorizados. Se ainda não há administrador cadastrado, use
            <Link to="/setup" className="ml-1 text-primary hover:underline">o cadastro inicial</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}