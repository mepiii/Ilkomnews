<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    'allowed_origins' => array_filter(array_map(
        'trim',
        explode(',', env('FRONTEND_URL', 'http://localhost:5173'))
    )),
    'allowed_origins_patterns' => [
        // Any subdomain of bemfasilkomunsri.org over https (e.g. ilkomnews.*)
        '#^https://([a-z0-9-]+\.)*bemfasilkomunsri\.org$#i',
    ],
    'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
