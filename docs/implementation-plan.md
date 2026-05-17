<!-- /autoplan restore point: /Users/rellysondouglas/.gstack/projects/Rellyso-pataspetsgo/main-autoplan-restore-20260511-205707.md -->
# PatasGo — Implementation Plan

## Objetivo

- Transformar as specs `00` a `09` em uma sequência de implementação pragmática, com dependências claras, entregas pequenas e checkpoints verificáveis.

## Princípios de execução

- Implementar na ordem das dependências reais, não apenas na ordem dos arquivos.
- Entregar primeiro a fundação que destrava as próximas fases.
- Validar cada fase antes de avançar.
- Evitar começar CRUDs e fluxos finais antes de layout, schema, auth e contrato público estarem estáveis.
- Priorizar sempre a experiência mobile-first e o caminho de conversão para WhatsApp.

## Base de referência

- `specs/00-product-vision.md`
- `specs/01-technical-architecture.md`
- `specs/02-database-schema.md`
- `specs/03-design-system.md`
- `specs/04-public-browsing.md`
- `specs/05-cart-and-checkout.md`
- `specs/06-admin-foundation.md`
- `specs/07-admin-catalog-management.md`
- `specs/08-admin-orders-and-settings.md`
- `specs/09-seo-and-metadata.md`

## Ordem recomendada

1. Fundação técnica
2. Banco, auth e contrato público
3. Design system e shell público
4. Navegação pública
5. Carrinho e checkout
6. Fundação administrativa
7. Catálogo administrativo
8. Pedidos, banners e configurações
9. SEO e fechamento do MVP

## Fase 0 — Bootstrap

Objetivo:
- criar o projeto e deixar o ambiente pronto para evoluir com segurança.

Implementar:
- bootstrap do app com Next.js, TypeScript e Tailwind v4
- aliases de import
- Biome (lint + format)
- `pnpm`
- `.env.example`
- validação de env no servidor
- estrutura inicial de pastas definida na spec 01

Entregáveis:
- projeto sobe com `pnpm dev`
- build compila
- estrutura de diretórios base criada

Checkpoint:
- app inicial roda localmente
- env inválida falha cedo

## Fase 1 — Banco e Supabase

Objetivo:
- estabelecer a base de dados, autenticação e integrações necessárias para o MVP.

Implementar:
- configuração Supabase
- clients browser/server/middleware
- migrations iniciais
- seed mínimo de desenvolvimento
- tabelas e constraints da spec 02
- tipos gerados do banco
- buckets de storage necessários

Entregáveis:
- schema aplicado localmente
- seed com dados básicos utilizáveis
- tipos `database.ts`

Checkpoint:
- migrations sobem sem ambiguidade
- dados mínimos permitem navegar no catálogo e logar no admin depois

## Fase 2 — Auth e autorização admin

Status:
- concluída

Objetivo:
- fechar acesso seguro à área protegida antes de construir os módulos administrativos.
- esta fase assume a base visual mínima já existente no repositório, sem antecipar o shell operacional completo do admin.

Implementar:
- Supabase Auth por email/senha
- tabela `profiles` com `role = admin`
- clients Supabase SSR para browser/server/proxy
- proxy para sessão em `/admin`
- checagem server-side de role
- helper central `requireAdmin()` para autorização server-only
- fluxo de login/logout
- estado dedicado de acesso negado para usuário autenticado sem role `admin`
- bootstrap explícito do primeiro admin

Specs principais:
- `01`
- `06`

Entregáveis:
- rota de login admin
- rota `/auth/access-denied`
- shell protegido mínimo do admin acessível apenas para `admin`
- script `pnpm admin:bootstrap <email> <senha>`
- testes de banco, UI e smoke E2E para auth admin

Checkpoint:
- sem sessão redireciona para login
- usuário autenticado sem role vê acesso negado e não entra
- usuário admin entra no shell
- logout remove acesso às rotas protegidas
- bootstrap do primeiro admin é reproduzível em ambiente local

## Fase 3 — Design system, tokens e shells base

Objetivo:
- fechar o contrato visual inicial do produto e montar os shells compartilhados do público e do admin, sem antecipar componentes que dependem das features finais.

Implementar:
- tokens semânticos em `app/globals.css` via `@theme inline`
- tipografia base conforme `DESIGN.md`, formalizando a estratégia de carregamento de fontes desta fase para evitar mistura acidental de abordagens
- primitives e wrappers da fundação imediata
- shell público base e shell admin base com a mesma família visual e ritmos diferentes
- extração visual do `AdminShell` sem alterar a boundary atual de autenticação/autorização do layout admin
- rota `/design` como contrato visual vivo da fundação
- estados base de loading, vazio e erro para reutilização nas próximas fases

Specs principais:
- `01`
- `03`
- `06`

Entregáveis:
- tokens mínimos nomeados e expostos semanticamente no tema: superfícies, ações, tipografia, feedback, foco, spacing e radius
- `AppHeader`, `AppFooter`, `Container`, `SectionTitle`, `EmptyState`, `SearchInput`, `FilterChip`, `WhatsappButton`, `PriceDisplay`
- `PublicShell` e `AdminShell` reutilizáveis
- página `/design` demonstrando tokens, tipografia, ações, inputs, shells e estados base

Não entra nesta fase:
- lógica de busca, filtro, navegação de catálogo ou bindings de dados reais em `SearchInput` e `FilterChip`, que nesta fase são apenas componentes fundacionais/presentacionais
- `ProductCard`, `CategoryCard`, `BrandBadge`, `PromoBadge` e `QuantitySelector`, que entram junto da navegação pública
- `AdminSidebar`, `AdminPageHeader`, `StatCard` e `DataTableShell` finais, que entram junto do shell operacional do admin

Checkpoint:
- visual base alinhado a `DESIGN.md`
- público e admin compartilham a mesma família visual com densidades distintas
- `/design` já funciona como referência confiável para iniciar catálogo e admin sem reabrir decisões de fundação

## Fase 4 — Contrato público do catálogo

Objetivo:
- criar a leitura pública centralizada antes de construir as páginas finais.

Implementar:
- queries server-side ou views SQL para catálogo público
- regra pública de produto exibível
- ordenação com destaque + `sort_order` + nome
- regra pública de promoção

Specs principais:
- `01`
- `02`
- `04`
- `09`

Entregáveis:
- camada `features/catalog`
- consultas para home, catálogo e produto

Checkpoint:
- produto inválido ou sem variante válida não aparece
- promoção pública segue a regra fechada nas specs

## Fase 5 — Navegação pública

Objetivo:
- entregar home, catálogo e detalhe de produto completos.

Implementar:
- home pública
- catálogo com busca e filtros
- detalhe do produto com seleção de variante
- estados de loading, vazio e erro
- CTA de adicionar ao pedido

Specs principais:
- `04`

Entregáveis:
- `/`
- `/catalogo`
- `/produto/[slug]`

Checkpoint:
- fluxo público navega bem no mobile
- filtros funcionam
- produto com `consult` e `unavailable` se comporta corretamente

## Fase 6 — Carrinho e checkout

Objetivo:
- fechar o principal fluxo de conversão do produto.

Implementar:
- estado local do carrinho
- persistência local
- página `/pedido`
- formulário do pedido
- validações client/server
- criação server-only de pedido
- geração da mensagem de WhatsApp
- tratamento de `delivery_enabled` e `pickup_enabled`

Specs principais:
- `05`

Entregáveis:
- usuário adiciona item
- revisa carrinho
- salva pedido
- abre WhatsApp após persistência

Checkpoint:
- pedido nasce como `pending`
- carrinho vazio não envia
- delivery/pickup obedecem `store_settings`

## Fase 7 — Shell administrativo real

Objetivo:
- transformar a fundação admin em superfície operacional utilizável.

Implementar:
- navegação principal do admin
- dashboard inicial
- estados base de loading/acesso negado/erro

Specs principais:
- `06`

Entregáveis:
- `/admin` funcional como hub dos módulos

Checkpoint:
- navegação entre módulos prevista no shell
- responsividade mínima operacional em mobile

## Fase 8 — Catálogo administrativo

Objetivo:
- permitir manutenção real da vitrine.

Implementar:
- listagem e formulário de produtos
- gestão de variantes
- listagem e formulário de categorias
- listagem e formulário de marcas
- upload de imagem principal e logo
- ativação/desativação lógica

Specs principais:
- `07`

Entregáveis:
- CRUD operacional de produtos
- CRUD de variantes
- CRUD de categorias
- CRUD de marcas

Checkpoint:
- operador consegue montar um produto publicável de ponta a ponta
- sistema sinaliza produto sem variante válida

## Fase 9 — Pedidos, banners e configurações

Objetivo:
- completar os módulos operacionais restantes do MVP com entregas sequenciais que fecham pedidos, vitrine da home e configuração institucional da loja.

Implementar:
- estruturar a fase em `9.1`, `9.2` e `9.3`, preservando a fase 9 como unidade única do roadmap
- alinhar a implementação ao padrão já usado em `features/admin/catalog`, com queries server-side, actions server-only, validação centralizada com Zod e revalidação por rota
- conectar os módulos ao que já existe no projeto: placeholders ativos em `/admin/pedidos`, `/admin/banners` e `/admin/configuracoes`, criação de pedidos via `features/cart/submit-order.ts` e leitura pública de `banners` e `store_settings` em `features/catalog/public-catalog.ts`

Specs principais:
- `08`

Entregáveis:
- fase 9 documentada com subetapas sequenciais e dependências explícitas entre operação admin, home pública e checkout
- operador consegue consultar pedidos, ajustar a home por banners e editar dados institucionais e operacionais da loja
- validações, testes e checkpoints da fase deixam claro o contrato de snapshot de pedido, a operação dos banners e o impacto real de `store_settings`

Checkpoint:
- pedido usa snapshot persistido
- home segue funcional sem banners ativos
- checkout muda conforme `store_settings`

### Fase 9.1 — Pedidos administrativos

Objetivo:
- transformar `/admin/pedidos` em módulo operacional de consulta rápida para atendimento via WhatsApp.

Implementar:
- `features/admin/orders` com queries server-side para listagem e detalhe
- filtros por `status`, `delivery_type` e período simples
- busca por `order_number`, `customer_name` e `customer_phone`
- ordenação padrão por `created_at desc`
- detalhe do pedido baseado apenas em `orders` + `order_items`, sem recalcular a partir do catálogo atual
- action server-only para atualizar `orders.status` com confirmação explícita e revalidação do domínio permitido
- reaproveitamento do shell admin com versão responsiva em cartões operacionais no mobile

Interfaces e tipos:
- novo schema de filtros em `lib/validations/admin-orders.ts`
- novo schema de atualização de status aceitando apenas `pending | sent_to_whatsapp | confirmed | canceled`
- tipos de listagem e detalhe em `features/admin/orders/types.ts`

Entregáveis:
- `/admin/pedidos` com listagem funcional
- detalhe do pedido acessível a partir da listagem
- atualização de status com feedback de sucesso e erro

Checkpoint:
- admin encontra pedidos recentes rapidamente
- detalhe mostra snapshot persistido de itens, preços e mensagem de WhatsApp
- mudar status não altera itens, total nem mensagem

### Fase 9.2 — Banners administrativos

Objetivo:
- substituir o placeholder de `/admin/banners` por CRUD leve de vitrine com upload e ordenação previsível.

Implementar:
- `features/admin/banners` com listagem, criação, edição e toggle de ativo
- formulário com `title`, `subtitle`, `image`, `cta_label`, `cta_url`, `position` e `is_active`
- upload para bucket `banners` no mesmo padrão operacional já usado em catálogo
- validação para impedir banner ativo com destino quebrado
- revalidação da home pública e da rota admin após salvar ou alternar status
- empty state orientado à criação do primeiro banner

Interfaces e tipos:
- novo schema em `lib/validations/admin-banners.ts`
- regra explícita de coerência entre `cta_label` e `cta_url`
- tipo de payload e item administrativo em `features/admin/banners/types.ts`

Entregáveis:
- `/admin/banners` com listagem operacional
- formulário de criar e editar com feedback de upload
- ordenação simples por `position`

Checkpoint:
- banner inativo não aparece na home
- home segue íntegra sem banners ativos
- upload deixa claro “imagem enviada” versus “registro salvo”

### Fase 9.3 — Configurações da loja e integração operacional

Objetivo:
- transformar `/admin/configuracoes` em editor do singleton `store_settings` e fechar o impacto no público e no checkout.

Implementar:
- `features/admin/store-settings` com query singleton e action única de update
- formulário para `store_name`, `description`, `whatsapp_phone`, `instagram_url`, `address`, `opening_hours`, `google_maps_url`, `delivery_enabled` e `pickup_enabled`
- validação forte de `whatsapp_phone` e validação mínima útil de URLs opcionais
- revalidação de home, superfícies públicas que usam resumo da loja e fluxo `/pedido`
- tratamento explícito para cenário anômalo de ausência do singleton, sem criar fluxo de múltiplos registros

Interfaces e tipos:
- novo schema em `lib/validations/admin-store-settings.ts`
- tipo singleton de leitura e escrita em `features/admin/store-settings/types.ts`

Entregáveis:
- `/admin/configuracoes` com edição do registro existente
- feedback claro de sucesso e erro
- atualização refletida no checkout e na home após salvar

Checkpoint:
- `delivery_enabled` e `pickup_enabled` alteram o comportamento do checkout já existente
- `whatsapp_phone` inválido é barrado no servidor
- não existe fluxo de criação de uma segunda configuração

Testes e cenários:
- testes de validação para filtros e status de pedidos, formulário de banners e formulário de `store_settings`
- testes de banco e integrados para update de `orders.status` e preservação de snapshot em `order_items`
- testes de UI admin para estados de loading, vazio, erro e sucesso nos três módulos
- testes E2E cobrindo listagem e detalhe de pedido, atualização de status, criação e edição de banner refletindo na home e edição de `store_settings` refletindo em `/pedido`
- regressão manual obrigatória para home sem banners ativos e checkout com apenas `pickup`, apenas `delivery` e fallback `arrange`

Assumptions:
- a fase 9 permanece única no roadmap, mas documentada com subetapas `9.1`, `9.2` e `9.3`
- o detalhe do pedido pode abrir na própria rota de pedidos via sheet, painel ou rota filha, desde que preserve leitura rápida e snapshot persistido
- não entram nesta fase automação de WhatsApp, workflow complexo de status, histórico de alterações ou motor avançado de campanhas para banners

## Fase 10 — SEO e fechamento

Objetivo:
- encerrar o MVP com metadados corretos e revisão final de qualidade.

Implementar:
- metadata por rota pública
- Open Graph mínimo
- canonical
- sitemap básico
- robots

Specs principais:
- `09`

Entregáveis:
- SEO básico funcionando para home, catálogo e produto

Checkpoint:
- rotas públicas principais têm metadata própria
- rotas protegidas/transacionais não entram em foco de indexação

## Ordem de execução detalhada

1. Fase 0
2. Fase 1
3. Fase 2
4. Fase 3
5. Fase 4
6. Fase 5
7. Fase 6
8. Fase 7
9. Fase 8
10. Fase 9
11. Fase 10

## Estratégia de validação por fase

- Ao final de cada fase:
- rodar build local
- testar manualmente o fluxo afetado
- revisar regressões visuais no mobile
- confirmar aderência à spec correspondente

## Checkpoints macro do MVP

1. Catálogo público navegável com dados reais
2. Fluxo de pedido salvando e abrindo WhatsApp
3. Admin protegido com manutenção real de catálogo
4. Pedidos, banners e store settings operacionais
5. SEO básico aplicado nas rotas públicas

## Riscos que merecem atenção

- divergência entre contrato público e tabelas base
- promoção incoerente entre produto e variante
- comportamento de checkout sem respeitar `store_settings`
- upload de imagens antes de salvar registros
- mudança de slug quebrando links públicos

## Recomendação prática

- Implementar uma fase por vez.
- Não começar Fase 8 antes de a Fase 4 estar estável.
- Não considerar o MVP pronto antes de completar o checkpoint macro 2 e o checkpoint macro 3.
