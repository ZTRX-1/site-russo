
-- Visitors
CREATE TABLE public.analytics_visitors (
  id uuid PRIMARY KEY,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  first_referrer text,
  first_utm_source text,
  first_utm_medium text,
  first_utm_campaign text,
  country text,
  city text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.analytics_visitors TO authenticated;
GRANT ALL ON public.analytics_visitors TO service_role;
ALTER TABLE public.analytics_visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read visitors" ON public.analytics_visitors
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Sessions
CREATE TABLE public.analytics_sessions (
  id uuid PRIMARY KEY,
  visitor_id uuid NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  landing_path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  fbclid text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sessions_visitor ON public.analytics_sessions(visitor_id);
CREATE INDEX idx_sessions_started ON public.analytics_sessions(started_at DESC);
CREATE INDEX idx_sessions_utm_source ON public.analytics_sessions(utm_source);
GRANT SELECT ON public.analytics_sessions TO authenticated;
GRANT ALL ON public.analytics_sessions TO service_role;
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read sessions" ON public.analytics_sessions
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Events
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL,
  session_id uuid NOT NULL,
  event_type text NOT NULL,
  path text NOT NULL,
  target text,
  title text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_events_created ON public.analytics_events(created_at DESC);
CREATE INDEX idx_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_events_session ON public.analytics_events(session_id);
CREATE INDEX idx_events_path ON public.analytics_events(path);
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read events" ON public.analytics_events
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Leads
CREATE TABLE public.analytics_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL,
  session_id uuid NOT NULL,
  source_event text NOT NULL,
  path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  fbclid text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_leads_created ON public.analytics_leads(created_at DESC);
CREATE INDEX idx_leads_utm_source ON public.analytics_leads(utm_source);
GRANT SELECT ON public.analytics_leads TO authenticated;
GRANT ALL ON public.analytics_leads TO service_role;
ALTER TABLE public.analytics_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read leads" ON public.analytics_leads
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
