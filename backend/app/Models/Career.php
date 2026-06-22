<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Career extends Model
{
    use HasFactory;
    protected $fillable = [
        'title', 'slug', 'company', 'location', 'type',
        'salary', 'description', 'requirements', 'deadline', 'published',
    ];

    protected $casts = [
        'requirements' => 'array',
        'deadline' => 'date',
        'published' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (Career $career) {
            if (empty($career->slug)) {
                $career->slug = Str::slug($career->title);
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }
}
