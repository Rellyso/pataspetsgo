create policy "Admins can read orders"
on public.orders
for select
using (public.is_admin());

create policy "Admins can update orders"
on public.orders
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read order_items"
on public.order_items
for select
using (public.is_admin());
