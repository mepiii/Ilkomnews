<?php

namespace App\Services;

use App\Models\UploadQuota;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class UploadQuotaService
{
    const DAILY_LIMIT_BYTES = 5 * 1024 * 1024; // 5MB

    public function check(Request $request, int $bytesToAdd): array
    {
        $quota = $this->getOrCreate($request);

        return [
            'allowed' => ($quota->bytes_used + $bytesToAdd) <= self::DAILY_LIMIT_BYTES,
            'bytes_used' => $quota->bytes_used,
            'remaining' => $quota->remaining_bytes,
            'limit' => self::DAILY_LIMIT_BYTES,
        ];
    }

    public function recordUsage(Request $request, int $bytes): void
    {
        $quota = $this->getOrCreate($request);
        $quota->increment('bytes_used', $bytes);
    }

    public function getStatus(Request $request): array
    {
        $quota = $this->getOrCreate($request);

        return [
            'bytes_used' => $quota->bytes_used,
            'remaining' => $quota->remaining_bytes,
            'limit' => self::DAILY_LIMIT_BYTES,
            'is_exceeded' => $quota->is_exceeded,
        ];
    }

    private function getOrCreate(Request $request): UploadQuota
    {
        $ip = $request->ip();
        $userId = $request->user()?->id;
        $today = Carbon::today()->toDateString();

        return UploadQuota::firstOrCreate(
            [
                'ip_address' => $ip,
                'date' => $today,
            ],
            [
                'user_id' => $userId,
                'bytes_used' => 0,
            ]
        );
    }
}
