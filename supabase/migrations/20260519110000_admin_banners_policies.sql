create policy "Admins can manage banners"
on public.banners
for all
using (public.is_admin())
with check (public.is_admin());

update storage.buckets
set public = true
where id = 'banners';

create policy "Admins can manage banner assets"
on storage.objects
for all
to authenticated
using (bucket_id = 'banners' and public.is_admin())
with check (bucket_id = 'banners' and public.is_admin());
