<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VectorSearchService
{
    // F2: chunks below this cosine similarity are treated as irrelevant noise,
    // not ground truth. Prevents a near-zero-match chunk from becoming context
    // for the LLM (the original RAG bypass). Tune up if retrieval gets loose.
    private const SIMILARITY_FLOOR = 0.2;

    protected EmbeddingService $embeddingService;

    public function __construct(EmbeddingService $embeddingService)
    {
        $this->embeddingService = $embeddingService;
    }

    /**
     * Store embedding in knowledge_chunks table
     */
    public function storeEmbedding(
        string $sourceType,
        int $sourceId,
        string $chunkText,
        ?string $summary,
        array $embedding,
        string $model,
        int $tokenCount
    ): bool {
        try {
            DB::table('knowledge_chunks')->insert([
                'source_type' => $sourceType,
                'source_id' => $sourceId,
                'chunk_text' => $chunkText,
                'summary' => $summary,
                'embedding' => json_encode($embedding),
                'embedding_model' => $model,
                'token_count' => $tokenCount,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to store embedding', [
                'error' => $e->getMessage(),
                'source_type' => $sourceType,
                'source_id' => $sourceId,
            ]);

            return false;
        }
    }

    /**
     * Search for similar chunks using vector similarity
     */
    public function search(string $query, int $topK = 3): array
    {
        // Generate embedding for query
        $queryEmbedding = $this->embeddingService->generate($query);

        if (! $queryEmbedding) {
            Log::error('Failed to generate query embedding');

            return [];
        }

        // ponytail: only compare against chunks embedded by the SAME model —
        // mismatched dims (e.g. Azure 1536 vs Gemini) produce garbage cosine.
        // Default to null so a missing model key degrades to "no vector match"
        // instead of throwing (the caller falls back to keyword search).
        $model = $queryEmbedding['model'] ?? null;

        // Get all chunks with embeddings for the active model
        $chunks = DB::table('knowledge_chunks')
            ->whereNotNull('embedding')
            ->where('embedding_model', $model)
            ->get();

        if ($chunks->isEmpty()) {
            return [];
        }

        // Calculate similarity scores
        $scored = [];
        foreach ($chunks as $chunk) {
            $chunkEmbedding = json_decode($chunk->embedding, true);

            if (! is_array($chunkEmbedding)) {
                continue;
            }

            $similarity = $this->embeddingService->cosineSimilarity(
                $queryEmbedding['embedding'],
                $chunkEmbedding
            );

            // F2: drop irrelevant chunks below the floor so they never reach
            // the LLM as context. If everything is filtered out, $scored stays
            // empty and we return [] → caller falls back to keyword search.
            if ($similarity < self::SIMILARITY_FLOOR) {
                continue;
            }

            $scored[] = [
                'chunk' => $chunk,
                'similarity' => $similarity,
            ];
        }

        if (empty($scored)) {
            return [];
        }

        // Sort by similarity (descending)
        usort($scored, fn ($a, $b) => $b['similarity'] <=> $a['similarity']);

        // Return top K
        return array_slice($scored, 0, $topK);
    }

    /**
     * SQL LIKE keyword search across one or more query variants.
     * Escapes LIKE wildcards (% and _) so a user-supplied query cannot act
     * as a wildcard and match unrelated chunks.
     */
    public function keywordSearch(array $queries, int $limit): array
    {
        if (empty($queries)) {
            return [];
        }

        return DB::table('knowledge_chunks')
            ->where(function ($q) use ($queries) {
                foreach ($queries as $query) {
                    $escaped = addcslashes($query, '\\%_');
                    $q->orWhere('chunk_text', 'LIKE', "%{$escaped}%")
                        ->orWhere('summary', 'LIKE', "%{$escaped}%");
                }
            })
            ->limit($limit)
            ->get()
            ->all();
    }

    /**
     * Hybrid search: vector + SQL LIKE
     */
    public function hybridSearch(string $query, int $topK = 3): array
    {
        // Vector search results
        $vectorResults = $this->search($query, $topK);

        // SQL LIKE search for keyword matching.
        $keywordResults = $this->keywordSearch([$query], $topK * 2);

        // Combine and deduplicate using Reciprocal Rank Fusion
        return $this->reciprocalRankFusion($vectorResults, $keywordResults, $topK);
    }

    /**
     * Reciprocal Rank Fusion for combining search results
     */
    protected function reciprocalRankFusion(array $vectorResults, $keywordResults, int $topK): array
    {
        $k = 60; // RRF constant
        $scores = [];

        // Score vector results
        foreach ($vectorResults as $rank => $result) {
            $id = $result['chunk']->id;
            $scores[$id] = ($scores[$id] ?? 0) + (1 / ($k + $rank + 1));
        }

        // Score keyword results
        foreach ($keywordResults as $rank => $chunk) {
            $id = $chunk->id;
            $scores[$id] = ($scores[$id] ?? 0) + (1 / ($k + $rank + 1));
        }

        // Sort by combined score
        arsort($scores);

        // Get top K chunks
        $topIds = array_slice(array_keys($scores), 0, $topK);

        $results = [];
        foreach ($topIds as $id) {
            // Find the chunk from either result set
            $chunk = null;

            foreach ($vectorResults as $result) {
                if ($result['chunk']->id == $id) {
                    $chunk = $result['chunk'];
                    break;
                }
            }

            if (! $chunk) {
                foreach ($keywordResults as $kwChunk) {
                    if ($kwChunk->id == $id) {
                        $chunk = $kwChunk;
                        break;
                    }
                }
            }

            if ($chunk) {
                $results[] = [
                    'chunk' => $chunk,
                    'score' => $scores[$id],
                ];
            }
        }

        return $results;
    }

    /**
     * Delete embeddings for a source
     */
    public function deleteEmbeddings(string $sourceType, int $sourceId): bool
    {
        try {
            DB::table('knowledge_chunks')
                ->where('source_type', $sourceType)
                ->where('source_id', $sourceId)
                ->delete();

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to delete embeddings', [
                'error' => $e->getMessage(),
                'source_type' => $sourceType,
                'source_id' => $sourceId,
            ]);

            return false;
        }
    }
}
