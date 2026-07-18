<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cookie;

/**
 * Attaches the XSRF-TOKEN cookie to every response, unconditionally.
 *
 * The original implementation sat in the `web` group BEFORE
 * VerifyCsrfToken and used `$response = $next(); $response->cookie(...)`.
 * That looked right but silently broke for 401/419/500 responses: when
 * auth or CSRF threw, the exception handler built a fresh response and
 * EmitCsrfCookie's post-$next code never ran. Result: the SPA's
 * priming GET to /api/admin/user got a 401 with no XSRF-TOKEN cookie,
 * the login POST had no token to send, and the user saw a
 * "Request timeout" / stuck spinner on the login page.
 *
 * Fix: make this a TerminableMiddleware so its terminate() runs in
 * Http\Kernel::terminate() AFTER the exception handler has built the
 * final response. Register it in $middleware (global) so it sees every
 * request, not just the web group.
 */
class EmitCsrfCookie
{
    /**
     * Cached per-request — terminate() is called once with the final
     * response, but handle() may be called multiple times in tests.
     */
    private bool $cookieAttached = false;

    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        if ($this->cookieAttached) {
            return;
        }
        // Only emit for the web-middleware group (where the SPA session
        // lives). Public API requests don't need it and the session
        // driver may not be available there.
        if (! $request->is('api/admin/*') && ! $request->is('*admin*')) {
            return;
        }
        // Start the session if needed so csrf_token() is valid. The web
        // group already started it; this is a defensive no-op for any
        // future global use.
        $app = app();
        if ($app->bound('session.store')) {
            $session = $app->make('session.store');
            if (! $session->isStarted()) {
                $session->start();
            }
        }
        $token = $request->hasSession() && $request->session()->isStarted()
            ? $request->session()->token()
            : (function () { session()->start(); return csrf_token(); })();
        $response->headers->setCookie(
            Cookie::make(
                'XSRF-TOKEN',
                $token,
                config('session.lifetime', 120),
                '/',
                null,
                config('session.secure', false),
                false, // http_only=false so JS can read it for X-XSRF-TOKEN
                false,
                'lax'
            )
        );
        $this->cookieAttached = true;
    }
}
