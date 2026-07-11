<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->prepend(\App\Http\Middleware\SecurityHeaders::class);
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminOnly::class,
        ]);

        // Trust reverse proxies / CDNs so $request->ip() reflects the real
        // client address instead of the proxy. Override with TRUSTED_PROXIES
        // (comma-separated CIDRs / IPs) when deployed behind a known proxy.
        $proxies = env('TRUSTED_PROXIES');
        $trustedProxies = $proxies !== null && $proxies !== ''
            ? array_map('trim', explode(',', $proxies))
            : ['127.0.0.1', '::1', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];

        $middleware->trustProxies($trustedProxies);

        // AdminIPWhitelist and RequestLogger middleware exist but are not
        // registered. They are intentionally left disabled: AdminIPWhitelist
        // depends on an `ip_whitelist` table and management UI that do not yet
        // exist (registering it now would risk 500s on admin requests), and
        // RequestLogger is intentionally inactive to avoid noisy logging.
        // Enable them once the supporting migrations/UI are in place.
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
