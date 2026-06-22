<?php

namespace App\Http\Controllers;

use App\Models\Article;

class ArticleController extends BasePublishableController
{
    protected function getModelClass(): string
    {
        return Article::class;
    }

    public function byCategory($category)
    {
        return response()->json(
            Article::published()
                ->where('category', $category)
                ->latest('date')
                ->paginate(12)
        );
    }
}
