
-- ============ SUPPLIERS ============
CREATE TABLE public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legal_name text,
  document text,
  email text,
  phone text,
  contact_name text,
  payment_terms text,
  notes text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX suppliers_name_trgm ON public.suppliers USING gin (name gin_trgm_ops);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO authenticated;
GRANT ALL ON public.suppliers TO service_role;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read suppliers" ON public.suppliers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write suppliers" ON public.suppliers FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ PURCHASE ORDERS ============
CREATE TYPE public.purchase_order_status AS ENUM ('draft','placed','partial','received','canceled');

CREATE TABLE public.purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  location_id uuid REFERENCES public.stock_locations(id) ON DELETE SET NULL,
  status public.purchase_order_status NOT NULL DEFAULT 'draft',
  expected_at date,
  received_at timestamptz,
  notes text,
  freight numeric(12,2) NOT NULL DEFAULT 0,
  discount numeric(12,2) NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX purchase_orders_supplier ON public.purchase_orders(supplier_id);
CREATE INDEX purchase_orders_status ON public.purchase_orders(status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_orders TO authenticated;
GRANT ALL ON public.purchase_orders TO service_role;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read POs" ON public.purchase_orders FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write POs" ON public.purchase_orders FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ PURCHASE ORDER ITEMS ============
CREATE TABLE public.purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
  received_quantity numeric(14,3) NOT NULL DEFAULT 0,
  unit_cost numeric(12,4) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX poi_po ON public.purchase_order_items(purchase_order_id);
CREATE INDEX poi_product ON public.purchase_order_items(product_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.purchase_order_items TO authenticated;
GRANT ALL ON public.purchase_order_items TO service_role;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read POI" ON public.purchase_order_items FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write POI" ON public.purchase_order_items FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ SUPPLIER COST HISTORY (auto by trigger on receive) ============
CREATE TABLE public.supplier_product_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  unit_cost numeric(12,4) NOT NULL,
  purchase_order_id uuid REFERENCES public.purchase_orders(id) ON DELETE SET NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX spc_pair ON public.supplier_product_costs(supplier_id, product_id, recorded_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supplier_product_costs TO authenticated;
GRANT ALL ON public.supplier_product_costs TO service_role;
ALTER TABLE public.supplier_product_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read SPC" ON public.supplier_product_costs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write SPC" ON public.supplier_product_costs FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ RECEIVE FUNCTION: creates stock_movements + updates PO status ============
CREATE OR REPLACE FUNCTION public.receive_purchase_order_item(
  _item_id uuid,
  _quantity numeric,
  _location_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item public.purchase_order_items%ROWTYPE;
  v_po public.purchase_orders%ROWTYPE;
  v_pending numeric;
  v_total_qty numeric;
  v_total_recv numeric;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Sem permissão.';
  END IF;
  IF _quantity <= 0 THEN
    RAISE EXCEPTION 'Quantidade deve ser positiva.';
  END IF;

  SELECT * INTO v_item FROM public.purchase_order_items WHERE id = _item_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Item não encontrado.'; END IF;

  SELECT * INTO v_po FROM public.purchase_orders WHERE id = v_item.purchase_order_id FOR UPDATE;
  IF v_po.status = 'canceled' THEN RAISE EXCEPTION 'Pedido cancelado.'; END IF;

  v_pending := v_item.quantity - v_item.received_quantity;
  IF _quantity > v_pending THEN
    RAISE EXCEPTION 'Quantidade acima do pendente (%.).', v_pending;
  END IF;

  -- stock entry
  INSERT INTO public.stock_movements (product_id, location_id, kind, quantity, reason, document, unit_cost, created_by)
  VALUES (
    v_item.product_id,
    COALESCE(_location_id, v_po.location_id),
    'in',
    _quantity,
    'Recebimento OC ' || v_po.code,
    v_po.code,
    v_item.unit_cost,
    auth.uid()
  );

  -- update item
  UPDATE public.purchase_order_items
    SET received_quantity = received_quantity + _quantity
    WHERE id = _item_id;

  -- supplier cost history
  INSERT INTO public.supplier_product_costs (supplier_id, product_id, unit_cost, purchase_order_id)
  VALUES (v_po.supplier_id, v_item.product_id, v_item.unit_cost, v_po.id);

  -- refresh PO status
  SELECT COALESCE(SUM(quantity),0), COALESCE(SUM(received_quantity),0)
    INTO v_total_qty, v_total_recv
    FROM public.purchase_order_items WHERE purchase_order_id = v_po.id;

  UPDATE public.purchase_orders
    SET status = CASE
      WHEN v_total_recv >= v_total_qty THEN 'received'::purchase_order_status
      WHEN v_total_recv > 0 THEN 'partial'::purchase_order_status
      ELSE status
    END,
    received_at = CASE WHEN v_total_recv >= v_total_qty THEN now() ELSE received_at END
    WHERE id = v_po.id;
END;
$$;

REVOKE ALL ON FUNCTION public.receive_purchase_order_item(uuid, numeric, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.receive_purchase_order_item(uuid, numeric, uuid) TO authenticated;
