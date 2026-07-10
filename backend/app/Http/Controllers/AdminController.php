<?php

namespace App\Http\Controllers;

use App\Http\Requests\RejectSubmissionRequest;
use App\Models\Notification;
use App\Models\ProjectSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // List all submissions with filters
    public function index(Request $request)
    {
        $query = ProjectSubmission::query();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = addcslashes($request->search, '%_');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('creator_name', 'like', "%{$search}%")
                  ->orWhere('tracking_id', 'like', "%{$search}%");
            });
        }

        $submissions = $query->latest()->paginate(15);

        return response()->json($submissions);
    }

    // Get single submission
    public function show(ProjectSubmission $submission)
    {
        return response()->json($submission);
    }

    // Accept a submission
    public function accept(ProjectSubmission $submission)
    {
        $submission->update([
            'status' => 'accepted',
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        // Notify the submitter that their project was accepted & published
        Notification::create([
            'tracking_id' => $submission->tracking_id,
            'project_id'  => $submission->id,
            'type'        => 'accepted',
            'title'       => 'Proyek Diterima',
            'message'     => 'Selamat! Proyek "' . $submission->title . '" telah diterima dan dipublikasikan di ILKOM Gallery.',
            'read'        => false,
        ]);

        // Bust the user's cached public notification list so it appears promptly
        Cache::forget("public-notifications:{$submission->tracking_id}");

        // Bust the public projects cache so the gallery reflects the change
        try { Cache::tags('public-projects')->flush(); } catch (\Throwable $e) {}

        return response()->json(['message' => 'Submission accepted', 'submission' => $submission]);
    }

    // Reject a submission
    public function reject(RejectSubmissionRequest $request, ProjectSubmission $submission)
    {
        $submission->update([
            'status' => 'rejected',
            'rejection_reason' => $request->validated()['rejection_reason'],
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        // Notify the submitter that their project was rejected
        Notification::create([
            'tracking_id' => $submission->tracking_id,
            'project_id'  => $submission->id,
            'type'        => 'rejected',
            'title'       => 'Proyek Ditolak',
            'message'     => 'Proyek "' . $submission->title . '" ditolak. Alasan: ' . $request->validated()['rejection_reason'],
            'read'        => false,
        ]);

        // Bust the user's cached public notification list so it appears promptly
        Cache::forget("public-notifications:{$submission->tracking_id}");

        // Bust the public projects cache so the gallery reflects the change
        try { Cache::tags('public-projects')->flush(); } catch (\Throwable $e) {}

        return response()->json(['message' => 'Submission rejected', 'submission' => $submission]);
    }

    // Stats
    public function stats()
    {
        return response()->json([
            'total' => ProjectSubmission::count(),
            'pending' => ProjectSubmission::pending()->count(),
            'accepted' => ProjectSubmission::accepted()->count(),
            'rejected' => ProjectSubmission::rejected()->count(),
        ]);
    }
}
