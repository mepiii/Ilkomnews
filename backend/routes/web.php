<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\Admin\AdminProfileController;
use App\Http\Controllers\Api\Admin\ApiKeyController;
use App\Models\News;
use App\Models\Event;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('admin.login');
});

// ── SPA Admin API ──
// Moved to routes/api.php (mounted at /api/admin/*) so the React admin panel
// hits a single, /api-prefixed base that matches frontend adminApi.js. Session
// cookie (Sanctum SPA) auth is preserved there via the inline 'web' group.

// ── Sitemap ──
Route::get('/sitemap.xml', function () {
    $baseUrl = config('app.url');
    $news = News::where('published', true)->latest('date')->limit(50)->get(['slug', 'updated_at']);
    $events = Event::where('published', true)->latest('date')->limit(50)->get(['slug', 'updated_at']);

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    // Static pages
    $staticPages = ['', '/news', '/events', '/ilkomgallery', '/gallery', '/submit', '/track', '/koleksi'];
    foreach ($staticPages as $page) {
        $xml .= '  <url>' . "\n";
        $xml .= '    <loc>' . $baseUrl . $page . '</loc>' . "\n";
        $xml .= '    <changefreq>weekly</changefreq>' . "\n";
        $xml .= '    <priority>0.8</priority>' . "\n";
        $xml .= '  </url>' . "\n";
    }

    // ponytail: extracted helper for repeated XML block
    $sitemapUrl = fn ($item, $path) => '  <url>' . "\n" .
        '    <loc>' . $baseUrl . $path . '/' . $item->slug . '</loc>' . "\n" .
        '    <lastmod>' . $item->updated_at->toIso8601String() . '</lastmod>' . "\n" .
        '    <changefreq>monthly</changefreq>' . "\n" .
        '  </url>' . "\n";

    $xml .= $news->map(fn ($n) => $sitemapUrl($n, 'news'))->implode('');
    $xml .= $events->map(fn ($e) => $sitemapUrl($e, 'events'))->implode('');

    $xml .= '</urlset>';

    return response($xml, 200)
        ->header('Content-Type', 'application/xml');
});

// ── Redirect /login to /admin/login ──
Route::get('/login', function () {
    return redirect()->route('admin.login');
});

// ── robots.txt ──
Route::get('/robots.txt', function () {
    $base = rtrim(config('app.url'), '/');
    $txt = "User-agent: *\n";
    $txt .= "Allow: /\n";
    $txt .= "Disallow: /admin\n";
    $txt .= "Disallow: /portal\n";
    $txt .= "Sitemap: {$base}/sitemap.xml\n";
    return response($txt, 200)->header('Content-Type', 'text/plain');
});

// ── Admin Login (guest) ──
Route::get('/admin/login', [Admin\AuthController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [Admin\AuthController::class, 'login'])->name('admin.login.submit');

// ── Admin (auth required) ──
Route::name('admin.')->prefix(config('app.admin_prefix'))->middleware(['auth', 'admin', 'throttle:admin'])->group(function () {

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
