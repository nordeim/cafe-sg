<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\InventoryReservation;
use App\Services\InventoryService;
use Carbon\Carbon;

class PruneReservations extends Command
{
    protected $signature = 'reservations:prune';
    protected $description = 'Release expired inventory reservations';

    public function handle(InventoryService $inventoryService): void
    {
        $expiredGroups = InventoryReservation::where('status', 'active')
            ->where('expires_at', '<', Carbon::now())
            ->select('reservation_group_id')
            ->distinct()
            ->pluck('reservation_group_id');

        foreach ($expiredGroups as $groupId) {
            if ($groupId) {
                $this->info("Releasing group: $groupId");
                $inventoryService->release($groupId);
            }
        }
    }
}