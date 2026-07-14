import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Verifica se o usuário atual é staff (admin ou editor)
export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    const roles = (data ?? []).map((r) => r.role as "admin" | "editor");
    return {
      roles,
      isAdmin: roles.includes("admin"),
      isEditor: roles.includes("editor") || roles.includes("admin"),
      userId: context.userId,
    };
  });

// Admin lista todos os usuários (para painel de equipe)
export const listTeamMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Apenas administradores podem ver a equipe.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, email, created_at")
      .order("created_at", { ascending: true });
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const roleMap = new Map<string, string[]>();
    (roles ?? []).forEach((r) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });
    return (profiles ?? []).map((p) => ({
      id: p.id,
      email: p.email,
      display_name: p.display_name,
      created_at: p.created_at,
      roles: roleMap.get(p.id) ?? [],
    }));
  });

// Convida um novo membro (admin only)
export const inviteTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string; role: "admin" | "editor"; displayName?: string }) =>
    z
      .object({
        email: z.string().email().max(200),
        role: z.enum(["admin", "editor"]),
        displayName: z.string().max(100).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Apenas administradores podem convidar.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const origin = process.env.SITE_URL || "";
    const { data: invite, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
      redirectTo: origin ? `${origin}/auth` : undefined,
      data: data.displayName ? { display_name: data.displayName } : undefined,
    });
    if (error) throw new Error(error.message);
    const userId = invite.user?.id;
    if (!userId) throw new Error("Falha ao criar convite.");
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: data.role });
    if (roleErr) throw new Error(roleErr.message);
    return { ok: true, userId };
  });

// Assign role (admin only)
export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; role: "admin" | "editor"; enable: boolean }) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["admin", "editor"]),
        enable: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Apenas administradores podem alterar papéis.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.enable) {
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
    } else {
      await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
    }
    return { ok: true };
  });

// Remove user (admin only, only removes role — auth user preserved)
export const removeTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) =>
    z.object({ userId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Apenas administradores podem remover membros.");
    if (data.userId === context.userId) throw new Error("Você não pode remover a si mesmo.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    return { ok: true };
  });

// Promove um usuário existente pelo email para admin (first-time setup)
// Só permite se ainda NÃO existir nenhum admin.
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) throw new Error("Já existe um administrador.");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: context.userId, role: "admin" },
        { onConflict: "user_id,role" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });