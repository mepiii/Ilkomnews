<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class ProjectSubmission extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'tracking_id', 'status', 'title', 'category', 'description',
        'thumbnail', 'tech_stack', 'live_demo', 'github_link',
        'download_link', 'figma_link', 'screenshots',
        'creator_name', 'creator_type', 'creator_nim', 'creator_nidn', 'creator_jabatan', 'creator_major', 'creator_year',
        'creator_avatar', 'collaborators', 'rejection_reason', 'reviewed_by', 'reviewed_at',
    ];

    protected $casts = [
        'tech_stack' => 'array',
        'screenshots' => 'array',
        'collaborators' => 'array',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = ['thumbnail_url', 'screenshots_urls', 'creator_avatar_url'];

    protected static function booted(): void
    {
        static::creating(function (ProjectSubmission $submission) {
            if (empty($submission->tracking_id)) {
                $submission->tracking_id = strtoupper(Str::random(12));
            }
        });

        // F3: Keep knowledge embeddings fresh when source content changes.
        // Only accepted/pending submissions are indexed; non-indexed ones have
        // their embeddings removed.
        static::saved(function (ProjectSubmission $submission) {
            try {
                if (!in_array($submission->status, ['accepted', 'pending'], true)) {
                    app(\App\Services\VectorSearchService::class)
                        ->deleteEmbeddings('project', $submission->id);
                    return;
                }

                $text = ($submission->title ?? '') . "\n\n"
                    . ($submission->description ?? '') . "\n\nTech: "
                    . implode(', ', $submission->tech_stack ?? []);

                app(\App\Services\KnowledgeIndexer::class)
                    ->indexContent('project', $submission->id, $submission->title ?? '', $text);
            } catch (\Throwable $e) {
                \Log::warning('Failed to reindex project submission embedding: ' . $e->getMessage());
            }
        });

        static::deleted(function (ProjectSubmission $submission) {
            try {
                app(\App\Services\VectorSearchService::class)
                    ->deleteEmbeddings('project', $submission->id);
            } catch (\Throwable $e) {
                \Log::warning('Failed to delete project submission embedding: ' . $e->getMessage());
            }
        });
    }

    public function getCreatorAvatarUrlAttribute(): ?string
    {
        if (!$this->creator_avatar) return null;
        if (filter_var($this->creator_avatar, FILTER_VALIDATE_URL)) {
            return $this->creator_avatar;
        }
        return asset('storage/' . $this->creator_avatar);
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail) return null;
        // If thumbnail is already a URL, return as-is
        if (filter_var($this->thumbnail, FILTER_VALIDATE_URL)) {
            return $this->thumbnail;
        }
        // Otherwise treat as file path
        return asset('storage/' . $this->thumbnail);
    }

    public function getScreenshotsUrlsAttribute(): array
    {
        if (!$this->screenshots) return [];
        return array_map(fn($path) => asset('storage/' . $path), $this->screenshots);
    }

    public function getCollaboratorsAttribute($value): array
    {
        $collabs = is_array($value) ? $value : (json_decode($value, true) ?: []);
        return array_map(function ($c) {
            if (is_array($c) && !empty($c['avatar']) && is_string($c['avatar']) && !filter_var($c['avatar'], FILTER_VALIDATE_URL)) {
                $c['avatar'] = asset('storage/' . $c['avatar']);
            }
            return $c;
        }, $collabs);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'project_id');
    }

    public function scopePending($query) { return $query->where('status', 'pending'); }
    public function scopeAccepted($query) { return $query->where('status', 'accepted'); }
    public function scopeRejected($query) { return $query->where('status', 'rejected'); }
}
