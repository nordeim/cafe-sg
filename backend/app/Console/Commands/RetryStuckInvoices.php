<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invoice;
use App\Jobs\TransmitInvoiceNowJob;

class RetryStuckInvoices extends Command
{
    protected $signature = 'invoices:retry-stuck';
    protected $description = 'Retry invoices stuck in draft state for more than 1 hour';

    public function handle(): void
    {
        $stuckInvoices = Invoice::where('status', 'draft')
            ->where('created_at', '<', now()->subHour())
            ->get();

        foreach ($stuckInvoices as $invoice) {
            $this->info("Retrying invoice: {$invoice->id}");
            TransmitInvoiceNowJob::dispatch($invoice->id);
        }
    }
}