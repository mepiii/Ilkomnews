<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::published()->latest('date');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $search = addcslashes($request->search, '%_');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('summary', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(12));
    }

    public function latest(Request $request)
    {
        $limit = min($request->get('limit', 6), 20);
        return response()->json(News::published()->latest('date')->take($limit)->get());
    }

    public function show($id)
    {
        $news = News::published()->where('id', $id)->orWhere('slug', $id)->firstOrFail();
        $news->incrementViews();
        return response()->json($news);
    }

    public function categories()
    {
        return response()->json(News::published()->distinct()->pluck('category'));
    }
}
