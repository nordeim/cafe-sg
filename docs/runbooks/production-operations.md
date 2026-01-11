# Production Operations Runbook

## Incident Response

### 1. Stripe Webhook Failures
**Symptom**: Orders remain 'pending' after successful payment, or inventory is not confirmed.
**Diagnosis**:
1. Check `webhook_events` table in DB for failed events.
2. Check Laravel logs (`storage/logs/laravel.log`) for `Stripe signature verification failed` or other errors.
**Resolution**:
- If signature failed: Verify `STRIPE_WEBHOOK_SECRET` in `.env`.
- If logic error: Fix code, then **Replay** the event from the Stripe Dashboard.
- **Manual Fix**: 
    ```bash
    # Confirm inventory manually if needed
    php artisan tinker
    > app(App\Services\InventoryService::class)->confirm('reservation-uuid');
    ```

### 2. Invoice Transmission Stuck
**Symptom**: Invoices stuck in `draft` or `generated` status.
**Diagnosis**:
- Check `invoice_transmissions` table for error payloads.
- Check `failed_jobs` table (if using database queue driver).
**Resolution**:
- Run the retry command:
    ```bash
    php artisan invoices:retry-stuck
    ```
- If provider is down, the exponential backoff should handle it. If permanent failure, check provider credentials.

### 3. Inventory Drift
**Symptom**: `stock_count` does not match physical reality or ledger sums.
**Diagnosis**:
- Compare `stock_count` vs `sum(quantity_change)` in `inventory_ledger`.
**Resolution**:
- **Audit**: Run a query to sum ledger entries.
- **Correction**: Use Admin API (Phase 12) or Tinker to adjust stock, creating a correction ledger entry:
    ```php
    InventoryLedgerEntry::create([
        'sku' => '...',
        'quantity_change' => 5,
        'reason' => 'manual_correction',
        'reference_id' => 'admin-user-id'
    ]);
    // Then update inventory table
    ```

## Routine Maintenance

### Database Backups
- **Frequency**: Daily.
- **Command**:
    ```bash
    docker compose exec db pg_dump -U merlion merlion_brews > backup_$(date +%F).sql
    ```

### Log Pruning
- Laravel logs rotate daily by default.
- Monitoring service (e.g., Sentry/Datadog) should be configured for production.
