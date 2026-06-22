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
            'date' => 'required|date',
            'published' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120', // 5MB max
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('news', 'public');
        }

        // Set published to false if not checked
        $validated['published'] = $request->has('published') ? true : false;

        // Generate slug from title
        $validated['slug'] = Str::slug($validated['title']);

        // Set default values
        $validated['views'] = 0;

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

        return redirect()->route('admin.news.index')->with('success', 'News article created successfully!');
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
            'date' => 'required|date',
            'published' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'remove_image' => 'nullable|boolean',
        ]);

        // Handle image removal
        if ($request->has('remove_image') && $news->image) {
            Storage::disk('public')->delete($news->image);
            $validated['image'] = null;
        }

        // Handle new image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($news->image && !$request->has('remove_image')) {
                Storage::disk('public')->delete($news->image);
            }
            $validated['image'] = $request->file('image')->store('news', 'public');
        }

        // Set published to false if not checked
        $validated['published'] = $request->has('published') ? true : false;

        // Update slug if title changed
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

        return redirect()->route('admin.news.index')->with('success', 'News article updated successfully!');
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

        // Delete associated image if exists
        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }

        $news->delete();

        return redirect()->route('admin.news.index')->with('success', 'News article deleted successfully!');
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
