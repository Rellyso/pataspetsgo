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
- ESLint e Prettier
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

Objetivo:
- fechar acesso seguro à área protegida antes de construir os módulos administrativos.

Implementar:
- Supabase Auth por email/senha
- tabela `profiles` com `role = admin`
- middleware para sessão em `/admin`
- checagem server-side de role
- fluxo de login/logout

Specs principais:
- `01`
- `06`

Entregáveis:
- rota de login admin
- shell protegido do admin acessível apenas para `admin`

Checkpoint:
- sem sessão redireciona para login
- usuário autenticado sem role não entra
- usuário admin entra no shell

## Fase 3 — Design system e layout base

Objetivo:
- construir a base visual e estrutural que será reutilizada no público e no admin.

Implementar:
- tokens em `globals.css`
- tipografia e cores conforme `DESIGN.md`
- componentes base da fundação imediata
- layouts raiz público e admin
- rota `/design`

Specs principais:
- `03`

Entregáveis:
- `AppHeader`, `AppFooter`, `Container`, `SectionTitle`, `EmptyState`, `SearchInput`, `FilterChip`, `WhatsappButton`, `PriceDisplay`
- página `/design`

Checkpoint:
- visual base alinhado ao design system
- público e admin compartilham a mesma família visual

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
- completar os módulos operacionais restantes do MVP.

Implementar:
- listagem e detalhe de pedidos
- atualização simples de status
- CRUD de banners
- edição de `store_settings`

Specs principais:
- `08`

Entregáveis:
- operador consegue consultar pedidos
- operador consegue ajustar home por banners
- operador consegue editar dados institucionais da loja

Checkpoint:
- pedido usa snapshot persistido
- home segue funcional sem banners ativos
- checkout muda conforme `store_settings`

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
