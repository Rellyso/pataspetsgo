# 09 — SEO And Metadata

Objetivo

- Definir o nível de SEO e metadata necessário para o MVP do PatasGo, cobrindo indexação básica, títulos, descrições, compartilhamento social e regras simples de URLs públicas.

Contexto

- O projeto precisa de SEO básico, não de uma estratégia avançada de conteúdo ou growth.
- O foco do MVP é tornar as páginas públicas legíveis para buscadores e compartilháveis em links de WhatsApp, Instagram bio e navegação direta.
- Esta spec deve seguir `specs/00-product-vision.md`, `specs/01-technical-architecture.md`, `specs/04-public-browsing.md` e `specs/08-admin-orders-and-settings.md`.

Escopo coberto por esta spec

- Metadata básica por rota pública
- Títulos e descrições
- Open Graph mínimo
- Canonical URLs
- Regras de indexação do MVP
- Uso de slugs públicos
- Requisitos mínimos para sitemap e robots

Fora de escopo desta spec

- Estratégia editorial de blog
- SEO avançado técnico
- Schema markup complexo
- Multi-idioma
- Search Console e analytics avançados
- Otimização de conteúdo para campanhas específicas

Princípios de SEO do MVP

- O SEO deve ser correto e simples, sem adicionar complexidade desnecessária.
- As rotas públicas principais devem ser indexáveis quando fizer sentido.
- As rotas administrativas e transacionais não devem competir com a navegação pública em indexação.
- O compartilhamento social deve produzir prévias legíveis e coerentes com a marca.

Rotas públicas cobertas

- `/`
- `/catalogo`
- `/produto/[slug]`

Rotas não focadas em indexação

- `/pedido`
- `/admin`
- `/auth/*`
- rotas técnicas ou operacionais internas

Títulos e descrições

- Cada rota pública principal deve ter `title` e `description` próprios.
- O título deve priorizar clareza e contexto comercial local, sem parecer spam.
- A descrição deve explicar utilidade real da página e reforçar o fluxo do catálogo/pedido.
- Padrão de direção recomendada:
- Home: marca + proposta do catálogo digital
- Catálogo: descoberta de produtos do pet shop
- Produto: nome do produto + marca ou contexto relevante quando útil

Diretrizes de `title`

- Home: destacar `PatasGo` e `Patas Pets` com proposta curta.
- Catálogo: deixar claro que é a listagem de produtos.
- Produto: usar o nome do produto como eixo principal.
- Evitar títulos genéricos como `Home`, `Produto` ou `Catálogo` sem contexto.
- Evitar excesso de repetição de keywords.

Diretrizes de `description`

- Home: descrever o catálogo digital, foco em WhatsApp e compra assistida.
- Catálogo: descrever descoberta de produtos por categoria, marca e perfil do pet.
- Produto: resumir o item com contexto de variação, indicação ou benefício principal quando houver dado útil.
- Se algum dado do produto estiver ausente, usar fallback curto e consistente em vez de descrição vazia.

Open Graph mínimo

- As rotas públicas devem gerar metadados mínimos para compartilhamento social.
- Campos mínimos recomendados:
- `og:title`
- `og:description`
- `og:type`
- `og:url`
- `og:image`
- `twitter:card` no formato simples compatível
- Home pode usar imagem institucional da marca ou banner social padrão.
- Produto deve preferir imagem principal do produto quando disponível.
- Se não houver imagem específica, usar fallback social padrão do projeto.

Canonical URLs

- As rotas públicas indexáveis devem expor `canonical` coerente.
- O canonical deve apontar para a URL pública principal da página, sem parâmetros de filtro efêmeros quando isso não representar página canônica própria.
- Parâmetros transitórios de busca/filtro no catálogo não devem criar canônicos alternativos para cada combinação.

Indexação por rota

- Home: indexável.
- Catálogo: indexável.
- Produto: indexável quando o produto for público e válido no contrato de catálogo.
- `/pedido`: não precisa ser indexável.
- `/admin` e autenticação: não indexáveis.

Relação com o contrato público do catálogo

- Página de produto não deve gerar metadata pública para item que não deveria estar exposto no catálogo.
- Produto inativo, sem variante válida ou com relação pública inválida não deve ser tratado como página indexável normal.
- A estratégia de metadata deve respeitar exatamente a mesma regra de visibilidade da navegação pública.

Slugs públicos

- `categories.slug`, `brands.slug` e `products.slug` devem ser únicos conforme o schema.
- No MVP atual, a rota pública indexável principal com slug é `/produto/[slug]`.
- O slug deve ser estável, legível e orientado a URL pública limpa.
- Mudanças de slug devem ser tratadas com cuidado na implementação para evitar links quebrados, mesmo que redirect automático avançado não seja obrigatório nesta fase.

Catálogo e filtros

- O catálogo pode usar parâmetros de busca e filtro para UX, mas isso não exige indexação de cada combinação.
- A versão canônica do catálogo continua sendo `/catalogo`.
- Não é necessário criar landing pages indexáveis por filtro no MVP.

Sitemap e robots

- O MVP deve prever sitemap básico das rotas públicas indexáveis.
- Inclusões mínimas esperadas:
- home
- catálogo
- páginas públicas de produto válidas
- O projeto deve expor `robots` coerente com esse escopo.
- Rotas administrativas e transacionais não devem ser promovidas para indexação.

Fallbacks de metadata

- Deve existir fallback global para título, descrição e imagem social padrão.
- Páginas públicas específicas podem sobrescrever esse fallback.
- Fallbacks devem ser suficientes para evitar páginas com metadata vazia ou inconsistente.

Imagem social padrão

- O projeto pode começar com uma imagem social padrão simples e institucional do PatasGo.
- Não é necessário gerar OG image dinâmica por produto no MVP.
- Se a implementação permitir imagem específica de produto sem custo alto de manutenção, isso é positivo, mas não obrigatório para a primeira entrega.

Rotas transacionais e protegidas

- `/pedido` deve priorizar UX do fluxo, não SEO.
- `/admin` e rotas de auth devem permanecer fora do foco de indexação.
- A ausência de SEO avançado nessas rotas não é problema do MVP.

Validações e robustez

- Metadata dinâmica deve lidar com ausência de imagem ou descrição sem quebrar renderização.
- Páginas de produto inexistente ou inválido devem responder de forma coerente com a navegação pública e não se comportar como páginas normais indexáveis.
- O sistema deve evitar títulos duplicados triviais quando o contexto da rota exigir diferenciação.

Critérios de aceite

- Home, catálogo e produto têm `title` e `description` próprios.
- Rotas públicas principais expõem Open Graph mínimo funcional.
- Existe canonical coerente para as páginas indexáveis do MVP.
- `/pedido`, `/admin` e rotas de autenticação não entram como páginas focadas em indexação.
- O sitemap básico contempla home, catálogo e produtos públicos válidos.
- Metadata respeita a visibilidade real do catálogo público, sem expor produto inválido como página normal indexável.
