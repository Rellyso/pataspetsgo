create policy "Admins can manage categories"
on public.categories
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage brands"
on public.brands
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage products"
on public.products
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage product_variants"
on public.product_variants
for all
using (public.is_admin())
with check (public.is_admin());

update storage.buckets
set public = true
where id in ('products', 'brands');

create policy "Admins can manage product assets"
on storage.objects
for all
to authenticated
using (bucket_id = 'products' and public.is_admin())
with check (bucket_id = 'products' and public.is_admin());

create policy "Admins can manage brand assets"
on storage.objects
for all
to authenticated
using (bucket_id = 'brands' and public.is_admin())
with check (bucket_id = 'brands' and public.is_admin());
