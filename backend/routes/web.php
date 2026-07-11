<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\Admin\AdminProfileController;
use App\Http\Controllers\Api\Admin\ApiKeyController;
use App\Models\News;
use App\Models\Article;
use App\Models\Event;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('admin.login');
});

// ── SPA Admin API (session cookie auth — web middleware) ──
Route::post('/api/admin/login', [Admin\AuthController::class, 'login'])->middleware('throttle:login');
Route::middleware(['auth', 'admin', 'throttle:admin'])->prefix('api/admin')->group(function () {
    Route::post('/logout', [Admin\AuthController::class, 'logout']);
    Route::get('/user', [Admin\AuthController::class, 'user']);
    Route::get('/dashboard', [Admin\DashboardController::class, 'apiStats']);

    // File upload
    Route::post('/upload', [\App\Http\Controllers\UploadController::class, 'store'])->middleware('throttle:10,1');

    // Projects
    Route::get('/projects', [Admin\GalleryController::class, 'index']);
    Route::get('/projects/stats', [Admin\GalleryController::class, 'stats']);
    Route::get('/projects/{submission}', [Admin\GalleryController::class, 'show']);
    Route::post('/projects/{submission}/accept', [Admin\GalleryController::class, 'accept']);
    Route::post('/projects/{submission}/reject', [Admin\GalleryController::class, 'reject']);
    Route::delete('/projects/{submission}', [Admin\GalleryController::class, 'destroy']);

    // News
    Route::get('/news', [Admin\NewsController::class, 'index']);
    Route::get('/news/stats', [Admin\NewsController::class, 'stats']);
    Route::post('/news', [Admin\NewsController::class, 'store']);
    Route::get('/news/{news}', [Admin\NewsController::class, 'show']);
    Route::put('/news/{news}', [Admin\NewsController::class, 'update']);
    Route::post('/news/{news}', [Admin\NewsController::class, 'update']); // _method=PUT spoofing
    Route::delete('/news/{news}', [Admin\NewsController::class, 'destroy']);
    Route::put('/news/{news}/toggle-hidden', [Admin\NewsController::class, 'toggleHidden']);

    // Notifications
    Route::get('/notifications', [Admin\NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [Admin\NotificationController::class, 'unreadCount']);
    Route::post('/notifications', [Admin\NotificationController::class, 'store']);
    Route::post('/notifications/{id}/read', [Admin\NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [Admin\NotificationController::class, 'markAllRead']);

    // Audit logs
    Route::get('/audit-logs', [Admin\AuditLogController::class, 'index']);
    Route::get('/audit-logs/summary', [Admin\AuditLogController::class, 'summary']);

    // Chat stats
    Route::get('/chat-stats', [Admin\ChatStatsController::class, 'index']);

    // Health
    Route::get('/health', [Admin\HealthController::class, 'index']);

    // Security
    Route::get('/security/login-attempts', [Admin\SecurityController::class, 'index']);

    // Chatbot API config
    Route::get('/chatbot-api', [Admin\ChatbotApiController::class, 'index']);
    Route::get('/chatbot-api/{id}', [Admin\ChatbotApiController::class, 'show']);
    Route::post('/chatbot-api', [Admin\ChatbotApiController::class, 'store']);
    Route::put('/chatbot-api/{id}', [Admin\ChatbotApiController::class, 'update']);
    Route::delete('/chatbot-api/{id}', [Admin\ChatbotApiController::class, 'destroy']);
    Route::post('/chatbot-api/test', [Admin\ChatbotApiController::class, 'testConnection']);

    // Admin profile
    Route::get('/admins', [AdminProfileController::class, 'index']);
    Route::post('/admins', [AdminProfileController::class, 'store']);
    Route::get('/admins/{id}', [AdminProfileController::class, 'show']);
    Route::put('/admins/{id}/name', [AdminProfileController::class, 'updateName']);
    Route::put('/admins/{id}/email', [AdminProfileController::class, 'updateEmail']);
    Route::put('/admins/{id}/password', [AdminProfileController::class, 'updatePassword']);
    Route::delete('/admins/{id}', [AdminProfileController::class, 'destroy']);

    // API keys
    Route::get('/api-keys', [ApiKeyController::class, 'index']);
    Route::put('/api-keys/azure', [ApiKeyController::class, 'updateAzure']);
    Route::put('/api-keys/gemini', [ApiKeyController::class, 'updateGemini']);
    Route::post('/api-keys/test-azure', [ApiKeyController::class, 'testAzure']);
    Route::post('/api-keys/test-gemini', [ApiKeyController::class, 'testGemini']);
});

// ── Sitemap ──
Route::get('/sitemap.xml', function () {
    $baseUrl = config('app.url');
    $news = News::where('published', true)->latest('date')->limit(50)->get(['slug', 'updated_at']);
    $articles = Article::where('published', true)->latest('date')->limit(50)->get(['slug', 'updated_at']);
    $events = Event::where('published', true)->latest('date')->limit(50)->get(['slug', 'updated_at']);

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    // Static pages
    $staticPages = ['', '/news', '/articles', '/events', '/ilkomgallery', '/gallery', '/submit', '/track', '/koleksi'];
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
