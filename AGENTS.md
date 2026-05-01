# AGENTS.md

## Project

**PatasGo** is a custom web app for **Patas Pets**, a pet shop focused on pet food, medicines, hygiene products, accessories, snacks and promotions.

The app is a digital catalog optimized for WhatsApp orders. It should feel similar to a web menu app, but adapted to a pet shop business.

The product should behave more like a fast, mobile-first catalog with assisted ordering than a traditional e-commerce storefront.

The customer should be able to browse products, filter/search the catalog, add products to a local cart and send a formatted order to the store via WhatsApp.

This is not a full e-commerce MVP. Do not implement online payment, automatic shipping calculation, customer login, fiscal features or ERP integrations unless explicitly requested in a future spec.

---

## Main Goal

Build a low-cost, maintainable, responsive and mobile-first catalog system with:

- public home page;
- public product catalog;
- product details page;
- local cart/order flow;
- WhatsApp order generation;
- protected admin area;
- product/category/brand/banner management;
- order listing;
- store settings management.

---

## Required Stack

Use the following stack:

- Next.js
- TypeScript
- Tailwind CSS v4
- Supabase
- Supabase Auth
- Supabase Storage
- Postgres
- shadcn/ui
- React Hook Form
- Zod

Do not replace this stack without explicit approval.

---

## Development Approach

This project follows **Spec Driven Development**.

Before implementing any feature:

1. Read the related spec in `/specs`.
2. Follow only the scope defined in the current spec.
3. Do not implement future features unless they are explicitly part of the spec.
4. Prefer small, incremental changes.
5. Keep business rules centralized and reusable.
6. Make sure the feature matches the acceptance criteria.

When working on the product foundation, prefer this order:

1. app bootstrap and project structure;
2. theme, tokens and reusable layouts;
3. base reusable components and `/design` demo page;
4. public browsing experience;
5. cart/order flow;
6. protected admin features.

Product and UI priorities:

- keep the public experience focused on fast catalog browsing and WhatsApp ordering;
- treat WhatsApp as the primary conversion action;
- avoid generic full e-commerce assumptions unless a future spec explicitly requires them;
- keep the admin area operational and efficient, not overly decorative.

When creating new features, include:

- typed data models;
- validation schemas when forms are involved;
- loading states;
- empty states;
- error states;
- responsive layout;
- accessible UI when possible.

---

## Language Rules

The codebase should use **English** for:

- file names;
- component names;
- variable names;
- function names;
- types;
- schemas;
- database-related identifiers.

The user-facing interface should use **Portuguese (Brazil)**.

Examples:

```ts
const productVariants = [];
function generateWhatsappMessage() {}
type ProductVariant = {};
```
