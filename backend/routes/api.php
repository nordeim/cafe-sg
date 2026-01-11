<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HealthController;

Route::prefix('v1')->group(function () {
    Route::get('/health', [HealthController::class, 'check']);
});