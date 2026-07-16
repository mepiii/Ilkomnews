<?php

use App\Models\News;
use App\Models\Event;
use Illuminate\Support\Facades\Route;

// ── SPA entry ──
// The React app (built into public/index.html) owns every client route
// (/, /submit, /track, /news, /admin/login, /admin/dashboard, ...).
// Blade admin routes were removed: they shadowed the SPA's client-side
// /admin/* routes and 404'd every React page (e.g. /submit). The admin API
// lives in routes/api.php under /api/admin/* and is untouched.

Route::get('/', function () {
    return response(file_get_contents(public_path('index.html')), 200)
        ->header('Content-Type', 'text/html');
});

// ── Sitemap ──
Route::get('/sitemap.xml', function () {
    $baseUrl = config('app.url');
    $news = News::where('published', true)->latest('date')->limit(50)->get(['slug', 'updated_at']);
    $events = Event::where('published', true)->latest('date')->limit(50)->get(['slug', 'updated_at']);

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    $staticPages = ['', '/news', '/events', '/ilkomgallery', '/gallery', '/submit', '/track', '/koleksi'];
    foreach ($staticPages as $page) {
        $xml .= '  <url>' . "\n";
        $xml .= '    <loc>' . $baseUrl . $page . '</loc>' . "\n";
        $xml .= '    <changefreq>weekly</changefreq>' . "\n";
        $xml .= '    <priority>0.8</priority>' . "\n";
        $xml .= '  </url>' . "\n";
    }

    $sitemapUrl = fn ($item, $path) => '  <url>' . "\n" .
        '    <loc>' . $baseUrl . $path . '/' . $item->slug . '</loc>' . "\n" .
        '    <lastmod>' . $item->updated_at->toIso8601String() . '</lastmod>' . "\n" .
        '    <changefreq>monthly</changefreq>' . "\n" .
        '  </url>' . "\n";

    $xml .= $news->map(fn ($n) => $sitemapUrl($n, 'news'))->implode('');
    $xml .= $events->map(fn ($e) => $sitemapUrl($e, 'events'))->implode('');
    $xml .= '</urlset>';

    return response($xml, 200)->header('Content-Type', 'application/xml');
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

// ── SPA fallback (must be last) ──
// Serves index.html for any GET route not already matched (explicit /api/*
// routes in routes/api.php take precedence and are never caught here).
Route::get('/{any}', function () {
    return response(file_get_contents(public_path('index.html')), 200)
        ->header('Content-Type', 'text/html');
})->where('any', '.*');
