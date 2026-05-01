# Production Database Setup

Guia operacional para configurar o banco do PatasGo em um projeto Supabase real.

## Objetivo

Ao final deste processo, voce deve ter:

- um projeto Supabase remoto criado
- migrations locais aplicadas no banco remoto
- buckets de storage criados pelas migrations
- variaveis de ambiente da app configuradas no ambiente de deploy
- tipos do banco regenerados a partir do schema remoto quando necessario

## Pre-requisitos

- conta e projeto criados no Supabase
- Supabase CLI instalado
- acesso ao repositorio do projeto
- acesso ao provedor de deploy da app, por exemplo Vercel

## 1. Criar o projeto Supabase

No dashboard do Supabase:

1. Crie um novo projeto.
2. Escolha regiao e senha do banco.
3. Espere o projeto terminar de provisionar.

Guarde estes dados do projeto:

- `Project URL`
- `Project Reference ID`
- `Publishable Key`
- `service_role` / secret key
- senha do banco remoto

Nao cole esses valores em documentacao versionada.

## 2. Autenticar e linkar o projeto local ao projeto remoto

Use a CLI oficial do Supabase:

```bash
supabase login
supabase link --project-ref <PROJECT_REF>
```

Se a CLI pedir a senha do banco remoto, use a senha definida na criacao do projeto.

Referencia oficial usada aqui:

- `supabase login`
- `supabase link --project-ref <project-id>`

## 3. Revisar o que vai subir

Antes de aplicar qualquer migration em producao, valide localmente:

```bash
supabase start
pnpm db:reset
pnpm test
pnpm build
```

Neste projeto, esse passo nao e opcional. O schema tem:

- RLS deny-by-default
- trigger para `updated_at`
- geracao automatica de `order_number`
- buckets criados por migration

Se algo falhar localmente, nao suba para producao ainda.

## 4. Aplicar migrations no banco remoto

Depois de linkar o projeto e validar localmente:

```bash
supabase db push
```

Se quiser revisar antes:

```bash
supabase db push --dry-run
```

O que este projeto sobe pelas migrations:

- tabelas do catalogo, pedidos e configuracoes
- indices
- constraints
- triggers
- politicas iniciais de RLS
- buckets `products`, `brands` e `banners`

Observacao:

- o seed local `supabase/seed.sql` nao deve ser aplicado cegamente em producao
- neste projeto, o seed serve para desenvolvimento e testes locais

## 5. Configurar variaveis da app em producao

No ambiente de deploy da app, configure:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Essas duas sao obrigatorias para a app.

### Sobre `SUPABASE_SERVICE_ROLE_KEY`

Use `SUPABASE_SERVICE_ROLE_KEY` em producao apenas se existir um fluxo `server-only` real que precise dela.

Exemplos validos:

- scripts administrativos rodando no servidor
- jobs internos
- server actions ou route handlers que realmente precisem bypassar RLS

Exemplos invalidos:

- browser
- `NEXT_PUBLIC_*`
- client components
- qualquer codigo exposto ao usuario final

Se a app nao tiver esse uso administrativo ainda, nao precisa configurar `SUPABASE_SERVICE_ROLE_KEY` no deploy agora.

## 6. Verificar buckets e politicas

Depois do `db push`, confira no dashboard do Supabase:

- bucket `products`
- bucket `brands`
- bucket `banners`

Confira tambem se as tabelas estao com RLS habilitado. Nesta fase, o banco nasce fechado por padrao.

Isso e esperado.

## 7. Regenerar tipos a partir do banco remoto

Se o schema remoto mudar, regenere os tipos do projeto:

```bash
supabase gen types typescript --project-id "<PROJECT_REF>" --schema public > types/database.ts
```

Depois rode:

```bash
pnpm check
pnpm build
```

## 8. Checklist de saida

Antes de considerar o banco de producao pronto, confirme:

- `supabase link` feito para o projeto correto
- `supabase db push` aplicado sem erro
- tabelas criadas no schema `public`
- RLS habilitado
- buckets criados
- `NEXT_PUBLIC_SUPABASE_URL` configurada no deploy
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` configurada no deploy
- `SUPABASE_SERVICE_ROLE_KEY` configurada apenas se existir uso `server-only` real
- `types/database.ts` atualizado se houve mudanca de schema

## 9. Fluxo recomendado para futuras mudancas

Sempre siga esta ordem:

1. editar migrations localmente
2. validar local com `pnpm db:reset`
3. rodar `pnpm test`
4. rodar `pnpm build`
5. aplicar em remoto com `supabase db push`
6. regenerar `types/database.ts` se necessario

Esse e o jeito mais seguro de evitar drift entre:

- schema local
- schema remoto
- tipos TypeScript
- comportamento real da app
