
-- LOCATIONS
CREATE TABLE public.stock_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'store' CHECK (kind IN ('store','warehouse','counter','other')),
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_locations TO authenticated;
GRANT ALL ON public.stock_locations TO service_role;
ALTER TABLE public.stock_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read locations" ON public.stock_locations FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff manage locations" ON public.stock_locations FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_stock_locations_updated BEFORE UPDATE ON public.stock_locations FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.stock_locations (name, kind, sort_order) VALUES
  ('Loja / Balcão','counter',1),
  ('Depósito interno','warehouse',2),
  ('Reserva','other',3);

-- MOVEMENTS (immutable ledger)
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  location_id UUID NOT NULL REFERENCES public.stock_locations(id) ON DELETE RESTRICT,
  kind TEXT NOT NULL CHECK (kind IN ('in','out','adjust','transfer_in','transfer_out','count')),
  quantity NUMERIC(12,3) NOT NULL CHECK (quantity <> 0),
  reason TEXT,
  document TEXT,
  unit_cost NUMERIC(12,2),
  related_id UUID,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.stock_movements TO authenticated;
GRANT ALL ON public.stock_movements TO service_role;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff read movements" ON public.stock_movements FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert movements" ON public.stock_movements FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND created_by = auth.uid());

CREATE INDEX idx_stock_mov_product ON public.stock_movements(product_id, created_at DESC);
CREATE INDEX idx_stock_mov_location ON public.stock_movements(location_id, created_at DESC);
CREATE INDEX idx_stock_mov_created ON public.stock_movements(created_at DESC);

-- BALANCES view (live sum). For scale later we can convert to materialized.
CREATE OR REPLACE VIEW public.stock_balances
WITH (security_invoker = true)
AS
SELECT
  m.product_id,
  m.location_id,
  SUM(
    CASE
      WHEN m.kind IN ('in','transfer_in','count') THEN m.quantity
      WHEN m.kind IN ('out','transfer_out') THEN -m.quantity
      WHEN m.kind = 'adjust' THEN m.quantity
      ELSE 0
    END
  )::NUMERIC(12,3) AS balance,
  MAX(m.created_at) AS last_movement_at
FROM public.stock_movements m
GROUP BY m.product_id, m.location_id;

GRANT SELECT ON public.stock_balances TO authenticated;
GRANT SELECT ON public.stock_balances TO service_role;
