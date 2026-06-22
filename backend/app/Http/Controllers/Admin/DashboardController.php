<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\ProjectSubmission;

class DashboardController extends Controller
{
    public function apiStats()
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

        $recentNews = News::latest('date')->take(5)->get();
        $recentProjects = ProjectSubmission::latest()->take(5)->get();

        return response()->json([
            'stats' => $stats,
            'recent_news' => $recentNews,
            'recent_projects' => $recentProjects,
        ]);
    }
}
