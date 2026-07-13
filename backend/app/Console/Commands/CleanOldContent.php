<?php

namespace App\Console\Commands;

use App\Models\News;
use App\Models\ProjectSubmission;
use Illuminate\Console\Command;

class CleanOldContent extends Command
{
    protected $signature = 'clean:old-content';
    protected $description = 'Clean old drafts, rejected projects, and orphaned files';

    public function handle(): int
    {
        $draftDeleted = News::where('published', false)
            ->where('created_at', '<', now()->subDays(90))
            ->delete();

        $rejectedDeleted = ProjectSubmission::where('status', 'rejected')
            ->where('created_at', '<', now()->subDays(30))
            ->delete();

        $this->info("Deleted {$draftDeleted} old draft news (>90 days)");
        $this->info("Deleted {$rejectedDeleted} old rejected projects (>30 days)");

        return self::SUCCESS;
    }
}
