# 03 — Design System

Objetivo

- Definir tokens, paleta, componentes base e diretrizes visuais para garantir consistência no MVP.

Contexto

- Visual pet-friendly, limpo e mobile-first. Paleta centrada em azul/turquesa, amarelo/laranja e neutros.
- A experiência deve transmitir confiança, agilidade e simpatia, sem cair em estética infantil ou visual genérico de marketplace.
- `DESIGN.md` deve funcionar como fonte de verdade visual do projeto quando existir.
- Em caso de conflito entre esta spec e `DESIGN.md`, prevalece `DESIGN.md`.

Escopo desta spec

- Definir a fundação visual do MVP.
- Delimitar o que precisa existir na Fase 3 e o que pode entrar junto das features posteriores.
- Evitar que a implementação do design system antecipe cards, tabelas e shells finais antes de existir contexto real de uso.

Tese visual

- O produto deve parecer um catálogo digital confiável e rápido para pedido por WhatsApp.
- A vitrine pública deve ser acolhedora e objetiva.
- O admin deve compartilhar a mesma base visual, mas com densidade maior e menos elementos decorativos.
- A memória desejada é: `Aqui eu resolvo rapido, com confianca, e parece que alguem do pet shop ja separou o caminho certo para mim.`

Paleta de cores (tokens)

- `--color-primary: #00A9C8`
- `--color-primary-dark: #0088A3`
- `--color-primary-light: #D9F7FC`

- `--color-secondary: #F6B800`
- `--color-secondary-dark: #E59A00`
- `--color-secondary-light: #FFF3C4`

- `--color-accent: #FF7A00`
- `--color-background: #F8FAFC`
- `--color-surface: #FFFFFF`
- `--color-text: #172033`
- `--color-text-muted: #64748B`
- `--color-border: #E2E8F0`

Estados

- Success: `#22C55E`
- Warning: `#F59E0B`
- Danger: `#EF4444`
- Info: `#0EA5E9`
- Dark mode não faz parte da fundação atual.

Tokens de espaçamento e radius

- `--radius-card: 1.25rem`
- `--radius-button: 999px`
- Sistema de espaçamento baseado em `0.25rem` (4px) steps.

Tipografia

- Direção tipográfica alvo: `General Sans` para display, `Plus Jakarta Sans` para corpo/UI e `IBM Plex Mono` para detalhes operacionais seletivos.
- `Inter` pode existir apenas como fallback temporario de implementação na fundação inicial.
- Carregamento preferencial via `next/font/google` durante a implementação inicial, enquanto a stack final de fontes alvo é conectada.
- A Fase 3 deve escolher e documentar uma única estratégia operacional de carregamento por família tipográfica, evitando fundação híbrida implícita ou mistura acidental sem decisão explícita.
- Scale: h1(2.25rem), h2(1.75rem), h3(1.25rem), h4(1.125rem), base(1rem), small(0.875rem), caption(0.75rem)

Tailwind v4 theme (resumo)

- Configurar via CSS-first em `app/globals.css` com `@theme` e variáveis CSS.
- Expor aliases semânticos mínimos para a fundação, evitando hex hardcoded nos componentes.
- Conjunto mínimo esperado de tokens/utilitários semânticos:
- superfícies: `bg-background`, `bg-surface`, `text-foreground`, `text-muted`, `border-default`
- ações e destaque: `bg-primary`, `bg-primary-dark`, `bg-secondary`, `bg-accent`, `bg-success`
- badges e chips: `badge-promo`, `badge-pet-dog`, `badge-pet-cat`, `chip-category`
- tipografia: `font-display`, `font-sans`, `font-mono`
- foco e feedback: tokens para `ring`, `success`, `warning`, `danger` e `info`
- spacing/radius: aliases mínimos para a escala base e para `card`, `button` e containers principais
- Componentes base devem consumir tokens semânticos e variáveis de tema, não valores hexadecimais inline.

Regras de uso de cor

- Neutros devem dominar a interface.
- `primary` deve conduzir navegação, ações principais e foco.
- `secondary` deve apoiar filtros, destaques leves e categorias.
- `accent` deve ser reservado para promoção, urgência e pontos de atenção comercial.
- `success` deve ser a base visual do CTA de WhatsApp.
- A maior parte da interface deve permanecer neutra, com cor concentrada em navegação, categorias, promoções e CTA principal.

Componentes base (descrição curta)

- Fundação imediata:
- `AppHeader`: logo, busca, acesso/admin e espaço para CTA contextual sem barra sticky global
- `AppFooter`: informações da loja e links
- `Container`: wrapper com paddings responsivos
- `SectionTitle`: título + subtítulo opcional
- `EmptyState`: mensagem e CTA
- `SearchInput` e `FilterChip`, nesta fase apenas como componentes fundacionais/presentacionais, sem acoplamento a regras reais de busca ou filtro
- `WhatsappButton`
- `PriceDisplay`: lógica para promotional_price + original riscado

- Componentes que entram junto com as features correspondentes:
- `ProductCard`: imagem, nome, badge, preço, ação
- `CategoryCard`: ícone + nome
- `BrandBadge`: logo pequeno
- `PromoBadge`: estilo para promoções
- `QuantitySelector` e `WhatsappButton`
- `AdminSidebar`: navegação principal da área protegida
- `AdminPageHeader`: título, contexto e ação primária
- `StatCard`: bloco simples para visão operacional
- `DataTableShell`: estrutura base de listas administrativas

Faseamento recomendado

1. Fase 3: fundação visual e estrutural

- tokens globais em `app/globals.css`
- fontes e aliases tipográficos
- `AppHeader`, `AppFooter`, `Container`, `SectionTitle`, `EmptyState`, `SearchInput`, `FilterChip`, `WhatsappButton`, `PriceDisplay`
- `PublicShell` e `AdminShell` base
- `AdminShell` nesta fase significa somente extração visual/estrutural reutilizável, preservando a boundary atual de auth no layout admin
- `/design` com demonstração de tokens, tipografia, estados e shells

2. Fase 5: navegação pública

- `ProductCard`, `CategoryCard`, `BrandBadge`, `PromoBadge`, `QuantitySelector`
- exemplos de home, catálogo e detalhe na `/design` quando esses componentes existirem

3. Fase 7 em diante: operação administrativa

- `AdminSidebar`, `AdminPageHeader`, `StatCard`, `DataTableShell`
- demonstrações operacionais mais fiéis na `/design` conforme os módulos reais entrarem

Acessibilidade

- Contraste mínimo para texto e botões.
- Foco visível para elementos interativos.
- Botões com área de toque ~44x44px no mobile.
- Estados interativos principais devem prever pelo menos `default`, `hover`, `focus-visible`, `pressed` e `disabled`.

Responsividade

- Mobile-first; breakpoints: sm, md, lg (padrões Tailwind).
- Cards empilhados no mobile; grid 2–4 cols em desktop.
- Header, filtros e CTAs devem privilegiar uso com uma mão no mobile.
- O CTA principal de WhatsApp não deve ser sticky globalmente no site inteiro.
- O header não deve carregar uma barra fixa de WhatsApp como elemento persistente em todas as telas.
- Recomendação da fundação: usar CTA sticky no mobile apenas em superfícies de decisão ou conversão, como detalhe de produto, carrinho e resumo de pedido.
- Em home e catálogo, priorizar CTA visível sem barra sticky permanente para evitar ruído visual.
- Filtros no mobile devem favorecer leitura rápida, toque confortável e comportamento horizontal ou em bottom sheet simples quando a feature exigir expansão.

Diretrizes de UX visual

- A home deve levar rapidamente para catálogo, categorias e promoções.
- O CTA de `adicionar ao pedido` deve ser mais evidente que ações secundárias.
- `promotional_price` deve dominar a hierarquia visual do preço quando existir.
- Variações de produto devem parecer simples de escolher, não técnicas.
- A área admin deve priorizar leitura, tabela e formulário, evitando ornamentos desnecessários.
- O produto não deve herdar a densidade visual de grandes marketplaces pet, nem migrar para uma estética fashion-first que prejudique utilidade.

Tokens de branding e exemplos de uso

- Botão primário: `bg-primary text-white rounded-full`.
- Botão WhatsApp: verde (usar `--color-success`) com ícone à esquerda.
- Badge de promoção: `bg-accent text-white`.

Guia rápido de implementação

- Declarar tokens CSS em `app/globals.css` e expor via `@theme`.
- Implementar página `/design` primeiro como contrato da fundação, não como galeria completa de todas as features futuras.
- Demonstrar na `/design`, na Fase 3, pelo menos: tokens, tipografia, botões, inputs, chips, estados de feedback, shell público e shell admin base.
- Acrescentar cards, tabelas e composições mais específicas apenas quando os componentes reais entrarem nas fases correspondentes.
- Ler e seguir `DESIGN.md` antes de tomar decisões de tipografia, densidade, hierarquia e tom visual.
- Não introduzir `ThemeProvider` nesta fundação sem necessidade concreta; CSS variables + Tailwind v4 são suficientes para o escopo atual.

Critérios de aceite

- Tailwind v4 configurado com tokens.
- Componentes base criados com props tipadas e demonstração na rota `/design`.
- Paleta aplicada ao layout público e admin.
- A página `/design`, ao final da Fase 3, demonstra tokens, tipografia, botões, inputs, chips, shells público/admin e estados vazios/erro/loading.
- Componentes como cards de catálogo, tabela admin e composições mais completas podem ser adicionados depois, quando as respectivas features forem implementadas.

Fora de escopo

- Design system completo (tokens avançados de motion, iconography system completo).
