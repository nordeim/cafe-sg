<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'price_cents',
        'duration_minutes',
    ];

    public function sessions()
    {
        return $this->hasMany(EventSession::class);
    }
}
