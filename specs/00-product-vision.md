# 00 — Product Vision

Objetivo

- Definir a visão do produto, público-alvo, propostas de valor e o escopo do MVP.

Contexto

- Patas Pets: catálogo digital para pet shop com foco em gerar pedidos via WhatsApp.
- Público: clientes locais que preferem comunicação por WhatsApp em vez de checkout online.
- O produto deve se comportar mais como um cardápio digital de compra assistida do que como um e-commerce tradicional.

Proposta de valor

- Navegação simples, foco em mobile.
- Produtos categorizados por pet, idade e porte.
- Processo de pedido rápido que gera uma mensagem do WhatsApp pronta.
- Experiência de descoberta e pedido com baixa fricção, priorizando velocidade, clareza de preço e ação rápida.

Princípios de produto

- WhatsApp é o CTA principal do funil, não um detalhe secundário.
- A home deve conduzir rapidamente ao catálogo e às promoções, sem excesso de conteúdo institucional.
- O MVP deve priorizar descoberta de produtos, montagem de pedido e operação interna simples.
- A área administrativa deve favorecer eficiência operacional, não complexidade de backoffice.

Fluxo principal (resumido)

1. Usuário visita home
2. Vai para catálogo
3. Filtra/busca produtos
4. Adiciona itens ao carrinho
5. Preenche dados básicos
6. Envia pedido via WhatsApp (pedido salvo no Supabase)

Rotas envolvidas

- `/` — Home pública
- `/catalogo` — Listagem de produtos
- `/produto/[slug]` — Página do produto
- `/pedido` — Carrinho / checkout
- `/admin` — Área administrativa (protegida)

Modelos de dados (visão rápida)

- StoreSettings, Category, Brand, Product, ProductVariant, Banner, Order, OrderItem

Componentes necessários (alto nível)

- AppHeader, AppFooter, ProductCard, CategoryCard, SearchInput, FilterChip, QuantitySelector, WhatsappButton, CartDrawer

Prioridade de construção

1. Fundação do app, tema, layouts e componentes base.
2. Shell público com navegação, busca, categorias e estados reutilizáveis.
3. Catálogo e detalhe de produto.
4. Carrinho local e fluxo de pedido via WhatsApp.
5. Área administrativa protegida e CRUDs do MVP.

Regras de negócio essenciais

- Produtos inativos não aparecem no catálogo.
- Variações inativas não são compráveis.
- `promotional_price` tem precedência na exibição de preço.
- Pedido salvo antes de abrir WhatsApp; número único gerado.
- O produto deve sempre deixar claro o caminho para `adicionar ao pedido` antes de qualquer fluxo secundário.

Validações chave

- Nome do cliente obrigatório.
- Telefone obrigatório e com validação básica.
- Endereço obrigatório quando `delivery`.
- Carrinho deve ter ≥1 item para salvar pedido.

Estados (loading/erro/vazio)

- Skeletons para listagens
- Empty states com CTA para catálogo
- Feedback claro ao enviar pedido

Critérios de aceite

- Fluxo principal executável manualmente (end-to-end) no ambiente local com dados de exemplo.
- Documento serve como contrato para as specs subsequentes.

Fora de escopo (MVP)

- Pagamento online
- Cálculo automático de frete
- NF-e / integração fiscal
