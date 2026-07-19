import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Login por nome de usuário OU email + senha.
 * Resolve o username para o email correspondente (via admin) e devolve a sessão.
 * O client faz supabase.auth.setSession com o resultado.
 */
export const loginWithIdentifier = createServerFn({ method: "POST" })
  .inputValidator((input: { identifier: string; password: string }) =>
    z
      .object({
        identifier: z.string().min(1).max(200),
        password: z.string().min(1).max(200),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const raw = data.identifier.trim();
    let email = raw;

    // Se não parece email, resolve pelo username
    if (!raw.includes("@")) {
      const { data: profile, error } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .ilike("username", raw)
        .maybeSingle();
      if (error) throw new Error("Falha ao verificar credenciais.");
      if (!profile?.email) throw new Error("Usuário ou senha inválidos.");
      email = profile.email;
    }

    // Assina com a chave publishable (respeita rate limit do GoTrue)
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const publicClient = createClient(process.env.SUPABASE_URL!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data: signIn, error: signErr } = await publicClient.auth.signInWithPassword({
      email,
      password: data.password,
    });
    if (signErr || !signIn.session) throw new Error("Usuário ou senha inválidos.");

    return {
      access_token: signIn.session.access_token,
      refresh_token: signIn.session.refresh_token,
    };
  });

/**
 * Cria o super administrador inicial (apenas quando não existe nenhum admin).
 * Após esse cadastro, a rota /setup fica bloqueada.
 */
export const createSuperAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) =>
    z
      .object({
        email: z.string().email().max(200),
        username: z
          .string()
          .min(3)
          .max(40)
          .regex(/^[a-zA-Z0-9_.-]+$/, "Use letras, números, ponto, hífen ou underline."),
        password: z.string().min(8).max(200),
        displayName: z.string().max(100).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Bloqueia se já existe qualquer admin
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);
    if ((count ?? 0) > 0) {
      throw new Error("O super administrador já foi criado. Cadastro bloqueado.");
    }

    // Confere unicidade do username
    const { data: usernameHit } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("username", data.username)
      .maybeSingle();
    if (usernameHit) throw new Error("Este nome de usuário já está em uso.");

    // Cria o usuário (trigger cria o profile via metadata)
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        display_name: data.displayName || data.username,
        username: data.username,
      },
    });
    if (createErr) throw new Error(createErr.message);
    const userId = created.user?.id;
    if (!userId) throw new Error("Falha ao criar usuário.");

    // Garante username no profile (caso o trigger não tenha rodado com metadata)
    await supabaseAdmin
      .from("profiles")
      .update({ username: data.username, display_name: data.displayName || data.username })
      .eq("id", userId);

    // Atribui papel admin
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (roleErr) throw new Error(roleErr.message);

    return { ok: true };
  });

/** Verifica se já existe algum admin cadastrado (usado por /setup). */
export const hasAnyAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw new Error(error.message);
  return { hasAdmin: (count ?? 0) > 0 };
});