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
