# 04 — Public Browsing

Objetivo

- Definir a experiência pública de navegação do MVP: home, catálogo, busca, filtros e detalhe de produto, com foco em descoberta rápida e caminho claro para pedido via WhatsApp.

Contexto

- O PatasGo deve se comportar mais como um catálogo digital assistido do que como um e-commerce tradicional.
- A experiência pública precisa ser mobile-first, rápida, clara e orientada a conversão para WhatsApp.
- Esta spec deve seguir `DESIGN.md`, `specs/01-technical-architecture.md`, `specs/02-database-schema.md` e `specs/03-design-system.md`.

Escopo coberto por esta spec

- Página inicial pública `/`
- Catálogo `/catalogo`
- Detalhe de produto `/produto/[slug]`
- Busca pública
- Filtros públicos
- Estados de loading, vazio e erro da navegação pública

Fora de escopo desta spec

- Carrinho e formulário de pedido detalhados
- Persistência do pedido
- CRUDs administrativos
- SEO detalhado

Princípios da experiência pública

- O usuário deve encontrar um produto ou caminho de navegação útil em poucos segundos.
- A home deve levar rapidamente para categorias, promoções e catálogo.
- O catálogo deve reduzir atrito de descoberta, não simular uma vitrine infinita de marketplace.
- O detalhe do produto deve remover dúvida suficiente para permitir `adicionar ao pedido` com confiança.
- O CTA principal sempre deve aproximar o usuário do pedido, nunca competir com ações secundárias.

Contrato de dados públicos

- A navegação pública só deve consumir o contrato de catálogo público definido na arquitetura.
- Não ler tabelas base diretamente em componentes públicos quando isso duplicar regras de visibilidade.
- Só devem aparecer produtos realmente exibíveis:
- produto ativo
- categoria ativa quando aplicável
- marca ativa quando aplicável
- pelo menos uma variante ativa e válida para pedido
- banners ativos com destino válido

Rotas públicas

1. `/`

- Objetivo: orientar rapidamente o usuário para descoberta de produtos e promoções.
- Blocos esperados no MVP:
- hero curto com proposta clara e CTA para catálogo
- banners ativos quando existirem
- atalhos de categorias principais
- seção de promoções quando houver produtos promocionais ativos
- seção de produtos em destaque quando houver itens marcados como destaque
- acesso claro para o catálogo completo
- informações institucionais resumidas no footer

2. `/catalogo`

- Objetivo: ser a principal superfície de descoberta e comparação rápida.
- Deve exibir:
- busca
- filtros
- grid/lista de produtos
- estado vazio quando não houver resultados
- feedback de filtros ativos

3. `/produto/[slug]`

- Objetivo: ajudar o usuário a escolher uma variante e seguir para o pedido.
- Deve exibir:
- imagem principal do produto
- nome
- descrição curta e detalhes relevantes
- preço baseado na variante selecionada
- seleção de variante
- status de disponibilidade
- CTA de adicionar ao pedido

Home pública

- A home não deve virar panfleto promocional denso.
- O hero deve ser curto, direto e com proposta centrada em rapidez, confiança e WhatsApp.
- Categorias devem aparecer cedo na página para orientar clientes que ainda não sabem o produto exato.
- Promoções devem ter presença forte, mas controlada; não dominar a página toda.
- Produtos em destaque devem reforçar descoberta, não substituir o catálogo.
- Se não houver banners ativos, a home continua funcional com hero + categorias + destaques.
- Se não houver produtos promocionais, a seção de promoções pode ser omitida.

Catálogo

- O catálogo deve priorizar leitura rápida no mobile.
- A listagem deve usar `ProductCard` com hierarquia visual clara para imagem, nome, preço e CTA.
- O catálogo deve aceitar combinação de busca + filtros sem recarregar a página inteira.
- Filtros ativos devem ser visíveis e removíveis com facilidade.
- Deve existir forma simples de limpar filtros.

Busca pública

- A busca deve atuar pelo menos sobre nome do produto.
- Pode incluir apoio em `short_description` se isso não aumentar complexidade cedo demais.
- No MVP, não é necessário autocomplete avançado.
- A busca deve ser tolerante ao uso comum, mas sem exigir search engine externo.

Filtros públicos

- Filtros mínimos do MVP:
- categoria
- marca
- tipo de pet
- faixa etária
- porte
- promoção
- Filtros só devem exibir opções públicas válidas.
- Marcas e categorias inativas não aparecem como filtro público.
- Produtos sem variante válida não devem aparecer em resultados, mesmo que o filtro coincida.
- O filtro de promoção deve retornar produtos com condição comercial promocional de forma consistente com `promotional_price` e/ou marcação de promoção adotada na implementação.
- Regra do MVP: um produto só entra em contextos públicos de promoção quando `is_promotion = true` e houver pelo menos uma variante pública válida com `promotional_price` coerente.

Ordenação

- O MVP pode começar sem múltiplas ordenações sofisticadas.
- Ordem padrão recomendada:
- produtos em destaque primeiro quando fizer sentido comercial
- depois `sort_order` ascendente
- fallback estável por nome
- Se uma ordenação explícita for implementada já no MVP, manter o conjunto mínimo: `mais relevantes` e `nome`.

Paginação e carregamento

- O MVP pode usar paginação simples ou carregamento incremental, desde que a UX continue leve no mobile.
- Não é necessário infinite scroll obrigatório.
- A primeira versão deve priorizar simplicidade de implementação e previsibilidade.

Detalhe de produto

- A página deve deixar evidente qual produto está sendo visto, para qual pet ele é indicado e qual variante está sendo escolhida.
- A seleção de variante deve ser simples de entender e tocar no mobile.
- O preço exibido deve refletir a variante selecionada.
- Quando houver `promotional_price`, ele domina a hierarquia visual e o preço original aparece de apoio.
- Se só houver uma variante válida, ela pode vir pré-selecionada.
- O CTA de adicionar ao pedido só deve ficar habilitado quando houver variante válida selecionada.

Status de disponibilidade

- `available`: item pode ser adicionado normalmente ao pedido.
- `consult`: item pode ser adicionado, mas deve exibir aviso claro de confirmação posterior com a loja.
- `unavailable`: item não pode ser adicionado ao pedido.
- Produto sem variante comprável não deve aparecer como comprável no detalhe; idealmente nem deve entrar no catálogo público.

CTA e conversão

- `Adicionar ao pedido` é o CTA principal da navegação pública.
- Na home e no catálogo, o CTA deve ser visível sem competir com excesso de elementos coloridos.
- No detalhe do produto, o CTA deve ter destaque maior que ações secundárias.
- No mobile, recomenda-se CTA sticky apenas em superfícies de decisão/conversão, especialmente no detalhe do produto.
- Não usar barra sticky global de WhatsApp na home inteira ou no catálogo inteiro.

Estados de interface

- Loading:
- skeletons para hero/listas/cards quando aplicável
- placeholders consistentes no catálogo e detalhe
- Vazio:
- home sem promoções ou banners continua útil sem blocos quebrados
- catálogo sem resultados mostra mensagem clara e CTA para limpar filtros
- detalhe sem produto encontrado deve levar o usuário de volta ao catálogo
- Erro:
- mensagem simples, sem linguagem técnica
- CTA para tentar novamente ou voltar ao catálogo

Regras de negócio da navegação pública

- Produtos inativos não aparecem.
- Categorias inativas não aparecem.
- Marcas inativas não aparecem como filtro público.
- Produto precisa ter ao menos uma variante válida para ser exibível/comprável.
- Produto indisponível não deve ser adicionado ao carrinho.
- Produto com status `consult` deve sinalizar confirmação posterior pela loja.
- O carrinho é local ao navegador e a navegação pública deve tratá-lo como estado local do cliente.

Responsividade

- Mobile-first obrigatório.
- Home, catálogo e detalhe devem funcionar com uso confortável de uma mão sempre que possível.
- Filtros no mobile podem usar linha horizontal de chips e expansão simples quando necessário.
- O grid do catálogo deve escalar de forma disciplinada para tablet e desktop, sem perder leitura.

Acessibilidade

- Busca, filtros, seleção de variante e CTA principal devem ser plenamente operáveis por teclado.
- Estados de foco devem ser visíveis.
- Labels e textos de apoio devem deixar claro o que acontece ao adicionar um item ao pedido.
- Não depender apenas de cor para transmitir promoção, disponibilidade ou erro.

Critérios de aceite

- Home pública guia rapidamente para catálogo, categorias e promoções quando existirem.
- Catálogo permite buscar e filtrar produtos do contrato público sem exibir itens inválidos.
- Detalhe de produto permite selecionar variante válida e avançar para `adicionar ao pedido`.
- Status `available`, `consult` e `unavailable` têm comportamento visual e funcional coerente.
- Estados de loading, vazio e erro existem nas superfícies públicas principais.
- A navegação pública funciona bem em mobile e desktop, com prioridade clara para mobile.
