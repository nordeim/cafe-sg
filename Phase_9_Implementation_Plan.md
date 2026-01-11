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
