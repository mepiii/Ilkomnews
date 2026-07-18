<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

abstract class BasePublishableController extends Controller
{
    /**
     * Cache TTL for list endpoints (seconds).
     */
    protected int $cacheTtl = 60;

    /**
     * Cache store to use (redis for performance).
     */
    protected string $cacheStore = 'redis';

    /**
     * Get the model class for this controller.
     */
    abstract protected function getModelClass(): string;

    /**
     * Get the column name to filter by.
     */
    protected function getFilterColumn(): string
    {
        return 'category';
    }

    /**
     * Get the column name to sort by.
     */
    protected function getSortColumn(): string
    {
        return 'date';
    }

    /**
     * Get the request parameter name for filtering.
     */
    protected function getFilterParam(): string
    {
        return $this->getFilterColumn();
    }

    /**
     * Build a stable cache key for the current request.
     */
    protected function cacheKey(string $tag, Request $request): ?string
    {
        if ($request->has('search')) return null;
        if ($request->get('page', 1) > 1) return null;
        if ($request->has('nocache')) return null;

        $parts = [$tag];
        foreach ($request->query() as $k => $v) {
            if (in_array($k, ['page', 'search', 'nocache'], true)) continue;
            $parts[] = $k . '=' . $v;
        }
        return implode('|', $parts);
    }

    /**
     * Scope hiding expired TTL rows from public reads.
     */
    protected function visibleScope(): ?\Closure
    {
        $modelClass = $this->getModelClass();
        if (!Schema::hasColumn((new $modelClass)->getTable(), 'expires_at')) {
            return null;
        }
        return fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
    }

    /**
     * Memoized cache store probe.
     *
     * First call probes `Cache::store('redis')` with a throwaway has() —
     * the real error (phpredis ext missing, AUTH failed, ECONNREFUSED)
     * only fires on IO. Falls back to the default store. Result is
     * memoized in a static so subsequent public requests skip the probe
     * entirely (the probe was a measurable per-request cost: a file
     * exists() on the cache dir, a Redis RTT, or a DB SELECT 1).
     */
    protected function getCacheStore()
    {
        static $resolved = null;
        if ($resolved !== null) {
            return $resolved;
        }
        try {
            $store = Cache::store($this->cacheStore);
            $store->has('__cache_probe__');
            $resolved = $store;
        } catch (\Throwable $e) {
            try {
                $resolved = Cache::store('database');
            } catch (\Throwable $e2) {
                $resolved = Cache::store();
            }
        }
        return $resolved;
    }

    /**
     * List resources with optional filtering and pagination.
     */
    public function index(Request $request)
    {
        $modelClass = $this->getModelClass();
        $key = $this->cacheKey(static::class . '::index', $request);

        $visible = $this->visibleScope();
        
        $run = function () use ($modelClass, $request, $visible) {
            // Use optimized query scope if available
            if (method_exists($modelClass, 'forListing')) {
                $query = $modelClass::forListing();
            } else {
                $query = $modelClass::select(['id', 'title', 'slug', 'summary', 'category', 'date', 'published'])
                    ->published();
            }
            
            $query->latest($this->getSortColumn());
            
            if ($visible) $query->where($visible);
            
            $filterParam = $this->getFilterParam();
            if ($request->has($filterParam) && $request->$filterParam !== 'all') {
                $query->where($this->getFilterColumn(), $request->$filterParam);
            }
            
            if ($request->has('search')) {
                $this->applySearch($query, $request->search);
            }
            
            return $query->paginate(12)->toArray();
        };

        $cache = $this->getCacheStore();
        $payload = $key ? $cache->remember($key, $this->cacheTtl, $run) : $run();

        return response()->json($payload)
            ->header('X-Cache', $key ? 'HIT' : 'BYPASS');
    }

    /**
     * Show a single resource by ID or slug.
     */
    public function show($id)
    {
        $modelClass = $this->getModelClass();
        $key = "show:{$modelClass}:{$id}";

        $cache = $this->getCacheStore();
        $payload = $cache->remember($key, $this->cacheTtl, function () use ($modelClass, $id) {
            return $modelClass::published()
                ->where(fn($q) => $q->where('id', $id)->orWhere('slug', $id))
                ->firstOrFail()->toArray();
        });

        return response()->json($payload)
            ->header('X-Cache', 'HIT');
    }

    /**
     * Get latest resources.
     */
    public function latest(Request $request)
    {
        $modelClass = $this->getModelClass();
        $limit = min($request->get('limit', 6), 20);
        $key = "latest:{$modelClass}:{$limit}";

        $visible = $this->visibleScope();
        
        $cache = $this->getCacheStore();
        $payload = $cache->remember($key, 30, function () use ($modelClass, $request, $limit, $visible) {
            $q = $modelClass::published()->latest($this->getSortColumn())->take($limit);
            if ($visible) $q->where($visible);
            return $q->get()->toArray();
        });

        return response()->json($payload);
    }

    /**
     * Get distinct values for the filter column.
     */
    public function categories()
    {
        $modelClass = $this->getModelClass();
        $key = "categories:{$modelClass}";

        $cache = $this->getCacheStore();
        $payload = $cache->remember($key, 300, function () use ($modelClass) {
            return $modelClass::published()
                ->distinct()
                ->pluck($this->getFilterColumn())
                ->all();
        });

        return response()->json($payload);
    }

    /**
     * Apply search filtering to the query.
     */
    protected function applySearch($query, string $searchTerm): void
    {
        // Default: no search
    }
}
