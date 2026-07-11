<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected string $chatModel;
    protected string $embeddingModel;
    protected int $timeout = 30;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key', env('GEMINI_API_KEY', ''));
        $this->chatModel = config('services.gemini.chat_model', 'gemini-2.5-flash');
        $this->embeddingModel = config('services.gemini.embedding_model', 'text-embedding-004');
    }

    /**
     * Generate text via Gemini API (native format)
     */
    public function chat(string $prompt, array $options = []): ?array
    {
        $temperature = $options['temperature'] ?? 0.7;
        $maxTokens = $options['max_tokens'] ?? 200;

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => $temperature,
                'maxOutputTokens' => $maxTokens,
                'thinkingConfig' => ['thinkingBudget' => 0],
            ]
        ];

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->chatModel}:generateContent";

            $response = Http::timeout($this->timeout)
                ->withHeaders(['x-goog-api-key' => $this->apiKey])
                ->post($url, $payload);

            if ($response->successful()) {
                $data = $response->json();

                // Defensive handling: Gemini returns a `candidates` array.
                // If empty (e.g. blocked/filtered) or missing parts, return null
                // instead of throwing an undefined-index error.
                $candidates = $data['candidates'] ?? [];
                $finishReason = $candidates[0]['finishReason'] ?? 'STOP';
                if (empty($candidates) || $finishReason === 'SAFETY') {
                    Log::warning('Gemini chat returned no usable candidate', [
                        'finishReason' => $finishReason,
                        'promptFeedback' => $data['promptFeedback'] ?? null,
                    ]);
                    return null;
                }

                $text = $candidates[0]['content']['parts'][0]['text'] ?? '';

                if ($text === '') {
                    return null;
                }

                return [
                    'content' => $text,
                    'tokens' => $data['usageMetadata']['totalTokenCount'] ?? 0,
                    'model' => $this->chatModel,
                ];
            }

            Log::error('Gemini chat error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('Gemini chat exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Generate embeddings via Gemini API
     */
    public function embeddings(string $text): ?array
    {
        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->embeddingModel}:embedContent";

            $response = Http::timeout($this->timeout)
                ->withHeaders(['x-goog-api-key' => $this->apiKey])
                ->post($url, [
                    'model' => "models/{$this->embeddingModel}",
                    'content' => [
                        'parts' => [
                            ['text' => $text]
                        ]
                    ]
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'embedding' => $data['embedding']['values'] ?? [],
                    'tokens' => 0, // Gemini doesn't return token count for embeddings
                    'model' => $this->embeddingModel,
                ];
            }

            Log::error('Gemini embeddings error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('Gemini embeddings exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Batch embeddings for multiple texts
     */
    public function batchEmbeddings(array $texts): ?array
    {
        $embeddings = [];

        // Gemini doesn't support batch embeddings in one call, process sequentially
        foreach ($texts as $index => $text) {
            $result = $this->embeddings($text);

            if ($result) {
                $embeddings[$index] = $result['embedding'];
            } else {
                return null; // Fail entire batch if one fails
            }
        }

        return [
            'embeddings' => $embeddings,
            'tokens' => 0,
            'model' => $this->embeddingModel,
        ];
    }

    /**
     * Check if Gemini service is healthy
     */
    public function isHealthy(): bool
    {
        return Cache::remember('gemini_health', 300, function () {
            try {
                $url = "https://generativelanguage.googleapis.com/v1beta/models";

                $response = Http::timeout(5)->withHeaders(['x-goog-api-key' => $this->apiKey])->get($url);

                return $response->successful();
            } catch (\Exception $e) {
                return false;
            }
        });
    }
}
