<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'subtotal_cents',
        'gst_cents',
        'total_cents',
        'gst_rate',
        'invoice_number',
        'status',
        'email',
    ];

    protected $casts = [
        'subtotal_cents' => 'integer',
        'gst_cents' => 'integer',
        'total_cents' => 'integer',
        'gst_rate' => 'decimal:2',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
}
