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
            ->where('id', $id)
            ->orWhere('slug', $id)
            ->firstOrFail();

        $news->incrementViews();

        return response()->json($news);
    }
}
