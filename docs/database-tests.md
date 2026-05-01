# Database Tests

## Pre-requisitos

- Docker Desktop rodando
- Supabase CLI instalado
- Variaveis de ambiente em `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Fluxo recomendado

1. Subir a stack local:

```bash
supabase start
```

2. Aplicar migrations e seed:

```bash
pnpm db:reset
```

3. Rodar os testes:

```bash
pnpm test
```

## O que os testes cobrem

- Constraints de preco e promocao
- Geracao de `order_number`
- Geracao de `order_number` sem enviar esse campo no insert
- RLS default deny
- Singleton de `store_settings`
- Seed minima util
