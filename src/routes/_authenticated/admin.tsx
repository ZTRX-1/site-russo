import { createFileRoute, Outlet, Link, useRouter, useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, FileText, Users, LayoutDashboard, ShieldAlert, Home, BarChart3 } from "lucide-react";
import { getMyRoles, claimFirstAdmin } from "@/lib/admin.functions";
import { signOut } from "@/lib/auth/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const getRoles = useServerFn(getMyRoles);
  const claim = useServerFn(claimFirstAdmin);
  const router = useRouter();
  const loc = useLocation();
  const queryClient = useQueryClient();

  const { data: me, isLoading, refetch } = useQuery({
    queryKey: ["me-roles"],
    queryFn: () => getRoles(),
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    router.navigate({ to: "/auth", replace: true });
  }

  async function handleClaim() {
    try {
      await claim();
      toast.success("Você agora é administrador!");
      refetch();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Carregando painel...</div>;
  }

  const isStaff = me?.isEditor || me?.isAdmin;

  if (!isStaff) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-display text-2xl font-black text-foreground">Sem permissão</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua conta não tem acesso ao painel editorial. Peça a um administrador para te adicionar
            à equipe, ou, se este é o primeiro acesso ao painel e ainda não há nenhum admin ,
            você pode se promover automaticamente abaixo.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={handleClaim}
              className="rounded-md bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground"
            >Sou o primeiro admin</button>
            <button
              onClick={handleSignOut}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
            >Sair</button>
          </div>
        </div>
      </div>
    );
  }

  const navItems: { to: string; label: string; icon: typeof FileText; exact?: boolean }[] = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/posts", label: "Posts", icon: FileText },
    ...(me?.isAdmin ? [{ to: "/admin/analytics", label: "Analytics", icon: BarChart3 }] : []),
    ...(me?.isAdmin ? [{ to: "/admin/users", label: "Equipe", icon: Users }] : []),
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/" className="font-display text-lg font-black">RUSSO / ADMIN</Link>
        </div>
        <nav className="p-3">
          {navItems.map((n) => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to as "/admin"}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-1 border-t border-border p-3">
          <Link to="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent">
            <Home className="h-4 w-4" /> Ver site
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6 lg:hidden">
          <Link to="/" className="font-display text-base font-black">RUSSO / ADMIN</Link>
          <button onClick={handleSignOut} className="text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-border bg-card px-4 py-2 lg:hidden">
          {navItems.map((n) => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as "/admin"}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium ${
                  active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}>{n.label}</Link>
            );
          })}
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}