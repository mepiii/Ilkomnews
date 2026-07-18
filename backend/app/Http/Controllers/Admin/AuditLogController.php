<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with('user:id,name,email');
        if ($request->has('action')) $query->where('action', $request->action);
        if ($request->has('entity_type')) $query->where('entity_type', $request->entity_type);
        if ($request->has('user_id')) $query->where('user_id', $request->user_id);
        if ($request->has('from')) $query->where('created_at', '>=', $request->from);
        if ($request->has('to')) $query->where('created_at', '<=', $request->to);

        $logs = $query->latest()->paginate(20)->withQueryString();

        return response()->json($logs);
    }

    public function summary()
    {
        $cached = Cache::remember('admin:audit:summary', 60, function () {
            $totals = AuditLog::query()
                ->selectRaw('COUNT(*) as total')
                ->selectRaw('SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today')
                ->selectRaw('SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) as this_week', [now()->startOfWeek()])
                ->first();

            return [
                'total' => (int) ($totals?->total ?? 0),
                'today' => (int) ($totals?->today ?? 0),
                'this_week' => (int) ($totals?->this_week ?? 0),
                'by_action' => AuditLog::selectRaw('action, count(*) as count')->groupBy('action')->orderByDesc('count')->take(10)->get(),
            ];
        });

        $byUser = AuditLog::query()
            ->selectRaw('user_id, count(*) as count')
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->orderByDesc('count')
            ->take(20)
            ->get();

        $users = User::query()
            ->whereIn('id', $byUser->pluck('user_id'))
            ->get(['id', 'name', 'email'])
            ->keyBy('id');

        return response()->json([
            ...$cached,
            'by_user' => $byUser->map(function ($row) use ($users) {
                return [
                    'user_id' => (int) $row->user_id,
                    'count' => (int) $row->count,
                    'user' => $users->get($row->user_id),
                ];
            })->values(),
        ]);
    }
}
