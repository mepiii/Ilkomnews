<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DbOptimize extends Command
{
    protected $signature = 'db:optimize {--analyze : Run ANALYZE TABLE}';
    protected $description = 'Optimize database tables and update statistics';

    public function handle(): int
    {
        $tables = ['news', 'events', 'project_submissions', 'interactions', 'engagement_interactions', 'chat_messages', 'chat_conversations', 'audit_logs', 'notifications', 'users'];

        foreach ($tables as $table) {
            try {
                if ($this->option('analyze')) {
                    DB::statement("ANALYZE TABLE {$table}");
                    $this->info("✓ Analyzed {$table}");
                }
                
                // Optimize table
                DB::statement("OPTIMIZE TABLE {$table}");
                $this->info("✓ Optimized {$table}");
            } catch (\Throwable $e) {
                $this->warn("⚠ Skipped {$table}: " . $e->getMessage());
            }
        }

        $this->info('Database optimization complete!');
        return self::SUCCESS;
    }
}
