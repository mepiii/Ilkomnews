<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;

class ApiKeyController extends Controller
{
    /**
     * Get current API keys (masked, never exposed)
     */
    public function index()
    {
        return response()->json([
            'azure' => [
                'configured' => !empty(config('services.azure.openai_api_key')),
                'key_masked' => $this->maskKey(config('services.azure.openai_api_key')),
                'endpoint' => config('services.azure.openai_endpoint'),
                'chat_deployment' => config('services.azure.chat_deployment'),
                'embedding_deployment' => config('services.azure.embedding_deployment'),
            ],
            'gemini' => [
                'configured' => !empty(config('services.gemini.api_key')),
                'key_masked' => $this->maskKey(config('services.gemini.api_key')),
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
     * Update Gemini API key (encrypted in .env)
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

        $this->updateEnv([
            'GEMINI_API_KEY' => $request->api_key,
            'GEMINI_CHAT_MODEL' => $request->chat_model ?? 'gemini-2.5-flash',
            'GEMINI_EMBEDDING_MODEL' => $request->embedding_model ?? 'text-embedding-004',
        ]);

        return response()->json([
            'message' => 'Gemini API configuration updated successfully',
            'key_masked' => $this->maskKey($request->api_key),
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
            return response()->json([
                'status' => 'error',
                'message' => 'Azure connection test failed: ' . $e->getMessage(),
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
            return response()->json([
                'status' => 'error',
                'message' => 'Gemini connection test failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update .env file with encrypted values
     */
    protected function updateEnv(array $data)
    {
        $envPath = base_path('.env');

        if (!file_exists($envPath)) {
            return;
        }

        $envContent = file_get_contents($envPath);

        foreach ($data as $key => $value) {
            // Encrypt sensitive keys before storing
            if (str_contains($key, 'API_KEY')) {
                $value = Crypt::encryptString($value);
            }

            $pattern = "/^{$key}=.*$/m";
            $replacement = "{$key}={$value}";

            if (preg_match($pattern, $envContent)) {
                $envContent = preg_replace($pattern, $replacement, $envContent);
            } else {
                $envContent .= "\n{$key}={$value}";
            }
        }

        file_put_contents($envPath, $envContent);

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
