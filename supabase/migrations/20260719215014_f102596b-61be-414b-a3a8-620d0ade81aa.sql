GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;

GRANT SELECT ON public.analytics_visitors TO authenticated;
GRANT SELECT ON public.analytics_sessions TO authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT SELECT ON public.analytics_leads TO authenticated;
GRANT ALL ON public.analytics_visitors TO service_role;
GRANT ALL ON public.analytics_sessions TO service_role;
GRANT ALL ON public.analytics_events TO service_role;
GRANT ALL ON public.analytics_leads TO service_role;

CREATE OR REPLACE FUNCTION public.has_any_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.has_any_admin() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.resolve_login_email(_identifier text)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cleaned text := lower(trim(coalesce(_identifier, '')));
  resolved_email text;
BEGIN
  IF cleaned = '' OR length(cleaned) > 200 THEN
    RAISE EXCEPTION 'Usuário ou senha inválidos.';
  END IF;

  IF position('@' in cleaned) > 0 THEN
    RETURN cleaned;
  END IF;

  SELECT lower(email)
    INTO resolved_email
  FROM public.profiles
  WHERE lower(username) = cleaned
  LIMIT 1;

  IF resolved_email IS NULL THEN
    RAISE EXCEPTION 'Usuário ou senha inválidos.';
  END IF;

  RETURN resolved_email;
END;
$$;

GRANT EXECUTE ON FUNCTION public.resolve_login_email(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.claim_initial_admin(_username text, _display_name text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  current_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  cleaned_username text := lower(trim(coalesce(_username, '')));
  final_display_name text := nullif(trim(coalesce(_display_name, '')), '');
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Faça login para concluir o cadastro inicial.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'O super administrador já foi criado. Cadastro bloqueado.';
  END IF;

  IF cleaned_username !~ '^[a-z0-9_.-]{3,40}$' THEN
    RAISE EXCEPTION 'Use um usuário de 3 a 40 caracteres com letras, números, ponto, hífen ou underline.';
  END IF;

  IF current_email = '' THEN
    RAISE EXCEPTION 'Não foi possível identificar o e-mail da conta.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE lower(username) = cleaned_username
      AND id <> current_user_id
  ) THEN
    RAISE EXCEPTION 'Este nome de usuário já está em uso.';
  END IF;

  INSERT INTO public.profiles (id, email, display_name, username)
  VALUES (
    current_user_id,
    current_email,
    coalesce(final_display_name, cleaned_username),
    cleaned_username
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    display_name = excluded.display_name,
    username = excluded.username,
    updated_at = now();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (current_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_initial_admin(text, text) TO authenticated;