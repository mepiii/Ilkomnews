<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ApiKeyController extends Controller
{
    /**
     * Get current API keys (masked, never exposed)
     */
    public function index()
    {
        $geminiRaw = config('services.gemini.api_key');
        $geminiKeys = preg_split('/[\s,]+/', (string) $geminiRaw, -1, PREG_SPLIT_NO_EMPTY);
        $geminiKeys = array_values(array_filter(array_map('trim', $geminiKeys)));

        return response()->json([
            'azure' => [
                'configured' => !empty(config('services.azure.openai_api_key')),
                'key_masked' => $this->maskKey(config('services.azure.openai_api_key')),
                'endpoint' => config('services.azure.openai_endpoint'),
                'chat_deployment' => config('services.azure.chat_deployment'),
                'embedding_deployment' => config('services.azure.embedding_deployment'),
            ],
            'gemini' => [
                'configured' => count($geminiKeys) > 0,
                'key_count' => count($geminiKeys),
                'key_masked' => $this->maskKey($geminiKeys[0] ?? ''),
                'keys_masked' => array_map([$this, 'maskKey'], $geminiKeys),
                'chat_model' => config('services.gemini.chat_model'),
                'embedding_model' => config('services.gemini.embedding_model'),
            ],
        ]);
    }

    /**
     * Update Azure API key (encrypted in .env)
     */
    public function updateAzure(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'api_key' => 'required|string|min:20',
            'endpoint' => 'required|url',
            'chat_deployment' => 'nullable|string',
            'embedding_deployment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $this->updateEnv([
            'AZURE_OPENAI_API_KEY' => $request->api_key,
            'AZURE_OPENAI_ENDPOINT' => $request->endpoint,
            'AZURE_OPENAI_DEPLOYMENT' => $request->chat_deployment ?? 'gpt-4o-mini',
            'AZURE_EMBEDDING_DEPLOYMENT' => $request->embedding_deployment ?? 'text-embedding-3-small',
        ]);

        return response()->json([
            'message' => 'Azure API configuration updated successfully',
            'key_masked' => $this->maskKey($request->api_key),
        ]);
    }

    /**
     * Update Gemini API keys (encrypted in .env).
     * Accepts one key or many — comma / newline / whitespace separated — and
     * stores them as a single delimited GEMINI_API_KEY value. The service
     * rotates across the pool to spread the free-tier quota.
     */
    public function updateGemini(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'api_key' => 'required|string|min:20',
            'chat_model' => 'nullable|string',
            'embedding_model' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Normalize the incoming blob into a de-duped, comma-joined pool.
        $keys = preg_split('/[\s,]+/', (string) $request->api_key, -1, PREG_SPLIT_NO_EMPTY);
        $keys = array_values(array_unique(array_filter(array_map('trim', $keys))));

        if (empty($keys)) {
            return response()->json(['errors' => ['api_key' => ['No valid API key provided']]], 422);
        }

        $joined = implode(',', $keys);

        $this->updateEnv([
            'GEMINI_API_KEY' => $joined,
            'GEMINI_CHAT_MODEL' => $request->chat_model ?? 'gemini-2.5-flash',
            'GEMINI_EMBEDDING_MODEL' => $request->embedding_model ?? 'gemini-embedding-001',
        ]);

        return response()->json([
            'message' => 'Gemini API configuration updated successfully',
            'key_count' => count($keys),
            'key_masked' => $this->maskKey($keys[0]),
        ]);
    }

    /**
     * Test Azure connection
     */
    public function testAzure()
    {
        try {
            $service = new \App\Services\AzureOpenAIService();
            $isHealthy = $service->isHealthy();

            return response()->json([
                'status' => $isHealthy ? 'success' : 'failed',
                'message' => $isHealthy ? 'Azure AI connection successful' : 'Failed to connect to Azure AI',
            ]);
        } catch (\Exception $e) {
            Log::channel('daily')->error('Azure connection test failed', [
                'exception' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Azure connection test failed. Check the configuration and try again.',
            ], 500);
        }
    }

    /**
     * Test Gemini connection
     */
    public function testGemini()
    {
        try {
            $service = new \App\Services\GeminiService();
            $isHealthy = $service->isHealthy();

            return response()->json([
                'status' => $isHealthy ? 'success' : 'failed',
                'message' => $isHealthy ? 'Gemini API connection successful' : 'Failed to connect to Gemini API',
            ]);
        } catch (\Exception $e) {
            Log::channel('daily')->error('Gemini connection test failed', [
                'exception' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gemini connection test failed. Check the configuration and try again.',
            ], 500);
        }
    }

    /**
     * Update .env file with values.
     *
     * Keys are stored in plaintext because the consumer services
     * (GeminiService / AzureOpenAIService) read them via config('services.*')
     * without decrypting. Values are quoted and escaped so that characters
     * such as #, =, ", $ and backslashes cannot corrupt the .env file or be
     * interpreted as comments/variable expansion.
     */
    protected function updateEnv(array $data)
    {
        $envPath = base_path('.env');

        if (!file_exists($envPath)) {
            return;
        }

        $envContent = file_get_contents($envPath);

        foreach ($data as $key => $value) {
            $value = is_string($value) ? $value : (string) $value;
            // Strip newlines/control characters that would break a single .env line.
            $value = str_replace(["\r", "\n"], '', $value);
            // Escape characters that are special inside a double-quoted .env value.
            $escaped = str_replace(['\\', '"', '$'], ['\\\\', '\\"', '\\$'], $value);
            $replacement = "{$key}=\"{$escaped}\"";

            $pattern = "/^{$key}=.*$/m";

            if (preg_match($pattern, $envContent)) {
                $envContent = preg_replace($pattern, $replacement, $envContent);
            } else {
                $envContent .= "\n{$replacement}";
            }
        }

        // ponytail: atomic write via temp file + rename so a concurrent admin
        // edit (or crash mid-write) can never leave a half-written .env.
        $tmpPath = $envPath . '.' . getmypid() . '.tmp';
        file_put_contents($tmpPath, $envContent);
        rename($tmpPath, $envPath);

        // Clear config cache
        \Artisan::call('config:clear');
    }

    /**
     * Mask API key for display (never show full key)
     */
    protected function maskKey(?string $key): string
    {
        if (!$key) {
            return 'Not configured';
        }

        $length = strlen($key);
        if ($length <= 8) {
            return str_repeat('*', $length);
        }

        return substr($key, 0, 4) . str_repeat('*', $length - 8) . substr($key, -4);
    }
}
