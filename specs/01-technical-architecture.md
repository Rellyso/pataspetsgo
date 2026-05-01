# 01 — Technical Architecture

Objetivo

- Documentar a arquitetura técnica, stack, layout de pastas, deploy e integrações para o MVP.

Contexto

- Stack principal: Next.js + TypeScript, Tailwind CSS v4, Supabase (Postgres/Auth/Storage), shadcn/ui, React Hook Form, Zod.
- Deploy alvo: Vercel (front) + Supabase (backend/storage).

Arquitetura resumida

- Frontend: Next.js (App Router), server components quando aplicar, client components para interações (carrinho, forms).
- Backend: Supabase (Postgres + RLS + Edge functions se necessário).
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
- `lib/` — clientes Supabase, form validations, services
- `types/` — tipagens compartilhadas
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

Configurações iniciais

- TypeScript com `tsconfig` base e paths alias (`@/components`, `@/lib`, `@/types`).
- Tailwind v4: configurar tokens de tema conforme paleta.
- ESLint + Prettier integrados (configs compartilhadas).
- `.env.example` com variáveis Supabase e NEXT*PUBLIC*\* necessárias.
- Preferir `pnpm` como gerenciador padrão do projeto.
- Usar route groups para separar shells público e admin sem poluir a URL.
- Preparar uma página `/design` como contrato visual inicial em vez de Storybook nesta fase.

Regras de build e runtime

- Variáveis sensíveis só no servidor; `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` para cliente.
- Funções server-side (inserção de orders) via API route ou server action, que usam service role key apenas do servidor (edge function / server runtime com env segura).

Client / Server responsibilities

- Client: renderizar catálogo, carrinho, interações do usuário.
- Server: rotinas que exigem segredo (ex.: geração de `order_number` consistente, gravação de pedidos com service role se necessário).

Responsabilidades da fundação

- Layouts, tema e componentes base devem ser definidos antes de qualquer CRUD ou fluxo de pedido.
- Tipagens compartilhadas podem ser introduzidas cedo; validações Zod devem acompanhar as features reais, evitando antecipar formulários fora da spec corrente.

Autenticação

- Admin: Supabase Auth (email/password). Proteção das rotas `/admin` com middleware do Next.js (checar cookie/session).

RLS (visão)

- Leitura pública permitida apenas para registros ativos (`is_active = true`).
- Escrita/alteração apenas para usuários autenticados com role `admin`.

Observabilidade

- Logging básico em servidor para ações críticas (criação de pedido, falhas de upload).

Critérios de aceite

- Projeto com `yarn dev` ou `pnpm dev` roda localmente.
- Aliases funcionam e build local compila sem erros.

Fora de escopo

- Infra CI/CD complexa (poderá ser adicionada depois)
