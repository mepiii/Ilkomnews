<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VectorSearchService
{
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

        if (!$queryEmbedding) {
            Log::error('Failed to generate query embedding');
            return [];
        }

        // Get all chunks with embeddings
        $chunks = DB::table('knowledge_chunks')
            ->whereNotNull('embedding')
            ->get();

        if ($chunks->isEmpty()) {
            return [];
        }

        // Calculate similarity scores
        $scored = [];
        foreach ($chunks as $chunk) {
            $chunkEmbedding = json_decode($chunk->embedding, true);

            if (!is_array($chunkEmbedding)) {
                continue;
            }

            $similarity = $this->embeddingService->cosineSimilarity(
                $queryEmbedding['embedding'],
                $chunkEmbedding
            );

            $scored[] = [
                'chunk' => $chunk,
                'similarity' => $similarity,
            ];
        }

        // Sort by similarity (descending)
        usort($scored, fn($a, $b) => $b['similarity'] <=> $a['similarity']);

        // Return top K
        return array_slice($scored, 0, $topK);
    }

    /**
     * Hybrid search: vector + SQL LIKE
     */
    public function hybridSearch(string $query, int $topK = 3): array
    {
        // Vector search results
        $vectorResults = $this->search($query, $topK);

        // SQL LIKE search for keyword matching.
        // Escape LIKE wildcards (% and _) so a user-supplied query cannot
        // act as a wildcard and match unrelated chunks.
        $escapedQuery = addcslashes($query, '%_');
        $keywordResults = DB::table('knowledge_chunks')
            ->where('chunk_text', 'LIKE', "%{$escapedQuery}%")
            ->orWhere('summary', 'LIKE', "%{$escapedQuery}%")
            ->limit($topK * 2)
            ->get();

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

            if (!$chunk) {
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
