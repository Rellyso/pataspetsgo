# Design System — PatasGo

## Product Context
- **What this is:** A mobile-first digital catalog for Patas Pets that helps local customers find products fast, assemble an order, and send it through WhatsApp.
- **Who it's for:** Local pet owners who want quick, trustworthy ordering without a heavy checkout flow.
- **Space/industry:** Pet retail, assisted ordering, WhatsApp-first local commerce.
- **Project type:** Web app.

## Core Memory
- **What people should remember:** `Aqui eu resolvo rapido, com confianca, e parece que alguem do pet shop ja separou o caminho certo para mim.`

## Aesthetic Direction
- **Direction:** Clean Neighborhood Retail.
- **Decoration level:** Intentional.
- **Mood:** Fast, trustworthy, local, friendly. The product should feel closer to a well-run neighborhood pet shop than to a giant promo-driven marketplace.
- **Reference pattern:** Avoid the dense supermarket-style feel common in large pet retailers. Keep the speed and category clarity, but remove noise and visual excess.

## Typography
- **Display/Hero:** `General Sans`.
  Gives the brand a cleaner and more confident voice than a default UI font, without feeling luxurious or fashion-first.
- **Body:** `Plus Jakarta Sans`.
  Friendly, highly legible on mobile, and softer than a generic enterprise UI tone.
- **UI/Labels:** `Plus Jakarta Sans`.
- **Data/Tables:** `IBM Plex Mono` for selective operational data only, such as SKU, lightweight codes, status emphasis, or numeric admin moments.
- **Code:** `IBM Plex Mono`.
- **Fallback during bootstrap:** `Inter` is acceptable only as a temporary implementation fallback until the target font stack is wired.
- **Loading:** Prefer `next/font/google` when implementing in Next.js.
- **Scale:**
  - h1: `2.25rem / 36px`
  - h2: `1.75rem / 28px`
  - h3: `1.25rem / 20px`
  - h4: `1.125rem / 18px`
  - body: `1rem / 16px`
  - small: `0.875rem / 14px`
  - caption: `0.75rem / 12px`

## Color
- **Approach:** Balanced.
- **Primary:** `#00A9C8`
  Main navigation, primary actions, active states, and trust anchors.
- **Primary Dark:** `#0088A3`
  Hover, pressed, and stronger contrast moments.
- **Primary Light:** `#D9F7FC`
  Soft highlighted backgrounds and informational emphasis.
- **Secondary:** `#F6B800`
  Category support, warm highlights, and light commercial emphasis.
- **Secondary Dark:** `#E59A00`
  Stronger warm support states.
- **Secondary Light:** `#FFF3C4`
  Gentle category chips and background support.
- **Accent:** `#FF7A00`
  Promotion, urgency, and commercial attention. Use sparingly.
- **Background:** `#F8FAFC`
- **Surface:** `#FFFFFF`
- **Text:** `#172033`
- **Text Muted:** `#64748B`
- **Border:** `#E2E8F0`
- **Semantic:**
  - success: `#22C55E`
  - warning: `#F59E0B`
  - error: `#EF4444`
  - info: `#0EA5E9`
- **Dark mode:** Not required for the current foundation. If introduced later, reduce saturation slightly and preserve the same trust-first hierarchy instead of inverting into a neon UI.

## Color Usage Rules
- Neutrals should dominate the interface.
- `primary` leads orientation and trust.
- `secondary` supports discovery, especially categories and chips.
- `accent` must stay rare so promotions keep their punch.
- `success` is the visual home of WhatsApp-related actions.

## Spacing
- **Base unit:** `4px`.
- **Density:** Comfortable-compact.
- **Scale:** `2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)`.

## Layout
- **Approach:** Hybrid.
- **Public experience:** Disciplined grid with a few warmer editorial moments in hero and promo sections.
- **Admin experience:** Same visual family, but denser and quieter.
- **Grid:**
  - mobile: 1-column flow
  - tablet: 2-column content blocks when useful
  - desktop: 12-column page grid
- **Max content width:** `1200px` for major public sections, tighter inner widths for text-heavy content.
- **Border radius:**
  - sm: `8px`
  - md: `12px`
  - lg: `20px`
  - full: `9999px`

## Motion
- **Approach:** Minimal-functional.
- **Principle:** Motion should confirm speed and clarity, never perform for attention.
- **Easing:**
  - enter: `ease-out`
  - exit: `ease-in`
  - move: `ease-in-out`
- **Duration:**
  - micro: `80-120ms`
  - short: `160-220ms`
  - medium: `240-320ms`
  - long: `400-560ms`

## UX Visual Rules
- The home must push quickly toward catalog, categories, and promotions.
- The interface should feel like assisted ordering, not a generic storefront.
- In the public catalog, categories should work first as navigation sections, especially on mobile, not only as isolated filter chips.
- `Adicionar ao pedido` is more important than secondary actions.
- `promotional_price` must dominate the price hierarchy when present.
- Product variations should look simple and confidence-building, not technical.
- Mobile use with one hand should shape header, sticky actions, and filter behavior.
- The admin should prioritize clarity, list scanning, and form efficiency over visual personality.

## Interaction Rules
- Show clear loading feedback for operations that take more than roughly 300ms.
- Primary action buttons should expose a loading state and prevent double submission while work is in flight.
- Hover states can shift color, border, shadow, or opacity, but should not move layout or feel jumpy.
- Focus states must stay visible across public and admin surfaces.
- Use motion only to clarify state change or hierarchy. Do not add decorative continuous animation.

## Responsive Rules
- Treat mobile as the default reading mode, not a compressed desktop layout.
- Prefer consistent responsive padding rhythms such as `px-4 sm:px-6 lg:px-8` for major shells and sections.
- Avoid separate mobile/desktop content structures unless the interaction model truly changes.
- Keep primary actions reachable with one hand on mobile, especially in search, filter, product, cart, and order flows.
- On mobile catalog views, prefer sticky horizontal category navigation that scrolls to in-page sections and does not hide section headers.

## Accessibility Rules
- Heading levels should remain sequential so assistive tech can navigate the page structure.
- Color cannot be the only indicator for state, selection, or validation.
- Touch targets should stay comfortable on mobile, especially chips, inputs, and CTA buttons.
- Font loading should avoid invisible text and minimize layout shift through `font-display: swap` and sensible fallbacks.

## Public vs Admin Rhythm
- **Public:** Warmer, more breathable, stronger category and promo storytelling.
- **Admin:** Tighter, quieter, more operational. Fewer decorative moments, more emphasis on hierarchy, labels, and task completion.

## Components To Express This System
- `AppHeader`
- `AppFooter`
- `Container`
- `SectionTitle`
- `ProductCard`
- `CategoryCard`
- `BrandBadge`
- `PromoBadge`
- `PriceDisplay`
- `SearchInput`
- `FilterChip`
- `QuantitySelector`
- `WhatsappButton`
- `AdminSidebar`
- `AdminPageHeader`
- `StatCard`
- `DataTableShell`

## Anti-Patterns
- Do not make the home feel like a giant promo flyer.
- Do not overuse bright accent colors across the whole page.
- Do not infantilize the brand with cartoon-heavy styling.
- Do not copy the density and campaign overload of large pet marketplaces.
- Do not push lifestyle-brand aesthetics so far that utility becomes secondary.
- Do not use emoji as interface icons.
- Do not leave async actions without visible feedback.
- Do not rely on hover transforms that make cards or buttons jump and shift surrounding layout.
- Do not create frozen-looking loading moments, especially in mobile-first flows.

## Implementation Notes
- `DESIGN.md` is the visual source of truth for future implementation.
- `specs/03-design-system.md` should stay aligned with this file.
- The `/design` route should demonstrate these decisions with both public and admin examples.
- During early implementation, temporary font fallbacks are acceptable, but the target visual system remains the one defined here.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-01 | Established the initial PatasGo design system | The product needs to feel fast, trustworthy, local, and WhatsApp-first instead of resembling a dense generic pet marketplace. |
