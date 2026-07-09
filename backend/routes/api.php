<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\ArticleController;
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
    Route::post('/notifications/{trackingId}/{id}/read', [NotificationController::class, 'publicMarkRead']);

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

    // Interaction tracking (public)
    Route::get('/interactions/{type}/{id}/stats', [InteractionController::class, 'stats']);
    Route::post('/interactions/{type}/{id}/view', [InteractionController::class, 'incrementView']);
    Route::post('/interactions/{type}/{id}/like', [InteractionController::class, 'toggleLike']);
    Route::post('/interactions/{type}/{id}/save', [InteractionController::class, 'toggleSave']);
    Route::post('/interactions/{type}/{id}/share', [InteractionController::class, 'incrementShare']);
});

// Note: Admin API routes are defined in web.php using session-based auth (web guard)
// This file only contains public API routes
