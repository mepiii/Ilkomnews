<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\News;
use App\Services\ImageCompressionService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        // Hard fix: physically delete TTL-expired news so it can never
        // linger in the admin list after its time passes. The admin list is
        // the source of truth (no visibility filter), so deletion is the
        // only reliable way to make "already passed" news disappear.
        // ponytail: throttled to once/minute via cache lock; public reads
        // in BasePublishableController do the same as a fallback.
        $lock = 'ttl:admin-prune';
        if (!Cache::has($lock)) {
            Cache::put($lock, true, 60);
            News::whereNotNull('expires_at')->where('expires_at', '<=', now())->delete();
        }

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
            'author_image' => 'nullable|image|mimes:jpeg,jpg,png,webp,gif|max:500',
            'author_institution' => 'nullable|string|max:255',
            'author_position' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp,gif|max:500', // 500KB max
            'expires_at' => 'nullable|date|after:now',
        ]);

        $compressor = new ImageCompressionService();
        if ($request->hasFile('image')) {
            $validated['image'] = $compressor->compress($request->file('image'), 'news');
        }

        if ($request->hasFile('author_image')) {
            $validated['author_image'] = $compressor->compress($request->file('author_image'), 'news/authors');
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

        $compressor = new ImageCompressionService();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|max:255',
            'date' => 'required|date',
            'published' => 'nullable|boolean',
            'summary' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'author_image' => 'nullable|image|mimes:jpeg,jpg,png,webp,gif|max:500',
            'author_institution' => 'nullable|string|max:255',
            'author_position' => 'nullable|string|max:255',
            'tags' => 'nullable',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp,gif|max:10240',
            'remove_image' => 'nullable|boolean',
            'remove_author_image' => 'nullable|boolean',
            'expires_at' => 'nullable|date|after:now',
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
            $validated['author_image'] = $compressor->compress($request->file('author_image'), 'news/authors');
        }

        if ($request->hasFile('image')) {
            if ($news->image && !$request->boolean('remove_image')) {
                Storage::disk('public')->delete($news->image);
            }
            $validated['image'] = $compressor->compress($request->file('image'), 'news');
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

    public function toggleHidden($id)
    {
        $news = News::findOrFail($id);
        $news->update(['published' => !$news->published]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'toggle_news_hidden',
            'entity_type' => 'news',
            'entity_id' => $news->id,
            'details' => ['title' => $news->title, 'published' => $news->published],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return response()->json(['data' => ['id' => $news->id, 'published' => $news->published]]);
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
