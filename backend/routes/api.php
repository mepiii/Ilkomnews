<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\CareerController;
use App\Http\Controllers\ProjectSubmissionController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Admin\NotificationController;
use Illuminate\Support\Facades\Route;

// ── Admin Auth (no session) ──
Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:login');

// ── Public API (rate limited) ──
Route::middleware('throttle:api')->group(function () {

    // News
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/latest', [NewsController::class, 'latest']);
    Route::get('/news/categories', [NewsController::class, 'categories']);
    Route::get('/news/{id}', [NewsController::class, 'show']);

    // Articles
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/latest', [ArticleController::class, 'latest']);
    Route::get('/articles/categories', [ArticleController::class, 'categories']);
    Route::get('/articles/category/{category}', [ArticleController::class, 'byCategory']);
    Route::get('/articles/{id}', [ArticleController::class, 'show']);

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

    // Submissions (public)
    Route::post('/submissions', [ProjectSubmissionController::class, 'store']);
    Route::get('/submissions/track/{trackingId}', [ProjectSubmissionController::class, 'track']);

    // Public projects (accepted only)
    Route::get('/projects', [ProjectSubmissionController::class, 'publicIndex']);
    Route::get('/projects/{id}', [ProjectSubmissionController::class, 'publicShow']);

    // Chatbot (Wolfy) — rate limited separately
    Route::post('/chat', [ChatController::class, 'chat'])->middleware('throttle:chatbot');
});

// ── Admin API (authenticated + admin) ──
Route::middleware(['auth:sanctum', 'admin', 'throttle:admin'])->prefix('admin')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // File upload
    Route::post('/upload', [\App\Http\Controllers\UploadController::class, 'store']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'apiStats']);

    // Gallery submissions + projects alias
    Route::get('/submissions', [Admin\GalleryController::class, 'index']);
    Route::get('/submissions/stats', [Admin\GalleryController::class, 'stats']);
    Route::get('/submissions/{submission}', [Admin\GalleryController::class, 'show']);
    Route::post('/submissions/{submission}/accept', [Admin\GalleryController::class, 'accept']);
    Route::post('/submissions/{submission}/reject', [Admin\GalleryController::class, 'reject']);

    Route::get('/projects', [Admin\GalleryController::class, 'index']);
    Route::get('/projects/stats', [Admin\GalleryController::class, 'stats']);
    Route::get('/projects/{submission}', [Admin\GalleryController::class, 'show']);
    Route::post('/projects/{submission}/accept', [Admin\GalleryController::class, 'accept']);
    Route::post('/projects/{submission}/reject', [Admin\GalleryController::class, 'reject']);

    // News management
    Route::get('/news', [Admin\NewsController::class, 'index']);
    Route::get('/news/stats', [Admin\NewsController::class, 'stats']);
    Route::post('/news', [Admin\NewsController::class, 'store']);
    Route::get('/news/{news}', [Admin\NewsController::class, 'show']);
    Route::put('/news/{news}', [Admin\NewsController::class, 'update']);
    Route::delete('/news/{news}', [Admin\NewsController::class, 'destroy']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    // Audit logs
    Route::get('/audit-logs', [Admin\AuditLogController::class, 'index']);
    Route::get('/audit-logs/summary', [Admin\AuditLogController::class, 'summary']);

    // Chat statistics
    Route::get('/chat-stats', [Admin\ChatStatsController::class, 'index']);

    // Health monitoring
    Route::get('/health', [Admin\HealthController::class, 'index']);

    // Security center
    Route::get('/security/login-attempts', [Admin\SecurityController::class, 'loginAttempts']);
});
