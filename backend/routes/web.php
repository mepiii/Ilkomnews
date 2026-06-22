<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// ── Admin Dashboard (Blade) ──
Route::middleware(['auth', 'admin'])->group(function () {

    // Dashboard (named route for Breeze auth redirects)
    Route::get('/dashboard', fn () => redirect(config('app.frontend_url', '/')))->name('dashboard');

    // Redirect /admin to SPA
    Route::get('/admin', fn () => redirect(config('app.frontend_url', '/')));

    // Admin SPA entry points (named routes for sidebar navigation)
    Route::get('/admin/berita', fn () => redirect(config('app.frontend_url', '/').'/admin/berita'))->name('admin.berita');
    Route::get('/admin/gallery', fn () => redirect(config('app.frontend_url', '/').'/admin/gallery'))->name('admin.gallery');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
