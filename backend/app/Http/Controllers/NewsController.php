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
        $news = News::published()
            ->where(function ($q) use ($id) {
                $q->where('id', $id)->orWhere('slug', $id);
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->firstOrFail();

        try {
            $news->incrementViews();
        } catch (\Throwable $e) {
            // View counting must never break article reads.
        }

        return response()->json($news);
    }
}
