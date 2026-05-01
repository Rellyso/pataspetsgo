# PatasGo — Catálogo Digital do Patas Pets

## Visão geral

O **PatasGo** é um web app personalizado para o **Patas Pets**, uma loja voltada para produtos pet, com foco principal em rações, medicamentos, higiene, acessórios, petiscos e promoções.

O objetivo do sistema é funcionar como um **catálogo digital inteligente**, inspirado na experiência de apps web de cardápio, mas adaptado ao contexto de um pet shop. O cliente poderá navegar pelos produtos, filtrar por tipo de pet, categoria, marca e características do produto, adicionar itens ao pedido e finalizar o atendimento diretamente pelo WhatsApp.

O projeto não tem como objetivo inicial ser um e-commerce completo com pagamento online, cálculo automático de frete ou controle fiscal. O foco do MVP é reduzir o atrito no atendimento, organizar melhor os pedidos recebidos pelo WhatsApp e oferecer uma experiência mais profissional para os clientes da loja.

---

## Problema que o projeto resolve

Atualmente, muitos clientes descobrem produtos por meio do Instagram ou pelo atendimento direto no WhatsApp. Esse fluxo pode gerar algumas dificuldades:

- o cliente precisa perguntar manualmente por preço e disponibilidade;
- a loja precisa responder repetidamente sobre os mesmos produtos;
- produtos, promoções e variações ficam espalhados em posts ou mensagens;
- pedidos chegam desorganizados no WhatsApp;
- o cliente pode não saber exatamente qual produto escolher;
- não há uma forma estruturada de destacar promoções, marcas e categorias.

O PatasGo resolve esse problema criando uma vitrine digital organizada, simples e acessível, onde o cliente monta o pedido antes de chamar a loja.

---

## Objetivo do produto

Criar uma aplicação web leve, responsiva e de baixo custo operacional, onde o cliente consiga:

1. acessar o catálogo do Patas Pets;
2. navegar por categorias;
3. buscar produtos;
4. filtrar por tipo de pet, idade, porte, marca e promoção;
5. visualizar produtos e suas variações;
6. adicionar itens ao pedido;
7. informar dados básicos;
8. enviar o pedido formatado para o WhatsApp da loja.

Para a loja, o sistema deve permitir:

1. cadastrar e editar produtos;
2. gerenciar categorias e marcas;
3. cadastrar variações de produtos;
4. marcar produtos como promoção ou destaque;
5. gerenciar banners da home;
6. consultar pedidos gerados;
7. alterar dados institucionais, como WhatsApp, endereço e horário de funcionamento.

---

## Público-alvo

O público-alvo principal são clientes locais do Patas Pets que desejam comprar produtos para cães e gatos, principalmente:

- rações;
- sachês;
- petiscos;
- medicamentos veterinários;
- antipulgas;
- vermífugos;
- produtos de higiene;
- acessórios;
- coleiras;
- brinquedos;
- produtos promocionais.

A experiência deve ser simples o suficiente para qualquer cliente conseguir montar um pedido pelo celular.

---

## Proposta de valor

O PatasGo deve entregar valor em três frentes:

### Para o cliente

- encontrar produtos com mais facilidade;
- consultar categorias e promoções;
- montar o pedido sem precisar digitar tudo manualmente;
- enviar uma mensagem organizada para a loja;
- ter uma experiência mais rápida e confiável.

### Para a loja

- reduzir perguntas repetitivas no WhatsApp;
- organizar melhor os pedidos;
- destacar produtos estratégicos;
- divulgar promoções com mais clareza;
- ter uma vitrine digital própria além do Instagram;
- centralizar informações importantes dos produtos.

### Para o negócio

- aumentar a percepção profissional da marca;
- melhorar a conversão de interessados em pedidos;
- aumentar o ticket médio com combos e destaques;
- criar uma base para futuras evoluções, como estoque, cupons, pagamento online e histórico de pedidos.

---

## Escopo do MVP

O MVP deve conter as seguintes funcionalidades:

- página inicial pública;
- catálogo de produtos;
- busca de produtos;
- filtros por categoria, marca, tipo de pet, idade, porte e promoção;
- página de detalhes do produto;
- suporte a variações de produto;
- carrinho local;
- formulário de pedido;
- geração de pedido;
- envio do pedido via WhatsApp;
- painel administrativo protegido;
- CRUD de produtos;
- CRUD de variações;
- CRUD de categorias;
- CRUD de marcas;
- CRUD de banners;
- listagem de pedidos;
- configurações da loja;
- SEO básico;
- layout responsivo.

---

## Fora do escopo do MVP

As seguintes funcionalidades não fazem parte da primeira versão:

- pagamento online;
- Pix automático;
- cartão de crédito;
- cálculo automático de frete;
- controle fiscal;
- emissão de nota fiscal;
- integração com ERP;
- login de cliente;
- histórico de pedidos do cliente;
- programa de fidelidade;
- integração automática com Instagram;
- multi-loja;
- marketplace;
- controle avançado de estoque.

Essas funcionalidades podem ser avaliadas em versões futuras.

---

## Stack técnica

A stack definida para o projeto é:

- **Next.js**
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase**
- **Supabase Auth**
- **Supabase Storage**
- **Postgres**
- **shadcn/ui**
- **React Hook Form**
- **Zod**

A escolha dessa stack busca equilibrar produtividade, baixo custo, boa experiência de desenvolvimento, facilidade de manutenção e possibilidade de evolução futura.

---

## Estratégia de baixo custo

O projeto deve sempre priorizar soluções que mantenham o custo operacional próximo de zero no início.

A estratégia inicial é:

- usar Supabase no plano gratuito durante o MVP;
- usar Supabase Auth para autenticação do admin;
- usar Supabase Storage para imagens;
- usar Next.js com deploy em plataforma gratuita ou de baixo custo;
- evitar backend separado no início;
- evitar pagamento online no MVP;
- usar WhatsApp como canal principal de fechamento do pedido.

Caso o projeto passe a ser usado de forma recorrente pela loja, poderá ser proposta uma evolução para planos pagos ou infraestrutura mais robusta.

---

## Fluxo principal do cliente

1. O cliente acessa o PatasGo.
2. Visualiza categorias e produtos em destaque.
3. Acessa o catálogo.
4. Busca ou filtra produtos.
5. Abre a página de um produto.
6. Seleciona uma variação.
7. Adiciona ao pedido.
8. Revisa o carrinho.
9. Informa nome, telefone, tipo de atendimento e observações.
10. Clica em “Enviar pedido pelo WhatsApp”.
11. O sistema salva o pedido.
12. O sistema abre o WhatsApp com uma mensagem formatada para a loja.

---

## Fluxo principal do administrador

1. O administrador acessa `/admin`.
2. Faz login com e-mail e senha.
3. Visualiza o dashboard.
4. Gerencia produtos, categorias, marcas e banners.
5. Consulta pedidos gerados.
6. Atualiza dados da loja, como telefone, endereço e horário.
7. Marca produtos como ativos, inativos, em promoção ou em destaque.

---

## Regras gerais do produto

- Produtos inativos não devem aparecer no catálogo público.
- Categorias inativas não devem aparecer no catálogo público.
- Marcas inativas não devem aparecer como filtros públicos.
- Produto precisa ter pelo menos uma variação ativa para ser comprável.
- Produto indisponível não deve ser adicionado ao carrinho.
- Produto com status “consultar” deve exibir aviso para confirmação com a loja.
- O total do pedido é sempre estimado.
- Preços e disponibilidade devem ser confirmados pela loja via WhatsApp.
- Pedidos devem receber um número único.
- O pedido deve ser salvo antes do redirecionamento para o WhatsApp.
- O carrinho deve ser armazenado localmente no navegador.
- O admin não deve excluir dados fisicamente no MVP; deve usar ativação/desativação lógica.

---

## Identidade visual

A identidade visual deve ser alegre, limpa, pet-friendly e comercial.

A paleta principal é baseada em azul/turquesa, amarelo/laranja e tons neutros.

### Cores principais

- Primary: `#00A9C8`
- Primary Dark: `#0088A3`
- Primary Light: `#D9F7FC`
- Secondary: `#F6B800`
- Secondary Dark: `#E59A00`
- Secondary Light: `#FFF3C4`
- Accent: `#FF7A00`
- Accent Dark: `#D95F00`
- Accent Light: `#FFE1C2`

### Neutros

- Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Surface Muted: `#F1F5F9`
- Text: `#172033`
- Text Muted: `#64748B`
- Border: `#E2E8F0`

---

## Diretrizes de experiência

A experiência deve ser:

- mobile-first;
- simples;
- clara;
- rápida;
- amigável;
- confiável;
- otimizada para WhatsApp;
- fácil de administrar.

O usuário final não deve sentir que está usando um sistema complexo. A sensação deve ser de um catálogo moderno, direto e fácil de comprar.

---

## Evoluções futuras

Após validação do MVP, o projeto pode evoluir com:

- controle de estoque;
- cupons;
- cálculo de entrega;
- combos personalizados;
- recomendação por perfil do pet;
- produtos recorrentes;
- histórico de pedidos;
- login de cliente;
- pagamento online;
- integração com Google Analytics ou Datadog;
- painel de métricas;
- importação de produtos por planilha;
- múltiplos administradores;
- integração com ERP.
