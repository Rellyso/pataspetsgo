# 02 — Database Schema

Objetivo

- Definir modelos de dados iniciais para o MVP e campos essenciais para cada entidade.

Contexto

- Banco: Postgres (via Supabase). Esquema pensado para consultas públicas eficientes e para facilitar RLS.
- O objetivo é manter o schema simples para o MVP, mas sem abrir mão de integridade básica e histórico consistente.

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
- `store_settings` é uma tabela singleton: deve existir apenas uma linha ativa de configuração da loja.
- A área admin edita a linha existente; não deve existir fluxo de criar múltiplas configurações.
- A migração deve prever alguma garantia de singleton em banco ou, no mínimo, seed inicial com proteção para impedir duplicação acidental.

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
- Um produto pode existir sem aparecer na vitrine pública.
- Para aparecer no catálogo público, ele também precisa estar ligado a categoria e marca válidas quando aplicável e ter ao menos uma variante exibível para pedido.

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
- `name` é o rótulo principal da variante exibido ao cliente e usado no admin.
- `weight` e `flavor` são atributos opcionais e estruturados para complementar o rótulo, não para substituir `name`.
- `sku` é opcional no MVP, mas deve ser único quando preenchido.
- Uma variante só é considerada exibível na vitrine se estiver `is_active = true`, tiver preço válido e `stock_status` compatível com pedido (`available` ou `consult`, conforme regra de negócio da feature).

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
- `orders` não recebe escrita pública direta do client.
- A criação de pedidos acontece apenas por boundary server-only da aplicação, alinhada com a arquitetura definida na spec 01.
- `order_number` é identificador de negócio e deve ser gerado de forma consistente no servidor/banco.

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
- `order_items` preserva um snapshot imutável do momento do pedido.
- `product_name`, `variant_name`, `unit_price` e `total_price` são a fonte de verdade histórica do item comprado.
- `product_id` e `product_variant_id` servem apenas como referência opcional para auditoria e navegação administrativa; o histórico do pedido não deve depender do catálogo atual.

Índices e considerações

- Index em `products.slug`, `categories.slug`, `brands.slug`.
- Index em `products.is_active` e `product_variants.is_active` para consultas públicas.
- Index nas FKs principais: `products.category_id`, `products.brand_id`, `product_variants.product_id`, `order_items.order_id`, `order_items.product_variant_id`.
- Index para listagem operacional: `products.sort_order` quando aplicável, `categories.sort_order`, `banners.position`, `orders.created_at`, `orders.status`.
- `order_number` gerado no servidor com padrão `PP-YYYY-XXXX`.
- A leitura pública do catálogo deve ser centralizada em views SQL ou queries server-side compartilhadas, não espalhada por filtros duplicados em cada página.

RLS (visão inicial)

- `SELECT` público em catálogo deve respeitar o contrato de vitrine pública, não apenas `is_active = true` isolado por tabela.
- `INSERT/UPDATE/DELETE` em tabelas administrativas só para usuário autenticado com role `admin`.
- `orders` e `order_items` não terão política de escrita pública direta pelo client nesta fundação.

Scripts de migração

- Preparar `CREATE TABLE` com geração de UUID e defaults para `created_at`.
- Definir `updated_at` com trigger ou mecanismo consistente de atualização automática.
- Definir `NOT NULL` para todos os campos obrigatórios do MVP.
- Definir defaults explícitos para campos de controle, como `is_active`, `is_featured`, `is_promotion`, `sort_order`, `delivery_enabled`, `pickup_enabled`, `status`.
- Definir `CHECK` constraints para domínios simples representados como texto, como `pet_type`, `age_group`, `size_group`, `stock_status`, `delivery_type` e `orders.status`.
- Definir `CHECK` para impedir preço negativo e para garantir consistência entre `price` e `promotional_price` quando houver promoção.
- Considerar unique index parcial para `product_variants.sku` quando o campo não for nulo.

Critérios de aceite

- Schema documentado com campos obrigatórios, relacionamentos, defaults e regras básicas de integridade suficientes para virar migração SQL sem ambiguidades críticas.
- Modelagem cobre catálogo público, área admin, persistência de pedidos e preservação de histórico sem depender de estado futuro do catálogo.
