<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasFactory;
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

    protected static function booted(): void
    {
        static::creating(function (Event $event) {
            if (empty($event->slug)) {
                $event->slug = Str::slug($event->title);
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->published()->where('date', '>=', now())->orderBy('date');
    }
}
