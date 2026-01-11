<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'slug',
        'name',
        'description',
        'price_cents',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price_cents' => 'integer',
    ];
}
