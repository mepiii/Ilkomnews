<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LLMRouter
{
    protected AzureOpenAIService $azure;
    protected GeminiService $gemini;
    protected int $healthCheckTTL = 300; // 5 minutes

    public function __construct(AzureOpenAIService $azure, GeminiService $gemini)
    {
        $this->azure = $azure;
        $this->gemini = $gemini;
    }

    /**
     * Route chat request to Azure (primary) or Gemini (fallback)
     */
    public function chat(array $messages, array $options = []): ?array
    {
        // Try Azure first
        if ($this->isAzureHealthy()) {
            $result = $this->azure->chat($messages, $options);

            if ($result) {
                return [
                    ...$result,
                    'provider' => 'azure',
                ];
            }

            // Mark Azure as unhealthy for a while
            $this->markUnhealthy('azure');
        }

        // Fallback to Gemini
        if ($this->isGeminiHealthy()) {
            Log::info('Falling back to Gemini for chat');

            // Convert messages to prompt for Gemini
            $prompt = $this->messagesToPrompt($messages);
            $result = $this->gemini->chat($prompt, $options);

            if ($result) {
                return [
                    ...$result,
                    'provider' => 'gemini',
                ];
            }

            $this->markUnhealthy('gemini');
        }

        Log::error('All LLM providers failed');
        return null;
    }

    /**
     * Route embeddings request to Azure (primary) or Gemini (fallback)
     */
    public function embeddings(string $text): ?array
    {
        // Try Azure first
        if ($this->isAzureHealthy()) {
            $result = $this->azure->embeddings($text);

            if ($result) {
                return [
                    ...$result,
                    'provider' => 'azure',
                ];
            }

            $this->markUnhealthy('azure');
        }

        // Fallback to Gemini
        if ($this->isGeminiHealthy()) {
            Log::info('Falling back to Gemini for embeddings');

            $result = $this->gemini->embeddings($text);

            if ($result) {
                return [
                    ...$result,
                    'provider' => 'gemini',
                ];
            }

            $this->markUnhealthy('gemini');
        }

        Log::error('All embedding providers failed');
        return null;
    }

    /**
     * Batch embeddings with fallback
     */
    public function batchEmbeddings(array $texts): ?array
    {
        // Try Azure first
        if ($this->isAzureHealthy()) {
            $result = $this->azure->batchEmbeddings($texts);

            if ($result) {
                return [
                    ...$result,
                    'provider' => 'azure',
                ];
            }

            $this->markUnhealthy('azure');
        }

        // Fallback to Gemini
        if ($this->isGeminiHealthy()) {
            Log::info('Falling back to Gemini for batch embeddings');

            $result = $this->gemini->batchEmbeddings($texts);

            if ($result) {
                return [
                    ...$result,
                    'provider' => 'gemini',
                ];
            }

            $this->markUnhealthy('gemini');
        }

        Log::error('All embedding providers failed');
        return null;
    }

    /**
     * Check if Azure is healthy
     */
    protected function isAzureHealthy(): bool
    {
        return Cache::get('llm_azure_healthy', true);
    }

    /**
     * Check if Gemini is healthy
     */
    protected function isGeminiHealthy(): bool
    {
        return Cache::get('llm_gemini_healthy', true);
    }

    /**
     * Mark a provider as unhealthy for a while
     */
    protected function markUnhealthy(string $provider): void
    {
        Cache::put("llm_{$provider}_healthy", false, $this->healthCheckTTL);
        Log::warning("LLM provider {$provider} marked as unhealthy");
    }

    /**
     * Convert messages array to a single prompt string for Gemini
     */
    protected function messagesToPrompt(array $messages): string
    {
        $prompt = '';

        foreach ($messages as $message) {
            $role = $message['role'];
            $content = $message['content'];

            if ($role === 'system') {
                $prompt .= "System: {$content}\n\n";
            } elseif ($role === 'user') {
                $prompt .= "User: {$content}\n\n";
            } elseif ($role === 'assistant') {
                $prompt .= "Assistant: {$content}\n\n";
            }
        }

        return trim($prompt);
    }
}
