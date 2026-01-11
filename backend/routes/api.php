<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StripeWebhookController;

Route::prefix('v1')->group(function () {
    Route::get('/health', [HealthController::class, 'check']);
    
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);

    Route::post('/orders/draft', [OrderController::class, 'store']);
    Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle']);
});
