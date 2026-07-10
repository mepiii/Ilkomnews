<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\ProjectSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class NotificationController extends Controller
{
    /**
     * Get all notifications for admin
     */
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::with('project:id,title,category,thumbnail,status,rejection_reason')
            ->latest()
            ->paginate($request->input('per_page', 20));

        $unreadCount = Notification::where('read', false)->count();

        return response()->json([
            'data' => $notifications->items(),
            'unread_count' => $unreadCount,
            'pagination' => [
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
            ],
        ]);
    }

    /**
     * Create a notification (used by admin actions such as admin account changes).
     * tracking_id is intentionally nullable for system/admin notifications.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:submitted,accepted,rejected,admin,info',
            'title' => 'required|string|max:255',
            'message' => 'nullable|string',
            'project_id' => 'nullable|exists:project_submissions,id',
        ]);

        $notification = Notification::create([
            'tracking_id' => null,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'message' => $validated['message'] ?? '',
            'project_id' => $validated['project_id'] ?? null,
            'read' => false,
        ]);

        return response()->json([
            'message' => 'Notification created',
            'data' => $notification,
        ], 201);
    }

    /**
     * Get unread notification count
     */
    public function unreadCount(): JsonResponse
    {
        return response()->json([
            'count' => Notification::where('read', false)->count(),
        ]);
    }

    /**
     * Mark a notification as read
     */
    public function markRead(int $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['read' => true]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllRead(): JsonResponse
    {
        Notification::where('read', false)->update(['read' => true]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Get public notifications by tracking ID (for non-authenticated users)
     */
    public function publicByTracking(string $trackingId): JsonResponse
    {
        $payload = Cache::remember("public-notifications:{$trackingId}", 5, function () use ($trackingId) {
            $notifications = Notification::where('tracking_id', $trackingId)
                ->with('project:id,title,category,thumbnail,status,rejection_reason')
                ->latest()
                ->get()
                ->map(function ($notif) {
                    // Include rejection reason directly in the notification
                    if ($notif->type === 'rejected' && $notif->project) {
                        $notif->rejection_reason = $notif->project->rejection_reason;
                    }
                    return $notif;
                });

            return ['data' => $notifications];
        });

        return response()->json($payload);
    }

    /**
     * Mark a public notification as read (by tracking ID)
     */
    public function publicMarkRead(Request $request, string $trackingId, int $id): JsonResponse
    {
        $notification = Notification::where('tracking_id', $trackingId)
            ->where('id', $id)
            ->firstOrFail();

        $notification->update(['read' => true]);

        Cache::forget("public-notifications:{$trackingId}");

        return response()->json(['message' => 'Notification marked as read']);
    }
}
