<?php

namespace App\Models;

use App\Traits\Publishable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class News extends Model
{
    use HasFactory, Publishable;

    protected $fillable = [
        'title', 'slug', 'summary', 'content', 'category',
        'date', 'author', 'author_image', 'author_institution', 'author_position',
        'image', 'views', 'tags', 'published', 'expires_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'views' => 'integer',
        'date' => 'date',
        'published' => 'boolean',
        'expires_at' => 'datetime',
    ];

    protected $appends = ['image_url', 'author_image_url', 'status'];

    /**
     * The relationships that should be eager loaded by default.
     */
    protected $with = [];

    /**
     * Flush cache on model changes.
     */
    protected static function booted(): void
    {
        static::saved(function (News $news) {
            static::flushModelCache();

            // F3: defer the embedding call so the request isn't blocked on
            // the Gemini network round-trip. Runs after the response is
            // flushed, same PHP process — no queue worker needed.
            $reindex = function () use ($news) {
                try {
                    if (! $news->published) {
                        app(\App\Services\VectorSearchService::class)
                            ->deleteEmbeddings('news', $news->id);
                        return;
                    }
                    app(\App\Services\KnowledgeIndexer::class)
                        ->indexContent('news', $news->id, $news->title ?? '', $news->content ?? '');
                } catch (\Throwable $e) {
                    \Log::warning('Failed to reindex news embedding: ' . $e->getMessage());
                }
            };
            // Defer embedding via terminating callback (see ProjectSubmission
            // for rationale). Falls back to inline in console/tinker.
            if (app()->runningInConsole() === false) {
                app()->terminating($reindex);
            } else {
                $reindex();
            }
        });

        static::deleted(function (News $news) {
            static::flushModelCache();
            
            try {
                app(\App\Services\VectorSearchService::class)
                    ->deleteEmbeddings('news', $news->id);
            } catch (\Throwable $e) {
                \Log::warning('Failed to delete news embedding: ' . $e->getMessage());
            }
        });
    }

    /**
     * Flush model-related cache.
     */
    public static function flushModelCache(): void
    {
        Cache::forget('admin:news:stats');
        Cache::forget('admin:dashboard:stats');

        $keys = [
            'news:latest:*',
            'news:categories',
            'news:stats',
        ];
        
        // Use pattern-based cache clearing for Redis
        try {
            $redis = Cache::getRedis()->connection();
            foreach ($keys as $pattern) {
                $redis->del($redis->keys('*' . $pattern . '*'));
            }
        } catch (\Throwable $e) {
            // Fallback to forgetting specific keys
            Cache::forget('news:categories');
        }
    }

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

    /**
     * Increment views with cache-friendly approach.
     */
    public function incrementViews(): void
    {
        // Use raw increment to avoid model overhead
        static::where('id', $this->id)->increment('views');
    }

    /**
     * Scope for non-expired news.
     */
    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
        });
    }

    /**
     * Scope for optimized listing queries.
     */
    public function scopeForListing($query)
    {
        return $query->select(['id', 'title', 'slug', 'summary', 'category', 'date', 'author', 'image', 'views', 'published'])
            ->published()
            ->notExpired();
    }
}
