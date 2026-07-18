<?php

namespace App\Models;

use App\Traits\Publishable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

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

    /**
     * Flush cache on model changes.
     */
    protected static function booted(): void
    {
        static::saved(function (Event $event) {
            static::flushModelCache();

            // F3: defer the embedding call (see News model for rationale).
            $reindex = function () use ($event) {
                try {
                    if (! $event->published) {
                        app(\App\Services\VectorSearchService::class)
                            ->deleteEmbeddings('event', $event->id);
                        return;
                    }
                    $text = ($event->title ?? '') . "\n\n" . ($event->content ?? '');
                    app(\App\Services\KnowledgeIndexer::class)
                        ->indexContent('event', $event->id, $event->title ?? '', $text);
                } catch (\Throwable $e) {
                    \Log::warning('Failed to reindex event embedding: ' . $e->getMessage());
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

        static::deleted(function (Event $event) {
            static::flushModelCache();
            
            try {
                app(\App\Services\VectorSearchService::class)
                    ->deleteEmbeddings('event', $event->id);
            } catch (\Throwable $e) {
                \Log::warning('Failed to delete event embedding: ' . $e->getMessage());
            }
        });
    }

    /**
     * Flush model-related cache.
     */
    public static function flushModelCache(): void
    {
        $keys = [
            'events:upcoming',
            'events:categories',
        ];
        
        try {
            $redis = Cache::getRedis()->connection();
            foreach ($keys as $pattern) {
                $redis->del($redis->keys('*' . $pattern . '*'));
            }
        } catch (\Throwable $e) {
            Cache::forget('events:categories');
        }
    }

    public function scopeUpcoming($query)
    {
        return $query->published()->where('date', '>=', now())->orderBy('date');
    }

    /**
     * Scope for optimized listing queries.
     */
    public function scopeForListing($query)
    {
        return $query->select(['id', 'title', 'slug', 'summary', 'category', 'date', 'location', 'image', 'registered', 'capacity', 'published'])
            ->published();
    }
}
