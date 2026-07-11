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

    public function showLoginForm()
    {
        return view('admin.login');
    }

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
            return $this->loginError($request, $email, "Account locked. Try again in {$remainingMinutes} minutes.");
        }

        // Check rate limit (login throttling)
        $throttleKey = "login_throttle:{$email}:{$ip}";
        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_FAILED_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            Cache::put($lockKey, ceil($seconds / 60), $seconds);

            $this->logAttempt($email, $ip, false, 'lockout');

            return $this->loginError($request, $email, "Too many failed attempts. Account locked for " . ceil($seconds / 60) . " minutes.");
        }

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            RateLimiter::hit($throttleKey, self::LOCKOUT_MINUTES * 60);

            $this->logAttempt($email, $ip, false, 'invalid_credentials');

            $attempts = RateLimiter::attempts($throttleKey);
            $remaining = self::MAX_FAILED_ATTEMPTS - $attempts;

            return $this->loginError($request, $email, "Email or password incorrect. {$remaining} attempts remaining.");
        }

        // Clear rate limiter on success
        RateLimiter::clear($throttleKey);

        $user = Auth::user();

        if (!$user->is_admin) {
            Auth::logout();
            $this->logAttempt($email, $ip, false, 'not_admin');
            return $this->loginError($request, $email, 'Access denied. Admin privileges required.');
        }

        // Regenerate session (session fixation prevention)
        $request->session()->regenerate();

        $this->logAttempt($email, $ip, true, 'success');

        // SPA JSON response (no token — relies on httpOnly session cookie)
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'user' => $user->only('id', 'name', 'email', 'is_admin'),
            ]);
        }

        return redirect()->route('admin.dashboard')->with('success', 'Welcome back, ' . $user->name . '!');
    }

    private function loginError(Request $request, string $email, string $message)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['message' => $message], 422);
        }

        return back()->withErrors(['email' => $message])->withInput($request->only('email'));
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'logout',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Logged out']);
        }

        return redirect()->route('admin.login')->with('status', 'You have been logged out successfully.');
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
