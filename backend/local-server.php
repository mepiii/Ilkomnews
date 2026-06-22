<?php
// Local dev server: API via Laravel, everything else via SPA
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$public = __DIR__ . '/public';

// API routes → Laravel
if (strpos($uri, '/api/') === 0) {
    require $public . '/index.php';
    return true;
}

// Try serving static file from public/
$file = $public . $uri;
if ($uri !== '/' && is_file($file)) {
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $mime = [
        'js'   => 'application/javascript',
        'css'  => 'text/css',
        'json' => 'application/json',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2'=> 'font/woff2',
        'ttf'  => 'font/ttf',
        'html' => 'text/html',
    ];
    $type = $mime[$ext] ?? mime_content_type($file) ?: 'application/octet-stream';
    header('Content-Type: ' . $type);
    readfile($file);
    return true;
}

// Root → redirect to admin login
if ($uri === '/') {
    header('Location: /admin/login');
    http_response_code(302);
    return true;
}

// SPA fallback → index.html
http_response_code(200);
header('Content-Type: text/html; charset=utf-8');
readfile($public . '/index.html');
