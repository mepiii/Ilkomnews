<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Support\Facades\Route;

// This is an admin-only portal. Public self-registration is intentionally
// disabled (admins are created via the admin API). Email verification,
// confirmable password, and password-change routes are also disabled because
// they are orphaned without public user registration.

Route::middleware('guest')->group(function () {
    // Redirect default /login → admin login (admin has its own login in web.php)
    Route::get('login', fn() => redirect()->route('admin.login'))
        ->name('login');

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
