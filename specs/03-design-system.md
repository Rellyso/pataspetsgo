# 03 — Design System

Objetivo

- Definir tokens, paleta, componentes base e diretrizes visuais para garantir consistência no MVP.

Contexto

- Visual pet-friendly, limpo e mobile-first. Paleta centrada em azul/turquesa, amarelo/laranja e neutros.
- A experiência deve transmitir confiança, agilidade e simpatia, sem cair em estética infantil ou visual genérico de marketplace.
- `DESIGN.md` deve funcionar como fonte de verdade visual do projeto quando existir.

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

Tokens de espaçamento e radius

- `--radius-card: 1.25rem`
- `--radius-button: 999px`
- Sistema de espaçamento baseado em `0.25rem` (4px) steps.

Tipografia

- Direção tipográfica alvo: `General Sans` para display, `Plus Jakarta Sans` para corpo/UI e `IBM Plex Mono` para detalhes operacionais seletivos.
- `Inter` pode existir apenas como fallback temporario de implementação na fundação inicial.
- Scale: h1(2rem), h2(1.5rem), h3(1.125rem), base(1rem), small(0.875rem)

Tailwind v4 theme (resumo)

- Configurar via CSS-first em `app/globals.css` com `@theme` e variáveis CSS.
- Expor utilitários e variantes semânticas para badges (`promo`, `dog`, `cat`) e superfícies comuns.

Regras de uso de cor

- Neutros devem dominar a interface.
- `primary` deve conduzir navegação, ações principais e foco.
- `secondary` deve apoiar filtros, destaques leves e categorias.
- `accent` deve ser reservado para promoção, urgência e pontos de atenção comercial.
- `success` deve ser a base visual do CTA de WhatsApp.
- A maior parte da interface deve permanecer neutra, com cor concentrada em navegação, categorias, promoções e CTA principal.

Componentes base (descrição curta)

- `AppHeader`: logo, busca, acesso/admin, botão WhatsApp fixo
- `AppFooter`: informações da loja e links
- `Container`: wrapper com paddings responsivos
- `SectionTitle`: título + subtítulo opcional
- `ProductCard`: imagem, nome, badge, preço, ação
- `CategoryCard`: ícone + nome
- `BrandBadge`: logo pequeno
- `PromoBadge`: estilo para promoções
- `PriceDisplay`: lógica para promotional_price + original riscado
- `EmptyState`: mensagem e CTA
- `SearchInput` e `FilterChip`
- `QuantitySelector` e `WhatsappButton`
- `AdminSidebar`: navegação principal da área protegida
- `AdminPageHeader`: título, contexto e ação primária
- `StatCard`: bloco simples para visão operacional
- `DataTableShell`: estrutura base de listas administrativas

Acessibilidade

- Contraste mínimo para texto e botões.
- Foco visível para elementos interativos.
- Botões com área de toque ~44x44px no mobile.

Responsividade

- Mobile-first; breakpoints: sm, md, lg (padrões Tailwind).
- Cards empilhados no mobile; grid 2–4 cols em desktop.
- Header, filtros e CTAs devem privilegiar uso com uma mão no mobile.

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
- Criar componente `ThemeProvider` opcional para alternância futura.
- Implementar página `/design` com exemplos de componentes, estados e variações público/admin.
- Ler e seguir `DESIGN.md` antes de tomar decisões de tipografia, densidade, hierarquia e tom visual.

Critérios de aceite

- Tailwind v4 configurado com tokens.
- Componentes base criados com props tipadas e story/demo.
- Paleta aplicada ao layout público e admin.
- A página `/design` demonstra tokens, botões, cards, formulário, tabela admin e estados vazios/erro/loading.

Fora de escopo

- Design system completo (tokens avançados de motion, iconography system completo).
