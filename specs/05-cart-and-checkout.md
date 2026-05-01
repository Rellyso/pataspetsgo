# 05 — Cart And Checkout

Objetivo

- Definir o fluxo do carrinho local e do checkout do MVP, desde `adicionar ao pedido` até a persistência do pedido e abertura do WhatsApp.

Contexto

- O PatasGo não é um checkout completo de e-commerce; ele funciona como um fluxo de pedido assistido com fechamento pelo WhatsApp.
- O carrinho é local ao navegador.
- O pedido precisa ser salvo antes de abrir o WhatsApp.
- Esta spec deve seguir `specs/00-product-vision.md`, `specs/01-technical-architecture.md`, `specs/02-database-schema.md`, `specs/03-design-system.md` e `specs/04-public-browsing.md`.

Escopo coberto por esta spec

- Adição de produto ao carrinho
- Estrutura e comportamento do carrinho local
- Página `/pedido`
- Formulário de checkout do MVP
- Validações de envio
- Persistência server-only do pedido
- Geração da mensagem e abertura do WhatsApp
- Estados de loading, vazio, erro e sucesso operacional do fluxo

Fora de escopo desta spec

- Pagamento online
- Cálculo automático de frete
- Cupom de desconto
- Conta de cliente
- Histórico de pedidos do cliente
- Recuperação de carrinho entre dispositivos

Princípios do fluxo

- O usuário deve montar e revisar o pedido sem fricção desnecessária.
- O carrinho deve parecer simples e confiável, não um checkout pesado.
- O sistema deve deixar claro que o total é estimado.
- O envio para WhatsApp só acontece depois de persistência bem-sucedida.
- O fluxo deve ser especialmente confortável no mobile.

Entrada no fluxo

- O usuário entra no carrinho a partir de `Adicionar ao pedido` nas superfícies públicas.
- A ação de adicionar item deve usar a variante selecionada e o snapshot visível naquele momento.
- Se a variante estiver `unavailable`, o item não pode ser adicionado.
- Se a variante estiver `consult`, o item pode ser adicionado com aviso de confirmação posterior pela loja.

Carrinho local

- O carrinho deve ser armazenado localmente no navegador.
- A persistência local deve sobreviver a refresh simples de página.
- O carrinho é por dispositivo/navegador; não há sincronização de sessão entre devices no MVP.
- O carrinho deve conter snapshot suficiente para renderização local sem depender de nova leitura imediata do catálogo.

Estrutura mínima do item local

- `product_id`
- `product_variant_id`
- `product_slug`
- `product_name`
- `variant_name`
- `unit_price_snapshot`
- `promotional_price_snapshot` quando aplicável
- `quantity`
- `stock_status_snapshot`
- `image_url` opcional para renderização do carrinho

Regras do carrinho

- Itens iguais devem ser consolidados quando `product_variant_id` for o mesmo.
- Quantidade mínima por item: `1`.
- Remover item deve ser simples e evidente.
- Esvaziar carrinho pode existir, mas não é obrigatório na primeira interação se remoção individual já for clara.
- O total exibido no carrinho é sempre estimado.
- O carrinho não precisa recalcular preço consultando o backend a cada interação local.
- Se o produto mudar no catálogo após ter sido colocado no carrinho, o sistema pode validar novamente apenas no momento do envio do pedido.

Página `/pedido`

- É a superfície principal de revisão antes do envio ao WhatsApp.
- Deve conter:
- lista de itens do carrinho
- controles de quantidade e remoção
- resumo do pedido com total estimado
- aviso de que preço e disponibilidade serão confirmados pela loja
- formulário de dados do cliente
- CTA principal `Enviar pedido pelo WhatsApp`

Estados da página `/pedido`

- Carrinho vazio:
- mensagem clara
- CTA para voltar ao catálogo
- Carrinho com itens:
- revisão normal do pedido
- Envio em andamento:
- bloquear reenvio duplo
- mostrar feedback de processamento
- Erro no envio:
- manter dados preenchidos e carrinho intactos
- mostrar mensagem simples com opção de tentar novamente

Formulário do checkout

- Campos mínimos do MVP:
- `customer_name`
- `customer_phone`
- `delivery_type`
- `address`
- `notes`
- `address` é obrigatório apenas quando `delivery_type = delivery`.
- `notes` é opcional.
- O formulário deve ser curto, claro e mobile-first.

Delivery type

- Valores do MVP:
- `pickup`
- `delivery`
- `arrange`
- As opções apresentadas ao cliente devem respeitar `store_settings`.
- `pickup`: só aparece se `pickup_enabled = true`; não exige endereço.
- `delivery`: só aparece se `delivery_enabled = true`; exige endereço.
- `arrange`: permanece disponível como fallback operacional do MVP e não exige endereço.
- Se apenas uma opção operacional estiver disponível entre `pickup` e `delivery`, ela pode vir pré-selecionada.
- Se `pickup` e `delivery` estiverem desabilitados, o checkout deve permitir apenas `arrange`.

Validações

- O carrinho deve ter pelo menos `1` item para permitir envio.
- `customer_name` é obrigatório.
- `customer_phone` é obrigatório e precisa de validação básica suficiente para evitar envio vazio ou claramente inválido.
- `address` é obrigatório quando `delivery`.
- Quantidades devem ser inteiras e maiores que zero.
- O servidor deve rejeitar `pickup` ou `delivery` quando essas opções estiverem desabilitadas em `store_settings`.
- O servidor deve revalidar tudo com Zod, independentemente das validações do cliente.

Total estimado

- O total mostrado ao cliente é sempre estimado.
- O cálculo local usa o snapshot de preço do carrinho no momento da montagem.
- Se existir `promotional_price_snapshot`, ele tem precedência sobre o preço base.
- O texto do resumo deve deixar claro que preço e disponibilidade serão confirmados pela loja no WhatsApp.

Persistência do pedido

- O cliente não grava `orders` nem `order_items` diretamente.
- O cliente envia um payload final para uma boundary server-only.
- O payload deve incluir:
- dados do cliente
- tipo de atendimento
- observações
- itens do carrinho com snapshot relevante
- total estimado
- O servidor valida o payload, gera `order_number`, persiste `orders` e `order_items` com status inicial `pending` e retorna o resultado do pedido criado.
- A gravação deve ocorrer como operação consistente única, conforme a arquitetura.

Revalidação no envio

- Antes de persistir, o servidor pode revalidar se as variantes enviadas continuam válidas para pedido.
- Se algum item deixar de ser comprável entre a montagem do carrinho e o envio, o fluxo deve falhar de forma clara e pedir revisão do carrinho.
- Não tentar corrigir silenciosamente o carrinho do usuário no servidor.

Mensagem de WhatsApp

- A mensagem deve ser gerada apenas após persistência bem-sucedida do pedido.
- A mensagem deve conter, no mínimo:
- número do pedido
- nome do cliente
- telefone
- tipo de atendimento
- endereço quando aplicável
- lista de itens com quantidade
- total estimado
- observações quando existirem
- A mensagem deve ser legível para a loja e pronta para continuidade manual do atendimento.

Sequência do envio

1. Usuário revisa carrinho.
2. Preenche dados do pedido.
3. Clica em `Enviar pedido pelo WhatsApp`.
4. Cliente envia payload para a boundary server-only.
5. Servidor valida e tenta persistir pedido.
6. Se persistir com sucesso, o sistema monta ou retorna a mensagem do WhatsApp.
7. O cliente abre o WhatsApp com a mensagem formatada.
8. O sistema pode então limpar o carrinho local ou movê-lo para estado concluído.

Pós-envio

- Recomendação do MVP: limpar o carrinho apenas depois de confirmação de persistência bem-sucedida.
- Se a abertura do WhatsApp falhar no cliente após a persistência, o pedido continua salvo com status `pending` e o usuário deve receber orientação clara para tentar abrir novamente.
- É aceitável mostrar uma tela/estado de sucesso com resumo curto e atalho para reabrir o WhatsApp.

Estados operacionais

- Loading:
- feedback visível durante o envio
- botão principal com estado de processamento
- Erro de validação:
- mensagens objetivas por campo quando aplicável
- Erro operacional:
- mensagem simples de falha ao salvar/enviar
- opção de tentar novamente
- Sucesso:
- confirmação de que o pedido foi salvo
- indicação de redirecionamento/abertura do WhatsApp

Comportamento de UX

- O resumo do pedido deve ficar fácil de revisar no mobile.
- O CTA principal deve ficar claro e dominante na página `/pedido`.
- O fluxo deve evitar distrações e campos excessivos.
- O usuário deve entender que ainda falará com a loja; o sistema não deve prometer compra finalizada automaticamente.

Responsividade

- Mobile-first obrigatório.
- A página `/pedido` deve funcionar confortavelmente em telas pequenas, com resumo e formulário em ordem lógica.
- O CTA principal pode ser sticky no mobile durante o checkout, desde que não esconda campos importantes nem crie conflito com teclado virtual.

Acessibilidade

- Campos devem ter label claro.
- Erros de validação devem ser perceptíveis e associados ao campo.
- O resumo do pedido e o CTA principal devem ser navegáveis por teclado.
- O fluxo não deve depender apenas de cor para comunicar erro ou sucesso.

Critérios de aceite

- Usuário consegue adicionar item válido ao carrinho e revisar o pedido em `/pedido`.
- Carrinho persiste localmente no navegador durante a sessão de uso esperada do MVP.
- Formulário exige nome, telefone e endereço quando `delivery`.
- Pedido só é enviado para WhatsApp após persistência bem-sucedida.
- O sistema impede envio com carrinho vazio ou itens inválidos.
- O total é apresentado como estimado de forma clara.
- O fluxo oferece estados coerentes de loading, erro e sucesso no mobile e desktop.
