<?php

namespace App\Models;

use App\Traits\Publishable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory, Publishable;

    protected $fillable = [
        'title', 'slug', 'summary', 'content', 'category',
        'date', 'location', 'image', 'registered', 'capacity',
        'duration', 'price', 'published',
    ];

    protected $casts = [
        'registered' => 'integer',
        'capacity' => 'integer',
        'date' => 'date',
        'published' => 'boolean',
    ];

    public function scopeUpcoming($query)
    {
        return $query->published()->where('date', '>=', now())->orderBy('date');
    }
}
