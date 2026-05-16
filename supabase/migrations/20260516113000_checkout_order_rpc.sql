create or replace function public.create_order_with_items(
  p_customer_name text,
  p_customer_phone text,
  p_delivery_type text,
  p_address text,
  p_notes text,
  p_total_estimated numeric,
  p_whatsapp_message text,
  p_items jsonb
)
returns table (
  order_id uuid,
  order_number text,
  whatsapp_message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  created_order public.orders%rowtype;
begin
  insert into public.orders (
    customer_name,
    customer_phone,
    delivery_type,
    address,
    notes,
    total_estimated,
    whatsapp_message,
    status
  )
  values (
    p_customer_name,
    p_customer_phone,
    p_delivery_type,
    p_address,
    p_notes,
    p_total_estimated,
    p_whatsapp_message,
    'pending'
  )
  returning * into created_order;

  insert into public.order_items (
    order_id,
    product_id,
    product_variant_id,
    product_name,
    variant_name,
    quantity,
    unit_price,
    total_price
  )
  select
    created_order.id,
    item.product_id,
    item.product_variant_id,
    item.product_name,
    item.variant_name,
    item.quantity,
    item.unit_price,
    item.total_price
  from jsonb_to_recordset(p_items) as item(
    product_id uuid,
    product_variant_id uuid,
    product_name text,
    variant_name text,
    quantity integer,
    unit_price numeric,
    total_price numeric
  );

  return query
  select
    created_order.id,
    created_order.order_number,
    created_order.whatsapp_message;
end;
$$;
