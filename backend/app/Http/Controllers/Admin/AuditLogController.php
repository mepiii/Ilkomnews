<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

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

        return view('admin.audit.index', compact('logs'));
    }

    public function summary()
    {
        return response()->json([
            'total' => AuditLog::count(),
            'today' => AuditLog::whereDate('created_at', today())->count(),
            'this_week' => AuditLog::whereBetween('created_at', [now()->startOfWeek(), now()])->count(),
            'by_action' => AuditLog::selectRaw('action, count(*) as count')->groupBy('action')->orderByDesc('count')->take(10)->get(),
            'by_user' => AuditLog::selectRaw('user_id, count(*) as count')->with('user:id,name,email')->groupBy('user_id')->orderByDesc('count')->get(),
        ]);
    }
}
