<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class News extends Model
{
    use HasFactory;
    protected $fillable = [
        'title', 'slug', 'summary', 'content', 'category',
        'date', 'author', 'image', 'views', 'tags', 'published',
    ];

    protected $casts = [
        'tags' => 'array',
        'views' => 'integer',
        'date' => 'date',
        'published' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (News $news) {
            if (empty($news->slug)) {
                $news->slug = Str::slug($news->title);
            }
        });
    }

    public function incrementViews(): void
    {
        $this->increment('views');
    }

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }
}
