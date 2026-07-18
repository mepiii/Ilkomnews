<?php
// Custom router for `php -S` so the SPA's index.html does NOT shadow Laravel.
// Rules:
//   1. Existing real file (asset, sw.js, index.html) → serve it as static.
//   2. /api/* or /sanctum/* or /up or /storage/* → always go through index.php
//      even if no matching file (PHP built-in server would otherwise return 404).
//   3. Anything else (e.g. /news, /gallery) → fall through to index.php so
//      Laravel can render the SPA, OR serve the SPA's index.html if present.
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = $uri === '/' ? '/index.php' : $uri;
$file = __DIR__ . $path;

$apiPrefixes = ['/api/', '/sanctum/', '/storage/', '/up', '/build/', '/livewire/', '/_debugbar/'];
foreach ($apiPrefixes as $p) {
    if (str_starts_with($uri, $p)) {
        require __DIR__ . '/index.php';
        return true;
    }
}

if ($uri !== '/' && is_file($file)) {
    return false; // serve the file as-is (CSS/JS/SW/fouc.js/BEM.png/etc.)
}

// SPA fallback: serve index.html for client-side routes.
if (is_file(__DIR__ . '/index.html') && !str_starts_with($uri, '/api')) {
    // Let index.html's own <meta> CSP and assets load; just return false so
    // PHP serves the file directly. index.php is not invoked.
    if ($uri === '/' || !str_contains($uri, '.')) {
        return false;
    }
}

require __DIR__ . '/index.php';
return true;
