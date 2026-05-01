# 02 — Database Schema

Objetivo

- Definir modelos de dados iniciais para o MVP e campos essenciais para cada entidade.

Contexto

- Banco: Postgres (via Supabase). Esquema pensado para consultas públicas eficientes e para facilitar RLS.

Tabelas principais

1. `store_settings`

- `id` UUID PK
- `store_name` text
- `description` text
- `whatsapp_phone` text
- `instagram_url` text
- `address` text
- `opening_hours` text
- `google_maps_url` text
- `delivery_enabled` boolean
- `pickup_enabled` boolean
- `created_at` timestamptz
- `updated_at` timestamptz

2. `categories`

- `id` UUID PK
- `name` text
- `slug` text UNIQUE
- `description` text
- `icon` text (opcional)
- `color` text (hex)
- `sort_order` integer
- `is_active` boolean
- `created_at`, `updated_at`

3. `brands`

- `id` UUID PK
- `name` text
- `slug` text UNIQUE
- `logo_url` text
- `is_active` boolean
- `created_at`, `updated_at`

4. `products`

- `id` UUID PK
- `name` text
- `slug` text UNIQUE
- `description` text
- `short_description` text
- `category_id` UUID FK -> categories(id)
- `brand_id` UUID FK -> brands(id)
- `pet_type` text (dog|cat|both)
- `age_group` text (puppy|adult|senior|all)
- `size_group` text (small|medium|large|all)
- `image_url` text (imagem principal)
- `is_active` boolean
- `is_featured` boolean
- `is_promotion` boolean
- `created_at`, `updated_at`

5. `product_variants`

- `id` UUID PK
- `product_id` UUID FK -> products(id)
- `name` text
- `sku` text
- `weight` text
- `flavor` text
- `price` numeric
- `promotional_price` numeric (nullable)
- `stock_status` text (available|unavailable|consult)
- `sort_order` integer
- `is_active` boolean
- `created_at`, `updated_at`

6. `banners`

- `id` UUID PK
- `title` text
- `subtitle` text
- `image_url` text
- `cta_label` text
- `cta_url` text
- `position` integer
- `is_active` boolean
- `created_at`, `updated_at`

7. `orders`

- `id` UUID PK
- `order_number` text UNIQUE
- `customer_name` text
- `customer_phone` text
- `delivery_type` text (pickup|delivery|arrange)
- `address` text (nullable)
- `notes` text
- `total_estimated` numeric
- `whatsapp_message` text
- `status` text (pending|sent_to_whatsapp|confirmed|canceled)
- `created_at`, `updated_at`

8. `order_items`

- `id` UUID PK
- `order_id` UUID FK -> orders(id)
- `product_id` UUID FK -> products(id)
- `product_variant_id` UUID FK -> product_variants(id)
- `product_name` text
- `variant_name` text
- `quantity` integer
- `unit_price` numeric
- `total_price` numeric
- `created_at` timestamptz

Índices e considerações

- Index em `products.slug`, `categories.slug`, `brands.slug`.
- Index em `products.is_active` e `product_variants.is_active` para consultas públicas.
- `order_number` gerado no servidor com padrão `PP-YYYY-XXXX`.

RLS (visão inicial)

- `SELECT` em products/categories/brands/banners: WHERE `is_active = true`.
- `INSERT/UPDATE/DELETE` só para role admin (autenticado).

Scripts de migração

- Preparar `CREATE TABLE` com `uuid_generate_v4()` e `created_at` defaults.

Critérios de aceite

- Schema documentado e pronto para ser traduzido em migrações SQL.
