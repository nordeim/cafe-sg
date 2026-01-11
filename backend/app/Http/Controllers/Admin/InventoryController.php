<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\InventoryLedgerEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InventoryController extends Controller
{
    public function update(string $sku, Request $request): JsonResponse
    {
        $request->validate([
            'quantity_change' => 'required|integer',
            'reason' => 'required|string',
        ]);

        return DB::transaction(function () use ($sku, $request) {
            $inventory = Inventory::where('sku', $sku)->lockForUpdate()->firstOrFail();
            
            $change = $request->input('quantity_change');
            $inventory->stock_count += $change;
            $inventory->save();

            InventoryLedgerEntry::create([
                'id' => (string) Str::uuid(),
                'sku' => $sku,
                'quantity_change' => $change,
                'reason' => $request->input('reason'),
                'reference_id' => $request->user()->id,
            ]);

            return response()->json($inventory);
        });
    }
}
