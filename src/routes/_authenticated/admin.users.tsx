import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, Trash2 } from "lucide-react";
import {
  listTeamMembers,
  inviteTeamMember,
  setUserRole,
  removeTeamMember,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const listFn = useServerFn(listTeamMembers);
  const inviteFn = useServerFn(inviteTeamMember);
  const roleFn = useServerFn(setUserRole);
  const removeFn = useServerFn(removeTeamMember);
  const qc = useQueryClient();

  const { data: members } = useQuery({ queryKey: ["team-members"], queryFn: () => listFn() });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");
  const [inviting, setInviting] = useState(false);

  async function onInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    try {
      await inviteFn({ data: { email: email.trim(), role, displayName: name.trim() || undefined } });
      toast.success("Convite enviado por email!");
      setEmail(""); setName("");
      qc.invalidateQueries({ queryKey: ["team-members"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setInviting(false);
    }
  }

  async function toggleRole(userId: string, r: "admin" | "editor", enable: boolean) {
    try {
      await roleFn({ data: { userId, role: r, enable } });
      qc.invalidateQueries({ queryKey: ["team-members"] });
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function remove(userId: string) {
    if (!confirm("Remover papéis desse membro? Ele perde o acesso ao painel.")) return;
    try {
      await removeFn({ data: { userId } });
      qc.invalidateQueries({ queryKey: ["team-members"] });
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-black">Equipe</h1>
        <p className="text-sm text-muted-foreground">Convide editores e administradores para o painel.</p>
      </div>

      <form onSubmit={onInvite} className="grid gap-3 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[1fr_1fr_140px_auto]">
        <input required type="email" placeholder="email@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        <input placeholder="Nome (opcional)" value={name} onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "editor")}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={inviting}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-60">
          <UserPlus className="h-4 w-4" /> {inviting ? "Enviando..." : "Convidar"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Membro</th>
              <th className="px-4 py-3">Editor</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(members ?? []).map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3">
                  <div className="font-medium">{m.display_name || ","}</div>
                  <div className="text-xs text-muted-foreground">{m.email}</div>
                </td>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={m.roles.includes("editor")}
                    onChange={(e) => toggleRole(m.id, "editor", e.target.checked)}
                    className="h-4 w-4" />
                </td>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={m.roles.includes("admin")}
                    onChange={(e) => toggleRole(m.id, "admin", e.target.checked)}
                    className="h-4 w-4" />
                </td>
                <td className="px-4 py-3 text-right">
                  {m.roles.length > 0 && (
                    <button onClick={() => remove(m.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {members && members.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nenhum membro ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}