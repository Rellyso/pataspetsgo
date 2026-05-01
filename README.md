# PatasGo

Catalogo mobile-first para pet shop, otimizado para pedidos via WhatsApp.

## Stack

- Next.js
- TypeScript
- Tailwind CSS v4
- Supabase
- Biome
- pnpm

## Requisitos

- Node.js 20+
- pnpm
- Docker Desktop rodando
- Supabase CLI

## Instalar dependencias

```bash
pnpm install
```

## Variaveis de ambiente

Crie `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Notas:
- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` sao usadas pela app e pelos testes anonimos.
- `SUPABASE_SERVICE_ROLE_KEY` e usada apenas pelos testes de banco que precisam validar constraints e seeds sem bloqueio de RLS.
- Na producao da app, `SUPABASE_SERVICE_ROLE_KEY` nao deve ser usada no browser nem em `NEXT_PUBLIC_*`.
- Na producao, ela so e necessaria se existir algum fluxo `server-only` real com privilegios administrativos.
- Depois de rodar `supabase start`, preencha essas variaveis com os valores mostrados pela CLI local:
  - `NEXT_PUBLIC_SUPABASE_URL` = `Project URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = `Publishable`
  - `SUPABASE_SERVICE_ROLE_KEY` = `Secret`
- Nao use a `Database URL` nem as credenciais de `Storage (S3)` nessas variaveis.

## Supabase local

Inicialize a stack local:

```bash
supabase start
```

Recrie o banco com migrations e seed:

```bash
pnpm db:reset
```

## Rodar a aplicacao

```bash
pnpm dev
```

## Testes de banco

Depois de subir o Supabase local e aplicar o reset:

```bash
pnpm test
```

Cobertura atual dos testes de banco:
- constraints de preco e promocao
- geracao de `order_number`
- RLS deny-by-default
- singleton de `store_settings`
- seed minima

## Scripts uteis

```bash
pnpm dev
pnpm build
pnpm check
pnpm test
pnpm db:reset
```

## Referencias do projeto

- `specs/01-technical-architecture.md`
- `specs/02-database-schema.md`
- `docs/implementation-plan.md`
- `docs/database-tests.md`
- `AGENTS.md`
