<?php

namespace App\Jobs;

use App\Models\Invoice;
use App\Models\InvoiceTransmission;
use App\Services\InvoiceService;
use App\Services\InvoiceNowProviderClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Exception;

class TransmitInvoiceNowJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [60, 300, 600];

    protected $invoiceId;

    public function __construct(string $invoiceId)
    {
        $this->invoiceId = $invoiceId;
    }

    public function handle(InvoiceService $invoiceService, InvoiceNowProviderClient $client): void
    {
        $invoice = Invoice::findOrFail($this->invoiceId);

        try {
            $payload = $invoiceService->generatePayload($invoice);
            $transmissionId = $client->send($payload);

            $invoice->status = 'transmitted';
            $invoice->provider_transmission_id = $transmissionId;
            $invoice->save();

            InvoiceTransmission::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'invoice_id' => $invoice->id,
                'attempt_at' => now(),
                'response_payload' => ['id' => $transmissionId],
                'success' => true,
            ]);

        } catch (Exception $e) {
            InvoiceTransmission::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'invoice_id' => $invoice->id,
                'attempt_at' => now(),
                'response_payload' => ['error' => $e->getMessage()],
                'success' => false,
            ]);

            throw $e;
        }
    }
}