<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;
use App\Models\WebhookEvent;
use App\Models\Payment;
use App\Models\Order;
use App\Services\InventoryService;
use Illuminate\Support\Facades\DB;

class StripeWebhookController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch (SignatureVerificationException $e) {
            Log::error('Stripe signature verification failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Idempotency
        if (WebhookEvent::where('id', $event->id)->exists()) {
            return response()->json(['message' => 'Event already processed']);
        }

        DB::transaction(function () use ($event) {
            if ($event->type === 'payment_intent.succeeded') {
                $paymentIntent = $event->data->object;
                $this->handlePaymentSucceeded($paymentIntent);
            }

            WebhookEvent::create([
                'id' => $event->id,
                'payload' => $event,
                'processed_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Received']);
    }

    protected function handlePaymentSucceeded($paymentIntent)
    {
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if (!$payment) {
            Log::warning('Payment not found for intent', ['id' => $paymentIntent->id]);
            return;
        }

        $order = $payment->order;
        if ($order->status !== 'paid') {
            $order->status = 'paid';
            $order->invoice_number = 'MB-' . date('Y') . '-' . strtoupper(substr($order->id, 0, 8)); // Simple generation
            $order->save();

            $payment->status = 'succeeded';
            $payment->save();

            // Confirm Inventory
            $reservationId = $paymentIntent->metadata->reservation_id ?? null;
            if ($reservationId) {
                $this->inventoryService->confirm($reservationId);
            }
        }
    }
}
