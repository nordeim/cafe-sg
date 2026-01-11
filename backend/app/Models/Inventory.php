<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventory';
    protected $primaryKey = 'sku';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'sku',
        'stock_count',
        'reserved_count',
    ];

    protected $casts = [
        'stock_count' => 'integer',
        'reserved_count' => 'integer',
    ];
}
