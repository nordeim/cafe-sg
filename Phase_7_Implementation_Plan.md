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
