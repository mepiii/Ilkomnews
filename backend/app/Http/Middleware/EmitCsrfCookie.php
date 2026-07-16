<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cookie;

/**
 * Attaches the XSRF-TOKEN cookie to every `web` response, unconditionally.
 *
 * Laravel's VerifyCsrfToken only sets this cookie after the request passes
 * its own handle() — so an unauthenticated 401 (admin boot GET /admin/user)
 * or a failed 419 never emits it. The SPA then has no token to send on the
 * login POST, which fails with 419 forever. Attaching it directly to the
 * response (after $next) guarantees the browser always has a token, and
 * sidesteps the queued-cookie flush timing in AddQueuedCookiesToResponse.
 */
class EmitCsrfCookie
{
    public function handle(Request $request, Closure $next): Response
    {
        // StartSession (earlier in the web group) has already opened the
        // session, so csrf_token() is valid here.
        $response = $next($request);

        $response->cookie(
            Cookie::make(
                'XSRF-TOKEN',
                csrf_token(),
                config('session.lifetime', 120),
                '/',
                null,
                config('session.secure', false),
                false, // http_only=false so JS can read it for X-XSRF-TOKEN
                false,
                'lax'
            )
        );

        return $response;
    }
}
