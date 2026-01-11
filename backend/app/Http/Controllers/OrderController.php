<?php

namespace App\Http\Controllers;

use App\Models\InventoryReservation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Payment;
use App\Services\GstService;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    protected $gstService;
    protected $stripeService;

    public function __construct(GstService $gstService, StripeService $stripeService)
    {
        $this->gstService = $gstService;
        $this->stripeService = $stripeService;
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'reservation_id' => 'required|uuid',
            'email' => 'required|email',
        ]);

        $reservationId = $request->input('reservation_id');
        $email = $request->input('email');

        // Check for active reservations with this group ID
        $reservations = InventoryReservation::where('reservation_group_id', $reservationId)
            ->where('status', 'active')
            ->get();

        if ($reservations->isEmpty()) {
            return response()->json(['error' => 'Reservation expired or invalid'], 422);
        }

        // Calculate totals based on current product prices (assuming prices didn't change since reservation? 
        // Or should we trust the reservation? Reservation stores sku and qty only. 
        // We fetch current price. Ideally price should be locked at reservation, but for MVP fetching active price is okay.)
        
        $totalCents = 0;
        $orderItemsData = [];

        foreach ($reservations as $res) {
            $product = Product::where('slug', $res->sku)->firstOrFail(); // Assuming SKU matches Slug or we map it. 
            // In Seeder: slug='singapore-heritage-blend'. In Inventory Service: sku='singapore-heritage-blend'.
            // Matches.
            
            $lineTotal = $product->price_cents * $res->quantity;
            $totalCents += $lineTotal;

            $orderItemsData[] = [
                'id' => (string) Str::uuid(),
                'product_id' => $product->id,
                'quantity' => $res->quantity,
                'price_at_time_cents' => $product->price_cents,
            ];
        }

        $gstData = $this->gstService->calculateFromInclusive($totalCents);

        return DB::transaction(function () use ($gstData, $orderItemsData, $reservationId, $email) {
            // Create Order
            $order = Order::create([
                'id' => (string) Str::uuid(),
                'subtotal_cents' => $gstData['subtotal_cents'],
                'gst_cents' => $gstData['gst_cents'],
                'total_cents' => $gstData['total_cents'],
                'gst_rate' => $gstData['gst_rate'],
                'invoice_number' => null, // Generated after payment
                'status' => 'pending',
                'email' => $email,
            ]);

            // Create Items
            foreach ($orderItemsData as $item) {
                $item['order_id'] = $order->id;
                OrderItem::create($item);
            }

            // Create Stripe Intent
            $paymentIntent = $this->stripeService->createPaymentIntent($order, $reservationId);

            // Record Payment
            Payment::create([
                'id' => (string) Str::uuid(),
                'order_id' => $order->id,
                'stripe_payment_intent_id' => $paymentIntent->id,
                'amount_cents' => $order->total_cents,
                'status' => 'pending',
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'order_id' => $order->id,
            ]);
        });
    }
}
