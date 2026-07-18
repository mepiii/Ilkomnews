<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\ProjectSubmission;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index()
    {
        $data = $this->safeDashboardData();

        return view('admin.dashboard', [
            'stats' => $data['stats'],
            'recent_news' => $data['recent_news'],
            'recent_projects' => $data['recent_projects'],
        ]);
    }

    public function apiStats()
    {
        $data = $this->safeDashboardData();

        return response()->json([
            'stats' => $data['stats'],
            'recent_news' => $data['recent_news'],
            'recent_projects' => $data['recent_projects'],
        ]);
    }

    /**
     * Build dashboard stats + recent lists. Degrades to zeros/empty on a DB
     * outage so the admin panel never 500s when MySQL is briefly unavailable.
     * ponytail: resilient but not retried; a down DB simply shows "—".
     * The eight counts are wrapped in a 60s cache (was 9+ uncached queries
     * per dashboard load). Keeps the original per-column counts for correctness.
     */
    private function safeDashboardData(): array
    {
        try {
            $stats = Cache::remember('admin:dashboard:stats', 60, function () {
                $newsStats = News::query()
                    ->selectRaw('COUNT(*) as total_news')
                    ->selectRaw('SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published_news')
                    ->selectRaw('SUM(CASE WHEN published = 0 THEN 1 ELSE 0 END) as draft_news')
                    ->selectRaw('COALESCE(SUM(views), 0) as total_views')
                    ->first();

                $projectStats = ProjectSubmission::query()
                    ->selectRaw('COUNT(*) as total_projects')
                    ->selectRaw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_projects")
                    ->selectRaw("SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_projects")
                    ->selectRaw("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_projects")
                    ->first();

                return [
                    'total_news' => (int) ($newsStats?->total_news ?? 0),
                    'published_news' => (int) ($newsStats?->published_news ?? 0),
                    'draft_news' => (int) ($newsStats?->draft_news ?? 0),
                    'total_views' => (int) ($newsStats?->total_views ?? 0),
                    'total_projects' => (int) ($projectStats?->total_projects ?? 0),
                    'pending_projects' => (int) ($projectStats?->pending_projects ?? 0),
                    'accepted_projects' => (int) ($projectStats?->accepted_projects ?? 0),
                    'rejected_projects' => (int) ($projectStats?->rejected_projects ?? 0),
                ];
            });

            // Both "Tayang" (published) and "Draft" news are intentionally included.
            $recent_news = News::query()
                ->select(['id', 'title', 'slug', 'category', 'date', 'author', 'published', 'views'])
                ->latest('date')
                ->take(5)
                ->get();
            $recent_projects = ProjectSubmission::query()
                ->select(['id', 'tracking_id', 'title', 'category', 'creator_name', 'status', 'created_at'])
                ->latest()
                ->take(5)
                ->get();
        } catch (\Throwable $e) {
            $stats = [
                'total_news' => 0,
                'published_news' => 0,
                'draft_news' => 0,
                'total_views' => 0,
                'total_projects' => 0,
                'pending_projects' => 0,
                'accepted_projects' => 0,
                'rejected_projects' => 0,
            ];
            $recent_news = new Collection();
            $recent_projects = new Collection();
        }

        return [
            'stats' => $stats,
            'recent_news' => $recent_news,
            'recent_projects' => $recent_projects,
        ];
    }
}
