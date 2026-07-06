<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminIPWhitelist
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Only check IP whitelist for admin users
        if (!$user || !$user->is_admin) {
            return $next($request);
        }

        // Check if user has IP whitelist enabled
        $whitelistEnabled = \DB::table('ip_whitelist')
            ->where('user_id', $user->id)
            ->exists();

        // If whitelist is enabled, verify IP
        if ($whitelistEnabled) {
            $clientIP = $request->ip();

            $isWhitelisted = \DB::table('ip_whitelist')
                ->where('user_id', $user->id)
                ->where('ip_address', $clientIP)
                ->exists();

            if (!$isWhitelisted) {
                // Log the blocked attempt
                \DB::table('audit_logs')->insert([
                    'user_id' => $user->id,
                    'action' => 'ip_whitelist_blocked',
                    'ip_address' => $clientIP,
                    'user_agent' => $request->userAgent(),
                    'url' => $request->fullUrl(),
                    'created_at' => now(),
                ]);

                Auth::logout();
                return response()->json([
                    'error' => true,
                    'message' => 'Access denied. IP not whitelisted.',
                ], 403);
            }
        }

        return $next($request);
    }
}
