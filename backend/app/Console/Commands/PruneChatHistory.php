<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PruneChatHistory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'chat:prune {--days=30 : Number of days to keep chat history}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete chat history older than specified days (default: 30)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = (int) $this->option('days');
        $cutoffDate = now()->subDays($days);

        $this->info("Pruning chat history older than {$days} days (before {$cutoffDate})...");

        // Delete old messages first (foreign key constraint)
        $messagesDeleted = DB::table('chat_messages')
            ->where('created_at', '<', $cutoffDate)
            ->delete();

        // Delete old conversations (use created_at to match the message cutoff —
        // updated_at is now touched on every message write, but the seed date
        // of the conversation is the only column both share with messages).
        $conversationsDeleted = DB::table('chat_conversations')
            ->where('created_at', '<', $cutoffDate)
            ->delete();

        $this->info("Deleted {$messagesDeleted} messages and {$conversationsDeleted} conversations.");

        // Also prune old chat logs
        $chatLogsDeleted = DB::table('chat_logs')
            ->where('created_at', '<', $cutoffDate)
            ->delete();

        $this->info("Deleted {$chatLogsDeleted} chat logs.");

        // Prune login attempts older than 30 days
        $loginAttemptsDeleted = DB::table('login_attempts')
            ->where('created_at', '<', now()->subDays(30))
            ->delete();

        $this->info("Deleted {$loginAttemptsDeleted} old login attempts.");

        return Command::SUCCESS;
    }
}
