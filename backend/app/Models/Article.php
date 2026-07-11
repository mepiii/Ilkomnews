<?php

namespace App\Models;

use App\Traits\Publishable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory, Publishable;

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
        // F3: Keep knowledge embeddings fresh when source content changes.
        static::saved(function (Article $article) {
            try {
                app(\App\Services\KnowledgeIndexer::class)
                    ->indexContent('article', $article->id, $article->title ?? '', $article->content ?? '');
            } catch (\Throwable $e) {
                \Log::warning('Failed to reindex article embedding: ' . $e->getMessage());
            }
        });

        static::deleted(function (Article $article) {
            try {
                app(\App\Services\VectorSearchService::class)
                    ->deleteEmbeddings('article', $article->id);
            } catch (\Throwable $e) {
                \Log::warning('Failed to delete article embedding: ' . $e->getMessage());
            }
        });
    }
}
