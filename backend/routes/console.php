<?php

use App\Models\News;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// ponytail: hourly auto-prune of TTL news (expires_at in the past). Explainable: run `php artisan tinker` and call the same query to inspect.
Schedule::call(function () {
    News::whereNotNull('expires_at')
        ->where('expires_at', '<=', now())
        ->delete();
})->hourly();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
