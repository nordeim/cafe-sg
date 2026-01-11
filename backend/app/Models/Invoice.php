<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'order_id',
        'provider_transmission_id',
        'status',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function transmissions()
    {
        return $this->hasMany(InvoiceTransmission::class);
    }
}
