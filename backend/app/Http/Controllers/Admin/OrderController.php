<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::with('items.product', 'payments', 'invoice.transmissions')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($orders);
    }

    public function show(string $id): JsonResponse
    {
        $order = Order::with('items.product', 'payments', 'invoice.transmissions')
            ->findOrFail($id);

        return response()->json($order);
    }
}
