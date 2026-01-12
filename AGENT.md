# AGENT.md — Developer Briefing & Context Source

> **Status**: ACTIVE / COMPLETE
> **Version**: 1.0.0
> **Date**: January 11, 2026

## 1. Project Identity & Mission

**Merlion Brews** is a Singapore-first, design-led headless commerce platform. It is not a standard e-commerce template. It represents a fusion of **Peranakan Heritage Aesthetic** ("The Soul") and **Enterprise Transactional Integrity** ("The Brain").

**Core Directive**: Never compromise the visual "soul" (defined in `cafe.html`) for technical convenience, and never compromise transactional integrity (GST/Inventory) for speed.

---

## 2. Architectural North Star

The system utilizes a **Hybrid BFF (Backend-for-Frontend)** topology to separate concerns strictly.

### 2.1 Technology Stack (Locked)
*   **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4.
*   **Backend**: Laravel 12 (PHP 8.3+), PostgreSQL 16, Redis 7.
*   **Infrastructure**: Docker Compose (Local), Dockerfiles provided for Production (Nginx/FPM).

### 2.2 The "Soul" (Frontend Architecture)
The frontend is the guardian of the design system.
*   **Design Authority**: `cafe.html` is the absolute source of truth for design tokens, animations, and behaviors.
*   **Tailwind v4 Strategy**: We use native CSS cascade layers (`@layer tokens, base, components, utilities, overrides`) defined in `src/app/globals.css`.
*   **Design Token Bridge**: `src/design-tokens/index.ts` mirrors CSS variables for type-safe usage in TypeScript/Framer Motion.
*   **Merlion Wrappers**: We **never** use raw Shadcn primitives for customer-facing UI. We wrap them to enforce the aesthetic:
    *   `Button` -> `ButtonMerlion` (Hover underlay animation).
    *   `Card` -> `CardMerlion` (`folio-frame` double-border effect).
    *   `Sheet` -> `MobileNavMerlion` (Accessible menu).
    *   **Parity Components**: `DropCap`, `PeranakanDivider`, `ScrollIndicator` (Aesthetic fidelity).

### 2.3 The "Brain" (Backend Architecture)
The backend is the system of record.
*   **API Strategy**: Versioned REST API (`v1`), secured by Sanctum (Admin) and public/sessionless (Storefront).
*   **Inventory Model**: **Two-Phase Reservation** (`Reserve` -> `Confirm`).
    *   **Logic**: Encapsulated in `InventoryService`.
    *   **Consistency**: Uses `lockForUpdate` to prevent race conditions.
    *   **Audit**: Every stock change is logged in `inventory_ledger`.
*   **Compliance**:
    *   **GST**: 9% tax is calculated backwards from inclusive prices (`GstService`).
    *   **InvoiceNow**: MVP integration via Provider API (`InvoiceNowProviderClient`).
    *   **PayNow**: Supported via Stripe PaymentIntents.

---

## 3. Codebase Map

### Frontend (`/frontend`)
```
src/
├── app/
│   ├── api/                # BFF Proxies (hides backend URL)
│   ├── admin/              # Admin Dashboard (Orders, Inventory)
│   ├── checkout/           # Stripe Elements Page
│   └── page.tsx            # Main Landing Page (Hero, Collections, Story)
├── components/
│   ├── merlion/            # CUSTOM WRAPPERS (The Soul)
│   └── ui/                 # Shadcn Primitives (Do not edit styles here)
├── design-tokens/          # TS definition of cafe.html tokens
└── lib/                    # Stores (Zustand), Utils
```

### Backend (`/backend`)
```
app/
├── Console/Commands/       # Scheduled Jobs (Prune Reservations, Retry Invoices)
├── Http/Controllers/       # API Endpoints (Admin/*, Order, Product, Webhook)
├── Jobs/                   # Async Workers (TransmitInvoiceNowJob)
├── Models/                 # Eloquent Entities (UUIDs used everywhere)
└── Services/               # Domain Logic (Inventory, GST, Stripe, Invoice)
routes/
└── api.php                 # V1 Routes (Throttled & Grouped)
```

---

## 4. Key Workflows & Logic

### 4.1 Checkout & Inventory
1.  **Add to Cart**: Frontend calls BFF -> Backend `POST /reservations`. Backend creates a "soft hold" (TTL 15m) and returns `reservation_id`.
2.  **Checkout Init**: Frontend calls BFF -> Backend `POST /orders/draft`. Backend validates reservation, calculates GST, creates Stripe PaymentIntent.
3.  **Payment**: User pays via Stripe (Card/PayNow).
4.  **Confirmation**: Stripe Webhook -> Backend.
    *   Verifies Signature.
    *   Idempotency Check.
    *   **Hard Commit**: Converts "Reserved" to "Sold" in Inventory.
    *   **Invoice**: Generates Invoice record.

### 4.2 InvoiceNow Transmission
1.  **Trigger**: Invoice creation (post-payment).
2.  **Process**: Dispatches `TransmitInvoiceNowJob`.
3.  **Retry**: Exponential backoff. If stuck > 1hr, `invoices:retry-stuck` command picks it up.

### 4.3 Admin Operations
*   **Auth**: Secure `admin` role (seeded via `AdminSeeder`).
*   **Inventory**: Manual adjustments via Admin UI write to the Ledger for audit trails.

---

## 5. Developer Guide

### 5.1 Running Locally
```bash
# 1. Infrastructure
cd infra && docker compose up -d

# 2. Backend
cd backend
cp .env.example .env
composer install
php artisan migrate --seed # Seeds Products & Admin

# 3. Frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### 5.2 Testing
*   **Visual Regression**: `cd frontend && npm run test:visual` (Playwright snapshots).
*   **Backend Logic**: `cd backend && php artisan test` (Inventory locks, GST calc).

### 5.3 Troubleshooting
*   **Stripe Webhooks**: If testing locally, use Stripe CLI to forward events to `localhost:8000/api/v1/webhooks/stripe`.
*   **Images**: `cafe.html` assets are SVG data URIs embedded in code. Do not replace with external heavy images without optimization.

---

6.  **Rules of Engagement (Directives)**

1.  **Respect the Layer**: When styling, use `@layer components` for complex composite components. Do not pollute the global namespace.
2.  **No Magic Numbers**: Use variables from `design-tokens` (e.g., `text-nyonya-cream`, `font-heading`).
3.  **Strict Compliance**: Do not modify GST calculation logic (`9/109` rule) without verifying IRAS guidelines.
4.  **Database Integrity**: Always use Transactions (`DB::transaction`) when modifying Inventory or Order status.
5.  **Browser Support**: Tailwind v4 features (cascade layers) require modern browsers. Do not polyfill for IE11.
6.  **Button Links**: Do not wrap `ButtonMerlion` in `Link`. Pass the `href` prop directly to `ButtonMerlion` to ensure valid HTML and correct accessibility semantics.
7.  **Reduced Motion**: Infinite animations (floating beans, scroll indicators) must be disabled via `@media (prefers-reduced-motion: reduce)` in `globals.css`.

**This document is the Single Source of Truth for the project's architectural intent.**
