<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\ProjectSubmission;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = ProjectSubmission::query();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $search = addcslashes($request->search, '%_');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('creator_name', 'like', "%{$search}%")
                  ->orWhere('tracking_id', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function show(ProjectSubmission $submission)
    {
        return response()->json($submission);
    }

    public function accept(ProjectSubmission $submission)
    {
        $submission->update([
            'status' => 'accepted',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        \App\Models\Notification::create([
            'tracking_id' => $submission->tracking_id,
            'type' => 'accepted',
            'title' => 'Project Diterima!',
            'message' => "Project '{$submission->title}' telah diterima dan akan ditampilkan di galeri.",
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

        return response()->json(['message' => 'Submission accepted', 'data' => $submission]);
    }

    public function reject(Request $request, ProjectSubmission $submission)
    {
        $request->validate(['rejection_reason' => 'required|string']);

        $submission->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        \App\Models\Notification::create([
            'tracking_id' => $submission->tracking_id,
            'type' => 'rejected',
            'title' => 'Project Ditolak',
            'message' => "Project '{$submission->title}' tidak dapat diterima. Alasan: {$request->rejection_reason}",
        ]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'reject_project',
            'entity_type' => 'project_submission',
            'entity_id' => $submission->id,
            'details' => [
                'title' => $submission->title,
                'tracking_id' => $submission->tracking_id,
                'rejection_reason' => $request->rejection_reason,
            ],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return response()->json(['message' => 'Submission rejected', 'data' => $submission]);
    }

    public function stats()
    {
        return response()->json([
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
    }
}
