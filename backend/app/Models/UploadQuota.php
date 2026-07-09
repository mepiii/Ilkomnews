<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UploadQuota extends Model
{
    protected $fillable = [
        'ip_address',
        'user_id',
        'date',
        'bytes_used',
    ];

    protected $casts = [
        'date' => 'date',
        'bytes_used' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getRemainingBytesAttribute(): int
    {
        $limit = 5 * 1024 * 1024; // 5MB
        return max(0, $limit - $this->bytes_used);
    }

    public function getIsExceededAttribute(): bool
    {
        return $this->bytes_used >= 5 * 1024 * 1024;
    }
}
