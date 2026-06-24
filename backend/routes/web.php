<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('admin.login');
});

// ── Redirect /login to /admin/login ──
Route::get('/login', function () {
    return redirect()->route('admin.login');
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
        Route::delete('/{id}', [Admin\GalleryController::class, 'destroy'])->name('destroy');
    });

    // System
    Route::get('/security', [Admin\SecurityController::class, 'index'])->name('security');
    Route::get('/chat-stats', [Admin\ChatStatsController::class, 'index'])->name('chat-stats');
    Route::get('/audit-logs', [Admin\AuditLogController::class, 'index'])->name('audit-logs');

    // Settings
    Route::get('/settings', [Admin\SettingsController::class, 'index'])->name('settings');
    Route::post('/settings/providers', [Admin\SettingsController::class, 'storeProvider'])->name('settings.providers.store');
    Route::put('/settings/providers/{provider}', [Admin\SettingsController::class, 'updateProvider'])->name('settings.providers.update');
    Route::delete('/settings/providers/{provider}', [Admin\SettingsController::class, 'destroyProvider'])->name('settings.providers.destroy');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Logout
    Route::post('/logout', [Admin\AuthController::class, 'logout'])->name('logout');
});

require __DIR__.'/auth.php';
