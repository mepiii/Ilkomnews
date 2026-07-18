<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;

class OptimizePerformance extends Command
{
    protected $signature = 'app:optimize-performance {--clear-cache : Clear all caches} {--analyze : Analyze database indexes}';
    protected $description = 'Optimize application performance by managing caches and analyzing indexes';

    public function handle(): int
    {
        if ($this->option('clear-cache')) {
            $this->clearCaches();
        }

        if ($this->option('analyze')) {
            $this->analyzeIndexes();
        }

        if (!$this->option('clear-cache') && !$this->option('analyze')) {
            $this->info('Running all optimizations...');
            $this->clearCaches();
            $this->optimizeApp();
        }

        return self::SUCCESS;
    }

    private function clearCaches(): void
    {
        $this->info('Clearing caches...');

        try {
            Cache::flush();
            $this->info('✓ Application cache cleared');
        } catch (\Throwable $e) {
            $this->warn('⚠ Could not clear cache: ' . $e->getMessage());
        }

        Artisan::call('config:clear');
        $this->info('✓ Config cache cleared');

        Artisan::call('route:clear');
        $this->info('✓ Route cache cleared');

        Artisan::call('view:clear');
        $this->info('✓ View cache cleared');
    }

    private function optimizeApp(): void
    {
        $this->info('Running optimizations...');

        try {
            Artisan::call('config:cache');
            $this->info('✓ Config cached');
        } catch (\Throwable $e) {
            $this->warn('⚠ Could not cache config: ' . $e->getMessage());
        }

        try {
            Artisan::call('route:cache');
            $this->info('✓ Routes cached');
        } catch (\Throwable $e) {
            $this->warn('⚠ Could not cache routes: ' . $e->getMessage());
        }

        try {
            Artisan::call('view:cache');
            $this->info('✓ Views cached');
        } catch (\Throwable $e) {
            $this->warn('⚠ Could not cache views: ' . $e->getMessage());
        }
    }

    private function analyzeIndexes(): void
    {
        $this->info('Analyzing database indexes...');

        $tables = ['news', 'events', 'project_submissions', 'interactions', 'engagement_interactions', 'chat_messages', 'audit_logs'];

        foreach ($tables as $table) {
            try {
                $indexes = \DB::select("SHOW INDEX FROM {$table}");
                $this->info("\n{$table} indexes:");
                $seen = [];
                foreach ($indexes as $index) {
                    $name = $index->Key_name;
                    if (!isset($seen[$name])) {
                        $seen[$name] = true;
                        $this->line("  - {$name}");
                    }
                }
            } catch (\Throwable $e) {
                $this->warn("⚠ Could not analyze {$table}: " . $e->getMessage());
            }
        }
    }
}
