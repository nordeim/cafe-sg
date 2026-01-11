<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'email',
        'consent_granted_at',
        'consent_source',
        'unsubscribed_at',
    ];

    protected $casts = [
        'consent_granted_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];
}
