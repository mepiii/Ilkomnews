<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoginAttempt;
use Illuminate\Http\Request;

class SecurityController extends Controller
{
    public function loginAttempts(Request $request)
    {
        $days = (int) $request->get('days', 7);
        $from = now()->subDays($days);

        $stats = [
            'total_attempts' => LoginAttempt::where('created_at', '>=', $from)->count(),
            'failed_attempts' => LoginAttempt::where('created_at', '>=', $from)->where('success', false)->count(),
            'successful_attempts' => LoginAttempt::where('created_at', '>=', $from)->where('success', true)->count(),
            'lockouts' => LoginAttempt::where('created_at', '>=', $from)->where('reason', 'lockout')->count(),
            'recent' => LoginAttempt::where('created_at', '>=', $from)->latest()->take(50)->get(['email', 'ip_address', 'success', 'reason', 'created_at']),
            'suspicious_ips' => LoginAttempt::selectRaw('ip_address, count(*) as failed_count')
                ->where('created_at', '>=', $from)->where('success', false)
                ->groupBy('ip_address')->having('failed_count', '>=', 3)->orderByDesc('failed_count')->get(),
        ];

        return view('admin.security.index', compact('stats'));
    }
}
