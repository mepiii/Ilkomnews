<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ChatStatsController extends Controller
{
    public function index(Request $request)
    {
        $days = (int) $request->get('days', 30);
        $from = now()->subDays($days);

        $stats = Cache::remember("admin:chat-stats:{$days}", 30, function () use ($from) {
            $totals = ChatLog::query()
                ->where('created_at', '>=', $from)
                ->selectRaw('COUNT(*) as total_queries')
                ->selectRaw("SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful")
                ->selectRaw("SUM(CASE WHEN status = 'topic_rejected' THEN 1 ELSE 0 END) as topic_rejected")
                ->selectRaw("SUM(CASE WHEN status = 'no_context' THEN 1 ELSE 0 END) as no_context")
                ->selectRaw("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rate_limited")
                ->selectRaw('SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today')
                ->first();

            return [
                'total_queries' => (int) ($totals?->total_queries ?? 0),
                'successful' => (int) ($totals?->successful ?? 0),
                'rejected' => (int) ($totals?->topic_rejected ?? 0),
                'no_context' => (int) ($totals?->no_context ?? 0),
                // ponytail: there is no rate-limit status; 'rejected' is input-validation
                // rejection (empty/multi-question/over-length), 'topic_rejected' is the
                // off-topic block. Keep both keys distinct so the dashboard labels are accurate.
                'rate_limited' => (int) ($totals?->rate_limited ?? 0),
                'topic_rejected' => (int) ($totals?->topic_rejected ?? 0),
                'today' => (int) ($totals?->today ?? 0),
                'daily_breakdown' => ChatLog::query()
                    ->selectRaw("DATE(created_at) as date, count(*) as total, SUM(status = 'success') as success, SUM(status = 'topic_rejected') as rejected")
                    ->where('created_at', '>=', $from)
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
                'top_ips' => ChatLog::query()
                    ->selectRaw('ip_address, count(*) as count')
                    ->where('created_at', '>=', $from)
                    ->groupBy('ip_address')
                    ->orderByDesc('count')
                    ->take(10)
                    ->get(),
            ];
        });

        return response()->json($stats);
    }
}
