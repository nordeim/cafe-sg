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
