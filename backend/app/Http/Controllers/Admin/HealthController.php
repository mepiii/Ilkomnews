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
            if ($free === false || $total === false || $total <= 0) {
                $health['checks']['disk'] = ['status' => 'error', 'message' => 'Cannot read disk usage'];
            } else {
                $pct = round(($free / $total) * 100, 1);
                $health['checks']['disk'] = ['status' => $pct > 10 ? 'ok' : 'warning', 'message' => "{$pct}% free (" . round($free / 1073741824, 1) . " GB)"];
            }
        } catch (\Exception $e) {
            $health['checks']['disk'] = ['status' => 'error', 'message' => 'Cannot read'];
        }

        $health['checks']['memory'] = ['status' => 'ok', 'message' => round(memory_get_usage(true) / 1048576, 1) . ' MB used'];

        // Storage stats
        try {
            $storagePath = storage_path('app/public');
            $dirs = ['news', 'news/authors', 'projects/thumbnails', 'projects/avatars', 'projects/screenshots'];
            $storage = ['total_bytes' => 0, 'total_files' => 0, 'breakdown' => []];
            foreach ($dirs as $dir) {
                $fullPath = $storagePath . '/' . $dir;
                $files = is_dir($fullPath) ? glob($fullPath . '/*') : [];
                $bytes = array_sum(array_map('filesize', array_filter($files, 'is_file')));
                $count = count(array_filter($files, 'is_file'));
                $storage['breakdown'][$dir] = ['bytes' => $bytes, 'files' => $count];
                $storage['total_bytes'] += $bytes;
                $storage['total_files'] += $count;
            }
            $health['checks']['storage'] = [
                'status' => 'ok',
                'message' => round($storage['total_bytes'] / 1048576, 1) . ' MB (' . $storage['total_files'] . ' files)',
                'details' => $storage,
            ];
        } catch (\Exception $e) {
            $health['checks']['storage'] = ['status' => 'error', 'message' => 'Cannot read'];
        }

        return response()->json($health);
    }

    // Public liveness probe for external uptime monitors. DB-only, leaks nothing.
    public function ping()
    {
        try {
            DB::connection()->getPdo();

            return response()->json(['status' => 'ok'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'down'], 503);
        }
    }
}
