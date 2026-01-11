<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use App\Jobs\TransmitInvoiceNowJob;
use Illuminate\Support\Facades\Queue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

class InvoiceTransmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_invoice_creation_dispatches_job(): void
    {
        Queue::fake();

        $product = Product::create([
            'id' => (string) Str::uuid(),
            'name' => 'Test Coffee',
            'slug' => 'test-coffee',
            'price_cents' => 1000,
            'is_active' => true,
        ]);

        $order = Order::create([
            'id' => (string) Str::uuid(),
            'subtotal_cents' => 1000,
            'gst_cents' => 90,
            'total_cents' => 1090,
            'status' => 'paid',
            'email' => 'test@example.com',
        ]);

        OrderItem::create([
            'id' => (string) Str::uuid(),
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price_at_time_cents' => 1000,
        ]);

        // Trigger service manually or via webhook
        $service = app(\App\Services\InvoiceService::class);
        $service->createForOrder($order);

        Queue::assertPushed(TransmitInvoiceNowJob::class);
        
        $this->assertDatabaseHas('invoices', [
            'order_id' => $order->id,
            'status' => 'draft',
        ]);
        
        $this->assertNotNull($order->fresh()->invoice_number);
    }
}