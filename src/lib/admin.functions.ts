import { supabase } from "@/integrations/supabase/client";

export async function getMyRoles() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error("Sessão expirada. Entre novamente.");
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r) => r.role as "admin" | "editor");
  return {
    roles,
    isAdmin: roles.includes("admin"),
    isEditor: roles.includes("editor") || roles.includes("admin"),
    userId: userData.user.id,
  };
}

export async function listTeamMembers() {
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name, email, username, created_at")
    .order("created_at", { ascending: true });
  if (profilesError) throw new Error(profilesError.message);

  const { data: roles, error: rolesError } = await supabase.from("user_roles").select("user_id, role");
  if (rolesError) throw new Error(rolesError.message);

  const roleMap = new Map<string, string[]>();
  (roles ?? []).forEach((r) => {
    const arr = roleMap.get(r.user_id) ?? [];
    arr.push(r.role);
    roleMap.set(r.user_id, arr);
  });

  return (profiles ?? []).map((p) => ({ ...p, roles: roleMap.get(p.id) ?? [] }));
}

export async function inviteTeamMember() {
  throw new Error("Convites por e-mail exigem publicação no Lovable. Por enquanto, use o setup inicial para o super administrador.");
}

export async function setUserRole(input: { userId: string; role: "admin" | "editor"; enable: boolean }) {
  if (input.enable) {
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: input.userId, role: input.role }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", input.userId).eq("role", input.role);
    if (error) throw new Error(error.message);
  }
  return { ok: true };
}

export async function removeTeamMember(input: { userId: string }) {
  const { data: userData } = await supabase.auth.getUser();
  if (userData.user?.id === input.userId) throw new Error("Você não pode remover a si mesmo.");
  const { error } = await supabase.from("user_roles").delete().eq("user_id", input.userId);
  if (error) throw new Error(error.message);
  return { ok: true };
}