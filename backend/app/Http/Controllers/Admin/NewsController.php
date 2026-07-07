<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $query = News::query();

        if ($request->has('status') && $request->status !== '') {
            $query->where('published', $request->status === 'published');
        }

        if ($request->has('search') && $request->search !== '') {
            $search = addcslashes($request->search, '%_');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $news = $query->latest('date')->paginate(15)->withQueryString();

        if ($request->expectsJson()) {
            return response()->json($news);
        }

        return view('admin.news.index', compact('news'));
    }

    public function create()
    {
        return view('admin.news.form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|max:255',
            'date' => 'required|date',
            'published' => 'nullable|boolean',
            'summary' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'author_image' => 'nullable|image|mimes:jpeg,jpg,png,webp,gif,svg|max:500',
            'author_institution' => 'nullable|string|max:255',
            'author_position' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp,gif,svg|max:500', // 500KB max
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('news', 'public');
        }

        if ($request->hasFile('author_image')) {
            $validated['author_image'] = $request->file('author_image')->store('news/authors', 'public');
        }

        $validated['published'] = $request->boolean('published');
        $baseSlug = Str::slug($validated['title']);
        $slug = $baseSlug;
        $i = 1;
        while (News::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$i}";
            $i++;
        }
        $validated['slug'] = $slug;
        $validated['views'] = 0;
        
        if (empty($validated['summary'])) {
            $validated['summary'] = Str::limit(strip_tags($validated['content']), 160);
        }
        
        if (empty($validated['author'])) {
            $validated['author'] = auth()->user()?->name ?? 'Admin';
        }

        if (isset($validated['tags']) && is_string($validated['tags'])) {
            $tagsDecoded = json_decode($validated['tags'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $validated['tags'] = $tagsDecoded;
            } else {
                // fallback if it's just a comma separated string
                $validated['tags'] = array_map('trim', explode(',', $validated['tags']));
            }
        }

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

        if ($request->expectsJson()) {
            return response()->json(['data' => $news], 201);
        }

        return redirect()->route('admin.news.index')->with('success', 'Artikel berita berhasil dibuat!');
    }

    public function edit($id)
    {
        $news = News::findOrFail($id);
        return view('admin.news.form', compact('news'));
    }

    public function show(News $news)
    {
        return response()->json($news);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|max:255',
            'date' => 'required|date',
            'published' => 'nullable|boolean',
            'summary' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'author_image' => 'nullable|image|mimes:jpeg,jpg,png,webp,gif,svg|max:500',
            'author_institution' => 'nullable|string|max:255',
            'author_position' => 'nullable|string|max:255',
            'tags' => 'nullable',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp,gif,svg|max:10240',
            'remove_image' => 'nullable|boolean',
            'remove_author_image' => 'nullable|boolean',
        ]);

        if ($request->boolean('remove_image') && $news->image) {
            Storage::disk('public')->delete($news->image);
            $validated['image'] = null;
        }

        if ($request->boolean('remove_author_image') && $news->author_image) {
            Storage::disk('public')->delete($news->author_image);
            $validated['author_image'] = null;
        }

        if ($request->hasFile('author_image')) {
            if ($news->author_image) {
                Storage::disk('public')->delete($news->author_image);
            }
            $validated['author_image'] = $request->file('author_image')->store('news/authors', 'public');
        }

        if ($request->hasFile('image')) {
            if ($news->image && !$request->boolean('remove_image')) {
                Storage::disk('public')->delete($news->image);
            }
            $validated['image'] = $request->file('image')->store('news', 'public');
        }

        $validated['published'] = $request->boolean('published');

        if ($news->title !== $validated['title']) {
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $i = 1;
            while (News::where('slug', $slug)->where('id', '!=', $news->id)->exists()) {
                $slug = "{$baseSlug}-{$i}";
                $i++;
            }
            $validated['slug'] = $slug;
        }

        if (empty($validated['summary'])) {
            $validated['summary'] = Str::limit(strip_tags($validated['content']), 160);
        }
        
        if (empty($validated['author'])) {
            $validated['author'] = $news->author ?? auth()->user()?->name ?? 'Admin';
        }

        if (isset($validated['tags']) && is_string($validated['tags'])) {
            $tagsDecoded = json_decode($validated['tags'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $validated['tags'] = $tagsDecoded;
            } else {
                $validated['tags'] = array_map('trim', explode(',', $validated['tags']));
            }
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

        if ($request->expectsJson()) {
            return response()->json(['data' => $news->fresh()]);
        }

        return redirect()->route('admin.news.index')->with('success', 'Artikel berita berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'delete_news',
            'entity_type' => 'news',
            'entity_id' => $news->id,
            'details' => ['title' => $news->title],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }

        $news->delete();

        if (request()->expectsJson()) {
            return response()->json(['message' => 'Artikel berita berhasil dihapus!']);
        }

        return redirect()->route('admin.news.index')->with('success', 'Artikel berita berhasil dihapus!');
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
