insert into public.store_settings (
  store_name,
  description,
  whatsapp_phone,
  instagram_url,
  address,
  opening_hours,
  google_maps_url,
  delivery_enabled,
  pickup_enabled
) values (
  'Patas Pets',
  'Seu pet shop de bairro com cuidado rapido e confiavel.',
  '5511999999999',
  'https://instagram.com/pataspets',
  'Rua dos Pets, 123 - Sao Paulo, SP',
  'Seg a Sab, 9h as 19h',
  'https://maps.google.com',
  true,
  true
);

insert into public.categories (name, slug, description, icon, color, sort_order, is_active)
values
  ('Racao', 'racao', 'Racoes para diferentes fases e portes.', 'bowl', '#00A9C8', 1, true),
  ('Higiene', 'higiene', 'Shampoos, tapetes e cuidados diarios.', 'sparkles', '#F6B800', 2, true),
  ('Saude', 'saude', 'Medicacoes e cuidados basicos.', 'shield', '#FF7A00', 3, true);

insert into public.brands (name, slug, logo_url, is_active)
values
  ('PetNutri', 'petnutri', null, true),
  ('BichoSano', 'bichosano', null, true);

insert into public.products (
  name,
  slug,
  description,
  short_description,
  category_id,
  brand_id,
  pet_type,
  age_group,
  size_group,
  image_url,
  sort_order,
  is_active,
  is_featured,
  is_promotion
) values
(
  'Racao PetNutri Premium 10kg',
  'racao-petnutri-premium-10kg',
  'Racao premium para caes adultos com alta digestibilidade.',
  'Racao premium para caes adultos.',
  (select id from public.categories where slug = 'racao'),
  (select id from public.brands where slug = 'petnutri'),
  'dog',
  'adult',
  'medium',
  null,
  1,
  true,
  true,
  true
),
(
  'Shampoo BichoSano Neutro 500ml',
  'shampoo-bichosano-neutro-500ml',
  'Shampoo suave para banho semanal.',
  'Shampoo neutro para pets.',
  (select id from public.categories where slug = 'higiene'),
  (select id from public.brands where slug = 'bichosano'),
  'both',
  'all',
  'all',
  null,
  2,
  true,
  false,
  false
);

insert into public.product_variants (
  product_id,
  name,
  sku,
  weight,
  flavor,
  price,
  promotional_price,
  stock_status,
  sort_order,
  is_active
) values
(
  (select id from public.products where slug = 'racao-petnutri-premium-10kg'),
  'Pacote 10kg',
  'PN-10KG',
  '10kg',
  'Frango',
  189.9,
  169.9,
  'available',
  1,
  true
),
(
  (select id from public.products where slug = 'shampoo-bichosano-neutro-500ml'),
  'Frasco 500ml',
  null,
  '500ml',
  null,
  39.9,
  null,
  'available',
  1,
  true
),
(
  (select id from public.products where slug = 'racao-petnutri-premium-10kg'),
  'Pacote 10kg (indisponivel)',
  'PN-10KG-IND',
  '10kg',
  'Frango',
  189.9,
  null,
  'unavailable',
  2,
  false
);

insert into public.banners (
  title,
  subtitle,
  image_url,
  cta_label,
  cta_url,
  position,
  is_active
) values (
  'Entrega rapida no bairro',
  'Pedidos pelo WhatsApp em minutos.',
  'https://images.unsplash.com/photo-1507146426996-ef05306b995a',
  'Falar no WhatsApp',
  'https://wa.me/5511999999999',
  1,
  true
);
