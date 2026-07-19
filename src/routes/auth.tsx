import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapVexxonPassword } from "@/lib/admin.functions";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Entrar — Painel Russo" },
      { name: "description", content: "Área restrita do time editorial da Russo Elétrica." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const bootstrap = useServerFn(bootstrapVexxonPassword);

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
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setSubmitting(false);
    if (error) toast.error("Falha no login: " + error.message);
  }

  async function handleResetAdmin() {
    setResetting(true);
    try {
      await bootstrap({});
      toast.success("Senha do admin redefinida. Use Dev2712 para entrar.");
      setEmail("vexxoncompany@gmail.com");
      setPassword("Dev2712");
    } catch (err) {
      toast.error("Falha: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <h1 className="font-display text-3xl font-black text-foreground">Acesso restrito da equipe Russo</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com email e senha para administrar posts, equipe e conteúdo do site.
          </p>

          <form onSubmit={handleEmailLogin} className="mt-6 space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                type="email" required autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
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
            O acesso é por convite. Se você é do time, peça ao administrador para adicioná-lo em
            <Link to="/admin/users" className="ml-1 text-primary hover:underline">Equipe</Link>.
          </p>

          <button
            type="button"
            onClick={handleResetAdmin}
            disabled={resetting}
            className="mt-4 w-full rounded-md border border-border bg-background py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-foreground disabled:opacity-60"
          >
            {resetting ? "Redefinindo..." : "Redefinir senha do admin (vexxoncompany)"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}