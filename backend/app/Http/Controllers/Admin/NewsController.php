<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::query();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('published', $request->status === 'published');
        }

        if ($request->has('search')) {
            $search = addcslashes($request->search, '%_');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest('date')->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'nullable|string|max:500',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'date' => 'required|date',
            'author' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
            'published' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        $news = News::create($validated);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'create_news',
            'entity_type' => 'news',
            'entity_id' => $news->id,
            'details' => ['title' => $news->title],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return response()->json(['message' => 'Berita created', 'data' => $news], 201);
    }

    public function show(News $news)
    {
        return response()->json($news);
    }

    public function update(Request $request, News $news)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'nullable|string|max:500',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'date' => 'required|date',
            'author' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
            'published' => 'boolean',
        ]);

        if ($news->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $news->update($validated);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'update_news',
            'entity_type' => 'news',
            'entity_id' => $news->id,
            'details' => ['title' => $news->title],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return response()->json(['message' => 'Berita updated', 'data' => $news]);
    }

    public function destroy(News $news)
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'delete_news',
            'entity_type' => 'news',
            'entity_id' => $news->id,
            'details' => ['title' => $news->title],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        $news->delete();
        return response()->json(['message' => 'Berita deleted']);
    }

    public function stats()
    {
        return response()->json([
            'total' => News::count(),
            'published' => News::where('published', true)->count(),
            'draft' => News::where('published', false)->count(),
            'total_views' => News::sum('views'),
        ]);
    }
}
