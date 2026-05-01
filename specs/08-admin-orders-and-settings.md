# 08 — Admin Orders And Settings

Objetivo

- Definir os módulos administrativos restantes do MVP: listagem de pedidos, gestão de banners da home e configurações da loja.

Contexto

- Depois que navegação pública, carrinho e catálogo administrativo estiverem definidos, o MVP ainda precisa de três frentes operacionais para fechar o ciclo: consultar pedidos gerados, controlar a vitrine da home e manter os dados institucionais da loja atualizados.
- Esta spec deve seguir `specs/01-technical-architecture.md`, `specs/02-database-schema.md`, `specs/04-public-browsing.md`, `specs/05-cart-and-checkout.md`, `specs/06-admin-foundation.md` e `specs/07-admin-catalog-management.md`.

Escopo coberto por esta spec

- Listagem administrativa de pedidos
- Visualização de detalhes de pedido
- Atualização simples de status do pedido
- Gestão administrativa de banners
- Edição de `store_settings`
- Estados de loading, vazio, erro e sucesso desses módulos

Fora de escopo desta spec

- Automação de atendimento no WhatsApp
- CRM
- Gestão logística
- Timeline avançada de pedido
- Motor de campanhas de banner
- Múltiplas lojas
- Auditoria avançada e histórico de alterações

Princípios dos módulos

- O operador deve conseguir entender rapidamente o que foi pedido e agir sem fricção.
- A home pública deve continuar leve; banners são apoio de navegação e promoção, não um sistema de mídia complexo.
- As configurações da loja devem ficar centralizadas em uma única fonte de verdade simples.
- O MVP deve preferir clareza operacional a automação excessiva.

Módulos administrativos cobertos

- Pedidos
- Banners
- Configurações da loja

Pedidos

- O módulo de pedidos deve permitir:
- listar pedidos gerados
- visualizar detalhes de um pedido
- atualizar status operacional simples do pedido
- consultar dados do cliente e itens do pedido

Objetivo do módulo de pedidos

- Ajudar a loja a consultar rapidamente o que foi enviado pelo cliente antes ou durante o atendimento via WhatsApp.
- O módulo não substitui um OMS completo nem um sistema de atendimento robusto.

Listagem de pedidos

- A listagem deve priorizar leitura rápida e ordenação operacional.
- Colunas mínimas recomendadas:
- `order_number`
- data/hora de criação
- nome do cliente
- telefone
- tipo de atendimento
- total estimado
- status
- ação para ver detalhes
- Ordem padrão recomendada: pedidos mais recentes primeiro.

Filtros e busca na listagem de pedidos

- Filtros mínimos úteis:
- status
- tipo de atendimento
- período simples quando viável
- Busca mínima útil por:
- número do pedido
- nome do cliente
- telefone
- Não é necessário busca avançada ou múltiplos filtros sofisticados na primeira versão.

Detalhe do pedido

- A visualização do pedido deve mostrar:
- `order_number`
- data de criação
- status atual
- nome do cliente
- telefone
- tipo de atendimento
- endereço quando aplicável
- observações
- lista de itens com nome, variante, quantidade e preço snapshot
- total estimado
- mensagem de WhatsApp persistida quando isso ajudar operação
- O detalhe deve usar o snapshot salvo do pedido, não recalcular a partir do catálogo atual.

Status do pedido

- Status disponíveis no MVP seguem o schema:
- `pending`
- `sent_to_whatsapp`
- `confirmed`
- `canceled`
- No MVP, pedidos recém-criados entram como `pending`.
- `sent_to_whatsapp` existe no domínio para uso operacional, mas não precisa ser atualizado automaticamente pelo cliente nesta primeira versão.
- O módulo admin deve permitir atualização simples e explícita desses status.
- Não é necessário workflow complexo com transições condicionais nesta fase.
- A UI deve evitar mudar status por acidente.

Regras de pedidos

- O total exibido é estimado e deve continuar tratado assim na interface administrativa.
- Alterar status não deve reescrever itens, preços ou mensagem do pedido.
- O pedido histórico deve permanecer legível mesmo que o catálogo mude depois.
- O admin consulta pedidos; o cliente não acessa histórico no MVP.

Banners

- O módulo de banners deve permitir:
- listar banners
- criar banner
- editar banner
- ativar/desativar banner
- ordenar banners
- gerenciar imagem e CTA

Objetivo dos banners

- Apoiar a home com destaques promocionais e atalhos de navegação.
- Banners não devem transformar a home em panfleto visualmente pesado.

Campos mínimos do banner

- `title`
- `subtitle`
- `image_url`
- `cta_label`
- `cta_url`
- `position`
- `is_active`

Regras de banner

- Banner inativo não aparece na home.
- Banner ativo precisa ter destino válido para não gerar navegação quebrada.
- A ordenação deve ser simples e previsível.
- Se não houver banners ativos, a home continua funcional sem eles.

Upload de banner

- Imagem de banner deve usar Supabase Storage conforme a arquitetura.
- O fluxo deve deixar claro quando a imagem foi enviada com sucesso e quando falta salvar o registro.
- Não é necessário editor avançado, crop inteligente ou múltiplas versões de mídia no MVP.

Configurações da loja

- O módulo de configurações deve editar a entidade singleton `store_settings`.
- Não deve existir fluxo administrativo para criar múltiplas lojas ou múltiplos registros de configuração.

Objetivo de `store_settings`

- Centralizar as informações institucionais e operacionais que aparecem no público e apoiam o fluxo de pedido.

Campos mínimos de `store_settings`

- `store_name`
- `description`
- `whatsapp_phone`
- `instagram_url`
- `address`
- `opening_hours`
- `google_maps_url`
- `delivery_enabled`
- `pickup_enabled`

Regras de `store_settings`

- Deve existir apenas um registro ativo de configuração.
- A interface administrativa deve carregar e editar esse registro existente.
- `whatsapp_phone` é crítico para o fluxo principal do produto e deve ter validação clara.
- As flags `delivery_enabled` e `pickup_enabled` devem influenciar o comportamento público e do checkout quando aplicável.
- O módulo não precisa suportar versionamento ou múltiplos perfis de operação.

Validações

- Pedidos: atualização de status deve aceitar apenas valores válidos do domínio.
- Banners: `title`, `cta_label` e `cta_url` devem ser coerentes quando o banner exigir ação navegável.
- `position` deve aceitar ordenação simples sem ambiguidade.
- `store_settings`: validar campos obrigatórios e formato mínimo útil de telefone e URLs quando fornecidas.
- O servidor continua sendo a fonte de verdade para validação.

Estados dos módulos

- Loading:
- listas e formulários com feedback coerente
- Vazio:
- pedidos sem registros devem mostrar estado operacional claro
- banners sem registros devem incentivar criação do primeiro banner
- Erro:
- mensagens simples e recuperáveis
- Sucesso:
- feedback claro ao salvar configurações, atualizar status ou criar/editar banner

Comportamento visual

- Pedidos priorizam leitura e escaneabilidade.
- Banners e configurações devem seguir a linguagem operacional da área admin, sem excesso decorativo.
- O uso de cor deve servir status e organização, não marketing interno.

Responsividade

- Os módulos devem seguir o shell administrativo responsivo já definido.
- Em mobile, listas podem colapsar para cartões operacionais quando necessário.
- Formulários de banners e configurações devem continuar editáveis em telas pequenas.

Acessibilidade

- Listagens, formulários e ações de status devem ser operáveis por teclado.
- Estados e feedbacks não devem depender apenas de cor.
- Labels e descrições devem ser claras para operador não técnico.

Critérios de aceite

- Admin consegue listar pedidos e abrir seus detalhes.
- Admin consegue atualizar status de pedido de forma simples e segura.
- O detalhe do pedido usa snapshot persistido, sem depender do catálogo atual.
- Admin consegue criar, editar, ativar/desativar e ordenar banners.
- Home pública continua funcional mesmo sem banners ativos.
- Admin consegue editar `store_settings` como registro único da loja.
- Os módulos têm estados coerentes de loading, vazio, erro e sucesso.
