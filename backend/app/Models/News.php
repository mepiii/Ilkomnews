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

    protected $appends = ['image_url', 'author_image_url', 'status'];

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

    public function getStatusAttribute(): string
    {
        return $this->published ? 'published' : 'draft';
    }

    public function incrementViews(): void
    {
        $this->increment('views');
    }

    protected static function booted(): void
    {
        // F3: Keep knowledge embeddings fresh when source content changes.
        // Embedding generation may be unavailable (no provider configured);
        // guard against exceptions so saves/deletes never throw a 500.
        static::saved(function (News $news) {
            try {
                if (!$news->published) {
                    app(\App\Services\VectorSearchService::class)
                        ->deleteEmbeddings('news', $news->id);
                    return;
                }
                app(\App\Services\KnowledgeIndexer::class)
                    ->indexContent('news', $news->id, $news->title ?? '', $news->content ?? '');
            } catch (\Throwable $e) {
                \Log::warning('Failed to reindex news embedding: ' . $e->getMessage());
            }
        });

        static::deleted(function (News $news) {
            try {
                app(\App\Services\VectorSearchService::class)
                    ->deleteEmbeddings('news', $news->id);
            } catch (\Throwable $e) {
                \Log::warning('Failed to delete news embedding: ' . $e->getMessage());
            }
        });
    }
}
