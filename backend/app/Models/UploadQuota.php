<?php

namespace App\Models;

use App\Services\UploadQuotaService;
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
        // ponytail: single source of truth lives in UploadQuotaService::DAILY_LIMIT_BYTES
        return max(0, UploadQuotaService::DAILY_LIMIT_BYTES - $this->bytes_used);
    }

    public function getIsExceededAttribute(): bool
    {
        return $this->bytes_used >= UploadQuotaService::DAILY_LIMIT_BYTES;
    }
}
