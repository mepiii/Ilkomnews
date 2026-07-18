<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\ProjectSubmission;
use App\Notifications\SseRegistry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class NotificationController extends Controller
{
    private const UNREAD_COUNT_CACHE_KEY = 'admin:notifications:unread_count';

    private const UNREAD_COUNT_CACHE_TTL = 10;

    /**
     * Get all notifications for admin
     */
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::query()
            ->select(['id', 'tracking_id', 'project_id', 'type', 'title', 'message', 'read', 'created_at'])
            ->with('project:id,title,category,thumbnail,status,rejection_reason')
            ->latest()
            ->paginate(min((int) $request->input('per_page', 20), 100));

        $unreadCount = Cache::remember(
            self::UNREAD_COUNT_CACHE_KEY,
            self::UNREAD_COUNT_CACHE_TTL,
            fn () => Notification::where('read', false)->count()
        );

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
        Cache::forget(self::UNREAD_COUNT_CACHE_KEY);

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
            'count' => Cache::remember(
                self::UNREAD_COUNT_CACHE_KEY,
                self::UNREAD_COUNT_CACHE_TTL,
                fn () => Notification::where('read', false)->count()
            ),
        ]);
    }

    /**
     * Mark a notification as read
     */
    public function markRead(int $id): JsonResponse
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['read' => true]);
        Cache::forget(self::UNREAD_COUNT_CACHE_KEY);

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllRead(): JsonResponse
    {
        Notification::where('read', false)->update(['read' => true]);
        Cache::forget(self::UNREAD_COUNT_CACHE_KEY);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Get public notifications by tracking ID (for non-authenticated users)
     */
    public function publicByTracking(string $trackingId): JsonResponse
    {
        try {
            $payload = Cache::remember("public-notifications:{$trackingId}", 5, function () use ($trackingId) {
                return ['data' => $this->publicNotifications($trackingId)];
            });
        } catch (\Throwable $e) {
            // Cache is an optimization, never a hard dependency.
            $payload = ['data' => $this->publicNotifications($trackingId)];
        }

        return response()->json($payload);
    }

    /**
     * SSE stream of public notifications for a tracking ID (event-driven, no polling).
     * Sends an initial "init" frame from the DB, then pushes "notification" frames
     * on each new Notification created for this trackingId.
     */
    public function stream(string $trackingId): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
            'Connection' => 'keep-alive',
        ];

        $stream = function () use ($trackingId) {
            ignore_user_abort(true);

            // Initial frame from DB (NO cache layer).
            $init = ['data' => $this->publicNotifications($trackingId)];
            echo "event: init\ndata: " . json_encode($init) . "\n\n";
            flush();

            $registry = SseRegistry::register($trackingId, function ($notification) {
                echo "event: notification\ndata: " . json_encode($notification) . "\n\n";
                flush();
            });

            while (!connection_aborted()) {
                // Heartbeat comment to keep the connection alive.
                echo ": heartbeat\n";
                flush();
                sleep(1);
            }

            SseRegistry::unregister($trackingId, $registry);
        };

        return response()->stream($stream, 200, $headers);
    }

    /**
     * Shared DB query for public notifications by tracking ID.
     * Used by publicByTracking (with cache fallback) and stream (no cache).
     */
    private function publicNotifications(string $trackingId): \Illuminate\Database\Eloquent\Collection
    {
        return Notification::where('tracking_id', $trackingId)
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
        Cache::forget(self::UNREAD_COUNT_CACHE_KEY);

        return response()->json(['message' => 'Notification marked as read']);
    }
}
