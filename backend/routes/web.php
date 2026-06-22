<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// ── Admin Dashboard (Blade) ──
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('admin.dashboard');

    // News
    Route::get('/berita', [Admin\NewsController::class, 'index'])->name('admin.news.index');
    Route::get('/berita/tambah', [Admin\NewsController::class, 'create'])->name('admin.news.create');
    Route::get('/berita/{id}/edit', [Admin\NewsController::class, 'edit'])->name('admin.news.edit');

    // Gallery
    Route::get('/gallery', [Admin\GalleryController::class, 'index'])->name('admin.projects.index');
    Route::get('/gallery/{id}', [Admin\GalleryController::class, 'show'])->name('admin.projects.show');

    // System
    Route::get('/security', [Admin\SecurityController::class, 'index'])->name('admin.security');
    Route::get('/chat-stats', [Admin\ChatStatsController::class, 'index'])->name('admin.chat-stats');
    Route::get('/audit-logs', [Admin\AuditLogController::class, 'index'])->name('admin.audit-logs');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('admin.profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('admin.profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('admin.profile.destroy');
});

// ── Admin Login (guest, Blade) ──
Route::get('/admin/login', [Admin\AuthController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [Admin\AuthController::class, 'login'])->name('admin.login.submit');

// ── Admin Logout ──
Route::post('/admin/logout', [Admin\AuthController::class, 'logout'])->name('admin.logout');

require __DIR__.'/auth.php';
