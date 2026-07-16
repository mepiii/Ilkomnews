<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\CareerController;
use App\Http\Controllers\ProjectSubmissionController;
use App\Http\Controllers\InteractionController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Api\Admin\AdminProfileController;
use App\Http\Controllers\Api\Admin\ApiKeyController;
use App\Http\Controllers\Admin\NotificationController;
use Illuminate\Support\Facades\Route;

// ── Public API (rate limited) ──
Route::middleware('throttle:api')->group(function () {

    // Liveness probe for external uptime monitors (DB-only, no info leak)
    Route::get('/ping', [Admin\HealthController::class, 'ping']);

    // News
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/latest', [NewsController::class, 'latest']);
    Route::get('/news/categories', [NewsController::class, 'categories']);
    Route::get('/news/{id}', [NewsController::class, 'show']);

    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/upcoming', [EventController::class, 'upcoming']);
    Route::get('/events/categories', [EventController::class, 'categories']);
    Route::get('/events/{id}', [EventController::class, 'show']);

    // Careers
    Route::get('/careers', [CareerController::class, 'index']);
    Route::get('/careers/types', [CareerController::class, 'types']);
    Route::get('/careers/locations', [CareerController::class, 'locations']);
    Route::get('/careers/{id}', [CareerController::class, 'show']);

    // Notifications (public - by tracking ID)
    Route::get('/notifications/{trackingId}', [NotificationController::class, 'publicByTracking']);
    Route::get('/notifications/stream/{trackingId}', [NotificationController::class, 'stream'])->middleware('throttle:10,1');
    Route::post('/notifications/{trackingId}/{id}/read', [NotificationController::class, 'publicMarkRead'])->middleware('throttle:60,1');

    // Submissions (public, rate limited)
    Route::post('/submissions', [ProjectSubmissionController::class, 'store'])->middleware('throttle:5,1');
    Route::get('/submissions/track/{trackingId}', [ProjectSubmissionController::class, 'track']);
    Route::get('/upload-quota', function (\Illuminate\Http\Request $request) {
        $service = new \App\Services\UploadQuotaService();
        return response()->json($service->getStatus($request));
    });

    // Public projects (accepted only)
    Route::get('/projects', [ProjectSubmissionController::class, 'publicIndex']);
    Route::get('/projects/{id}', [ProjectSubmissionController::class, 'publicShow']);

    // Chatbot (Wolfy) — rate limited separately
    Route::post('/chat', [ChatController::class, 'chat'])->middleware('throttle:chatbot');
    // SSE streaming endpoint (token-by-token). FAQ hits never reach this.
    Route::post('/chat/stream', [ChatController::class, 'chatStream'])->middleware('throttle:chatbot');

    // Interaction tracking (public)
    Route::get('/interactions/{type}/{id}/stats', [InteractionController::class, 'stats']);
    Route::post('/interactions/{type}/{id}/view', [InteractionController::class, 'incrementView']);
    Route::post('/interactions/{type}/{id}/like', [InteractionController::class, 'toggleLike']);
    Route::post('/interactions/{type}/{id}/save', [InteractionController::class, 'toggleSave']);
    Route::post('/interactions/{type}/{id}/share', [InteractionController::class, 'incrementShare']);
});

// ──────────────────────────────────────────────────────────────────────────
// SPA Admin API — mounted at /api/admin/* (matches frontend adminApi.js base).
//
// These routes opt into the 'web' middleware group inline so the session cookie
// (Sanctum SPA / httpOnly) auth, CSRF token, and cookie encryption all apply,
// while still living under the /api prefix like the rest of the ILKOM API.
// ──────────────────────────────────────────────────────────────────────────
Route::prefix('admin')->middleware('web')->group(function () {

    // Login (guest, throttled)
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

    // Authenticated admin endpoints (layered: session auth -> admin gate -> rate limit)
    Route::middleware(['auth', 'admin', 'throttle:admin'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::get('/dashboard', [DashboardController::class, 'apiStats']);

        // File upload
        Route::post('/upload', [\App\Http\Controllers\UploadController::class, 'store'])->middleware('throttle:10,1');

        // Projects
        Route::get('/projects', [Admin\GalleryController::class, 'index']);
        Route::get('/projects/stats', [Admin\GalleryController::class, 'stats']);
        Route::get('/projects/{id}', [Admin\GalleryController::class, 'show']);
        Route::post('/projects/{id}/accept', [Admin\GalleryController::class, 'accept']);
        Route::post('/projects/{id}/reject', [Admin\GalleryController::class, 'reject']);
        Route::delete('/projects/{id}', [Admin\GalleryController::class, 'destroy']);

        // News
        Route::get('/news', [Admin\NewsController::class, 'index']);
        Route::get('/news/stats', [Admin\NewsController::class, 'stats']);
        Route::post('/news', [Admin\NewsController::class, 'store']);
        Route::get('/news/{news}', [Admin\NewsController::class, 'show']);
        Route::put('/news/{news}', [Admin\NewsController::class, 'update']);
        Route::post('/news/{news}', [Admin\NewsController::class, 'update']); // _method=PUT spoofing
        Route::delete('/news/{news}', [Admin\NewsController::class, 'destroy']);
        Route::put('/news/{news}/toggle-hidden', [Admin\NewsController::class, 'toggleHidden']);

        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/notifications', [NotificationController::class, 'store']);
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

        // Audit logs
        Route::get('/audit-logs', [Admin\AuditLogController::class, 'index']);
        Route::get('/audit-logs/summary', [Admin\AuditLogController::class, 'summary']);

        // Chat stats
        Route::get('/chat-stats', [Admin\ChatStatsController::class, 'index']);

        // Health
        Route::get('/health', [Admin\HealthController::class, 'index']);

        // Security
        Route::get('/security/login-attempts', [Admin\SecurityController::class, 'index']);

        // Chatbot API config
        Route::get('/chatbot-api', [Admin\ChatbotApiController::class, 'index']);
        Route::get('/chatbot-api/{id}', [Admin\ChatbotApiController::class, 'show']);
        Route::post('/chatbot-api', [Admin\ChatbotApiController::class, 'store']);
        Route::put('/chatbot-api/{id}', [Admin\ChatbotApiController::class, 'update']);
        Route::delete('/chatbot-api/{id}', [Admin\ChatbotApiController::class, 'destroy']);
        Route::post('/chatbot-api/test', [Admin\ChatbotApiController::class, 'testConnection']);

        // Admin profile management
        Route::get('/admins', [AdminProfileController::class, 'index']);
        Route::post('/admins', [AdminProfileController::class, 'store']);
        Route::get('/admins/{id}', [AdminProfileController::class, 'show']);
        Route::put('/admins/{id}/name', [AdminProfileController::class, 'updateName']);
        Route::put('/admins/{id}/email', [AdminProfileController::class, 'updateEmail']);
        Route::put('/admins/{id}/password', [AdminProfileController::class, 'updatePassword']);
        Route::delete('/admins/{id}', [AdminProfileController::class, 'destroy']);

        // API keys
        Route::get('/api-keys', [ApiKeyController::class, 'index']);
        Route::put('/api-keys/azure', [ApiKeyController::class, 'updateAzure']);
        Route::put('/api-keys/gemini', [ApiKeyController::class, 'updateGemini']);
        Route::post('/api-keys/test-azure', [ApiKeyController::class, 'testAzure']);
        Route::post('/api-keys/test-gemini', [ApiKeyController::class, 'testGemini']);
    });
});
