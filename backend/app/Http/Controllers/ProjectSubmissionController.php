<?php

namespace App\Http\Controllers;

use App\Models\ProjectSubmission;
use Illuminate\Http\Request;

class ProjectSubmissionController extends Controller
{
    // Public: submit a project (no auth required)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:web,mobile,uiux,game,ai',
            'description' => 'required|string|max:5000',
            'thumbnail' => 'nullable|string|max:500',
            'tech_stack' => 'nullable|array|max:20',
            'tech_stack.*' => 'string|max:50',
            'live_demo' => 'nullable|string|max:500',
            'github_link' => 'nullable|string|max:500',
            'download_link' => 'nullable|string|max:500',
            'figma_link' => 'nullable|string|max:500',
            'screenshots' => 'nullable|array|max:10',
            'screenshots.*' => 'string|max:500',
            'creator_name' => 'required|string|max:255',
            'creator_nim' => 'required|string|max:50',
            'creator_major' => 'required|string|max:255',
            'creator_year' => 'required|integer|min:2000|max:2030',
            'collaborators' => 'nullable|array|max:20',
            'collaborators.*' => 'string|max:100',
        ]);

        $submission = ProjectSubmission::create($validated);

        return response()->json([
            'message' => 'Project submitted successfully!',
            'tracking_id' => $submission->tracking_id,
            'status' => $submission->status,
        ], 201);
    }

    // Public: track submission by tracking_id
    public function track(string $trackingId)
    {
        $submission = ProjectSubmission::where('tracking_id', $trackingId)->firstOrFail();

        return response()->json([
            'tracking_id' => $submission->tracking_id,
            'status' => $submission->status,
            'title' => $submission->title,
            'category' => $submission->category,
            'rejection_reason' => $submission->rejection_reason,
            'reviewed_at' => $submission->reviewed_at?->toIso8601String(),
            'created_at' => $submission->created_at->toIso8601String(),
        ]);
    }

    // Public: list accepted projects
    public function publicIndex(Request $request)
    {
        $query = ProjectSubmission::where('status', 'accepted');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $search = addcslashes($request->search, '%_');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('creator_name', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate(12));
    }

    // Public: single accepted project
    public function publicShow(string $id)
    {
        $submission = ProjectSubmission::where('id', $id)
            ->where('status', 'accepted')
            ->firstOrFail();

        return response()->json($submission);
    }
}
