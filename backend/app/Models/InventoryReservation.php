<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class InventoryReservation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'sku',
        'quantity',
        'expires_at',
        'status',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'expires_at' => 'datetime',
    ];

    public function inventory()
    {
        return $this->belongsTo(Inventory::class, 'sku', 'sku');
    }
}
