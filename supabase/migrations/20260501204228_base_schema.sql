create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  description text,
  whatsapp_phone text not null,
  instagram_url text,
  address text,
  opening_hours text,
  google_maps_url text,
  delivery_enabled boolean not null default true,
  pickup_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  icon text,
  color text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_slug_unique unique (slug)
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint brands_slug_unique unique (slug)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  short_description text,
  category_id uuid references public.categories (id),
  brand_id uuid references public.brands (id),
  pet_type text not null,
  age_group text not null,
  size_group text not null,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_promotion boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_unique unique (slug),
  constraint products_pet_type_check check (pet_type in ('dog', 'cat', 'both')),
  constraint products_age_group_check check (age_group in ('puppy', 'adult', 'senior', 'all')),
  constraint products_size_group_check check (size_group in ('small', 'medium', 'large', 'all'))
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,
  sku text,
  weight text,
  flavor text,
  price numeric not null,
  promotional_price numeric,
  stock_status text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_stock_status_check check (stock_status in ('available', 'unavailable', 'consult')),
  constraint product_variants_price_check check (price >= 0),
  constraint product_variants_promotional_price_check check (promotional_price is null or (promotional_price >= 0 and promotional_price <= price))
);

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  cta_label text,
  cta_url text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,
  customer_name text not null,
  customer_phone text not null,
  delivery_type text not null,
  address text,
  notes text,
  total_estimated numeric not null,
  whatsapp_message text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_order_number_unique unique (order_number),
  constraint orders_delivery_type_check check (delivery_type in ('pickup', 'delivery', 'arrange')),
  constraint orders_status_check check (status in ('pending', 'sent_to_whatsapp', 'confirmed', 'canceled')),
  constraint orders_total_estimated_check check (total_estimated >= 0)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  product_variant_id uuid references public.product_variants (id),
  product_name text not null,
  variant_name text not null,
  quantity integer not null,
  unit_price numeric not null,
  total_price numeric not null,
  created_at timestamptz not null default now(),
  constraint order_items_quantity_check check (quantity > 0),
  constraint order_items_unit_price_check check (unit_price >= 0),
  constraint order_items_total_price_check check (total_price >= 0)
);

create trigger set_store_settings_updated_at
before update on public.store_settings
for each row execute function public.set_updated_at();

create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger set_brands_updated_at
before update on public.brands
for each row execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger set_product_variants_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

create trigger set_banners_updated_at
before update on public.banners
for each row execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();
