<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\InventoryReservation;
use App\Models\InventoryLedgerEntry;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Exception;

class InventoryService
{
    /**
     * Create a reservation for multiple items.
     *
     * @param array $items Array of ['sku' => string, 'quantity' => int]
     * @param int $ttlSeconds Time to live in seconds
     * @return array Result with reservation_group_id and expires_at
     * @throws Exception
     */
    public function reserve(array $items, int $ttlSeconds = 900): array
    {
        return DB::transaction(function () use ($items, $ttlSeconds) {
            $groupId = (string) Str::uuid();
            $expiresAt = Carbon::now()->addSeconds($ttlSeconds);

            foreach ($items as $item) {
                $sku = $item['sku'];
                $quantity = $item['quantity'];

                $inventory = Inventory::where('sku', $sku)->lockForUpdate()->first();

                if (!$inventory) {
                    // Create if not exists (for prototype ease)
                    $inventory = Inventory::create(['sku' => $sku, 'stock_count' => 100, 'reserved_count' => 0]);
                }

                $available = $inventory->stock_count - $inventory->reserved_count;

                if ($available < $quantity) {
                    throw new Exception("Insufficient stock for SKU: {$sku}");
                }

                $inventory->reserved_count += $quantity;
                $inventory->save();

                $reservationId = (string) Str::uuid();

                InventoryReservation::create([
                    'id' => $reservationId,
                    'reservation_group_id' => $groupId,
                    'sku' => $sku,
                    'quantity' => $quantity,
                    'expires_at' => $expiresAt,
                    'status' => 'active',
                ]);

                InventoryLedgerEntry::create([
                    'sku' => $sku,
                    'quantity_change' => $quantity, 
                    'reason' => 'reservation_created',
                    'reference_id' => $reservationId,
                ]);
            }

            return [
                'reservation_id' => $groupId, // Returning group ID as the main "reservation ID"
                'expires_at' => $expiresAt->toIso8601String(),
            ];
        });
    }

    public function confirm(string $groupId): void
    {
        DB::transaction(function () use ($groupId) {
            $reservations = InventoryReservation::where('reservation_group_id', $groupId)
                ->where('status', 'active')
                ->lockForUpdate()
                ->get();

            if ($reservations->isEmpty()) {
                // Idempotency: Maybe already confirmed?
                return;
            }

            foreach ($reservations as $reservation) {
                $inventory = Inventory::where('sku', $reservation->sku)->lockForUpdate()->first();
                
                // Confirm: Deduct stock, deduct reserved.
                $inventory->stock_count -= $reservation->quantity;
                $inventory->reserved_count -= $reservation->quantity;
                $inventory->save();

                $reservation->status = 'committed';
                $reservation->save();

                InventoryLedgerEntry::create([
                    'sku' => $reservation->sku,
                    'quantity_change' => -$reservation->quantity,
                    'reason' => 'reservation_confirmed',
                    'reference_id' => $reservation->id,
                ]);
            }
        });
    }

    public function release(string $groupId): void
    {
        DB::transaction(function () use ($groupId) {
            $reservations = InventoryReservation::where('reservation_group_id', $groupId)
                ->where('status', 'active')
                ->lockForUpdate()
                ->get();

            foreach ($reservations as $reservation) {
                $inventory = Inventory::where('sku', $reservation->sku)->lockForUpdate()->first();
                
                // Release: Deduct reserved only.
                $inventory->reserved_count -= $reservation->quantity;
                $inventory->save();

                $reservation->status = 'expired'; // or cancelled
                $reservation->save();

                InventoryLedgerEntry::create([
                    'sku' => $reservation->sku,
                    'quantity_change' => -$reservation->quantity, // Negative reservation change? 
                    // Actually ledger usually tracks stock. 
                    // Let's say ledger tracks "Reserved Stock" change? Or "Physical Stock"?
                    // If physical, reservation doesn't change it.
                    // If ledger tracks ALL changes, we should be specific.
                    // Let's assume ledger is for audit.
                    'quantity_change' => -$reservation->quantity, 
                    'reason' => 'reservation_released',
                    'reference_id' => $reservation->id,
                ]);
            }
        });
    }
}