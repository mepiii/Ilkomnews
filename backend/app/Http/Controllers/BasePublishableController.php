<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

abstract class BasePublishableController extends Controller
{
    /**
     * Cache TTL for list endpoints (seconds).
     * Tight enough that updates feel live, wide enough to absorb
     * burst reads from the public site.
     */
    protected int $cacheTtl = 60;

    /**
     * Get the model class for this controller.
     */
    abstract protected function getModelClass(): string;

    /**
     * Get the column name to filter by (e.g., 'category', 'type').
     */
    protected function getFilterColumn(): string
    {
        return 'category';
    }

    /**
     * Get the column name to sort by (e.g., 'date', 'deadline').
     */
    protected function getSortColumn(): string
    {
        return 'date';
    }

    /**
     * Get the request parameter name for filtering (defaults to filter column).
     */
    protected function getFilterParam(): string
    {
        return $this->getFilterColumn();
    }

    /**
     * Build a stable cache key for the current request.
     * We only cache on the cheap public reads (no user, no page > 1, no search).
     */
    protected function cacheKey(string $tag, Request $request): ?string
    {
        // Don't cache personalised or paginated-after-first-page requests
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
     * List resources with optional filtering and pagination.
     */
    public function index(Request $request)
    {
        $modelClass = $this->getModelClass();
        $key = $this->cacheKey(static::class . '::index', $request);

        $run = function () use ($modelClass, $request) {
            $query = $modelClass::published()->latest($this->getSortColumn());
            $filterParam = $this->getFilterParam();
            if ($request->has($filterParam) && $request->$filterParam !== 'all') {
                $query->where($this->getFilterColumn(), $request->$filterParam);
            }
            if ($request->has('search')) {
                $this->applySearch($query, $request->search);
            }
            return $query->paginate(12);
        };

        $payload = $key ? Cache::remember($key, $this->cacheTtl, $run) : $run();

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

        $payload = Cache::remember($key, $this->cacheTtl, function () use ($modelClass, $id) {
            return $modelClass::published()
                ->where(fn($q) => $q->where('id', $id)->orWhere('slug', $id))
                ->firstOrFail();
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

        $payload = Cache::remember($key, 30, function () use ($modelClass, $request, $limit) {
            return $modelClass::published()
                ->latest($this->getSortColumn())
                ->take($limit)
                ->get();
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

        $payload = Cache::remember($key, 300, function () use ($modelClass) {
            return $modelClass::published()
                ->distinct()
                ->pluck($this->getFilterColumn());
        });

        return response()->json($payload);
    }

    /**
     * Apply search filtering to the query.
     * Override this method in child controllers to implement search.
     */
    protected function applySearch($query, string $searchTerm): void
    {
        // Default: no search
    }
}
