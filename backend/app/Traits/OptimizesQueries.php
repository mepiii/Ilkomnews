<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

trait OptimizesQueries
{
    /**
     * Cache frequently accessed query results.
     */
    protected function cacheRemember(string $key, int $ttl, callable $callback)
    {
        return Cache::store('redis')->remember($key, $ttl, $callback);
    }

    /**
     * Get cached count for a model.
     */
    public static function getCachedCount(string $cacheKey, int $ttl = 300): int
    {
        return Cache::store('redis')->remember($cacheKey, $ttl, fn() => static::count());
    }

    /**
     * Flush model-related cache keys.
     */
    public static function flushCacheKeys(array $keys): void
    {
        foreach ($keys as $key) {
            Cache::store('redis')->forget($key);
        }
    }
}
