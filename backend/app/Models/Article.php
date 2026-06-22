<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;
    protected $fillable = [
        'title', 'slug', 'summary', 'content', 'category',
        'date', 'author', 'image', 'read_time', 'tags', 'published',
    ];

    protected $casts = [
        'tags' => 'array',
        'date' => 'date',
        'published' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (Article $article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }
}
