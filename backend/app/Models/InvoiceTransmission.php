<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class InvoiceTransmission extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'invoice_id',
        'attempt_at',
        'response_payload',
        'success',
    ];

    protected $casts = [
        'attempt_at' => 'datetime',
        'response_payload' => 'array',
        'success' => 'boolean',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
