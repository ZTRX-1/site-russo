GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;

GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;

GRANT SELECT ON public.analytics_sessions TO authenticated;
GRANT ALL ON public.analytics_sessions TO service_role;

GRANT SELECT ON public.analytics_leads TO authenticated;
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
  raw_identifier text := btrim(_identifier);
  resolved_email text;
BEGIN
  IF raw_identifier = '' THEN
    RETURN NULL;
  END IF;

  IF position('@' in raw_identifier) > 0 THEN
    RETURN lower(raw_identifier);
  END IF;

  SELECT email
  INTO resolved_email
  FROM public.profiles
  WHERE lower(username) = lower(raw_identifier)
  LIMIT 1;

  RETURN lower(resolved_email);
END;
$$;

GRANT EXECUTE ON FUNCTION public.resolve_login_email(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.claim_initial_admin(_username text, _display_name text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_username text := btrim(_username);
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado.';
  END IF;

  IF public.has_any_admin() THEN
    RAISE EXCEPTION 'O super administrador já foi criado. Cadastro bloqueado.';
  END IF;

  IF normalized_username !~ '^[a-zA-Z0-9_.-]{3,40}$' THEN
    RAISE EXCEPTION 'Use letras, números, ponto, hífen ou underline.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE lower(username) = lower(normalized_username)
      AND id <> auth.uid()
  ) THEN
    RAISE EXCEPTION 'Este nome de usuário já está em uso.';
  END IF;

  UPDATE public.profiles
  SET
    username = normalized_username,
    display_name = COALESCE(NULLIF(btrim(_display_name), ''), normalized_username),
    updated_at = now()
  WHERE id = auth.uid();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_initial_admin(text, text) TO authenticated;