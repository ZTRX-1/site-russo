import { supabase } from "@/integrations/supabase/client";

export async function loginWithIdentifier(input: { identifier: string; password: string }) {
  const identifier = input.identifier.trim();
  const { data: email, error: resolveError } = await supabase.rpc("resolve_login_email", {
    _identifier: identifier,
  });

  if (resolveError || !email) {
    throw new Error("Usuário ou senha inválidos.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error || !data.session) {
    throw new Error("Usuário ou senha inválidos.");
  }

  return { ok: true, session: data.session };
}

export async function createSuperAdmin(input: {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}) {
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim().toLowerCase();
  const displayName = input.displayName?.trim() || username;

  const signup = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      emailRedirectTo: window.location.origin,
      data: { display_name: displayName, username },
    },
  });

  if (signup.error) {
    const message = signup.error.message.toLowerCase();
    if (message.includes("already") || message.includes("registered")) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: input.password,
      });
      if (signInError) throw new Error("Este e-mail já existe. Entre com a senha correta para concluir o setup.");
    } else {
      throw new Error(signup.error.message);
    }
  }

  const { error: claimError } = await supabase.rpc("claim_initial_admin", {
    _username: username,
    _display_name: displayName,
  });

  if (claimError) throw new Error(claimError.message);
  return { ok: true };
}

export async function hasAnyAdmin() {
  const { data, error } = await supabase.rpc("has_any_admin");
  if (error) throw new Error(error.message);
  return { hasAdmin: Boolean(data) };
}