<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\KnowledgeIndexer;

class KnowledgeReindex extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'knowledge:reindex
                            {--type=all : Content type to reindex (all, news, event, project)}
                            {--force : Force reindex even if embeddings exist}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reindex knowledge base for RAG chatbot';

    protected KnowledgeIndexer $indexer;

    public function __construct(KnowledgeIndexer $indexer)
    {
        parent::__construct();
        $this->indexer = $indexer;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->option('type');
        $force = $this->option('force');

        $this->info("Starting knowledge base reindexing...");
        $this->info("Type: {$type}, Force: " . ($force ? 'Yes' : 'No'));

        $startTime = microtime(true);

        try {
            if ($type === 'all') {
                $stats = $this->indexer->reindexAll();
            } elseif (in_array($type, ['news', 'event', 'project'], true)) {
                $stats = $this->indexer->reindexByType($type);
            } else {
                $this->error("Unknown type '{$type}'. Use all, news, event, or project.");
                return Command::FAILURE;
            }

            $elapsed = round(microtime(true) - $startTime, 2);

            $this->newLine();
            $this->info("=== Reindex Summary ===");
            $this->info("News items indexed: {$stats['news']}");
            $this->info("Events indexed: {$stats['events']}");
            $this->info("Projects indexed: {$stats['projects']}");
            $this->info("FAQ items indexed: {$stats['faq']}");
            $this->info("Total chunks created: {$stats['chunks']}");
            $this->info("Errors: " . count($stats['errors']));
            $this->info("Time elapsed: {$elapsed}s");

            if (!empty($stats['errors'])) {
                $this->newLine();
                $this->warn("Errors encountered:");
                foreach (array_slice($stats['errors'], 0, 5) as $error) {
                    $this->error(" - {$error}");
                }
            }

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error("Reindex failed: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
