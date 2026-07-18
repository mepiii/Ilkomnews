<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Notification;
use App\Models\ProjectSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    private const STATS_CACHE_KEY = 'admin:gallery:stats';

    private const STATS_CACHE_TTL = 60;

    /**
     * Bust the public /projects and /projects/{id} caches when the
     * admin changes project status. Short TTL (60s) covers it if the
     * cache store doesn't support tags.
     */
    private function flushPublicProjectsCache(): void
    {
        try {
            Cache::tags('public-projects')->flush();
        } catch (\Throwable $e) {
            // cache store doesn't support tags
        }
    }

    public function index(Request $request)
    {
        $query = ProjectSubmission::query()->select([
            'id',
            'tracking_id',
            'title',
            'category',
            'creator_name',
            'creator_type',
            'status',
            'reviewed_at',
            'created_at',
        ]);

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }

        if ($request->has('search') && $request->search !== '') {
            $search = addcslashes($request->search, '%_');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('creator_name', 'like', "%{$search}%")
                    ->orWhere('creator_nim', 'like', "%{$search}%")
                    ->orWhere('tracking_id', 'like', "%{$search}%");
            });
        }

        $projects = $query->latest()->paginate(15)->withQueryString();

        if ($request->expectsJson()) {
            return response()->json($projects);
        }

        // Stats for the view (only computed for Blade, not JSON).
        // ponytail: cached 60s via the already-declared STATS_CACHE_KEY.
        [$total_projects, $pending_count, $accepted_count, $rejected_count] = Cache::remember(
            self::STATS_CACHE_KEY,
            self::STATS_CACHE_TTL,
            function () {
                $stats = ProjectSubmission::query()
                    ->selectRaw('COUNT(*) as total')
                    ->selectRaw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending")
                    ->selectRaw("SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted")
                    ->selectRaw("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected")
                    ->first();

                return [
                    (int) ($stats?->total ?? 0),
                    (int) ($stats?->pending ?? 0),
                    (int) ($stats?->accepted ?? 0),
                    (int) ($stats?->rejected ?? 0),
                ];
            }
        );

        return view('admin.projects.index', compact('projects', 'total_projects', 'pending_count', 'accepted_count', 'rejected_count'));
    }

    public function show(Request $request, $id)
    {
        $project = ProjectSubmission::findOrFail($id);

        if ($request->expectsJson()) {
            return response()->json($project);
        }

        return view('admin.projects.show', compact('project'));
    }

    public function accept($id)
    {
        $submission = ProjectSubmission::findOrFail($id);

        $submission->update([
            'status' => 'accepted',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        Notification::create([
            'tracking_id' => $submission->tracking_id,
            'project_id' => $submission->id,
            'type' => 'accepted',
            'title' => 'Proyek Diterima!',
            'message' => "Proyek '{$submission->title}' telah diterima dan akan ditampilkan di galeri.",
        ]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'accept_project',
            'entity_type' => 'project_submission',
            'entity_id' => $submission->id,
            'details' => ['title' => $submission->title, 'tracking_id' => $submission->tracking_id],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        Cache::forget(self::STATS_CACHE_KEY);
        Cache::forget("public-notifications:{$submission->tracking_id}");
        $this->flushPublicProjectsCache();

        if (request()->expectsJson()) {
            return response()->json(['data' => $submission->fresh()]);
        }

        return redirect()->route('admin.projects.show', $id)->with('success', 'Project accepted successfully!');
    }

    public function reject(Request $request, $id)
    {
        $submission = ProjectSubmission::findOrFail($id);

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $rejectionReason = $validated['rejection_reason'] ?? 'No reason provided';

        $submission->update([
            'status' => 'rejected',
            'rejection_reason' => $rejectionReason,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        Notification::create([
            'tracking_id' => $submission->tracking_id,
            'project_id' => $submission->id,
            'type' => 'rejected',
            'title' => 'Proyek Ditolak',
            'message' => "Proyek '{$submission->title}' tidak dapat diterima. Alasan: {$rejectionReason}",
        ]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'reject_project',
            'entity_type' => 'project_submission',
            'entity_id' => $submission->id,
            'details' => [
                'title' => $submission->title,
                'tracking_id' => $submission->tracking_id,
                'project_id' => $submission->id,
                'rejection_reason' => $rejectionReason,
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        Cache::forget(self::STATS_CACHE_KEY);
        Cache::forget("public-notifications:{$submission->tracking_id}");
        $this->flushPublicProjectsCache();

        if ($request->expectsJson()) {
            return response()->json(['data' => $submission->fresh()]);
        }

        return redirect()->route('admin.projects.show', $id)->with('success', 'Project rejected successfully!');
    }

    public function destroy($id)
    {
        $submission = ProjectSubmission::findOrFail($id);

        // Log before deletion for audit trail
        Log::warning('Project deletion initiated', [
            'project_id' => $submission->id,
            'title' => $submission->title,
            'tracking_id' => $submission->tracking_id,
            'status' => $submission->status,
            'notifications_count' => Notification::where('project_id', $submission->id)->count(),
            'admin_user_id' => auth()->id(),
            'ip_address' => request()->ip(),
        ]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'delete_project',
            'entity_type' => 'project_submission',
            'entity_id' => $submission->id,
            'details' => [
                'title' => $submission->title,
                'tracking_id' => $submission->tracking_id,
                'project_id' => $submission->id,
                'status' => $submission->status,
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        // Delete associated files from storage
        if ($submission->thumbnail && ! filter_var($submission->thumbnail, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($submission->thumbnail);
        }
        if ($submission->creator_avatar && ! filter_var($submission->creator_avatar, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($submission->creator_avatar);
        }
        if ($submission->screenshots && is_array($submission->screenshots)) {
            foreach ($submission->screenshots as $screenshot) {
                if (! filter_var($screenshot, FILTER_VALIDATE_URL)) {
                    Storage::disk('public')->delete($screenshot);
                }
            }
        }

        // Delete associated notifications (FK will null them out, but clean up explicitly)
        Notification::where('project_id', $submission->id)->delete();

        $submission->delete();

        Cache::forget(self::STATS_CACHE_KEY);
        $this->flushPublicProjectsCache();

        if (request()->expectsJson()) {
            return response()->json(['message' => 'Proyek berhasil dihapus!']);
        }

        return redirect()->route('admin.projects.index')->with('success', 'Proyek berhasil dihapus!');
    }

    public function stats()
    {
        $stats = Cache::remember(self::STATS_CACHE_KEY, self::STATS_CACHE_TTL, function () {
            $row = ProjectSubmission::query()
                ->selectRaw('COUNT(*) as total')
                ->selectRaw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending")
                ->selectRaw("SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted")
                ->selectRaw("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected")
                ->selectRaw("SUM(CASE WHEN category = 'web' THEN 1 ELSE 0 END) as web")
                ->selectRaw("SUM(CASE WHEN category = 'mobile' THEN 1 ELSE 0 END) as mobile")
                ->selectRaw("SUM(CASE WHEN category = 'uiux' THEN 1 ELSE 0 END) as uiux")
                ->selectRaw("SUM(CASE WHEN category = 'game' THEN 1 ELSE 0 END) as game")
                ->selectRaw("SUM(CASE WHEN category = 'ai' THEN 1 ELSE 0 END) as ai")
                ->first();

            return [
                'total' => (int) ($row?->total ?? 0),
                'pending' => (int) ($row?->pending ?? 0),
                'accepted' => (int) ($row?->accepted ?? 0),
                'rejected' => (int) ($row?->rejected ?? 0),
                'web' => (int) ($row?->web ?? 0),
                'mobile' => (int) ($row?->mobile ?? 0),
                'uiux' => (int) ($row?->uiux ?? 0),
                'game' => (int) ($row?->game ?? 0),
                'ai' => (int) ($row?->ai ?? 0),
            ];
        });

        return response()->json($stats);
    }
}
