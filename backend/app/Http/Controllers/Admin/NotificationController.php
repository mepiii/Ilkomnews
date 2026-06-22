<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $notifications = Notification::latest()->get();
        $unreadCount = Notification::where('read', false)->count();

        return response()->json([
            'data' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function unreadCount(): JsonResponse
    {
        return response()->json([
            'count' => Notification::where('read', false)->count(),
        ]);
    }

    public function markRead(int $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['read' => true]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllRead(): JsonResponse
    {
        Notification::where('read', false)->update(['read' => true]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function publicByTracking(string $trackingId): JsonResponse
    {
        $notifications = Notification::where('tracking_id', $trackingId)
            ->latest()
            ->get();

        return response()->json(['data' => $notifications]);
    }
}
