<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AzureOpenAIService
{
    protected string $apiKey;
    protected string $endpoint;
    protected string $chatDeployment;
    protected string $embeddingDeployment;
    protected int $timeout = 30;

    public function __construct()
    {
        $this->apiKey = config('services.azure.openai_api_key', env('AZURE_OPENAI_API_KEY', ''));
        $this->endpoint = config('services.azure.openai_endpoint', env('AZURE_OPENAI_ENDPOINT', ''));
        $this->chatDeployment = config('services.azure.chat_deployment', env('AZURE_OPENAI_DEPLOYMENT', 'gpt-4o-mini'));
        $this->embeddingDeployment = config('services.azure.embedding_deployment', env('AZURE_EMBEDDING_DEPLOYMENT', 'text-embedding-3-small'));
    }

    /**
     * Generate chat completion via Azure AI Foundry
     */
    public function chat(array $messages, array $options = []): ?array
    {
        $maxRetries = $options['max_retries'] ?? 2;
        $temperature = $options['temperature'] ?? 0.7;
        $maxTokens = $options['max_tokens'] ?? 200;

        $payload = [
            'messages' => $messages,
            'temperature' => $temperature,
            'max_tokens' => $maxTokens,
        ];

        for ($attempt = 0; $attempt <= $maxRetries; $attempt++) {
            try {
                $response = Http::withHeaders([
                    'api-key' => $this->apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->timeout($this->timeout)
                ->post("{$this->endpoint}/chat/completions?api-version=2024-02-15-preview", [
                    'model' => $this->chatDeployment,
                    ...$payload
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    return [
                        'content' => $data['choices'][0]['message']['content'] ?? '',
                        'tokens' => $data['usage']['total_tokens'] ?? 0,
                        'model' => $this->chatDeployment,
                    ];
                }

                // Handle rate limiting
                if ($response->status() === 429) {
                    $retryAfter = $response->header('Retry-After') ?? 5;
                    Log::warning("Azure rate limited, retrying in {$retryAfter}s");
                    sleep((int) $retryAfter);
                    continue;
                }

                Log::error('Azure chat error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);

                return null;

            } catch (\Exception $e) {
                Log::error('Azure chat exception', ['error' => $e->getMessage()]);

                if ($attempt < $maxRetries) {
                    sleep(2 ** $attempt); // Exponential backoff
                    continue;
                }

                return null;
            }
        }

        return null;
    }

    /**
     * Generate embeddings via Azure AI Foundry
     */
    public function embeddings(string $text): ?array
    {
        try {
            $response = Http::withHeaders([
                'api-key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])
            ->timeout($this->timeout)
            ->post("{$this->endpoint}/embeddings?api-version=2024-02-15-preview", [
                'model' => $this->embeddingDeployment,
                'input' => $text,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $embedding = $data['data'][0]['embedding'] ?? null;
                // ponytail: never persist an empty vector — cosine norm 0 would
                // silently no-match. Surface the failure so the caller can skip.
                if (empty($embedding)) {
                    Log::error('Azure embeddings returned empty vector');
                    return null;
                }
                return [
                    'embedding' => $embedding,
                    'tokens' => $data['usage']['total_tokens'] ?? 0,
                    'model' => $this->embeddingDeployment,
                ];
            }

            Log::error('Azure embeddings error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('Azure embeddings exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Batch embeddings for multiple texts
     */
    public function batchEmbeddings(array $texts): ?array
    {
        try {
            $response = Http::withHeaders([
                'api-key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])
            ->timeout($this->timeout)
            ->post("{$this->endpoint}/embeddings?api-version=2024-02-15-preview", [
                'model' => $this->embeddingDeployment,
                'input' => $texts,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $embeddings = [];

                foreach ($data['data'] as $item) {
                    $embeddings[$item['index']] = $item['embedding'];
                }

                return [
                    'embeddings' => $embeddings,
                    'tokens' => $data['usage']['total_tokens'] ?? 0,
                    'model' => $this->embeddingDeployment,
                ];
            }

            Log::error('Azure batch embeddings error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('Azure batch embeddings exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Check if Azure service is healthy
     */
    public function isHealthy(): bool
    {
        return Cache::remember('azure_health', 300, function () {
            try {
                $response = Http::withHeaders([
                    'api-key' => $this->apiKey,
                ])
                ->timeout(5)
                ->get("{$this->endpoint}/models?api-version=2024-02-15-preview");

                return $response->successful();
            } catch (\Exception $e) {
                return false;
            }
        });
    }
}
