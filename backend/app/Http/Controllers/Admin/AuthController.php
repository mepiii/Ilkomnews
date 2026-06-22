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
            return back()->withErrors([
                'email' => "Account locked. Try again in {$remainingMinutes} minutes."
            ])->withInput($request->only('email'));
        }

        // Check rate limit (login throttling)
        $throttleKey = "login_throttle:{$email}:{$ip}";
        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_FAILED_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            Cache::put($lockKey, ceil($seconds / 60), $seconds);

            $this->logAttempt($email, $ip, false, 'lockout');

            return back()->withErrors([
                'email' => "Too many failed attempts. Account locked for " . ceil($seconds / 60) . " minutes."
            ])->withInput($request->only('email'));
        }

        if (!Auth::attempt($request->only('email', 'password'), $request->filled('remember'))) {
            RateLimiter::hit($throttleKey, self::LOCKOUT_MINUTES * 60);

            $this->logAttempt($email, $ip, false, 'invalid_credentials');

            $attempts = RateLimiter::attempts($throttleKey);
            $remaining = self::MAX_FAILED_ATTEMPTS - $attempts;

            return back()->withErrors([
                'email' => "Email or password incorrect. {$remaining} attempts remaining."
            ])->withInput($request->only('email'));
        }

        // Clear rate limiter on success
        RateLimiter::clear($throttleKey);

        $user = Auth::user();

        if (!$user->is_admin) {
            Auth::logout();
            $this->logAttempt($email, $ip, false, 'not_admin');
            return back()->withErrors([
                'email' => 'Access denied. Admin privileges required.'
            ])->withInput($request->only('email'));
        }

        // Regenerate session (session fixation prevention)
        $request->session()->regenerate();

        $this->logAttempt($email, $ip, true, 'success');

        return redirect()->route('admin.dashboard')->with('success', 'Welcome back, ' . $user->name . '!');
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
