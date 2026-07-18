<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoginAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SecurityController extends Controller
{
    public function index(Request $request)
    {
        $days = (int) $request->get('days', 7);
        $from = now()->subDays($days);

        $stats = Cache::remember("admin:security:stats:{$days}", 30, function () use ($from) {
            $totals = LoginAttempt::query()
                ->where('created_at', '>=', $from)
                ->selectRaw('COUNT(*) as total_attempts')
                ->selectRaw('SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed_attempts')
                ->selectRaw('SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_attempts')
                ->selectRaw("SUM(CASE WHEN reason = 'lockout' THEN 1 ELSE 0 END) as lockouts")
                ->first();

            return [
                'total_attempts' => (int) ($totals?->total_attempts ?? 0),
                'failed_attempts' => (int) ($totals?->failed_attempts ?? 0),
                'successful_attempts' => (int) ($totals?->successful_attempts ?? 0),
                'lockouts' => (int) ($totals?->lockouts ?? 0),
                'recent' => LoginAttempt::query()
                    ->where('created_at', '>=', $from)
                    ->latest()
                    ->take(50)
                    ->get(['email', 'ip_address', 'success', 'reason', 'created_at']),
                'suspicious_ips' => LoginAttempt::query()
                    ->selectRaw('ip_address, count(*) as failed_count')
                    ->where('created_at', '>=', $from)
                    ->where('success', false)
                    ->groupBy('ip_address')
                    ->having('failed_count', '>=', 3)
                    ->orderByDesc('failed_count')
                    ->get(),
            ];
        });

        return response()->json($stats);
    }
}
