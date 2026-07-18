<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Model::preventLazyLoading(true);

        // Public API: bumped 60 → 300/min/IP.
        // The home page fires news + projects + interactions in parallel,
        // and the notification popover polls every 60s. 60/min exhausted
        // those in well under a minute, surfacing as intermittent 429s
        // and frontend state wipeouts.
        RateLimiter::for('api', fn (Request $request) => [
            Limit::perMinute(300)->by($request->ip()),
        ]);

        // Admin API: 600/min/user. Admin panel is CRUD-heavy; 240 was
        // tight when paginating + filtering + viewing details in succession.
        RateLimiter::for('admin', fn (Request $request) => [
            Limit::perMinute(600)->by($request->user()?->id ?: $request->ip()),
        ]);

        // ponytail: 10/min (not 5) so the controller's own 5-attempt lockout
        // returns its friendly 422 "locked" message before this raw 429 fires.
        RateLimiter::for('login', fn (Request $request) => [
            Limit::perMinute(10)->by($request->ip()),
        ]);

        RateLimiter::for('chatbot', fn (Request $request) => [
            Limit::perMinute(30)->by($request->ip()),
        ]);

        // ponytail: 5 AI questions per IP per day (measured against the actual
        // Gemini call, not the FAQ fast path). 86400s = 1 day window; counted
        // in ChatController only when a non-FAQ question reaches the LLM.
        RateLimiter::for('chatbot-ai-daily', fn (Request $request) => [
            Limit::perDay(5)->by($request->ip()),
        ]);

        // Heavy admin analytics endpoints (dashboard/security/chat/audit summary).
        RateLimiter::for('admin-heavy', fn (Request $request) => [
            Limit::perMinute(120)->by($request->user()?->id ?: $request->ip()),
        ]);

        // High-traffic public read endpoints with aggressive caching.
        RateLimiter::for('public-read', fn (Request $request) => [
            Limit::perMinute(180)->by($request->ip()),
        ]);
    }
}
