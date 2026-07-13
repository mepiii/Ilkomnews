<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // ponytail: per-request nonce shared to Blade views; replaces 'unsafe-inline'.
        // Must be shared BEFORE $next() so views rendered during the controller
        // (web admin panel, or an API controller's Blade fallback) have it.
        $nonce = bin2hex(random_bytes(16));
        view()->share('cspNonce', $nonce);

        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        // CSP — single source of truth (removed frontend meta tag)
        $connectSrc = config('app.env') === 'local'
            ? "'self' http://localhost:5173 http://localhost:8000"
            : env('CSP_CONNECT_SRC', "'self' https://bemfasilkomunsri.org https://www.bemfasilkomunsri.org https://ilkomnews.bemfasilkomunsri.org");

        // ponytail: per-request nonce shared to Blade views; replaces 'unsafe-inline'
        // (nonce already shared before $next() above)
        $response->headers->set('Content-Security-Policy',
            "default-src 'self'; " .
            "script-src 'self' 'nonce-{$nonce}'; " .
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " .   // ponytail: inline-style refactor out of scope
            "font-src 'self' https://fonts.gstatic.com; " .
            "img-src 'self' data: https: blob:; " .
            "connect-src {$connectSrc}; " .
            "frame-src 'none'; " .
            "frame-ancestors 'none'; " .
            "object-src 'none'; " .
            "base-uri 'self'; " .
            "form-action 'self'"
        );

        return $response;
    }
}
