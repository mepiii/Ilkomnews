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
        'date', 'author', 'image', 'views', 'tags', 'published',
    ];

    protected $casts = [
        'tags' => 'array',
        'views' => 'integer',
        'date' => 'date',
        'published' => 'boolean',
    ];

    protected $appends = ['image_url'];

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
