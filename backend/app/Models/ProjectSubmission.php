<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProjectSubmission extends Model
{
    use HasFactory;
    protected $fillable = [
        'tracking_id', 'status', 'title', 'category', 'description',
        'thumbnail', 'tech_stack', 'live_demo', 'github_link',
        'download_link', 'figma_link', 'screenshots',
        'creator_name', 'creator_nim', 'creator_major', 'creator_year',
        'collaborators', 'rejection_reason', 'reviewed_by', 'reviewed_at',
    ];

    protected $casts = [
        'tech_stack' => 'array',
        'screenshots' => 'array',
        'collaborators' => 'array',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = ['thumbnail_url', 'screenshots_urls'];

    protected static function booted(): void
    {
        static::creating(function (ProjectSubmission $submission) {
            if (empty($submission->tracking_id)) {
                $submission->tracking_id = strtoupper(Str::random(12));
            }
        });
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

    public function scopePending($query) { return $query->where('status', 'pending'); }
    public function scopeAccepted($query) { return $query->where('status', 'accepted'); }
    public function scopeRejected($query) { return $query->where('status', 'rejected'); }
}
