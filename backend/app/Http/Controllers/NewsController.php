<?php

namespace App\Http\Controllers;

use App\Models\News;

class NewsController extends BasePublishableController
{
    protected function getModelClass(): string
    {
        return News::class;
    }

    protected function applySearch($query, string $searchTerm): void
    {
        $search = addcslashes($searchTerm, '%_');
        $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('summary', 'like', "%{$search}%");
        });
    }

    public function show($id)
    {
        // ponytail: dead DB → 404 (same as unknown id), not a 500.
        try {
            $news = News::published()
                ->where(function ($q) use ($id) {
                    $q->where('id', $id)->orWhere('slug', $id);
                })
                ->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                })
                ->firstOrFail();
        } catch (\Throwable $e) {
            abort(404);
        }

        try {
            $news->incrementViews();
        } catch (\Throwable $e) {
            // View counting must never break article reads.
        }

        return response()->json($news);
    }
}
