create unique index store_settings_singleton
on public.store_settings ((true));

alter table public.store_settings enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.banners enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_counters enable row level security;

create policy "Deny all store_settings"
on public.store_settings
for all
using (false);

create policy "Deny all categories"
on public.categories
for all
using (false);

create policy "Deny all brands"
on public.brands
for all
using (false);

create policy "Deny all products"
on public.products
for all
using (false);

create policy "Deny all product_variants"
on public.product_variants
for all
using (false);

create policy "Deny all banners"
on public.banners
for all
using (false);

create policy "Deny all orders"
on public.orders
for all
using (false);

create policy "Deny all order_items"
on public.order_items
for all
using (false);

create policy "Deny all order_counters"
on public.order_counters
for all
using (false);

insert into storage.buckets (id, name, public)
values
  ('products', 'products', false),
  ('brands', 'brands', false),
  ('banners', 'banners', false)
on conflict (id) do nothing;
