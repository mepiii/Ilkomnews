# Laravel Project Comprehensive Map
## ILKOM Backend Project

**Project Path:** `/home/pina/AETHER/ENGINEERING/projects/ILKOM/backend`

---

## 1. Admin Controllers Directory Structure

**Path:** `app/Http/Controllers/Admin/`

### Files Listed:
```
AuditLogController.php       (1.4K)
AuthController.php           (3.8K)
ChatStatsController.php      (1.4K)
DashboardController.php      (1.1K)
GalleryController.php        (5.1K)
HealthController.php         (1.7K)
NewsController.php           (6.2K)
NotificationController.php   (1.4K)
SecurityController.php       (1.3K)
```

---

## 2. Main Controllers Directory Structure

**Path:** `app/Http/Controllers/`

### Files Listed:
```
Admin/                       (directory)
Auth/                        (directory)
AdminController.php          (2.3K)
ArticleController.php        (460B)
BasePublishableController.php (2.8K)
CareerController.php         (1.1K)
ChatController.php           (21.2K)
Controller.php               (77B)
EventController.php          (323B)
NewsController.php           (764B)
ProfileController.php        (1.4K) ⭐
ProjectSubmissionController.php (3.1K)
UploadController.php         (2.8K)
```

---

## 3. Route Files

**Path:** `routes/`

### Files Listed:
```
api.php                      (4.9K)
auth.php                     (2.3K)
console.php                  (210B)
web.php                      (2.4K)  ⭐
```

---

## 4. Admin Blade Views Structure

**Path:** `resources/views/admin/`

### Subdirectories:
```
audit/
berita/
chat/
gallery/
news/
projects/
security/    ⭐
```

### Root Admin Files:
```
dashboard.blade.php          (15.8K)
layout.blade.php             (13.4K)
login.blade.php              (8.5K)   ⭐
```

---

## 5. Security Views

**Path:** `resources/views/admin/security/`

### Files:
```
index.blade.php              (10.1K)  ⭐
```

---

## 6. Profile Views

**Path:** `resources/views/admin/profile/`

### Status: Directory does not exist

**Alternative Profile Views:**
```
resources/views/profile/
  - edit.blade.php (likely exists, referenced in ProfileController)
  - partials/
```

---

## 7. Auth Views

**Path:** `resources/views/auth/`

### Files:
```
confirm-password.blade.php   (886B)
forgot-password.blade.php    (981B)
login.blade.php              (1.9K)
register.blade.php           (2.1K)
reset-password.blade.php     (1.6K)
verify-email.blade.php       (1.2K)
```

---

## 📄 FULL FILE CONTENTS

### SecurityController.php
**Location:** `app/Http/Controllers/Admin/SecurityController.php`

```php
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
```

**Key Features:**
- Analyzes login attempts over configurable days (default: 7)
- Tracks total, successful, and failed attempts
- Identifies lockouts
- Detects suspicious IPs (3+ failed attempts)
- Returns recent 50 login attempts with email, IP, status, reason, and timestamp

---

### ProfileController.php
**Location:** `app/Http/Controllers/ProfileController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): View
    {
        return view('profile.edit', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
```

**Key Features:**
- Edit profile form display
- Profile information update with email verification reset
- Account deletion with password confirmation
- Session invalidation and token regeneration on delete

---

### routes/web.php
**Location:** `routes/web.php`

```php
<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// ── Admin Login (guest) ──
Route::get('/admin/login', [Admin\AuthController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [Admin\AuthController::class, 'login'])->name('admin.login.submit');

// ── Admin (auth required) ──
Route::name('admin.')->prefix('admin')->middleware(['auth', 'admin'])->group(function () {

    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

    // News — single route set, Indonesian path, Blade-compatible names
    Route::name('news.')->prefix('berita')->group(function () {
        Route::get('/', [Admin\NewsController::class, 'index'])->name('index');
        Route::get('/create', [Admin\NewsController::class, 'create'])->name('create');
        Route::post('/', [Admin\NewsController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [Admin\NewsController::class, 'edit'])->name('edit');
        Route::put('/{id}', [Admin\NewsController::class, 'update'])->name('update');
        Route::delete('/{id}', [Admin\NewsController::class, 'destroy'])->name('destroy');
    });

    // Projects — single route set
    Route::name('projects.')->prefix('projects')->group(function () {
        Route::get('/', [Admin\GalleryController::class, 'index'])->name('index');
        Route::get('/{id}', [Admin\GalleryController::class, 'show'])->name('show');
        Route::post('/{id}/accept', [Admin\GalleryController::class, 'accept'])->name('accept');
        Route::post('/{id}/reject', [Admin\GalleryController::class, 'reject'])->name('reject');
    });

    // System
    Route::get('/security', [Admin\SecurityController::class, 'index'])->name('security');
    Route::get('/chat-stats', [Admin\ChatStatsController::class, 'index'])->name('chat-stats');
    Route::get('/audit-logs', [Admin\AuditLogController::class, 'index'])->name('audit-logs');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Logout
    Route::post('/logout', [Admin\AuthController::class, 'logout'])->name('logout');
});

require __DIR__.'/auth.php';
```

**Key Route Structure:**
- **Guest Routes:** Admin login endpoints
- **Protected Routes:** All admin routes require auth + admin middleware
- **Nested Groups:** News (berita), Projects, Security, Profile
- **RESTful News Routes:** Full CRUD with Indonesian prefix
- **Project Management:** Accept/reject submissions
- **System Routes:** Security, chat stats, audit logs
- **Profile Routes:** Edit, update, destroy
- **Auth Routes:** Imported from auth.php (register, password reset, email verification)

---

### resources/views/admin/login.blade.php
**Location:** `resources/views/admin/login.blade.php`

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Admin Login - {{ config('app.name') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="h-full bg-black text-gray-100 antialiased">
    <div class="min-h-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-md space-y-8">
            <!-- Logo and Title -->
            <div class="text-center">
                <img src="{{ asset('BEM.png') }}" alt="BEM FASILKOM" class="mx-auto h-16 w-16 object-contain">
                <h2 class="mt-6 text-3xl font-bold text-white">Admin Login</h2>
                <p class="mt-2 text-sm text-gray-400">Sign in to access the admin panel</p>
            </div>

            <!-- Login Form -->
            <div class="mt-8 bg-[#050505] border border-purple-900/20 rounded-xl shadow-xl shadow-purple-500/5 p-8">
                <!-- Session Status -->
                @if (session('status'))
                <div class="mb-6 p-4 rounded-lg bg-green-600/20 border border-green-600/30 text-green-400">
                    <div class="flex items-center gap-3">
                        <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <p class="text-sm">{{ session('status') }}</p>
                    </div>
                </div>
                @endif

                <!-- Error Messages -->
                @if ($errors->any())
                <div class="mb-6 p-4 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                        </svg>
                        <div class="flex-1">
                            <p class="font-medium text-sm">{{ $errors->first() }}</p>
                        </div>
                    </div>
                </div>
                @endif

                <form method="POST" action="{{ route('admin.login.submit') }}" class="space-y-6">
                    @csrf

                    <!-- Email Address -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            value="{{ old('email') }}"
                            class="w-full px-4 py-3 bg-black border border-purple-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                            placeholder="admin@fasilkom.ui.ac.id"
                        >
                        @error('email')
                            <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Password -->
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            class="w-full px-4 py-3 bg-black border border-purple-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        >
                        @error('password')
                            <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Remember Me -->
                    <div class="flex items-center">
                        <input
                            id="remember"
                            name="remember"
                            type="checkbox"
                            class="w-4 h-4 bg-black border-purple-900/30 rounded text-purple-600 focus:ring-purple-600 focus:ring-offset-black focus:ring-offset-2"
                        >
                        <label for="remember" class="ml-3 text-sm text-gray-400">
                            Remember me for 30 days
                        </label>
                    </div>

                    <!-- Submit Button -->
                    <div>
                        <button
                            type="submit"
                            class="w-full flex justify-center items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-black"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                            </svg>
                            Sign In
                        </button>
                    </div>
                </form>

                <!-- Footer Links -->
                <div class="mt-6 pt-6 border-t border-purple-900/20">
                    <div class="text-center">
                        <a href="{{ route('password.request') }}" class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                            Forgot your password?
                        </a>
                    </div>
                </div>
            </div>

            <!-- Security Notice -->
            <div class="mt-6 p-4 rounded-lg bg-yellow-600/10 border border-yellow-600/20">
                <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <div class="flex-1 text-sm text-yellow-400">
                        <p class="font-medium">Security Notice</p>
                        <p class="mt-1 text-yellow-400/80">This is a restricted area. Only authorized administrators can access this panel. All login attempts are logged and monitored.</p>
                    </div>
                </div>
            </div>

            <!-- Back to Site -->
            <div class="text-center">
                <a href="/" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Back to main site
                </a>
            </div>
        </div>
    </div>
</body>
</html>
```

**Design Features:**
- Dark theme (black background with purple accents)
- BEM FASILKOM logo
- Form inputs with purple focus rings
- Status & error message display
- Remember me checkbox
- Password reset link
- Security warning notice
- Responsive layout (mobile-friendly)
- SVG icons for visual elements
- TailwindCSS styling

---

### resources/views/admin/security/index.blade.php
**Location:** `resources/views/admin/security/index.blade.php`

```blade
@extends('admin.layout')

@section('title', 'Security Center')
@section('header', 'Security Center')

@section('content')
<div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Attempts -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-purple-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-400">Total Attempts</p>
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <p class="text-3xl font-bold text-white">{{ $stats['total_attempts'] ?? 0 }}</p>
            </div>
        </div>

        <!-- Failed Attempts -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-red-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-400">Failed Attempts</p>
                    <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </div>
                <p class="text-3xl font-bold text-white">{{ $stats['failed_attempts'] ?? 0 }}</p>
            </div>
        </div>

        <!-- Successful Attempts -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-400">Successful Logins</p>
                    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <p class="text-3xl font-bold text-white">{{ $stats['successful_attempts'] ?? 0 }}</p>
            </div>
        </div>

        <!-- Lockouts -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-orange-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-400">Lockouts</p>
                    <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
                <p class="text-3xl font-bold text-white">{{ $stats['lockouts'] ?? 0 }}</p>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
        <form method="GET" action="{{ route('admin.security') }}" class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-400 mb-2">Time Range</label>
                <select name="days" class="w-full bg-black/50 border border-purple-900/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option value="7" {{ request('days', 7) == 7 ? 'selected' : '' }}>Last 7 days</option>
                    <option value="30" {{ request('days') == 30 ? 'selected' : '' }}>Last 30 days</option>
                    <option value="90" {{ request('days') == 90 ? 'selected' : '' }}>Last 90 days</option>
                </select>
            </div>

            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select name="success" class="w-full bg-black/50 border border-purple-900/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option value="">All</option>
                    <option value="1" {{ request('success') === '1' ? 'selected' : '' }}>Success</option>
                    <option value="0" {{ request('success') === '0' ? 'selected' : '' }}>Failed</option>
                </select>
            </div>

            <div class="flex items-end">
                <button type="submit" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                    Apply Filters
                </button>
            </div>
        </form>
    </div>

    <!-- Suspicious IPs -->
    @if(isset($stats['suspicious_ips']) && count($stats['suspicious_ips']) > 0)
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-4">
            <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h3 class="text-lg font-bold text-white">Suspicious IP Addresses</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-purple-900/30">
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">IP Address</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Failed Attempts</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($stats['suspicious_ips'] as $ip)
                    <tr class="border-b border-purple-900/20 hover:bg-purple-600/5 transition-colors">
                        <td class="py-3 px-4 text-white font-mono">{{ $ip->ip_address }}</td>
                        <td class="py-3 px-4 text-white">{{ $ip->failed_count }}</td>
                        <td class="py-3 px-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600/20 text-red-400">
                                High Risk
                            </span>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
    @endif

    <!-- Recent Login Attempts -->
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">Recent Login Attempts</h3>

        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-purple-900/30">
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Email</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">IP Address</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Reason</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Time</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($stats['recent'] ?? [] as $attempt)
                    <tr class="border-b border-purple-900/20 hover:bg-purple-600/5 transition-colors">
                        <td class="py-3 px-4 text-white">{{ $attempt->email }}</td>
                        <td class="py-3 px-4 text-gray-300 font-mono">{{ $attempt->ip_address }}</td>
                        <td class="py-3 px-4">
                            @if($attempt->success)
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/20 text-green-400">
                                    Success
                                </span>
                            @else
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600/20 text-red-400">
                                    Failed
                                </span>
                            @endif
                        </td>
                        <td class="py-3 px-4 text-gray-300">{{ $attempt->reason ?? '-' }}</td>
                        <td class="py-3 px-4 text-gray-400">{{ $attempt->created_at->diffForHumans() }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="py-8 text-center text-gray-400">
                            No login attempts found
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
```

**Layout & Features:**
- Extends admin.layout with Security Center title
- 4-column stats cards (total, failed, successful, lockouts)
- Time range filter (7/30/90 days)
- Status filter (all/success/failed)
- Suspicious IPs table (3+ failures detected)
- Recent login attempts table with email, IP, status, reason, timestamp
- Responsive grid layout
- Dark theme with purple accents
- Color-coded status badges (green/red)
- Empty state message

---

## 📊 Additional Notes

### Authentication Flow
1. Guest users access `/admin/login`
2. `AuthController@login` validates credentials
3. Rate limiting: 5 failed attempts locks account for 15 minutes
4. IP-based throttling per email
5. Admin privilege check (`is_admin` flag)
6. Session regeneration on success
7. All attempts logged to `LoginAttempt` model

### Authorization
- Admin routes protected by `['auth', 'admin']` middleware
- Profile routes accessible to authenticated admin users
- Password confirmation required for account deletion

### Models Referenced
- `LoginAttempt` - tracks all login attempts
- `News` - published content management
- `ProjectSubmission` - project gallery submissions
- `AuditLog` - admin action logging

### View Hierarchy
```
resources/views/
├── admin/
│   ├── layout.blade.php (master layout)
│   ├── login.blade.php (admin login form)
│   ├── dashboard.blade.php
│   ├── security/
│   │   └── index.blade.php (login analytics)
│   ├── berita/ (news management)
│   ├── projects/ (project gallery)
│   ├── chat/
│   ├── audit/
│   ├── gallery/
│   └── news/
├── auth/
│   ├── login.blade.php (user auth)
│   ├── register.blade.php
│   ├── forgot-password.blade.php
│   ├── reset-password.blade.php
│   ├── confirm-password.blade.php
│   └── verify-email.blade.php
├── profile/
│   └── edit.blade.php (user profile)
└── welcome.blade.php
```

