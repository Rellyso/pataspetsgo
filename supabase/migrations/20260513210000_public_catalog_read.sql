create policy "Public read store_settings"
on public.store_settings
for select
to anon, authenticated
using (true);

create policy "Public read active categories"
on public.categories
for select
to anon, authenticated
using (is_active = true);

create policy "Public read active brands"
on public.brands
for select
to anon, authenticated
using (is_active = true);

create policy "Public read active products"
on public.products
for select
to anon, authenticated
using (is_active = true);

create policy "Public read valid variants"
on public.product_variants
for select
to anon, authenticated
using (
  is_active = true
  and stock_status in ('available', 'consult')
);

create policy "Public read active banners"
on public.banners
for select
to anon, authenticated
using (is_active = true);
