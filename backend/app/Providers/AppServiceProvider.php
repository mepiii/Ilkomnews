<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        RateLimiter::for('api', fn (Request $request) => [
            Limit::perMinute(60)->by($request->ip()),
        ]);

        RateLimiter::for('admin', fn (Request $request) => [
            Limit::perMinute(120)->by($request->user()?->id ?: $request->ip()),
        ]);

        RateLimiter::for('login', fn (Request $request) => [
            Limit::perMinute(10)->by($request->input('email').$request->ip()),
        ]);

        RateLimiter::for('chatbot', fn (Request $request) => [
            Limit::perMinute(30)->by($request->ip()),
        ]);
    }
}
