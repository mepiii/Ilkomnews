<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\ProjectSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class GalleryController extends Controller
{
    private const STATS_CACHE_KEY = 'admin:gallery:stats';
    private const STATS_CACHE_TTL = 60;
    public function index(Request $request)
    {
        $query = ProjectSubmission::query();

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

        // Stats for the view
        $total_projects = ProjectSubmission::count();
        $pending_count = ProjectSubmission::where('status', 'pending')->count();
        $accepted_count = ProjectSubmission::where('status', 'accepted')->count();
        $rejected_count = ProjectSubmission::where('status', 'rejected')->count();

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

        \App\Models\Notification::create([
            'tracking_id' => $submission->tracking_id,
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

        \App\Models\Notification::create([
            'tracking_id' => $submission->tracking_id,
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
                'rejection_reason' => $rejectionReason,
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        Cache::forget(self::STATS_CACHE_KEY);

        if ($request->expectsJson()) {
            return response()->json(['data' => $submission->fresh()]);
        }

        return redirect()->route('admin.projects.show', $id)->with('success', 'Project rejected successfully!');
    }

    public function destroy($id)
    {
        $submission = ProjectSubmission::findOrFail($id);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'delete_project',
            'entity_type' => 'project_submission',
            'entity_id' => $submission->id,
            'details' => [
                'title' => $submission->title,
                'tracking_id' => $submission->tracking_id,
                'status' => $submission->status,
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        // Delete associated files if they exist
        // Note: Currently thumbnail and screenshots are stored as strings/paths
        // If they were file uploads, we would need to delete them from storage here

        $submission->delete();

        Cache::forget(self::STATS_CACHE_KEY);

        if (request()->expectsJson()) {
            return response()->json(['message' => 'Proyek berhasil dihapus!']);
        }

        return redirect()->route('admin.projects.index')->with('success', 'Proyek berhasil dihapus!');
    }

    public function stats()
    {
        $stats = Cache::remember(self::STATS_CACHE_KEY, self::STATS_CACHE_TTL, fn () => [
            'total' => ProjectSubmission::count(),
            'pending' => ProjectSubmission::pending()->count(),
            'accepted' => ProjectSubmission::accepted()->count(),
            'rejected' => ProjectSubmission::rejected()->count(),
            'web' => ProjectSubmission::where('category', 'web')->count(),
            'mobile' => ProjectSubmission::where('category', 'mobile')->count(),
            'uiux' => ProjectSubmission::where('category', 'uiux')->count(),
            'game' => ProjectSubmission::where('category', 'game')->count(),
            'ai' => ProjectSubmission::where('category', 'ai')->count(),
        ]);

        return response()->json($stats);
    }
}
