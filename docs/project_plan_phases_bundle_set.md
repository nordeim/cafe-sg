# Phase_1_Implementation_Plan.md
```md
# Phase 1 Implementation Plan: Monorepo Foundation + Local Dev Infrastructure

## Phase 1.1: Root Configuration & Documentation

### 1. `.gitignore` (Update)
- **Purpose**: Ensure all generated, secret, and OS-specific files are ignored across the monorepo structure.
- **Action**: Update the existing `.gitignore` to include:
  - IDE specific files (`.idea/`, `.vscode/`)
  - OS artifacts (`.DS_Store`, `Thumbs.db`)
  - Backend specific (`storage/logs/`, `bootstrap/cache/`, `vendor/`, `.phpunit.result.cache`)
  - Frontend specific (`.next/`, `node_modules/`, `coverage/`)
  - Infra specific (any local volumes if mapped locally, though named volumes are preferred)
  - Environment files (`.env`, `.env.local`, `.env.*.local`)
- **Checklist**:
  - [ ] Ignores `.env` but allows `.env.example`
  - [ ] Covers Node, PHP/Laravel, and System artifacts

### 2. `docs/adr/ADR-0001-scope-lock.md` (Create)
- **Purpose**: Record the architectural scope locks to prevent drift.
- **Content**:
  - Frontend: Next.js 15 + Tailwind v4 + Merlion Wrappers.
  - Backend: Laravel 12 + Postgres 16 (Day 1).
  - Compliance: PayNow required, InvoiceNow MVP.
  - Browser Floor: Safari 16.4+, Chrome 111+.
- **Checklist**:
  - [ ] Document is created in `docs/adr/`
  - [ ] Explicitly states "Do not downgrade Tailwind v4"

### 3. `docs/runbooks/local-development.md` (Create)
- **Purpose**: Guide for developers to troubleshoot local setup.
- **Content**:
  - Prerequisites check.
  - Common issues (ports already in use, migration failures).
  - Database reset commands.
- **Checklist**:
  - [ ] Includes Postgres/Redis connection troubleshooting

## Phase 1.2: Infrastructure Setup

### 1. `infra/docker-compose.yml` (Create)
- **Purpose**: Define local services (Postgres 16, Redis 7).
- **Content**:
  - Service: `db` (postgres:16)
    - Ports: 5432:5432
    - Volumes: `pg_data:/var/lib/postgresql/data`
    - Healthcheck: `pg_isready`
  - Service: `redis` (redis:7)
    - Ports: 6379:6379
    - Volumes: `redis_data:/data`
    - Healthcheck: `redis-cli ping`
- **Checklist**:
  - [ ] Uses named volumes for persistence
  - [ ] Uses environment variables for credentials (no hardcoded passwords)

### 2. `infra/.env.example` (Create)
- **Purpose**: Template for local infrastructure environment variables.
- **Content**:
  - `POSTGRES_DB`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `REDIS_PORT`
- **Checklist**:
  - [ ] Matches variables used in `docker-compose.yml`
  - [ ] Contains safe default values (e.g., user: `merlion`, db: `merlion_brews`)

## Validation Criteria
- [ ] `docker compose up -d` (from `infra/`) starts containers successfully and they become healthy.
- [ ] `.gitignore` prevents git from seeing `.env` or `node_modules` in `git status`.
- [ ] Documentation files exist and are linked/accessible.

```

# Phase_2_Implementation_Plan.md
```md
# Phase 2 Implementation Plan: Backend Skeleton (Laravel 12) + Core Domain Model

## Phase 2.1: Laravel Scaffold & Configuration

### 1. `backend/` (Scaffold)
- **Purpose**: Initialize the Laravel framework structure.
- **Action**: Run the Laravel installer or `composer create-project` to generate the `backend` directory.
- **Checklist**:
  - [ ] `php artisan --version` reports Laravel 12.x (or latest stable compatible with PHP 8.3+)
  - [ ] `config/database.php` is configured to use `pgsql` driver by default
  - [ ] Directory structure includes `app/`, `bootstrap/`, `config/`, `database/`, `public/`, `resources/`, `routes/`, `storage/`, `tests/`, `vendor/`

### 2. `backend/composer.json` (Update)
- **Purpose**: Define backend dependencies and platform requirements.
- **Action**: Ensure `require` section includes `php: ^8.3` and `laravel/framework: ^12.0`. Add `ext-pdo_pgsql` to requirements.
- **Checklist**:
  - [ ] Platform PHP version set to `8.3`
  - [ ] `laravel/framework` version constraint allows 12.x

### 3. `backend/.env.example` (Create/Update)
- **Purpose**: Template for backend environment variables.
- **Action**: Create or update `.env.example` to match the infrastructure setup.
- **Content**:
  - `DB_CONNECTION=pgsql`
  - `DB_HOST=db` (service name from docker-compose)
  - `DB_PORT=5432`
  - `DB_DATABASE=merlion_brews`
  - `DB_USERNAME=merlion`
  - `DB_PASSWORD=` (empty in example)
  - `REDIS_HOST=redis`
  - `REDIS_PORT=6379`
  - `STRIPE_SECRET=`
  - `STRIPE_WEBHOOK_SECRET=`
  - `INVOICENOW_CLIENT_ID=`
  - `INVOICENOW_CLIENT_SECRET=`
- **Checklist**:
  - [ ] Matches `infra/docker-compose.yml` service names
  - [ ] Includes all third-party credential keys (Stripe, InvoiceNow)

## Phase 2.2: Core Domain Models & Migrations

### 1. `backend/database/migrations/xxxx_xx_xx_create_core_tables.php` (Create)
- **Purpose**: Define the database schema for the core domain.
- **Action**: Create a migration file to create the following tables:
  - `products`: `id` (UUID), `slug` (unique), `name`, `description` (text), `price_cents` (int), `is_active` (bool)
  - `inventory`: `sku` (string, primary), `stock_count` (int), `reserved_count` (int)
  - `inventory_reservations`: `id` (UUID), `sku` (FK -> inventory), `quantity` (int), `expires_at` (timestamp), `status` (string)
  - `inventory_ledger`: `id` (UUID), `sku` (FK -> inventory), `quantity_change` (int), `reason` (string), `reference_id` (UUID, nullable), `created_at`
  - `orders`: `id` (UUID), `subtotal_cents` (int), `gst_cents` (int), `total_cents` (int), `gst_rate` (decimal 4,2), `invoice_number` (string, unique, nullable), `status` (string), `email` (string)
  - `order_items`: `id` (UUID), `order_id` (FK -> orders), `product_id` (FK -> products), `quantity` (int), `price_at_time_cents` (int)
  - `payments`: `id` (UUID), `order_id` (FK -> orders), `stripe_payment_intent_id` (string), `amount_cents` (int), `status` (string)
  - `webhook_events`: `id` (string, primary - Stripe Event ID), `processed_at` (timestamp, nullable), `payload` (json)
  - `invoices`: `id` (UUID), `order_id` (FK -> orders), `provider_transmission_id` (string, nullable), `status` (string)
  - `invoice_transmissions`: `id` (UUID), `invoice_id` (FK -> invoices), `attempt_at` (timestamp), `response_payload` (json), `success` (bool)
- **Checklist**:
  - [ ] Uses UUIDs for primary keys where specified
  - [ ] Foreign key constraints are defined
  - [ ] Indexes on frequently queried columns (`slug`, `email`, `status`, `expires_at`)

### 2. `backend/app/Models/*` (Create)
- **Purpose**: Eloquent models for interaction with the database tables.
- **Action**: Create the following Model classes in `app/Models/`:
  - `Product`: `HasUuids`, `$fillable = ['slug', 'name', ...]`
  - `Inventory`: `$primaryKey = 'sku'`, `$keyType = 'string'`, `$incrementing = false`
  - `InventoryReservation`: `HasUuids`, relationships to `Inventory`
  - `InventoryLedgerEntry`: `HasUuids`
  - `Order`: `HasUuids`, relationships to `OrderItem`, `Payment`, `Invoice`
  - `OrderItem`: `HasUuids`
  - `Payment`: `HasUuids`
  - `WebhookEvent`: `$incrementing = false`, `$keyType = 'string'`
  - `Invoice`: `HasUuids`
  - `InvoiceTransmission`: `HasUuids`
- **Checklist**:
  - [ ] All models extend `Illuminate\Database\Eloquent\Model`
  - [ ] UUID traits applied where appropriate
  - [ ] Mass assignment protection configured (`$fillable` or `$guarded`)
  - [ ] Relationships defined (e.g., `Order` hasMany `OrderItem`)

## Phase 2.3: API Foundation & Health Check

### 1. `backend/routes/api.php` (Update)
- **Purpose**: Define the API routes.
- **Action**: Define a versioned route group `v1` and add a health check endpoint.
- **Content**:
  - `Route::prefix('v1')->group(function () { Route::get('/health', [HealthController::class, 'check']); });`
- **Checklist**:
  - [ ] Uses `v1` prefix
  - [ ] Maps to `HealthController`

### 2. `backend/app/Http/Controllers/HealthController.php` (Create)
- **Purpose**: Provide a simple endpoint to verify API and DB connectivity.
- **Action**: Create the controller class.
- **Content**:
  - Method `check()`:
    - Returns JSON: `{ "status": "ok", "timestamp": "...", "version": "..." }`
    - (Optional) Minimal DB query to ensure connection (e.g., `DB::connection()->getPdo()`)
- **Checklist**:
  - [ ] Returns valid JSON
  - [ ] Does not crash if DB is down (handles exception gracefully or lets Laravel handler catch it - preferably simple check)

## Validation Criteria
- [ ] `php artisan migrate` runs successfully against the Postgres container.
- [ ] Database schema matches the specifications (tables, columns, types).
- [ ] `GET /api/v1/health` returns a 200 OK JSON response.
- [ ] `composer install` installs all dependencies without error.

```

# Phase_3_Implementation_Plan.md
```md
# Phase 3 Implementation Plan: Design Token Bridge + CSS Layers (Frontend Foundation)

## Phase 3.1: Frontend Scaffold & Dependencies

### 1. `frontend/` (Scaffold)
- **Purpose**: Initialize the Next.js 15 framework structure.
- **Action**: Run `npx create-next-app@latest frontend` with the following flags:
  - TypeScript: Yes
  - ESLint: Yes
  - Tailwind CSS: No (We will install v4 manually to ensure correct setup)
  - `src/` directory: No (Use `app/` at root for simpler monorepo structure)
  - App Router: Yes
  - Import alias: `@/*`
- **Checklist**:
  - [ ] `frontend/app/` exists.
  - [ ] `frontend/package.json` exists.
  - [ ] `frontend/tsconfig.json` exists.

### 2. `frontend/package.json` (Update)
- **Purpose**: Install Tailwind CSS v4 and Shadcn/Radix dependencies.
- **Action**: 
  - Install dependencies: `next`, `react`, `react-dom`, `tailwindcss@next`, `@tailwindcss/postcss@next`, `postcss` (if needed for v4 beta), `clsx`, `tailwind-merge`, `class-variance-authority`.
  - Ensure scripts include `dev`, `build`, `start`, `lint`.
- **Checklist**:
  - [ ] `tailwindcss` version is `^4.0.0` (or compatible beta/next tag).
  - [ ] Dependencies listed in `Phase 3` of MEP are present.

### 3. `frontend/next.config.mjs` (Update)
- **Purpose**: Configure Next.js.
- **Action**: Ensure minimal config. Enable any necessary flags for Tailwind v4 if required (though v4 is mostly CSS-side).
- **Checklist**:
  - [ ] Valid ESM config file.

### 4. `frontend/.env.example` (Create)
- **Purpose**: Frontend environment template.
- **Content**:
  - `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=`
  - `STRIPE_SECRET_KEY=`
- **Checklist**:
  - [ ] Matches `Master_Execution_Plan.md` requirements.

## Phase 3.2: Design Token Bridge & CSS Architecture

### 1. `frontend/app/globals.css` (Create/Overwrite)
- **Purpose**: Authoritative CSS source using Tailwind v4 native layers.
- **Content**:
  - `@import "tailwindcss";`
  - `@layer tokens { ... }`: Define CSS variables for colors, typography, spacing (from `cafe.html`).
  - `@theme { ... }`: Map Tailwind theme keys to these variables.
  - `@layer base { ... }`: Global resets, typography defaults (font-family).
  - `@layer components { ... }`: Placeholders for future component styles.
  - `@layer utilities { ... }`: Custom utilities if needed.
  - `@layer overrides { ... }`: Animation keyframes, specific overrides.
- **Checklist**:
  - [ ] Includes Peranakan palette: `nyonya-cream`, `kopi-brown`, `terracotta`, `heritage-blue`, `gold-leaf`.
  - [ ] Includes fluid type scale variables.
  - [ ] Includes `folio-frame` styles in `components` or `utilities` layer.

### 2. `frontend/design-tokens/index.ts` (Create)
- **Purpose**: TypeScript source of truth for design tokens, mirrored from `globals.css` for use in JS logic (e.g., Framer Motion).
- **Content**:
  - Export `const tokens = { colors: { ... }, spacing: { ... }, fonts: { ... } }`.
- **Checklist**:
  - [ ] Values match `globals.css` exactly.
  - [ ] Typed exports for type safety.

### 3. `frontend/lib/cn.ts` (Create)
- **Purpose**: Utility for merging Tailwind classes.
- **Content**: Standard `clsx` + `tailwind-merge` implementation.
- **Checklist**:
  - [ ] Exports `cn` function.

### 4. `frontend/app/layout.tsx` (Update)
- **Purpose**: Root layout setup.
- **Action**:
  - Import `globals.css`.
  - Configure fonts (`Cormorant Garamond`, `Crimson Pro`, `Pinyon Script`) using `next/font/google`.
  - Apply global background color (`nyonya-cream`) and text color (`kopi-brown`).
  - Add `<div id="skip-nav">` container.
- **Checklist**:
  - [ ] `lang="en-SG"` set.
  - [ ] Fonts variables applied to `<body>`.

## Validation Criteria
- [ ] `npm run build` in `frontend/` succeeds.
- [ ] A test page (e.g., modified `page.tsx`) rendering a simple element with `bg-nyonya-cream text-kopi-brown font-heading` displays correctly in a browser (or visual inspection of generated CSS).
- [ ] Tailwind v4 imports function without error.

```

# Phase_4_Implementation_Plan.md
```md
# Phase 4 Implementation Plan: Merlion Component System (Shadcn Primitives + Wrappers)

## Phase 4.1: Shadcn Foundation

### 1. `frontend/components/ui/` (Install Primitives)
- **Purpose**: Install necessary Shadcn UI components as the foundational layer.
- **Action**: Use the shadcn-ui CLI (or copy the code manually if CLI is tricky in this environment) to add:
  - `button`
  - `card`
  - `sheet` (for mobile nav)
  - `dialog` (if needed, or sheet covers it)
- **Checklist**:
  - [ ] `frontend/components/ui/button.tsx` exists.
  - [ ] `frontend/components/ui/card.tsx` exists.
  - [ ] `frontend/components/ui/sheet.tsx` exists.
  - [ ] `frontend/lib/utils.ts` (or `cn.ts`) is correctly referenced by these components.

## Phase 4.2: Merlion Wrappers (The Soul)

### 1. `frontend/components/merlion/button-merlion.tsx` (Create)
- **Purpose**: Extended button with the "hover underlay" animation from `cafe.html`.
- **Content**:
  - Accepts `variant` ('primary' | 'secondary').
  - Wraps `Button` from `ui/button`.
  - Adds a pseudo-element (or span) for the slide-in background effect.
- **Checklist**:
  - [ ] Exports `ButtonMerlion`.
  - [ ] Animation classes match `cafe.html` (`transform: scaleX(0)` -> `scaleX(1)` on hover).

### 2. `frontend/components/merlion/card-merlion.tsx` (Create)
- **Purpose**: Extended card with the `folio-frame` double-border effect.
- **Content**:
  - Wraps `Card` from `ui/card`.
  - Prop `withFolioFrame` (default true).
  - Applies `folio-frame` class (defined in `globals.css`).
- **Checklist**:
  - [ ] Exports `CardMerlion`.
  - [ ] Supports `className` prop merging.

### 3. `frontend/components/merlion/ornament.tsx` (Create)
- **Purpose**: Reusable SVG component for the "Peranakan Corner" ornaments.
- **Content**:
  - Prop `position`: `'tl' | 'tr' | 'bl' | 'br'`.
  - Renders the SVG paths from `cafe.html`.
  - Applies rotation based on position.
- **Checklist**:
  - [ ] SVG paths match `cafe.html`.
  - [ ] Positioning classes (`top-0 left-0`, etc.) are correct.

### 4. `frontend/components/merlion/texture-overlay.tsx` (Create)
- **Purpose**: Global paper fiber noise overlay.
- **Content**:
  - Fixed position div.
  - CSS radial-gradient background (matches `cafe.html`).
  - `pointer-events-none`.
- **Checklist**:
  - [ ] Renders invisible to clicks.
  - [ ] Z-index is correct (below content, above background).

### 5. `frontend/components/merlion/zigzag.tsx` (Create)
- **Purpose**: Editorial layout component.
- **Content**:
  - Container with `flex flex-col gap-16`.
  - Item wrapper that toggles `flex-row` / `flex-row-reverse` (or CSS grid with `direction: rtl` if sticking strictly to `cafe.html` technique, but flex order is often easier in React). *Decision*: Use `even:flex-row-reverse` utility for simplicity unless `direction: rtl` was crucial for text flow (it was mostly for image/text swap).
  - **Correction**: `cafe.html` used `direction: rtl`. To preserve "soul", we should replicate the *visual result*. Flex `row-reverse` is safer for accessibility unless the text language actually changes. We will use `even:flex-row-reverse`.
- **Checklist**:
  - [ ] Accepts a list of items (image + content).
  - [ ] Alternates layout.

### 6. `frontend/components/merlion/mobile-nav.tsx` (Create)
- **Purpose**: The mobile navigation menu with "soulful" transitions.
- **Content**:
  - Uses `Sheet` primitive.
  - Custom trigger (hamburger icon).
  - Custom content (nav links).
  - Matches `cafe.html` font sizes for mobile menu items.
- **Checklist**:
  - [ ] `aria-expanded` attributes handled by Sheet primitive.
  - [ ] Links close the sheet when clicked.

## Validation Criteria
- [ ] `npm run build` succeeds.
- [ ] A test page using `<ButtonMerlion>` and `<CardMerlion>` renders with correct styles (checked via visual inspection of class names in code or running dev server if possible).

```

# Phase_5_Implementation_Plan.md
```md
# Phase 5 Implementation Plan: Storefront Pages (Content + Catalog)

## Phase 5.1: Backend Catalog Foundation

### 1. `backend/app/Http/Controllers/ProductController.php` (Update)
- **Purpose**: Implement the public catalog endpoints.
- **Content**:
  - Method `index()`: Return all active products with JSON structure: `{ data: [ { slug, name, description, price_cents, ... } ] }`.
  - Method `show($slug)`: Return single product details.
- **Checklist**:
  - [ ] Returns valid JSON.
  - [ ] Maps `price_cents` correctly.
  - [ ] Filters by `is_active = true`.

### 2. `backend/routes/api.php` (Update)
- **Purpose**: Define public routes.
- **Content**:
  - `GET /api/v1/products` -> `ProductController@index`
  - `GET /api/v1/products/{slug}` -> `ProductController@show`
- **Checklist**:
  - [ ] Versioned routes exist.

### 3. `backend/database/seeders/ProductSeeder.php` (Create)
- **Purpose**: Seed the "Heritage Bean Collection" from `cafe.html`.
- **Content**:
  - Create 3 products: "Singapore Heritage Blend", "Peranakan Estate", "Straits Sourcing".
  - Use prices and descriptions from `cafe.html`.
- **Checklist**:
  - [ ] Seeder runs without error.
  - [ ] Data matches `cafe.html`.

## Phase 5.2: Frontend BFF & Pages

### 1. `frontend/src/app/api/catalog/route.ts` (Create)
- **Purpose**: BFF route to fetch products from Laravel (avoiding CORS/exposure of internal API details if needed, though direct fetching is also okay for public data; we'll use BFF for caching control).
- **Content**:
  - `GET` handler fetching from `NEXT_PUBLIC_API_BASE_URL/api/v1/products`.
  - Sets Cache-Control headers.
- **Checklist**:
  - [ ] Fetches data successfully.
  - [ ] Returns sanitized JSON.

### 2. `frontend/src/app/page.tsx` (Update)
- **Purpose**: The main landing page implementing `cafe.html`.
- **Content**:
  - **Hero Section**: `<h1>` with `font-heading`, floating beans animation.
  - **Collection Section**: Fetches products via `api/catalog` (or direct server fetch). Renders `ZigzagSection` with `ZigzagItem` components.
  - **Story Section**: Static content using `TextureOverlay` and typography tokens.
  - **Footer**: Static compliance footer.
- **Checklist**:
  - [ ] Uses `ZigzagSection` for products.
  - [ ] "Add to Cart" buttons are present (can be non-functional for this phase, just UI).
  - [ ] Floating beans animation is visible.

### 3. `frontend/src/components/merlion/product-card.tsx` (Optional/Refactor)
- **Purpose**: If `CardMerlion` needs specific product logic (price formatting), create a composition here.
- **Content**:
  - Takes product data.
  - Renders image, title, price (formatted SGD), and "Add to Cart" `ButtonMerlion`.
- **Checklist**:
  - [ ] Prices displayed inclusive of GST (e.g., "$28.00 SGD (Incl. 9% GST)").

## Validation Criteria
- [ ] `php artisan db:seed` populates the database.
- [ ] Visiting `http://localhost:3000` shows the Hero, Products (fetched from DB), and Story sections.
- [ ] Visual fidelity matches `cafe.html` (typography, spacing, ornaments).

```

# Phase_6_Implementation_Plan.md
```md
# Phase 6 Implementation Plan: Cart & Inventory Reservation

## Phase 6.1: Backend Inventory Logic

### 1. `backend/app/Services/InventoryService.php` (Create)
- **Purpose**: Encapsulate the core two-phase reservation logic.
- **Content**:
  - `reserve(array $items, int $ttlSeconds): string` (Returns reservation_id)
    - Starts transaction.
    - Checks `stock_count - reserved_count >= quantity`.
    - Updates `reserved_count`.
    - Creates `inventory_reservations` records.
    - Creates `inventory_ledger` entries.
  - `confirm(string $reservationId)`
    - Updates `stock_count` (decrement) and `reserved_count` (decrement).
    - Updates reservation status to `committed`.
    - Logs to ledger.
  - `release(string $reservationId)`
    - Decrements `reserved_count`.
    - Updates reservation status to `cancelled`.
- **Checklist**:
  - [ ] Uses pessimistic locking (`lockForUpdate`) or atomic updates to prevent race conditions.
  - [ ] Throws proper exceptions for insufficient stock.

### 2. `backend/app/Http/Controllers/ReservationController.php` (Create)
- **Purpose**: API endpoints for cart interactions.
- **Content**:
  - `store(Request $request)`: Calls `InventoryService::reserve`.
  - `update(Request $request, $id)`: Adjusts reservation quantity (release old, reserve new diff, or simple release-and-reserve).
  - `destroy($id)`: Calls `InventoryService::release`.
- **Checklist**:
  - [ ] Validates input (sku, quantity > 0).
  - [ ] Returns `reservation_id` and `expires_at`.

### 3. `backend/routes/api.php` (Update)
- **Purpose**: Register reservation routes.
- **Content**:
  - `POST /reservations`
  - `PATCH /reservations/{id}`
  - `DELETE /reservations/{id}`
- **Checklist**:
  - [ ] Routes are present.

### 4. `backend/app/Console/Commands/PruneReservations.php` (Create)
- **Purpose**: Scheduled job to release expired reservations.
- **Content**:
  - Finds active reservations where `expires_at < now()`.
  - Calls `InventoryService::release` for each.
- **Checklist**:
  - [ ] registered in `Console/Kernel.php` (or routes/console.php in L11/12).

## Phase 6.2: Frontend Cart State

### 1. `frontend/src/lib/cart-store.ts` (Create)
- **Purpose**: Client-side cart state management (Zustand or React Context).
- **Content**:
  - Store items: `{ sku, quantity, price, name, image }[]`.
  - Store reservation info: `reservationId`, `expiresAt`.
  - Actions: `addItem`, `removeItem`, `updateQuantity`.
  - Logic:
    - On change, debounce calls to BFF `POST /api/reservations`.
    - Handle expiry (clear reservationId).
- **Checklist**:
  - [ ] Persists to localStorage.
  - [ ] Syncs with backend reservation.

### 2. `frontend/src/app/api/reservations/route.ts` (Create)
- **Purpose**: BFF proxy to Laravel reservation endpoints.
- **Content**:
  - Forwards requests to backend.
  - Handles cookie/session if we need to secure it (optional for MVP, reservation ID is the token).
- **Checklist**:
  - [ ] Proxies success/error states correctly.

### 3. `frontend/src/components/merlion/cart-drawer.tsx` (Create)
- **Purpose**: UI for the cart.
- **Content**:
  - Uses `Sheet` from shadcn.
  - Lists items using `CartItem` component (needs creation).
  - Shows total (with GST note).
  - "Checkout" button (disabled if empty).
- **Checklist**:
  - [ ] Animations match `cafe.html` style.
  - [ ] Updates in real-time.

## Validation Criteria
- [ ] Adding an item triggers a `POST` to backend and creates a reservation row in DB.
- [ ] Waiting 15 minutes (or running prune command manually) releases the reservation in DB.
- [ ] Frontend shows "Reserved until [Time]" countdown (optional but good).
- [ ] Cannot reserve more than available stock (backend returns 422).

```

# Phase_7_Implementation_Plan.md
```md
# Phase 7 Implementation Plan: Checkout (Stripe + PayNow)

## Phase 7.1: Backend Order & Payment Logic

### 1. `backend/app/Services/GstService.php` (Create)
- **Purpose**: Centralized GST calculation logic.
- **Content**:
  - `calculate(int $subtotalCents): array`
    - Returns `['subtotal_cents', 'gst_cents', 'total_cents', 'gst_rate']`.
    - GST Rate: 9%.
    - Calculation: `gst_cents = round($subtotalCents * 0.09)`.
    - `total_cents = $subtotalCents + $gst_cents` (Wait, cafe.html says "Prices inclusive". If prices are inclusive, we need to back-calculate or treat catalog prices as inclusive).
    - **Decision**: Catalog prices are inclusive.
    - Logic: `gst_cents = round($totalCents * 9 / 109)`. `subtotal_cents = $totalCents - $gst_cents`.
- **Checklist**:
  - [ ] Correctly handles inclusive pricing logic.

### 2. `backend/app/Services/StripeService.php` (Create)
- **Purpose**: Wrapper for Stripe PHP SDK.
- **Content**:
  - `createPaymentIntent(Order $order): PaymentIntent`
    - Amount: `$order->total_cents`.
    - Currency: `sgd`.
    - Payment Methods: `['card', 'paynow']`.
    - Metadata: `order_id`, `reservation_id` (if applicable, or derived).
- **Checklist**:
  - [ ] Enables PayNow.
  - [ ] Sets metadata for webhook reconciliation.

### 3. `backend/app/Http/Controllers/OrderController.php` (Create)
- **Purpose**: Create order drafts.
- **Content**:
  - `store(Request $request)`
    - Input: `reservation_id`, `email`.
    - Validates reservation exists and is active.
    - Calculates totals using `GstService` (based on reserved items).
    - Creates `Order` (status: pending) and `OrderItems`.
    - Calls `StripeService::createPaymentIntent`.
    - Stores `Payment` record.
    - Returns: `client_secret`, `order_id`.
- **Checklist**:
  - [ ] Uses DB transaction.
  - [ ] Links Order to Reservation (so we know what to confirm).

### 4. `backend/app/Http/Controllers/StripeWebhookController.php` (Create)
- **Purpose**: Handle payment confirmation.
- **Content**:
  - `handle(Request $request)`
    - Verifies signature.
    - Handles `payment_intent.succeeded`.
    - Idempotency check using `webhook_events` table.
    - On success:
      - Update `Payment` status.
      - Update `Order` status to `paid`.
      - Call `InventoryService::confirm($reservationId)`.
- **Checklist**:
  - [ ] Signature verification is strict.
  - [ ] Idempotency prevents double-confirmation.

### 5. `backend/routes/api.php` (Update)
- **Purpose**: Register checkout routes.
- **Content**:
  - `POST /orders/draft` -> `OrderController@store`
  - `POST /webhooks/stripe` -> `StripeWebhookController@handle` (Exclude from CSRF if needed, though API is usually stateless).
- **Checklist**:
  - [ ] Webhook route is accessible.

## Phase 7.2: Frontend Checkout Flow

### 1. `frontend/src/app/checkout/page.tsx` (Create)
- **Purpose**: Checkout page UI.
- **Content**:
  - `Elements` provider (Stripe).
  - `CheckoutForm` component.
  - Displays Order Summary (items, subtotal, GST, total).
- **Checklist**:
  - [ ] Uses `loadStripe`.
  - [ ] Fetches order draft (client secret) on mount or via action.

### 2. `frontend/src/components/merlion/checkout-form.tsx` (Create)
- **Purpose**: Stripe Elements form.
- **Content**:
  - `PaymentElement` (handles PayNow/Card UI).
  - Submit button (ButtonMerlion).
  - Error handling display.
- **Checklist**:
  - [ ] Handles PayNow QR code display (Stripe element handles this).
  - [ ] Shows success/error messages.

### 3. `frontend/src/app/api/checkout/route.ts` (Create)
- **Purpose**: BFF proxy for creating order draft.
- **Content**:
  - `POST`: Calls `backend/api/v1/orders/draft`.
- **Checklist**:
  - [ ] Passes reservation ID from request body.

## Validation Criteria
- [ ] Clicking "Proceed to Checkout" in Cart Drawer navigates to `/checkout`.
- [ ] `/checkout` creates an Order in backend (pending) and returns a client secret.
- [ ] Stripe Payment Element renders with PayNow option visible.
- [ ] Completing a payment (test mode) triggers the webhook.
- [ ] Webhook successfully updates Order to `paid` and Inventory Reservation to `committed`.

```

# Phase_8_Implementation_Plan.md
```md
# Phase 8 Implementation Plan: Invoicing + InvoiceNow Provider Integration (MVP)

## Phase 8.1: Invoice Logic & Generation

### 1. `backend/app/Services/InvoiceNumberService.php` (Create)
- **Purpose**: Encapsulate invoice number generation logic.
- **Content**:
  - `generate()`: Returns format `MB-{Year}-{UUID segment}`.
  - Ensures uniqueness (check DB).
- **Checklist**:
  - [ ] Returns valid string.
  - [ ] Checks for collisions.

### 2. `backend/app/Services/InvoiceService.php` (Create)
- **Purpose**: Create invoice records from paid orders.
- **Content**:
  - `createForOrder(Order $order)`:
    - Generates invoice number.
    - Creates `Invoice` record.
    - Updates Order with `invoice_number`.
    - Dispatches `TransmitInvoiceNowJob`.
  - `generatePayload(Invoice $invoice)`:
    - Constructs the JSON/XML payload required by the provider.
    - Includes GST breakdown, UEN, Customer details (email).
- **Checklist**:
  - [ ] Maps GST fields correctly.
  - [ ] Includes required UENs.

### 3. `backend/app/Services/InvoiceNowProviderClient.php` (Create)
- **Purpose**: HTTP Client for the InvoiceNow provider.
- **Content**:
  - `send(array $payload)`
    - POST request to provider.
    - Handles auth (Bearer token or similar).
    - Returns transmission ID or throws exception.
- **Checklist**:
  - [ ] Uses `.env` credentials.
  - [ ] Logs requests/responses.

## Phase 8.2: Async Transmission & Resilience

### 1. `backend/app/Jobs/TransmitInvoiceNowJob.php` (Create)
- **Purpose**: Background job to send invoice to provider.
- **Content**:
  - Accepts `invoice_id`.
  - Calls `InvoiceService::generatePayload`.
  - Calls `InvoiceNowProviderClient::send`.
  - Updates `Invoice` status to `transmitted`.
  - Creates `InvoiceTransmission` log.
  - Uses `Backoff` strategy for retries.
- **Checklist**:
  - [ ] Retries 3 times on failure.
  - [ ] Logs success/failure to `invoice_transmissions`.

### 2. `backend/app/Console/Kernel.php` (Update)
- **Purpose**: Register schedule for stuck invoices.
- **Content**:
  - Job `invoices:retry-stuck` (new command).
- **Checklist**:
  - [ ] Runs hourly.

### 3. `backend/app/Console/Commands/RetryStuckInvoices.php` (Create)
- **Purpose**: Catch invoices stuck in 'generated' state > 1 hour.
- **Content**:
  - Finds invoices.
  - Dispatches `TransmitInvoiceNowJob`.
- **Checklist**:
  - [ ] Idempotent dispatch.

## Validation Criteria
- [ ] Completing a checkout flow (Phase 7) creates an Order -> Paid.
- [ ] This triggers Invoice creation automatically (hook into StripeWebhook from Phase 7).
- [ ] Invoice record exists with `invoice_number`.
- [ ] `TransmitInvoiceNowJob` runs and logs a result in `invoice_transmissions`.
- [ ] Invoice status updates to `transmitted` (mock success if no real provider key).

```

# Phase_9_Implementation_Plan.md
```md
# Phase 9 Implementation Plan: Observability, Security Hardening, and Quality Gates

## Phase 9.1: Security Hardening

### 1. `backend/app/Http/Middleware/RateLimitMiddleware.php` (Configure)
- **Purpose**: Protect critical endpoints from abuse.
- **Action**: Use Laravel's built-in RateLimiter via `AppServiceProvider` or routes.
- **Content**:
  - `boot()` in `AppServiceProvider`:
    - `RateLimiter::for('api', ...)` -> 60 per minute.
    - `RateLimiter::for('checkout', ...)` -> 5 per minute per IP (prevent card testing).
- **Checklist**:
  - [ ] Applied to `POST /orders/draft` and `POST /reservations`.

### 2. `frontend/next.config.ts` (Update)
- **Purpose**: Security headers.
- **Content**:
  - Add `headers()` config.
  - Set `X-Frame-Options: DENY`.
  - Set `X-Content-Type-Options: nosniff`.
  - Set `Referrer-Policy: strict-origin-when-cross-origin`.
  - (Optional) CSP if feasible without breaking Stripe/Next.js scripts.
- **Checklist**:
  - [ ] Headers present in response.

## Phase 9.2: Operational Runbooks & Observability

### 1. `docs/runbooks/production-operations.md` (Create)
- **Purpose**: Guide for on-call engineers.
- **Content**:
  - **Incidents**:
    - "Stripe Webhook Failures": Check `webhook_events` table, replay via Stripe Dashboard.
    - "Invoice Transmission Stuck": Run `php artisan invoices:retry-stuck`.
    - "Inventory Drift": Check `inventory_ledger` vs `inventory`.
  - **Routine**:
    - Pruning logs.
    - Database backups (pg_dump).
- **Checklist**:
  - [ ] Covers all critical failure modes.

## Phase 9.3: Quality Gates (Visual Regression)

### 1. `frontend/tests/visual/basic.spec.ts` (Create)
- **Purpose**: Playwright test for visual stability.
- **Action**: Install Playwright (`npm init playwright@latest`).
- **Content**:
  - Visit `/`.
  - Snapshot Hero section.
  - Snapshot Footer.
- **Checklist**:
  - [ ] `npx playwright test` runs.
  - [ ] Snapshots capture Peranakan aesthetic.

### 2. `frontend/package.json` (Update)
- **Purpose**: Add test scripts.
- **Content**:
  - `"test:visual": "playwright test"`
- **Checklist**:
  - [ ] Script executable.

## Phase 9.4: Final Polish

### 1. `backend/app/Models/User.php` (Cleanup)
- **Purpose**: Remove unused default User model/migrations if we are purely headless/sessionless for customers.
- **Decision**: Keep for Admin usage (Phase 12), but ensure it's secure.
- **Action**: Ensure `password` is hashed (default Laravel behavior).

## Validation Criteria
- [ ] Rate limits block excessive requests to checkout.
- [ ] Security headers are present on frontend.
- [ ] Playwright visual tests pass.
- [ ] Runbook exists and is readable.

```

# Phase_10_Implementation_Plan.md
```md
# Phase 10 Implementation Plan: Newsletter, Consent, and Transactional Messaging

## Phase 10.1: Backend Newsletter & Consent

### 1. `backend/database/migrations/xxxx_xx_xx_create_newsletter_tables.php` (Create)
- **Purpose**: Store subscribers with explicit consent tracking (PDPA compliance).
- **Content**:
  - Table `newsletter_subscribers`:
    - `id` (UUID)
    - `email` (string, unique)
    - `consent_granted_at` (timestamp)
    - `consent_source` (string, e.g., 'web_footer')
    - `unsubscribed_at` (timestamp, nullable)
- **Checklist**:
  - [ ] Unique index on email.
  - [ ] Non-nullable consent timestamp.

### 2. `backend/app/Models/NewsletterSubscriber.php` (Create)
- **Purpose**: Eloquent model for subscribers.
- **Checklist**:
  - [ ] `HasUuids` trait applied.
  - [ ] `$fillable` includes email and consent fields.

### 3. `backend/app/Http/Controllers/NewsletterController.php` (Create)
- **Purpose**: API endpoint for subscription.
- **Content**:
  - `subscribe(Request $request)`:
    - Validates `email` and `consent_marketing` (boolean).
    - Rejects if `consent_marketing` is false.
    - Uses `updateOrCreate` to handle resubscriptions.
- **Checklist**:
  - [ ] Returns 201 on success.
  - [ ] Returns 422 if consent is missing.

### 4. `backend/routes/api.php` (Update)
- **Purpose**: Register the newsletter route.
- **Content**:
  - `POST /newsletter/subscribe` -> `NewsletterController@subscribe`.
- **Checklist**:
  - [ ] Route is versioned under `v1`.

## Phase 10.2: Transactional Messaging

### 1. `backend/app/Services/MailService.php` (Create)
- **Purpose**: Centralized service for sending brand-aligned emails.
- **Content**:
  - Wrapper around Laravel's `Mail` facade.
  - Method `sendWelcome(string $email)`: Sends the welcome discount code mentioned in `cafe.html`.
- **Checklist**:
  - [ ] Uses standard Laravel Mailable classes.
  - [ ] Logs email attempts for audit.

## Phase 10.3: Frontend Newsletter Integration

### 1. `frontend/src/components/merlion/newsletter-form.tsx` (Create)
- **Purpose**: The "Join Our Manuscript" form from `cafe.html`.
- **Content**:
  - Email input.
  - Explicit consent checkbox (unchecked by default).
  - Success/Error toast messages.
- **Checklist**:
  - [ ] Typography and button style match `cafe.html`.
  - [ ] Checkbox is required for submission.

### 2. `frontend/src/app/api/newsletter/route.ts` (Create)
- **Purpose**: BFF route proxy.
- **Content**:
  - `POST` handler forwarding to Laravel.
- **Checklist**:
  - [ ] Proxies status codes correctly.

## Validation Criteria
- [ ] `php artisan migrate` creates the subscription table.
- [ ] Submitting the newsletter form with consent adds a record to the database.
- [ ] Submitting without the consent checkbox results in a frontend validation error.
- [ ] Transactional emails are logged in `laravel.log` (using `log` mail driver).

```

# Phase_11_Implementation_Plan.md
```md
# Phase 11 Implementation Plan: Experiences & Events Booking

## Phase 11.1: Backend Event Infrastructure

### 1. `backend/database/migrations/xxxx_xx_xx_create_events_tables.php` (Create)
- **Purpose**: Store event details, sessions (dates/times), and user bookings.
- **Content**:
  - `events`: `id` (UUID), `slug`, `title`, `description`, `price_cents`, `duration_minutes`.
  - `event_sessions`: `id` (UUID), `event_id` (FK), `starts_at` (timestamp), `capacity` (int), `booked_count` (int).
  - `bookings`: `id` (UUID), `session_id` (FK), `user_email`, `quantity`, `status` (pending/confirmed/cancelled), `payment_id` (nullable).
- **Checklist**:
  - [ ] Indexes on `starts_at` for querying upcoming sessions.
  - [ ] Optimistic locking columns (`booked_count`).

### 2. `backend/app/Models/*` (Create)
- **Purpose**: Eloquent models.
- **Content**: `Event`, `EventSession`, `Booking`.
- **Checklist**:
  - [ ] Relationships defined (`Event` hasMany `EventSession`, `EventSession` hasMany `Booking`).

### 3. `backend/app/Services/CapacityService.php` (Create)
- **Purpose**: Handle booking logic with concurrency control.
- **Content**:
  - `reserve(sessionId, email, qty)`:
    - Transaction start.
    - Check `capacity - booked_count >= qty`.
    - Increment `booked_count`.
    - Create `Booking` (status: confirmed for MVP free/pay-at-door events, or pending if paid).
    - **Decision**: For MVP simplicity, assume "Pay at Door" or "Free" to avoid another Stripe integration loop, OR reuse StripeService if time permits. Let's aim for **Confirmed immediately** (Pay at Door/Reservation only) to match the "Reservation" terminology in `cafe.html`.
- **Checklist**:
  - [ ] Prevents overbooking.

### 4. `backend/app/Http/Controllers/BookingController.php` (Create)
- **Purpose**: API endpoints.
- **Content**:
  - `index()`: List upcoming events + sessions.
  - `store()`: Create booking.
- **Checklist**:
  - [ ] Validates email and quantity.

### 5. `backend/routes/api.php` (Update)
- **Purpose**: Register routes.
- **Content**:
  - `GET /events`
  - `POST /bookings`
- **Checklist**:
  - [ ] Publicly accessible.

## Phase 11.2: Frontend Booking UI

### 1. `frontend/src/app/events/page.tsx` (Create)
- **Purpose**: dedicated events page (or section).
- **Content**:
  - List events using `CardMerlion`.
  - "Book Now" opens a modal/drawer.
- **Checklist**:
  - [ ] Uses Merlion components.

### 2. `frontend/src/app/api/bookings/route.ts` (Create)
- **Purpose**: BFF proxy.
- **Checklist**:
  - [ ] Forwards to Laravel.

## Validation Criteria
- [ ] Migration runs.
- [ ] Can view events JSON via API.
- [ ] Can create a booking via API (increments booked_count).
- [ ] Overbooking returns 422 error.

```

# Phase_12_Implementation_Plan.md
```md
# Phase 12 Implementation Plan: Admin Dashboard (Day‑1 Operations)

## Phase 12.1: Backend Admin Foundation

### 1. `backend/database/migrations/xxxx_xx_xx_create_admin_roles.php` (Create)
- **Purpose**: Implement RBAC for admin users.
- **Content**:
  - Tables: `roles` (id, name), `permissions` (id, name), `role_user`, `permission_role`.
  - Simple schema sufficient for MVP (or use Spatie/Permission if complex, but custom is lighter for Day 1).
- **Checklist**:
  - [ ] Includes `admin` role seed.

### 2. `backend/app/Models/User.php` (Update)
- **Purpose**: Add role relationship.
- **Content**:
  - `roles()` relationship.
  - `hasRole($role)` helper.
- **Checklist**:
  - [ ] Relationship defined.

### 3. `backend/database/seeders/AdminSeeder.php` (Create)
- **Purpose**: Create initial admin user.
- **Content**:
  - Create user with email `admin@merlionbrews.sg` and secure password (env driven or default `password`).
  - Assign `admin` role.
- **Checklist**:
  - [ ] Idempotent (check if exists first).

### 4. `backend/app/Http/Middleware/AdminMiddleware.php` (Create)
- **Purpose**: Protect admin routes.
- **Content**:
  - Check if `auth()->user()->hasRole('admin')`.
- **Checklist**:
  - [ ] Registered in `bootstrap/app.php` alias.

## Phase 12.2: Admin API Endpoints

### 1. `backend/app/Http/Controllers/Admin/OrderController.php` (Create)
- **Purpose**: Admin order management.
- **Content**:
  - `index()`: List orders with status filters.
  - `show($id)`: Detail view with payments/invoices.
- **Checklist**:
  - [ ] Returns detailed JSON including relationships.

### 2. `backend/app/Http/Controllers/Admin/InventoryController.php` (Create)
- **Purpose**: Manual stock adjustments.
- **Content**:
  - `update($sku, Request $request)`:
    - Input: `quantity_change`, `reason`.
    - Updates `stock_count`.
    - Logs to `inventory_ledger`.
- **Checklist**:
  - [ ] Atomic update.
  - [ ] Ledger entry created.

### 3. `backend/routes/api.php` (Update)
- **Purpose**: Register admin routes under auth+admin middleware.
- **Content**:
  - `GET /admin/orders`
  - `PATCH /admin/inventory/{sku}`
- **Checklist**:
  - [ ] Protected by Sanctum + AdminMiddleware.

## Phase 12.3: Frontend Admin UI

### 1. `frontend/src/app/admin/layout.tsx` (Create)
- **Purpose**: Admin shell.
- **Content**:
  - Sidebar navigation (Orders, Inventory).
  - Auth check (redirect to login if not admin - simple client-side check + API 401 handling).
- **Checklist**:
  - [ ] Distinct layout from Storefront.

### 2. `frontend/src/app/admin/orders/page.tsx` (Create)
- **Purpose**: Order list.
- **Content**:
  - Table of orders (ID, Customer, Total, Status, Date).
  - Status badges.
- **Checklist**:
  - [ ] Fetches from `/api/v1/admin/orders`.

### 3. `frontend/src/app/admin/inventory/page.tsx` (Create)
- **Purpose**: Inventory management.
- **Content**:
  - List products + stock.
  - "Adjust Stock" modal/form.
- **Checklist**:
  - [ ] Fetches products.
  - [ ] Submits adjustment to `/api/v1/admin/inventory/{sku}`.

## Validation Criteria
- [ ] `php artisan db:seed --class=AdminSeeder` creates admin.
- [ ] Admin endpoints return 401/403 for non-admins.
- [ ] Admin can view orders and adjust stock via UI.
- [ ] Ledger reflects manual adjustments.

```

# Phase_13_Implementation_Plan.md
```md
# Phase 13 Implementation Plan: CI, Deployment, and Environment Promotion

## Phase 13.1: CI/CD Pipeline Configuration

### 1. `frontend/next.config.ts` (Update)
- **Purpose**: Ensure standalone output for Docker optimization.
- **Content**:
  - `output: 'standalone'`
- **Checklist**:
  - [ ] `npm run build` produces `.next/standalone`.

### 2. `infra/production/Dockerfile.backend` (Create)
- **Purpose**: Production-ready PHP image.
- **Content**:
  - Base: `php:8.3-fpm-alpine`
  - Install extensions: `pdo_pgsql`, `redis`, `opcache`.
  - Copy code.
  - Run `composer install --no-dev --optimize-autoloader`.
  - Set permissions.
- **Checklist**:
  - [ ] Multi-stage build (if beneficial, otherwise single stage optimized).

### 3. `infra/production/Dockerfile.frontend` (Create)
- **Purpose**: Production-ready Next.js image.
- **Content**:
  - Base: `node:20-alpine`
  - Builder stage: `npm run build`
  - Runner stage: Copy `.next/standalone`.
  - Expose 3000.
- **Checklist**:
  - [ ] Minimal size.

### 4. `infra/production/nginx.conf` (Create)
- **Purpose**: Reverse proxy for backend (and frontend if not using Vercel).
- **Content**:
  - Proxy `/api` to Laravel FPM.
  - Proxy `/` to Next.js.
- **Checklist**:
  - [ ] Gzip enabled.
  - [ ] Security headers.

## Phase 13.2: Deployment Documentation

### 1. `docs/runbooks/deployment.md` (Create)
- **Purpose**: Instructions for deploying to a VPS (e.g., DigitalOcean/AWS EC2) using Docker Compose.
- **Content**:
  - Environment variables setup (`.env.production`).
  - Build command: `docker compose -f docker-compose.prod.yml up --build -d`.
  - Migration command: `docker compose exec backend php artisan migrate --force`.
  - Rollback steps.
- **Checklist**:
  - [ ] Includes zero-downtime considerations (basic).

### 2. `infra/production/docker-compose.prod.yml` (Create)
- **Purpose**: Production orchestration.
- **Content**:
  - Services: `frontend`, `backend`, `worker` (queue), `nginx`, `db`, `redis`.
  - Restart policies: `always`.
  - Networks: private backend network.
- **Checklist**:
  - [ ] No ports exposed unnecessarily (only Nginx 80/443).

## Validation Criteria
- [ ] Docker images build successfully.
- [ ] `docker-compose.prod.yml` starts all services.
- [ ] Frontend can communicate with Backend via internal network (or Nginx proxy).
- [ ] Static assets are served correctly.

```

