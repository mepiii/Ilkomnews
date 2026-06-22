<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\LoginAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
{
    private const MAX_FAILED_ATTEMPTS = 5;
    private const LOCKOUT_MINUTES = 15;

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $ip = $request->ip();
        $email = $request->email;
        $lockKey = "login_lock:{$email}";

        // Check account lockout
        if (Cache::has($lockKey)) {
            $remainingMinutes = Cache::get($lockKey);
            return response()->json([
                'message' => "Account locked. Try again in {$remainingMinutes} minutes.",
                'locked' => true,
                'retry_after' => $remainingMinutes * 60,
            ], 429);
        }

        // Check rate limit (login throttling)
        $throttleKey = "login_throttle:{$email}:{$ip}";
        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_FAILED_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            Cache::put($lockKey, ceil($seconds / 60), $seconds);

            $this->logAttempt($email, $ip, false, 'lockout');

            return response()->json([
                'message' => "Too many failed attempts. Account locked for " . ceil($seconds / 60) . " minutes.",
                'locked' => true,
                'retry_after' => $seconds,
            ], 429);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            RateLimiter::hit($throttleKey, self::LOCKOUT_MINUTES * 60);

            $this->logAttempt($email, $ip, false, 'invalid_credentials');

            $attempts = RateLimiter::attempts($throttleKey);
            $remaining = self::MAX_FAILED_ATTEMPTS - $attempts;

            return response()->json([
                'message' => "Email or password incorrect. {$remaining} attempts remaining.",
                'attempts_remaining' => $remaining,
            ], 401);
        }

        // Clear rate limiter on success
        RateLimiter::clear($throttleKey);

        $user = Auth::user();

        if (!$user->is_admin) {
            Auth::logout();
            $this->logAttempt($email, $ip, false, 'not_admin');
            return response()->json(['message' => 'Access denied'], 403);
        }

        // Regenerate session if available (session rotation)
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        // Delete old tokens for this user (session rotation)
        $user->tokens()->where('name', 'admin-token')->delete();

        $token = $user->createToken('admin-token')->plainTextToken;

        $this->logAttempt($email, $ip, true, 'success');

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'logout',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    private function logAttempt(string $email, string $ip, bool $success, string $reason): void
    {
        LoginAttempt::create([
            'email' => $email,
            'ip_address' => $ip,
            'success' => $success,
            'reason' => $reason,
            'user_agent' => request()->userAgent(),
        ]);
    }
}
