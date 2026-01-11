<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'order_id',
        'stripe_payment_intent_id',
        'amount_cents',
        'status',
    ];

    protected $casts = [
        'amount_cents' => 'integer',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
