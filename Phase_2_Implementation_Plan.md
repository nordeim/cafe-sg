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
