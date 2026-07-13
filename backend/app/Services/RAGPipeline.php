<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class RAGPipeline
{
    protected LLMRouter $llmRouter;
    protected VectorSearchService $vectorSearch;
    protected EmbeddingService $embeddingService;

    protected int $maxContextTokens = 600;
    protected int $maxResponseTokens = 200;

    // Topics to block (off-topic). Keep narrow: ILKOM/tech-news topics
    // (programming, math, health) are in-scope. Financial ADVICE is out of
    // scope (mirrors the ChatController system prompt ban on financial advice),
    // so trading/crypto/stock/investment prompts are rejected before the LLM.
    // News ABOUT finance at ILKOM stays retrievable; only user advisory
    // queries on these terms are blocked.
    protected array $blockedTopics = [
        'politics', 'government', 'election', 'president',
        'religion', 'god', 'church', 'mosque', 'temple',
        'trading', 'crypto', 'stock', 'investment', 'forex', 'bitcoin',
    ];

    public function __construct(
        LLMRouter $llmRouter,
        VectorSearchService $vectorSearch,
        EmbeddingService $embeddingService
    ) {
        $this->llmRouter = $llmRouter;
        $this->vectorSearch = $vectorSearch;
        $this->embeddingService = $embeddingService;
    }

    /**
     * Process a user query through the RAG pipeline
     */
    public function process(string $query): array
    {
        // 1. Check for off-topic queries
        if ($this->isOffTopic($query)) {
            return [
                'success' => false,
                'response' => 'Maaf, saya hanya bisa menjawab pertanyaan seputar ILKOM NEWS dan Fakultas Ilmu Komputer.',
                'reason' => 'off_topic',
            ];
        }

        // 2. Check for jailbreak attempts
        if ($this->isJailbreakAttempt($query)) {
            return [
                'success' => false,
                'response' => 'Saya tidak dapat memproses permintaan tersebut.',
                'reason' => 'jailbreak',
            ];
        }

        // 3. Rewrite query for better retrieval
        $rewrittenQueries = $this->rewriteQuery($query);

        // 4. Retrieve relevant chunks
        $chunks = $this->retrieve($rewrittenQueries);

        if (empty($chunks)) {
            return [
                'success' => false,
                'response' => 'Maaf, saya tidak menemukan informasi yang relevan di database ILKOM NEWS.',
                'reason' => 'no_context',
            ];
        }

        // 5. Re-rank chunks by relevance
        $rankedChunks = $this->rerank($query, $chunks);

        // 6. Compress context
        $context = $this->compressContext($rankedChunks);

        // 7. Generate response
        $response = $this->generateResponse($query, $context);

        // 8. Check groundedness
        if (!$this->isGrounded($response, $context)) {
            return [
                'success' => false,
                'response' => 'Maaf, saya tidak dapat menemukan informasi yang akurat untuk pertanyaan tersebut.',
                'reason' => 'not_grounded',
            ];
        }

        return [
            'success' => true,
            'response' => $response,
            'chunks' => count($chunks),
        ];
    }

    /**
     * Retrieve context only — no LLM generation.
     * Returns compressed context string or null when empty.
     * Used by ChatController as primary retrieval with keyword LIKE fallback.
     */
    public function retrieveOnly(string $query): ?string
    {
        if ($this->isOffTopic($query) || $this->isJailbreakAttempt($query)) {
            return null;
        }

        $rewrittenQueries = $this->rewriteQuery($query);
        $chunks = $this->retrieve($rewrittenQueries);

        if (empty($chunks)) {
            return null;
        }

        $rankedChunks = $this->rerank($query, $chunks);
        return $this->compressContext($rankedChunks);
    }

    /**
     * Check if query is off-topic
     */
    protected function isOffTopic(string $query): bool
    {
        $queryLower = strtolower($query);
        $words = preg_split('/\s+/', $queryLower);

        $blockedCount = 0;
        foreach ($words as $word) {
            foreach ($this->blockedTopics as $blocked) {
                if (strpos($word, $blocked) !== false || strpos($blocked, $word) !== false) {
                    $blockedCount++;
                }
            }
        }

        // If more than 2 blocked topic words, consider off-topic
        return $blockedCount > 2;
    }

    /**
     * Check for jailbreak attempts
     */
    protected function isJailbreakAttempt(string $query): bool
    {
        $patterns = [
            '/ignore (all )?(previous|above) instructions?/i',
            '/system prompt/i',
            '/you are (now|a)/i',
            '/pretend (to be|you are)/i',
            '/act as/i',
            '/disregard/i',
            '/override/i',
            '/developer mode/i',
            '/DAN/i',
            '/jailbreak/i',
            '/\/system/i',
            '/\[SYSTEM\]/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $query)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Rewrite query into multiple search terms
     */
    protected function rewriteQuery(string $query): array
    {
        $queries = [$query];

        // Add common Indonesian question word variations
        $questionWords = [
            'apa' => ['apa itu', 'apakah', 'jelaskan'],
            'siapa' => ['siapa', 'orang siapa'],
            'kapan' => ['kapan', 'tanggal berapa'],
            'dimana' => ['dimana', 'lokasi'],
            'bagaimana' => ['bagaimana', 'cara'],
        ];

        $queryLower = strtolower($query);

        foreach ($questionWords as $key => $variations) {
            if (strpos($queryLower, $key) !== false) {
                foreach ($variations as $variation) {
                    $queries[] = str_ireplace($key, $variation, $query);
                }
            }
        }

        return array_unique($queries);
    }

    /**
     * Retrieve relevant chunks for all query variations.
     * ponytail: embed the original query ONCE for vector search; run the
     * SQL LIKE pass across all rewritten variants. Rewrite expand to 4–7
     * variants, so the old per-variant embedding loop cost ~7 embedding calls
     * per message and blew the Gemini free-tier 20 req/min budget in 2 chats.
     */
    protected function retrieve(array $queries): array
    {
        $allChunks = [];

        // Vector search once (single embedding call) on the first query.
        $vectorResults = $this->vectorSearch->search($queries[0] ?? '', 3);
        foreach ($vectorResults as $result) {
            $id = $result['chunk']->id;
            if (!isset($allChunks[$id])) {
                $allChunks[$id] = $result;
            }
        }

        // Keyword LIKE pass across all variants (no extra embedding calls).
        $keywordResults = $this->vectorSearch->keywordSearch($queries, 3 * 2);
        foreach ($keywordResults as $chunk) {
            if (!isset($allChunks[$chunk->id])) {
                $allChunks[$chunk->id] = ['chunk' => $chunk, 'score' => 0];
            }
        }

        return array_values($allChunks);
    }

    /**
     * Re-rank chunks using LLM
     */
    protected function rerank(string $query, array $chunks): array
    {
        if (count($chunks) <= 3) {
            return $chunks;
        }

        // Prepare chunks for ranking
        $chunkTexts = [];
        foreach ($chunks as $index => $result) {
            $chunkTexts[] = "[{$index}] " . substr($result['chunk']->chunk_text, 0, 200);
        }

        $prompt = "Rank these text chunks by relevance to the query: \"{$query}\"\n\n";
        $prompt .= implode("\n\n", $chunkTexts) . "\n\n";
        $prompt .= "Return only the top 3 chunk indices separated by commas (e.g., 0,2,5).";

        $response = $this->llmRouter->chat([
            ['role' => 'user', 'content' => $prompt]
        ], ['max_tokens' => 20, 'temperature' => 0.1]);

        if (!$response) {
            return array_slice($chunks, 0, 3);
        }

        // Parse indices
        preg_match_all('/\d+/', $response['content'], $matches);
        $indices = $matches[0] ?? [];

        $ranked = [];
        foreach (array_slice($indices, 0, 3) as $index) {
            $index = (int) $index;
            if (isset($chunks[$index])) {
                $ranked[] = $chunks[$index];
            }
        }

        return !empty($ranked) ? $ranked : array_slice($chunks, 0, 3);
    }

    /**
     * Compress context to fit token limit
     */
    protected function compressContext(array $chunks): string
    {
        $context = '';
        $currentTokens = 0;

        foreach ($chunks as $result) {
            $chunk = $result['chunk'];
            $chunkText = $chunk->summary ?? $chunk->chunk_text;
            $chunkTokens = strlen($chunkText) / 4;

            if ($currentTokens + $chunkTokens > $this->maxContextTokens) {
                break;
            }

            $context .= $chunkText . "\n\n";
            $currentTokens += $chunkTokens;
        }

        return trim($context);
    }

    /**
     * Generate response using LLM
     */
    protected function generateResponse(string $query, string $context): ?string
    {
        $systemPrompt = "Anda adalah asisten ILKOM NEWS. Jawab dengan ramah dan singkat (maksimal 200 karakter). ";
        $systemPrompt .= "Hanya jawab berdasarkan konteks yang diberikan. Jika tidak yakin, katakan tidak tahu.\n\n";
        $systemPrompt .= "Konteks:\n{$context}";

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $query],
        ];

        $response = $this->llmRouter->chat($messages, [
            'max_tokens' => $this->maxResponseTokens,
            'temperature' => 0.7,
        ]);

        return $response['content'] ?? null;
    }

    /**
     * Check if response is grounded in context
     */
    protected function isGrounded(string $response, string $context): bool
    {
        // An empty/placeholder response is not a real answer — never mark it grounded.
        $response = trim($response);
        if ($response === '') {
            return false;
        }

        // Simple check: response should have at least one word from context
        $contextWords = preg_split('/\s+/', strtolower($context));
        $responseWords = preg_split('/\s+/', strtolower($response));

        $commonWords = array_intersect($responseWords, $contextWords);

        // At least 20% of response words should be in context
        $threshold = count($responseWords) * 0.2;

        return count($commonWords) >= $threshold;
    }
}
