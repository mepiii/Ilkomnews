<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\News;
use App\Models\Article;
use App\Models\Event;
use App\Models\ProjectSubmission;

class KnowledgeIndexer
{
    protected EmbeddingService $embeddingService;
    protected VectorSearchService $vectorSearch;

    protected int $chunkSize = 200; // tokens
    protected int $overlapSize = 50; // tokens

    public function __construct(EmbeddingService $embeddingService, VectorSearchService $vectorSearch)
    {
        $this->embeddingService = $embeddingService;
        $this->vectorSearch = $vectorSearch;
    }

    /**
     * Reindex all content
     */
    public function reindexAll(): array
    {
        $stats = [
            'news' => 0,
            'articles' => 0,
            'events' => 0,
            'projects' => 0,
            'faq' => 0,
            'chunks' => 0,
            'errors' => [],
        ];

        // Index news
        $news = News::where('published', true)->get();
        foreach ($news as $item) {
            $result = $this->indexContent('news', $item->id, $item->title, $item->content);
            if ($result['success']) {
                $stats['news']++;
                $stats['chunks'] += $result['chunks'];
            } else {
                $stats['errors'][] = $result['error'];
            }
        }

        // Index articles
        $articles = Article::where('published', true)->get();
        foreach ($articles as $item) {
            $result = $this->indexContent('article', $item->id, $item->title, $item->content);
            if ($result['success']) {
                $stats['articles']++;
                $stats['chunks'] += $result['chunks'];
            } else {
                $stats['errors'][] = $result['error'];
            }
        }

        // Index events
        $events = Event::where('published', true)->get();
        foreach ($events as $item) {
            $text = $item->title . "\n\n" . ($item->content ?? '');
            $result = $this->indexContent('event', $item->id, $item->title, $text);
            if ($result['success']) {
                $stats['events']++;
                $stats['chunks'] += $result['chunks'];
            } else {
                $stats['errors'][] = $result['error'];
            }
        }

        // Index FAQ (frequently asked questions) so the chatbot can answer
        // common questions such as "bagaimana cara submit proyek".
        $faqCount = $this->indexFaq();
        $stats['faq'] += $faqCount;

        // Index project submissions
        $projects = ProjectSubmission::whereIn('status', ['accepted', 'pending'])->get();
        foreach ($projects as $item) {
            $text = $item->title . "\n\n" . $item->description . "\n\nTech: " . implode(', ', $item->tech_stack ?? []);
            $result = $this->indexContent('project', $item->id, $item->title, $text);
            if ($result['success']) {
                $stats['projects']++;
                $stats['chunks'] += $result['chunks'];
            } else {
                $stats['errors'][] = $result['error'];
            }
        }

        Log::info('Knowledge reindex completed', $stats);

        return $stats;
    }

    /**
     * Index the FAQ knowledge base into the RAG corpus.
     */
    public function indexFaq(): int
    {
        $faqs = require database_path('faq_data.php');

        // Clear existing FAQ chunks before re-indexing.
        DB::table('knowledge_chunks')->where('source_type', 'faq')->delete();

        $chunkCount = 0;
        foreach ($faqs as $index => $faq) {
            $text = "Kategori: {$faq['category']}\nPertanyaan: {$faq['question']}\nJawaban: {$faq['answer']}";
            $result = $this->indexContent('faq', $index + 1, $faq['question'], $text);
            if ($result['success']) {
                $chunkCount += $result['chunks'];
            }
        }

        return $chunkCount;
    }

    /**
     * Index a single content item
     */
    public function indexContent(string $sourceType, int $sourceId, string $title, string $content): array
    {
        try {
            // Delete existing embeddings for this source
            $this->vectorSearch->deleteEmbeddings($sourceType, $sourceId);

            // Chunk the content
            $chunks = $this->chunkText($title, $content);

            $chunkCount = 0;

            foreach ($chunks as $chunk) {
                // Generate embedding for chunk
                $embedding = $this->embeddingService->generate($chunk['text']);

                if (!$embedding) {
                    Log::warning('Failed to generate embedding for chunk', [
                        'source_type' => $sourceType,
                        'source_id' => $sourceId,
                    ]);
                    continue;
                }

                // Store in database
                $stored = $this->vectorSearch->storeEmbedding(
                    $sourceType,
                    $sourceId,
                    $chunk['text'],
                    $chunk['summary'],
                    $embedding['embedding'],
                    $embedding['model'],
                    $chunk['tokens']
                );

                if ($stored) {
                    $chunkCount++;
                }
            }

            return [
                'success' => true,
                'chunks' => $chunkCount,
            ];

        } catch (\Exception $e) {
            Log::error('Failed to index content', [
                'error' => $e->getMessage(),
                'source_type' => $sourceType,
                'source_id' => $sourceId,
            ]);

            return [
                'success' => false,
                'chunks' => 0,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Chunk text into ~200 token segments with overlap
     */
    protected function chunkText(string $title, string $content): array
    {
        // Combine title and content
        $fullText = $title . "\n\n" . $content;

        // Split into sentences
        $sentences = preg_split('/(?<=[.!?])\s+/', $fullText, -1, PREG_SPLIT_NO_EMPTY);

        $chunks = [];
        $currentChunk = '';
        $currentTokens = 0;

        foreach ($sentences as $sentence) {
            $sentenceTokens = $this->estimateTokens($sentence);

            // If adding this sentence exceeds chunk size, save current chunk
            if ($currentTokens + $sentenceTokens > $this->chunkSize && !empty($currentChunk)) {
                $chunks[] = [
                    'text' => trim($currentChunk),
                    'summary' => $this->generateSummary($currentChunk),
                    'tokens' => $currentTokens,
                ];

                // Start new chunk with overlap
                $overlapText = $this->getLastTokens($currentChunk, $this->overlapSize);
                $currentChunk = $overlapText . ' ' . $sentence;
                $currentTokens = $this->estimateTokens($currentChunk);
            } else {
                $currentChunk .= ' ' . $sentence;
                $currentTokens += $sentenceTokens;
            }
        }

        // Add final chunk
        if (!empty(trim($currentChunk))) {
            $chunks[] = [
                'text' => trim($currentChunk),
                'summary' => $this->generateSummary($currentChunk),
                'tokens' => $currentTokens,
            ];
        }

        return $chunks;
    }

    /**
     * Estimate token count (approximation: 1 token ≈ 4 chars for Indonesian)
     */
    protected function estimateTokens(string $text): int
    {
        return (int) ceil(strlen($text) / 4);
    }

    /**
     * Get last N tokens from text
     */
    protected function getLastTokens(string $text, int $tokens): string
    {
        $chars = $tokens * 4;
        $text = trim($text);

        if (strlen($text) <= $chars) {
            return $text;
        }

        // Find last sentence boundary within the limit
        $substring = substr($text, -$chars);
        $lastPeriod = strrpos($substring, '. ');

        if ($lastPeriod !== false) {
            return substr($substring, $lastPeriod + 1);
        }

        return $substring;
    }

    /**
     * Generate a brief summary for a chunk (first sentence)
     */
    protected function generateSummary(string $text): string
    {
        $sentences = preg_split('/(?<=[.!?])\s+/', trim($text), 2, PREG_SPLIT_NO_EMPTY);
        return $sentences[0] ?? substr($text, 0, 100);
    }
}
