<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::published()->latest('date');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        return response()->json($query->paginate(12));
    }

    public function latest(Request $request)
    {
        $limit = min($request->get('limit', 6), 20);
        return response()->json(Article::published()->latest('date')->take($limit)->get());
    }

    public function show($id)
    {
        return response()->json(Article::published()->where('id', $id)->orWhere('slug', $id)->firstOrFail());
    }

    public function byCategory($category)
    {
        return response()->json(Article::published()->where('category', $category)->latest('date')->paginate(12));
    }

    public function categories()
    {
        return response()->json(Article::published()->distinct()->pluck('category'));
    }
}
