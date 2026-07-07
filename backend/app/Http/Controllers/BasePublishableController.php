<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

abstract class BasePublishableController extends Controller
{
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
     * List resources with optional filtering and pagination.
     */
    public function index(Request $request)
    {
        $modelClass = $this->getModelClass();
        $query = $modelClass::published()->latest($this->getSortColumn());

        // Apply filter (category/type/etc)
        $filterParam = $this->getFilterParam();
        if ($request->has($filterParam) && $request->$filterParam !== 'all') {
            $query->where($this->getFilterColumn(), $request->$filterParam);
        }

        // Apply search if implemented by child controller
        if ($request->has('search')) {
            $this->applySearch($query, $request->search);
        }

        return response()->json($query->paginate(12));
    }

    /**
     * Show a single resource by ID or slug.
     */
    public function show($id)
    {
        $modelClass = $this->getModelClass();
        return response()->json(
            $modelClass::published()
                ->where(fn($q) => $q->where('id', $id)->orWhere('slug', $id))
                ->firstOrFail()
        );
    }

    /**
     * Get latest resources.
     */
    public function latest(Request $request)
    {
        $modelClass = $this->getModelClass();
        $limit = min($request->get('limit', 6), 20);
        return response()->json(
            $modelClass::published()
                ->latest($this->getSortColumn())
                ->take($limit)
                ->get()
        );
    }

    /**
     * Get distinct values for the filter column.
     */
    public function categories()
    {
        $modelClass = $this->getModelClass();
        return response()->json(
            $modelClass::published()
                ->distinct()
                ->pluck($this->getFilterColumn())
        );
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
