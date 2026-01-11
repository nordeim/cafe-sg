<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use App\Models\Order;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
    }

    public function createPaymentIntent(Order $order, string $reservationId): PaymentIntent
    {
        return PaymentIntent::create([
            'amount' => $order->total_cents,
            'currency' => 'sgd',
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
            // Explicitly enable PayNow if automatic doesn't cover it or for specificity
            // 'payment_method_types' => ['card', 'paynow'], 
            // Using automatic is generally better for Stripe updates, but let's stick to simple first.
            'metadata' => [
                'order_id' => $order->id,
                'reservation_id' => $reservationId,
            ],
        ]);
    }
}
