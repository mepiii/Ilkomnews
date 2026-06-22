<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HealthController extends Controller
{
    public function index()
    {
        $health = ['status' => 'ok', 'timestamp' => now()->toIso8601String(), 'checks' => []];

        try {
            DB::connection()->getPdo();
            $health['checks']['database'] = ['status' => 'ok', 'message' => 'Connected'];
        } catch (\Exception $e) {
            $health['checks']['database'] = ['status' => 'error', 'message' => $e->getMessage()];
            $health['status'] = 'degraded';
        }

        try {
            Cache::put('health_check', true, 10);
            $ok = Cache::get('health_check') === true;
            $health['checks']['cache'] = ['status' => $ok ? 'ok' : 'error', 'message' => $ok ? 'Working' : 'Read failed'];
        } catch (\Exception $e) {
            $health['checks']['cache'] = ['status' => 'error', 'message' => $e->getMessage()];
            $health['status'] = 'degraded';
        }

        try {
            $free = disk_free_space(base_path());
            $total = disk_total_space(base_path());
            $pct = round(($free / $total) * 100, 1);
            $health['checks']['disk'] = ['status' => $pct > 10 ? 'ok' : 'warning', 'message' => "{$pct}% free (" . round($free / 1073741824, 1) . " GB)"];
        } catch (\Exception $e) {
            $health['checks']['disk'] = ['status' => 'error', 'message' => 'Cannot read'];
        }

        $health['checks']['memory'] = ['status' => 'ok', 'message' => round(memory_get_usage(true) / 1048576, 1) . ' MB used'];

        return response()->json($health);
    }
}
