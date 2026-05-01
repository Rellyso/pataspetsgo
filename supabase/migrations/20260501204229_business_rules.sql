create table public.order_counters (
  year integer primary key,
  current_value integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.generate_order_number()
returns text
language plpgsql
as $$
declare
  current_year integer := extract(year from now())::integer;
  next_value integer;
begin
  insert into public.order_counters (year, current_value)
  values (current_year, 0)
  on conflict (year) do nothing;

  update public.order_counters
    set current_value = current_value + 1
  where year = current_year
  returning current_value into next_value;

  return format('PP-%s-%s', current_year, lpad(next_value::text, 4, '0'));
end;
$$;

create or replace function public.set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number = public.generate_order_number();
  end if;
  return new;
end;
$$;

create trigger set_orders_order_number
before insert on public.orders
for each row execute function public.set_order_number();

alter table public.orders
alter column order_number set default public.generate_order_number();

create trigger set_order_counters_updated_at
before update on public.order_counters
for each row execute function public.set_updated_at();

create unique index product_variants_sku_unique
on public.product_variants (sku)
where sku is not null;

create index categories_sort_order_idx on public.categories (sort_order);
create index categories_is_active_idx on public.categories (is_active);
create index brands_is_active_idx on public.brands (is_active);
create index products_sort_order_idx on public.products (sort_order);
create index products_is_active_idx on public.products (is_active);
create index products_category_id_idx on public.products (category_id);
create index products_brand_id_idx on public.products (brand_id);
create index product_variants_is_active_idx on public.product_variants (is_active);
create index product_variants_product_id_idx on public.product_variants (product_id);
create index banners_position_idx on public.banners (position);
create index orders_created_at_idx on public.orders (created_at);
create index orders_status_idx on public.orders (status);
create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_variant_id_idx on public.order_items (product_variant_id);
