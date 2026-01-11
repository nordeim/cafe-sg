<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use App\Jobs\TransmitInvoiceNowJob;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    protected $numberService;

    public function __construct(InvoiceNumberService $numberService)
    {
        $this->numberService = $numberService;
    }

    public function createForOrder(Order $order): Invoice
    {
        return DB::transaction(function () use ($order) {
            $invoiceNumber = $this->numberService->generate();
            
            $order->invoice_number = $invoiceNumber;
            $order->save();

            $invoice = Invoice::create([
                'id' => (string) \Illuminate\Support\Str::uuid(),
                'order_id' => $order->id,
                'status' => 'draft',
            ]);

            // Dispatch transmission
            TransmitInvoiceNowJob::dispatch($invoice->id);

            return $invoice;
        });
    }

    public function generatePayload(Invoice $invoice): array
    {
        $order = $invoice->order;
        
        // Peppol BIS Billing 3.0 simplified representation
        return [
            'invoice_number' => $order->invoice_number,
            'issue_date' => $invoice->created_at->format('Y-m-d'),
            'supplier' => [
                'uen' => '2015123456K',
                'gst_reg' => 'M9-1234567-8',
                'name' => 'Merlion Brews Artisan Roastery Pte. Ltd.',
            ],
            'customer' => [
                'email' => $order->email,
            ],
            'totals' => [
                'subtotal' => $order->subtotal_cents / 100,
                'gst' => $order->gst_cents / 100,
                'total' => $order->total_cents / 100,
                'currency' => 'SGD',
            ],
            'items' => $order->items->map(function ($item) {
                return [
                    'description' => $item->product->name,
                    'quantity' => $item->quantity,
                    'price' => $item->price_at_time_cents / 100,
                ];
            })->toArray(),
        ];
    }
}
