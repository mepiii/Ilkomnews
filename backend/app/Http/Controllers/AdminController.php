<?php

namespace App\Http\Controllers;

use App\Models\ProjectSubmission;
use Illuminate\Http\Request;

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

        return response()->json(['message' => 'Submission accepted', 'submission' => $submission]);
    }

    // Reject a submission
    public function reject(Request $request, ProjectSubmission $submission)
    {
        $request->validate(['rejection_reason' => 'required|string']);

        $submission->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

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
