# 01 — Technical Architecture

Objetivo

- Documentar a arquitetura técnica, stack, layout de pastas, deploy e integrações para o MVP.

Contexto

- Stack principal: Next.js + TypeScript, Tailwind CSS v4, Supabase (Postgres/Auth/Storage), shadcn/ui, React Hook Form, Zod.
- Deploy alvo: Vercel (front) + Supabase (backend/storage).

Arquitetura resumida

- Frontend: Next.js (App Router), server components quando aplicar, client components para interações (carrinho, forms).
- Backend: Supabase (Postgres + RLS). Edge Functions ficam fora do escopo desta fundação e só entram se surgir uma necessidade concreta posterior.
- Storage: Supabase Storage buckets para `products`, `banners`, `brands`.

Sequência de fundação recomendada

1. Bootstrap do projeto e configurações base.
2. Tema global, tokens e página de demonstração visual (`/design`).
3. Layouts raiz público e admin.
4. Componentes reutilizáveis base.
5. Infraestrutura Supabase/Auth/middleware.
6. Features de catálogo e pedido.

Estrutura de pastas sugerida

- `app/` — rotas públicas e admin (ex.: app/catalogo/page.tsx)
- `components/` — componentes reutilizáveis (ui, layout, catalog, cart, admin)
- `features/` — regras por domínio (`catalog`, `cart`, `orders`, `admin`)
- `lib/` — utilitários transversais e integrações bem delimitadas
- `types/` — tipagens compartilhadas e tipos gerados do banco
- `specs/` — especificações do produto

Estrutura inicial recomendada

- `app/(public)/` — home, catálogo, produto, pedido, página `/design`
- `app/(admin)/admin/` — shell da área protegida
- `app/auth/` — login e fluxos relacionados ao admin
- `components/layout/` — headers, footers, sidebars e wrappers estruturais
- `components/shared/` — componentes de produto reutilizáveis entre seções
- `components/catalog/` — cartões, filtros e elementos específicos do catálogo
- `components/admin/` — shells e blocos reutilizáveis do admin
- `components/ui/` — primitives do shadcn/ui e wrappers visuais comuns
- `lib/supabase/` — clients browser/server/middleware helpers
- `lib/server/` — utilitários server-only, validação de env e helpers de autorização
- `lib/validations/` — schemas Zod compartilhados por feature
- `features/catalog/` — queries e mapeamentos do catálogo público
- `features/orders/` — fluxo server-only de criação de pedido
- `features/admin/` — regras e queries da área protegida
- `types/database.ts` — tipos gerados do Supabase

Configurações iniciais

- TypeScript com `tsconfig` base e paths alias (`@/components`, `@/lib`, `@/types`).
- Tailwind v4: configurar tokens de tema conforme paleta.
- Biome integrado (lint + format).
- `.env.example` com variáveis Supabase e NEXT*PUBLIC*\* necessárias.
- Validar variáveis obrigatórias no boot do servidor para falhar cedo em ambiente mal configurado.
- Preferir `pnpm` como gerenciador padrão do projeto.
- Usar route groups para separar shells público e admin sem poluir a URL.
- Preparar uma página `/design` como contrato visual inicial em vez de Storybook nesta fase.
- Ler `DESIGN.md` antes de implementar qualquer layout, componente visual ou escolha tipográfica.
- Versionar migrations do Supabase no repositório desde o início, com seed mínimo para desenvolvimento local.

Regras de build e runtime

- Variáveis sensíveis só no servidor; `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` para cliente.
- O fluxo de criação de pedido será server-only desde o início, usando Route Handler ou Server Action executada no runtime do servidor.
- `SUPABASE_SERVICE_ROLE_KEY` não deve ser a opção padrão da fundação. Só pode ser introduzida se aparecer uma limitação real de RLS/Storage que não possa ser resolvida com boundary mais estreita.

Client / Server responsibilities

- Client: renderizar catálogo, carrinho, interações do usuário.
- Server: rotinas que exigem segredo e consistência (ex.: geração de `order_number`, gravação de pedidos, checagem de autorização do admin, upload autenticado).

Fluxo de pedidos

- O pedido público não grava direto no banco a partir do cliente.
- O cliente envia apenas o payload final do pedido para uma boundary server-only.
- O payload deve ser validado com Zod no servidor antes de qualquer escrita.
- A criação de `orders` e `order_items` deve ocorrer como uma única operação consistente, preferencialmente via função SQL/RPC transacional ou lógica equivalente controlada no servidor.
- A geração de `order_number` deve acontecer no banco ou em mecanismo transacional equivalente para evitar duplicidade.
- O redirecionamento ou composição da mensagem de WhatsApp só acontece após persistência bem-sucedida do pedido.
- Deve existir pelo menos uma proteção mínima contra abuso no endpoint público, como rate limiting simples por IP ou mecanismo equivalente compatível com a infraestrutura do projeto.

Responsabilidades da fundação

- Layouts, tema e componentes base devem ser definidos antes de qualquer CRUD ou fluxo de pedido.
- Tipagens compartilhadas podem ser introduzidas cedo; validações Zod devem acompanhar as features reais, evitando antecipar formulários fora da spec corrente.

Autenticação

- Admin: Supabase Auth (email/password).
- O sistema terá poucos operadores internos; não há necessidade de modelagem complexa de papéis nesta fase.
- A autorização do admin terá como fonte de verdade uma tabela de perfil simples, com `profiles.id` referenciando `auth.users.id` e campo `role`, usando `admin` como valor permitido para acesso administrativo.
- O `middleware` protege `/admin` verificando existência de sessão e cuidando de redirects.
- A validação de role `admin` deve ocorrer no servidor dentro do layout da área admin, loaders, queries e actions protegidas. Middleware não é a única camada de autorização.
- Policies e queries do banco devem refletir a mesma regra de autorização.

RLS e contrato de leitura pública

- Escrita e alteração em tabelas administrativas são permitidas apenas para usuários autenticados com role `admin`.
- A leitura pública do catálogo não deve depender de filtros soltos repetidos em múltiplas páginas.
- A fundação deve prever um contrato explícito de "catálogo público", preferencialmente por views SQL ou queries server-side centralizadas em `features/catalog`.
- Esse contrato deve retornar apenas registros realmente exibíveis na vitrine, por exemplo:
- produtos ativos
- categorias e marcas ativas quando aplicáveis
- variantes ativas e disponíveis para pedido
- banners ativos e válidos para navegação
- Produtos com relacionamento inválido ou item não comprável não devem vazar para o catálogo público apenas porque `is_active = true` em uma tabela isolada.
- Se houver dúvida entre ler tabelas base direto ou usar views, a recomendação desta arquitetura é usar views ou consultas centralizadas desde o início para reduzir duplicação e inconsistência de regra.

Observabilidade

- Logging básico em servidor para ações críticas (criação de pedido, falhas de upload).
- Logs devem incluir contexto mínimo para troubleshooting sem registrar dados sensíveis desnecessários.

Critérios de aceite

- Projeto com `pnpm dev` roda localmente.
- Aliases funcionam e build local compila sem erros.
- Validação de env falha cedo quando configuração obrigatória está ausente.
- Migrations do Supabase estão versionadas e existe seed mínimo para ambiente local.
- `/admin` redireciona usuário sem sessão e bloqueia usuário autenticado sem role `admin`.
- Upload para bucket definido funciona com regra de acesso coerente com a área administrativa.
- Existe um fluxo local funcional de criação de pedido: cliente envia payload, servidor valida, pedido persiste com número consistente e o fluxo segue para WhatsApp.
- Rotas principais da fundação passam por smoke test manual: home, catálogo, detalhe de produto, login admin e shell admin.

Fora de escopo

- Infra CI/CD complexa (poderá ser adicionada depois)
