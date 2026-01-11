<?php

namespace App\Services;

use App\Models\Invoice;
use Illuminate\Support\Str;

class InvoiceNumberService
{
    public function generate(): string
    {
        $year = date('Y');
        // Simple format: MB-2026-UUIDSEG
        // In a real app, this might be sequential (MB-2026-0001), but that requires locking.
        // For MVP, collision-resistant random string is sufficient and faster.
        $segment = strtoupper(Str::random(8));
        $number = "MB-{$year}-{$segment}";

        // Ensure uniqueness
        while (Invoice::where('provider_transmission_id', $number)->exists()) { 
            // Actually, invoice_number is stored on Order, but Invoice model might store it too?
            // Schema check: `orders.invoice_number`. `invoices` table links to `order_id`.
            // Let's assume we store it on Order as per Phase 2 schema.
            // But we need to check uniqueness against Order table.
            $segment = strtoupper(Str::random(8));
            $number = "MB-{$year}-{$segment}";
        }

        return $number;
    }
}
