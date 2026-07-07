<?php

namespace App\Models;

use App\Traits\Publishable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory, Publishable;

    protected $fillable = [
        'title', 'slug', 'summary', 'content', 'category',
        'date', 'author', 'author_image', 'author_institution', 'author_position',
        'image', 'views', 'tags', 'published',
    ];

    protected $casts = [
        'tags' => 'array',
        'views' => 'integer',
        'date' => 'date',
        'published' => 'boolean',
    ];

    protected $appends = ['image_url', 'author_image_url'];

    public function getAuthorImageUrlAttribute(): ?string
    {
        if (!$this->author_image) return null;
        if (filter_var($this->author_image, FILTER_VALIDATE_URL)) {
            return $this->author_image;
        }
        return asset('storage/' . $this->author_image);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) return null;
        if (filter_var($this->image, FILTER_VALIDATE_URL)) {
            return $this->image;
        }
        return asset('storage/' . $this->image);
    }

    public function incrementViews(): void
    {
        $this->increment('views');
    }
}
