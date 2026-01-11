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
