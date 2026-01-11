<?php

namespace App\Services;

use App\Models\EventSession;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;
use Exception;

class CapacityService
{
    public function reserve(string $sessionId, string $email, int $quantity): Booking
    {
        return DB::transaction(function () use ($sessionId, $email, $quantity) {
            $session = EventSession::where('id', $sessionId)->lockForUpdate()->firstOrFail();

            if (($session->capacity - $session->booked_count) < $quantity) {
                throw new Exception("Insufficient capacity for this session.");
            }

            $session->booked_count += $quantity;
            $session->save();

            return Booking::create([
                'session_id' => $sessionId,
                'user_email' => $email,
                'quantity' => $quantity,
                'status' => 'confirmed',
            ]);
        });
    }
}
