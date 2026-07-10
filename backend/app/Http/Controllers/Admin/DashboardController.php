<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\ProjectSubmission;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_news' => News::count(),
            'published_news' => News::where('published', true)->count(),
            'draft_news' => News::where('published', false)->count(),
            'total_views' => News::sum('views'),
            'total_projects' => ProjectSubmission::count(),
            'pending_projects' => ProjectSubmission::pending()->count(),
            'accepted_projects' => ProjectSubmission::accepted()->count(),
            'rejected_projects' => ProjectSubmission::rejected()->count(),
        ];

        // Both "Tayang" (published) and "Draft" news are intentionally included.
        $recent_news = News::latest('date')->take(5)->get();
        $recent_projects = ProjectSubmission::latest()->take(5)->get();

        return view('admin.dashboard', [
            'stats' => $stats,
            'recent_news' => $recent_news,
            'recent_projects' => $recent_projects,
        ]);
    }

    public function apiStats()
    {
        return response()->json([
            'stats' => [
                'total_news' => News::count(),
                'published_news' => News::where('published', true)->count(),
                'draft_news' => News::where('published', false)->count(),
                'total_views' => (int) News::sum('views'),
                'total_projects' => ProjectSubmission::count(),
                'pending_projects' => ProjectSubmission::pending()->count(),
                'accepted_projects' => ProjectSubmission::accepted()->count(),
                'rejected_projects' => ProjectSubmission::rejected()->count(),
            ],
            // Both "Tayang" (published) and "Draft" news are intentionally included.
            'recent_news' => News::latest('date')->take(5)->get(),
            'recent_projects' => ProjectSubmission::latest()->take(5)->get(),
        ]);
    }
}
