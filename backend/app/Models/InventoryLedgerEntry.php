<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class InventoryLedgerEntry extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'inventory_ledger';

    protected $fillable = [
        'sku',
        'quantity_change',
        'reason',
        'reference_id',
    ];

    protected $casts = [
        'quantity_change' => 'integer',
    ];

    public function inventory()
    {
        return $this->belongsTo(Inventory::class, 'sku', 'sku');
    }
}
