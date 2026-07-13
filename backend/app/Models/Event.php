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

    protected static function booted(): void
    {
        // F3: Keep knowledge embeddings fresh when source content changes.
        static::saved(function (Event $event) {
            try {
                // Draft/unpublished events must not leak into the RAG corpus.
                if (!$event->published) {
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
        });

        static::deleted(function (Event $event) {
            try {
                app(\App\Services\VectorSearchService::class)
                    ->deleteEmbeddings('event', $event->id);
            } catch (\Throwable $e) {
                \Log::warning('Failed to delete event embedding: ' . $e->getMessage());
            }
        });
    }
}
