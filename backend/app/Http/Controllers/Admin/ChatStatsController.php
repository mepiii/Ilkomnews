<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatLog;
use Illuminate\Http\Request;

class ChatStatsController extends Controller
{
    public function index(Request $request)
    {
        $days = (int) $request->get('days', 30);
        $from = now()->subDays($days);
        $query = ChatLog::where('created_at', '>=', $from);

        $stats = [
            'total_queries' => (clone $query)->count(),
            'successful' => (clone $query)->where('status', 'success')->count(),
            'rejected' => (clone $query)->where('status', 'topic_rejected')->count(),
            'no_context' => (clone $query)->where('status', 'no_context')->count(),
            // ponytail: there is no rate-limit status; 'rejected' is input-validation
            // rejection (empty/multi-question/over-length), 'topic_rejected' is the
            // off-topic block. Keep both keys distinct so the dashboard labels are accurate.
            'rate_limited' => (clone $query)->where('status', 'rejected')->count(),
            'topic_rejected' => (clone $query)->where('status', 'topic_rejected')->count(),
            'today' => ChatLog::whereDate('created_at', today())->count(),
            'daily_breakdown' => ChatLog::selectRaw("DATE(created_at) as date, count(*) as total, SUM(status = 'success') as success, SUM(status = 'topic_rejected') as rejected")
                ->where('created_at', '>=', $from)->groupBy('date')->orderBy('date')->get(),
            'top_ips' => ChatLog::selectRaw('ip_address, count(*) as count')
                ->where('created_at', '>=', $from)->groupBy('ip_address')->orderByDesc('count')->take(10)->get(),
        ];

        return response()->json($stats);
    }
}
