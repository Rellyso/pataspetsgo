# 07 — Admin Catalog Management

Objetivo

- Definir o gerenciamento administrativo do catálogo do MVP: produtos, variantes, categorias e marcas, com foco em operação simples, ativação lógica e manutenção segura da vitrine pública.

Contexto

- O catálogo é o núcleo operacional do PatasGo.
- A área administrativa deve permitir que poucos operadores internos mantenham a vitrine atualizada sem depender de fluxos complexos.
- O MVP deve privilegiar clareza de formulário, listagem eficiente e regras simples de publicação.
- Esta spec deve seguir `specs/01-technical-architecture.md`, `specs/02-database-schema.md`, `specs/03-design-system.md` e `specs/06-admin-foundation.md`.

Escopo coberto por esta spec

- Listagem administrativa de produtos
- Criação e edição de produtos
- Gestão de variantes por produto
- Listagem, criação e edição de categorias
- Listagem, criação e edição de marcas
- Ativação/desativação lógica
- Upload e vínculo de imagens principais do catálogo
- Estados de loading, vazio, erro e sucesso dos módulos de catálogo

Fora de escopo desta spec

- Gestão de banners
- Pedidos
- Configurações da loja
- Importação por planilha
- Controle avançado de estoque
- Exclusão física de dados
- Edição em massa avançada

Princípios do módulo

- O operador deve conseguir publicar e ajustar catálogo com poucos passos.
- O sistema deve reduzir chance de colocar item inválido na vitrine pública.
- O MVP deve preferir ativação/desativação lógica a exclusão física.
- Formulários devem ser objetivos e adequados a uso operacional recorrente.
- A gestão de variantes deve parecer simples, não técnica demais.

Módulos administrativos cobertos

- Produtos
- Categorias
- Marcas
- Variantes de produto

Relação com o catálogo público

- O admin gerencia tabelas base, mas a vitrine pública lê o contrato público centralizado.
- Alterações administrativas devem refletir as regras de publicação já definidas nas specs anteriores.
- Um produto salvo no admin não precisa necessariamente ficar público imediatamente.

Produtos

- O módulo de produtos deve permitir:
- listar produtos
- criar produto
- editar produto
- ativar/desativar produto
- marcar produto como destaque
- marcar produto como promoção
- gerenciar imagem principal
- acessar e gerenciar variantes do produto

Campos mínimos do produto

- `name`
- `slug`
- `description`
- `short_description`
- `category_id`
- `brand_id`
- `pet_type`
- `age_group`
- `size_group`
- `image_url`
- `sort_order`
- `is_active`
- `is_featured`
- `is_promotion`

Regras de produto

- `name` é obrigatório.
- `slug` é obrigatório e único.
- Categoria e marca devem apontar para registros válidos.
- Produto pode existir inativo sem aparecer na vitrine.
- Produto ativo sem variante válida não deve ser considerado publicável de fato, ainda que o registro exista.
- `sort_order` define prioridade operacional simples do produto em listagens e apoio à ordenação pública.
- `is_promotion` é uma flag editorial do produto, mas só deve produzir efeito público real quando existir pelo menos uma variante válida com `promotional_price`; o admin não deve induzir promoção vazia.

Listagem de produtos

- A listagem deve priorizar leitura operacional.
- Colunas mínimas recomendadas:
- imagem/thumb
- nome
- categoria
- marca
- status ativo/inativo
- destaque
- promoção
- prioridade/ordem quando útil
- última atualização ou data de criação
- Deve existir ação rápida para editar.
- Deve existir feedback claro sobre produto sem variante válida ou com publicação incompleta quando isso impactar a vitrine.

Filtros e busca na listagem de produtos

- Busca por nome do produto.
- Filtros mínimos úteis:
- status ativo/inativo
- categoria
- marca
- promoção
- destaque
- Não é necessário filtro avançado demais na primeira versão.

Formulário de produto

- O formulário deve ser organizado para leitura rápida.
- Ordem recomendada:
- identidade básica do produto
- categorização
- imagem principal
- descrição curta e descrição longa
- atributos de público do pet
- status e flags comerciais
- prioridade de exibição
- As opções de pet, idade e porte devem ser apresentadas com labels claros em português para o operador.

Variantes de produto

- Variantes pertencem ao contexto do produto e devem ser gerenciadas dentro do fluxo do produto ou em tela diretamente associada a ele.
- O módulo deve permitir:
- listar variantes do produto
- criar variante
- editar variante
- ativar/desativar variante
- reordenar prioridade simples quando necessário

Campos mínimos da variante

- `name`
- `sku`
- `weight`
- `flavor`
- `price`
- `promotional_price`
- `stock_status`
- `sort_order`
- `is_active`

Regras de variante

- `name` é obrigatório.
- `price` deve ser obrigatório e maior ou igual a zero.
- `promotional_price`, quando informado, deve ser válido e coerente com `price`.
- `sku` é opcional, mas deve ser único quando preenchido.
- `stock_status` define o comportamento comercial: `available`, `consult`, `unavailable`.
- Variante inativa não é comprável.
- Variante `unavailable` não entra como comprável, mesmo se estiver ativa.
- Produto precisa de pelo menos uma variante válida para ser comprável na vitrine.

Experiência de variantes

- O operador deve entender rapidamente quais variantes estão publicáveis.
- A UI deve destacar preço, preço promocional, status de estoque e ativo/inativo sem parecer uma planilha complexa.
- Se não houver variantes, o produto deve sinalizar claramente que ainda não está pronto para vitrine.

Categorias

- O módulo de categorias deve permitir:
- listar categorias
- criar categoria
- editar categoria
- ativar/desativar categoria
- definir ordenação simples

Campos mínimos da categoria

- `name`
- `slug`
- `description`
- `icon`
- `color`
- `sort_order`
- `is_active`

Regras de categoria

- `name` e `slug` são obrigatórios.
- `slug` deve ser único.
- Categoria inativa não aparece no catálogo público.
- Produtos vinculados a categoria inativa não devem vazar para a vitrine pública.

Marcas

- O módulo de marcas deve permitir:
- listar marcas
- criar marca
- editar marca
- ativar/desativar marca
- gerenciar logo

Campos mínimos da marca

- `name`
- `slug`
- `logo_url`
- `is_active`

Regras de marca

- `name` e `slug` são obrigatórios.
- `slug` deve ser único.
- Marca inativa não aparece como filtro público.
- Produto ligado a marca inativa não deve ser considerado válido para vitrine pública quando a regra pública exigir marca ativa.

Upload de imagem e logo

- O upload deve usar Supabase Storage conforme a arquitetura.
- Escopos principais do módulo:
- imagem principal de produto
- logo de marca
- O fluxo deve deixar claro quando um arquivo foi enviado com sucesso e quando apenas existe referência ainda não salva.
- O operador deve poder substituir imagem principal sem fluxo complicado.
- Não é necessário editor avançado de imagem no MVP.

Ativação e desativação lógica

- O MVP não deve excluir fisicamente produtos, categorias, marcas ou variantes como fluxo normal de operação.
- Ações principais devem usar `is_active`.
- O sistema deve evitar linguagem ambígua de “apagar” quando a ação real for “desativar”.
- Se existir ação de exclusão no futuro, ela não faz parte desta fase.

Validações

- Todas as entradas administrativas devem ser validadas no servidor com schema consistente.
- O cliente pode validar UX básica, mas o servidor é a fonte de verdade.
- Campos obrigatórios devem bloquear salvamento incompleto.
- Mensagens de erro devem ser claras para operador não técnico.

Estados do módulo

- Loading:
- lista administrativa com skeleton ou placeholder coerente
- formulários com estado de salvamento
- Vazio:
- listagens sem dados devem orientar próximo passo, como `Criar produto`
- Erro:
- mensagem simples e recuperável
- sucesso:
- feedback claro após criar, editar, ativar/desativar ou enviar imagem

Listagens administrativas

- As listagens devem usar estrutura consistente com `DataTableShell` ou equivalente.
- A primeira versão não precisa de tabela extremamente avançada.
- Busca, filtros básicos, ação de editar e indicadores de status já são suficientes.
- A densidade deve favorecer leitura e escaneabilidade.

Formulários administrativos

- Os formulários devem ser curtos por seção e evitar blocos longos sem agrupamento.
- Pode haver separação por cards/seções quando isso melhorar clareza.
- O CTA principal deve ser inequívoco: `Salvar`, `Criar produto`, `Salvar alterações` ou equivalente.
- Campos e labels devem aparecer em português na interface.

Responsividade

- O módulo deve continuar utilizável em mobile, embora a melhor experiência operacional possa ocorrer em tablet/desktop.
- Em telas pequenas, tabelas podem colapsar para listas/cartões operacionais quando necessário.
- Formulários devem permanecer editáveis sem depender de layout horizontal apertado.

Acessibilidade

- Formulários e ações de tabela devem ser operáveis por teclado.
- Labels, mensagens de erro e estados de foco devem ser visíveis.
- Status ativo/inativo, promoção e disponibilidade não devem depender apenas de cor.

Critérios de aceite

- Admin consegue listar, criar e editar produtos, categorias e marcas.
- Admin consegue criar e editar variantes dentro do contexto de um produto.
- Ativação/desativação lógica funciona sem exclusão física.
- Upload de imagem principal de produto e logo de marca funciona com feedback coerente.
- O módulo deixa claro quando um produto ainda não está pronto para vitrine pública por falta de variante válida.
- Listagens e formulários têm estados coerentes de loading, vazio, erro e sucesso.
- O gerenciamento de catálogo é utilizável em mobile e desktop, com foco operacional.
