<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class RequestLogger
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $requestId = $request->attributes->get('request-id', uniqid('req_', true));
        $startTime = microtime(true);

        $response = $next($request);

        // Only log admin requests and API requests
        if ($request->is('api/*') || $request->is('admin/*')) {
            $duration = round((microtime(true) - $startTime) * 1000, 2);

            Log::channel('daily')->info('Request', [
                'request_id' => $requestId,
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'user_id' => $request->user()?->id,
                'status' => $response->status(),
                'duration_ms' => $duration,
            ]);
        }

        return $response;
    }
}
