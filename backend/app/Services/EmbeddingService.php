<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class EmbeddingService
{
    protected LLMRouter $llmRouter;

    public function __construct(LLMRouter $llmRouter)
    {
        $this->llmRouter = $llmRouter;
    }

    /**
     * Generate embedding for a single text
     */
    public function generate(string $text): ?array
    {
        // Clean and normalize text
        $text = $this->normalizeText($text);

        if (empty($text)) {
            return null;
        }

        $result = $this->llmRouter->embeddings($text);

        if (!$result) {
            return null;
        }

        return [
            'embedding' => $result['embedding'],
            'tokens' => $result['tokens'],
            'model' => $result['model'],
            'provider' => $result['provider'],
        ];
    }

    /**
     * Generate embeddings for multiple texts in batch
     */
    public function generateBatch(array $texts): ?array
    {
        // Clean and normalize all texts
        $texts = array_map([$this, 'normalizeText'], $texts);
        $texts = array_filter($texts, fn($text) => !empty($text));

        if (empty($texts)) {
            return null;
        }

        $result = $this->llmRouter->batchEmbeddings($texts);

        if (!$result) {
            return null;
        }

        return [
            'embeddings' => $result['embeddings'],
            'tokens' => $result['tokens'],
            'model' => $result['model'],
            'provider' => $result['provider'],
        ];
    }

    /**
     * Normalize text for embedding
     */
    protected function normalizeText(string $text): string
    {
        // Remove excessive whitespace
        $text = preg_replace('/\s+/', ' ', $text);

        // Remove special characters that might interfere
        $text = preg_replace('/[^\p{L}\p{N}\p{P}\s]/u', '', $text);

        // Trim
        $text = trim($text);

        // Limit length (Azure has a token limit)
        // Approximate: 1 token ≈ 4 characters
        $maxChars = 8000 * 4; // ~8000 tokens
        if (strlen($text) > $maxChars) {
            $text = substr($text, 0, $maxChars);
        }

        return $text;
    }

    /**
     * Calculate cosine similarity between two embeddings
     */
    public function cosineSimilarity(array $embedding1, array $embedding2): float
    {
        $dotProduct = 0.0;
        $norm1 = 0.0;
        $norm2 = 0.0;

        $count = min(count($embedding1), count($embedding2));

        for ($i = 0; $i < $count; $i++) {
            $dotProduct += $embedding1[$i] * $embedding2[$i];
            $norm1 += $embedding1[$i] * $embedding1[$i];
            $norm2 += $embedding2[$i] * $embedding2[$i];
        }

        if ($norm1 == 0 || $norm2 == 0) {
            return 0.0;
        }

        return $dotProduct / (sqrt($norm1) * sqrt($norm2));
    }
}
