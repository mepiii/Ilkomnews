<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    /** @var string[] Pool of API keys (rotated to dodge per-key quota limits). */
    protected array $keys = [];

    protected string $chatModel;

    protected string $embeddingModel;

    // ponytail: 8s (was 10). Aligns with ChatController's per-provider cap so a
    // slow Gemini call can't exceed the request's overall latency budget.
    protected int $timeout = 8;

    public function __construct()
    {
        // ponytail: GEMINI_API_KEY holds one key OR a list (comma / newline /
        // whitespace separated). Splitting here means no DB/schema change and
        // the admin single-key flow keeps working unchanged.
        $raw = config('services.gemini.api_key', env('GEMINI_API_KEY', ''));
        $keys = preg_split('/[\s,]+/', (string) $raw, -1, PREG_SPLIT_NO_EMPTY);
        $this->keys = array_values(array_unique(array_filter(array_map('trim', $keys))));

        $this->chatModel = config('services.gemini.chat_model', 'gemini-2.5-flash');
        $this->embeddingModel = config('services.gemini.embedding_model', 'gemini-embedding-001');
    }

    /**
     * Generate text via Gemini API (native format), rotating keys on 429.
     */
    public function chat(string $prompt, array $options = []): ?array
    {
        $temperature = $options['temperature'] ?? 0.7;
        $maxTokens = $options['max_tokens'] ?? 200;

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                    ],
                ],
            ],
            'generationConfig' => [
                'temperature' => $temperature,
                'maxOutputTokens' => $maxTokens,
                'thinkingConfig' => ['thinkingBudget' => 0],
            ],
        ];

        $result = $this->executeWithRotation(fn ($key) => Http::timeout($this->timeout)
            ->withHeaders(['x-goog-api-key' => $key])
            ->post($this->chatUrl(), $payload)
        );

        if (! $result) {
            return null;
        }

        $data = $result['data'];

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

    /**
     * Generate embeddings via Gemini API, rotating keys on 429.
     */
    public function embeddings(string $text): ?array
    {
        $result = $this->executeWithRotation(fn ($key) => Http::timeout($this->timeout)
            ->withHeaders(['x-goog-api-key' => $key])
            ->post($this->embedUrl(), [
                'model' => "models/{$this->embeddingModel}",
                'content' => [
                    'parts' => [
                        ['text' => $text],
                    ],
                ],
            ])
        );

        if (! $result) {
            return null;
        }

        $data = $result['data'];

        return [
            'embedding' => $data['embedding']['values'] ?? [],
            'tokens' => 0, // Gemini doesn't return token count for embeddings
            'model' => $this->embeddingModel,
        ];
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
        $key = $this->keys[0] ?? null;
        if (! $key) {
            return false;
        }

        return Cache::remember('gemini_health', 300, function () use ($key) {
            try {
                $url = 'https://generativelanguage.googleapis.com/v1beta/models';

                $response = Http::timeout(5)->withHeaders(['x-goog-api-key' => $key])->get($url);

                return $response->successful();
            } catch (\Exception $e) {
                return false;
            }
        });
    }

    /**
     * Run a Gemini HTTP request, transparently rotating to the next available
     * key when the current one is rate-limited (429). Returns
     * ['data' => decoded json] on a successful (2xx) response, or null when
     * every key is exhausted / rate-limited.
     */
    protected function executeWithRotation(callable $requestFn): ?array
    {
        if (empty($this->keys)) {
            return null;
        }

        $count = count($this->keys);
        $start = (int) Cache::get('gemini_key_ptr', 0) % $count;

        for ($i = 0; $i < $count; $i++) {
            $idx = ($start + $i) % $count;
            $key = $this->keys[$idx];

            // Skip keys currently in cooldown (recently 429'd).
            if (Cache::get('gemini_key_cd:'.md5($key), false)) {
                continue;
            }

            try {
                $response = $requestFn($key);
            } catch (\Exception $e) {
                Log::warning('Gemini request exception for a key', ['error' => $e->getMessage()]);
                $this->cooldown($key, 60);

                continue;
            }

            if ($response->successful()) {
                Cache::put('gemini_key_ptr', $idx + 1, 3600); // spread load

                return ['data' => $response->json()];
            }

            if ($response->status() === 429) {
                // Rate-limited: skip this key for a while, try the next one.
                $this->cooldown($key, $this->retryAfter($response));

                continue;
            }

            Log::error('Gemini request error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            $this->cooldown($key, 60);
        }

        Log::error('All Gemini API keys failed or are rate-limited');

        return null;
    }

    /**
     * Put a key on cooldown so the rotator skips it briefly.
     */
    protected function cooldown(string $key, int $seconds): void
    {
        Cache::put('gemini_key_cd:'.md5($key), true, max(1, $seconds));
    }

    /**
     * Best-effort parse of how long to back off after a 429.
     */
    protected function retryAfter($response): int
    {
        $header = method_exists($response, 'header')
            ? $response->header('Retry-After')
            : null;

        if ($header && is_numeric($header)) {
            return (int) $header;
        }

        // Gemini sometimes reports retryDelay in the JSON body details.
        $data = method_exists($response, 'json') ? $response->json() : null;
        foreach (($data['error']['details'] ?? []) as $detail) {
            if (isset($detail['retryDelay']) && preg_match('/(\d+)/', $detail['retryDelay'], $m)) {
                return (int) $m[1];
            }
        }

        // ponytail: 5-minute cooldown default — long enough to clear most
        // per-minute buckets, short enough to recover when quota resets.
        return 300;
    }

    protected function chatUrl(): string
    {
        return "https://generativelanguage.googleapis.com/v1beta/models/{$this->chatModel}:generateContent";
    }

    /**
     * Stream chat tokens via Gemini SSE (alt=sse), rotating keys on 429.
     * Yields text chunks (strings). On total failure yields nothing and logs.
     * ponytail: single streaming endpoint, no batching; the per-key pool is
     * already split in the constructor so multi-key rotation "just works".
     */
    public function streamChat(string $prompt, array $options = []): \Generator
    {
        $temperature = $options['temperature'] ?? 0.7;
        $maxTokens = $options['max_tokens'] ?? 200;

        $payload = [
            'contents' => [['parts' => [['text' => $prompt]]]],
            'generationConfig' => [
                'temperature' => $temperature,
                'maxOutputTokens' => $maxTokens,
                'thinkingConfig' => ['thinkingBudget' => 0],
            ],
        ];

        $count = count($this->keys);
        if ($count === 0) {
            return;
        }
        $start = (int) Cache::get('gemini_key_ptr', 0) % $count;

        for ($i = 0; $i < $count; $i++) {
            $idx = ($start + $i) % $count;
            $key = $this->keys[$idx];
            if (Cache::get('gemini_key_cd:'.md5($key), false)) {
                continue;
            }

            try {
                $response = Http::timeout($this->timeout)
                    ->withOptions(['stream' => true])
                    ->withHeaders(['x-goog-api-key' => $key])
                    ->post($this->chatUrl().':streamGenerateContent?alt=sse', $payload);
            } catch (\Exception $e) {
                Log::warning('Gemini stream exception for a key', ['error' => $e->getMessage()]);
                $this->cooldown($key, 60);

                continue;
            }

            if ($response->status() === 429) {
                $this->cooldown($key, $this->retryAfter($response));

                continue;
            }
            if (! $response->successful()) {
                Log::error('Gemini stream request error', [
                    'status' => $response->status(),
                    'body' => substr($response->body(), 0, 500),
                ]);
                $this->cooldown($key, 60);

                continue;
            }

            Cache::put('gemini_key_ptr', $idx + 1, 3600);
            yield from $this->parseSseStream($response);

            return;
        }

        Log::error('All Gemini API keys failed or are rate-limited (stream)');
    }

    /**
     * Read a streamed SSE body and yield the text of each chunk.
     */
    protected function parseSseStream($response): \Generator
    {
        $stream = $response->toPsrResponse()->getBody();
        $buffer = '';

        while (! $stream->eof()) {
            $chunk = $stream->read(1024);
            if ($chunk === '') {
                usleep(10000);

                continue;
            }
            $buffer .= $chunk;

            while (($pos = strpos($buffer, "\n")) !== false) {
                $line = substr($buffer, 0, $pos);
                $buffer = substr($buffer, $pos + 1);
                $text = $this->sseLineText($line);
                if ($text !== null) {
                    yield $text;
                }
            }
        }

        // Flush any trailing line not terminated by newline.
        $text = $this->sseLineText($buffer);
        if ($text !== null) {
            yield $text;
        }
    }

    /**
     * Parse one SSE line ("data: {json}") and return its text part, or null.
     */
    protected function sseLineText(string $line): ?string
    {
        $line = trim($line);
        if ($line === '' || ! str_starts_with($line, 'data:')) {
            return null;
        }
        $json = trim(substr($line, 5));
        if ($json === '') {
            return null;
        }
        $data = json_decode($json, true);
        if (! is_array($data)) {
            return null;
        }

        // Skip finish/empty candidates (e.g. SAFETY blocks).
        $candidates = $data['candidates'] ?? [];
        if (empty($candidates)) {
            return null;
        }
        if (($candidates[0]['finishReason'] ?? 'STOP') === 'SAFETY') {
            return null;
        }

        return $candidates[0]['content']['parts'][0]['text'] ?? null;
    }

    protected function embedUrl(): string
    {
        return "https://generativelanguage.googleapis.com/v1beta/models/{$this->embeddingModel}:embedContent";
    }
}
