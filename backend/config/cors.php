<?php

return [
    'paths' => ['*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://ilkomnews.bemfasilkomunsri.org', 'https://bemfasilkomunsri.org', 'https://www.bemfasilkomunsri.org', 'http://localhost:5173', 'http://localhost:8000'],
    'allowed_origins_patterns' => [
        '#^https://.*\.bemfasilkomunsri\.org$#',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['X-CSRF-TOKEN', 'X-XSRF-TOKEN'],
    'max_age' => 0,
    'supports_credentials' => true,
];
