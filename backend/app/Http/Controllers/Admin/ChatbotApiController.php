<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LlmProvider;
use Illuminate\Http\Request;

class ChatbotApiController extends Controller
{
    public function index()
    {
        $configs = LlmProvider::orderBy('is_active', 'desc')->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $configs]);
    }

    public function show($id)
    {
        $config = LlmProvider::findOrFail($id);
        return response()->json(['data' => $config]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:100',
            'provider_type' => 'required|string|max:100',
            'api_key'       => 'required|string|max:500',
            'base_url'      => 'nullable|url|max:255',
            'model'         => 'required|string|max:100',
            'prefix'        => 'nullable|string|max:5000',
            'api_type'      => 'nullable|string|in:chat,responses',
            'is_active'     => 'boolean',
        ]);

        // Map 'model' to 'model_id' for the database schema
        $validated['model_id'] = $validated['model'] ?? null;
        unset($validated['model']);

        // If setting this as active, deactivate all others first
        if (!empty($validated['is_active'])) {
            LlmProvider::where('is_active', true)->update(['is_active' => false]);
        }

        $config = LlmProvider::create($validated);
        return response()->json(['data' => $config], 201);
    }

    public function update(Request $request, $id)
    {
        $config = LlmProvider::findOrFail($id);

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:100',
            'provider_type' => 'sometimes|required|string|max:100',
            'api_key'       => 'sometimes|required|string|max:500',
            'base_url'      => 'nullable|url|max:255',
            'model'         => 'sometimes|required|string|max:100',
            'prefix'        => 'nullable|string|max:5000',
            'api_type'      => 'nullable|string|in:chat,responses',
            'is_active'     => 'boolean',
        ]);

        // Map 'model' to 'model_id' for the database
        if (isset($validated['model'])) {
            $validated['model_id'] = $validated['model'];
            unset($validated['model']);
        }

        // If setting this as active, deactivate all others first
        if (isset($validated['is_active']) && $validated['is_active']) {
            LlmProvider::where('id', '!=', $id)->where('is_active', true)->update(['is_active' => false]);
        }

        $config->update($validated);
        return response()->json(['data' => $config->fresh()]);
    }

    public function destroy($id)
    {
        $config = LlmProvider::findOrFail($id);
        $config->delete();
        return response()->json(['message' => 'Konfigurasi API berhasil dihapus.']);
    }


    /**
     * Test API connection for a provider configuration
     */
    public function testConnection(Request $request)
    {
        $validated = $request->validate([
            'provider_type' => 'required|string',
            'api_key' => 'required|string',
            'base_url' => 'nullable|url',
            'model_id' => 'nullable|string',
            'api_type' => 'nullable|string|in:chat,responses',
        ]);

        $providerType = $validated['provider_type'];
        $apiKey = $validated['api_key'];
        $baseUrl = $validated['base_url'];
        $modelId = $validated['model_id'] ?? 'gpt-3.5-turbo';
        $apiType = $validated['api_type'] ?? 'chat';

        try {
            if ($providerType === 'anthropic' || $providerType === 'Anthropic') {
                // Anthropic uses /messages endpoint
                $url = $baseUrl ? rtrim($baseUrl, '/') . '/messages' : 'https://api.anthropic.com/v1/messages';
                
                $response = IlluminateSupportFacadesHttp::withHeaders([
                    'x-api-key' => $apiKey,
                    'anthropic-version' => '2023-06-01',
                    'Content-Type' => 'application/json',
                ])->post($url, [
                    'model' => $modelId ?: 'claude-3-haiku-20240307',
                    'max_tokens' => 10,
                    'messages' => [['role' => 'user', 'content' => 'Hi']],
                ]);

                if ($response->successful() || $response->status() === 200) {
                    return response()->json(['success' => true, 'message' => 'Anthropic API connection successful!']);
                }
                
                // Check for specific errors
                $error = $response->json();
                if (isset($error['error']['type']) && strpos($error['error']['type'], 'invalid_api_key') !== false) {
                    return response()->json(['success' => false, 'message' => 'Invalid API key'], 400);
                }
                
                return response()->json([
                    'success' => true, 
                    'message' => 'Connection established (model may need adjustment)'
                ]);
            } else {
                // OpenAI compatible (including OpenAI, Gemini, Custom)
                $url = $baseUrl ? rtrim($baseUrl, '/') : 'https://api.openai.com/v1';
                
                if ($apiType === 'responses') {
                    // Responses API (OpenAI)
                    $url .= '/responses';
                    $response = IlluminateSupportFacadesHttp::withHeaders([
                        'Authorization' => 'Bearer ' . $apiKey,
                        'Content-Type' => 'application/json',
                    ])->post($url, [
                        'model' => $modelId ?: 'gpt-4o',
                        'input' => 'Hi',
                    ]);
                } else {
                    // Chat Completions API (default)
                    $url .= '/chat/completions';
                    $response = IlluminateSupportFacadesHttp::withHeaders([
                        'Authorization' => 'Bearer ' . $apiKey,
                        'Content-Type' => 'application/json',
                    ])->post($url, [
                        'model' => $modelId ?: 'gpt-3.5-turbo',
                        'messages' => [['role' => 'user', 'content' => 'Hi']],
                        'max_tokens' => 10,
                    ]);
                }

                if ($response->successful() || $response->status() === 200) {
                    return response()->json(['success' => true, 'message' => 'API connection successful!']);
                }
                
                $error = $response->json();
                if (isset($error['error']['code']) && $error['error']['code'] === 'invalid_api_key') {
                    return response()->json(['success' => false, 'message' => 'Invalid API key'], 400);
                }
                if (isset($error['error']['message']) && strpos(strtolower($error['error']['message']), 'invalid') !== false) {
                    return response()->json(['success' => false, 'message' => $error['error']['message']], 400);
                }
                
                return response()->json([
                    'success' => true, 
                    'message' => 'Connection established (model may need adjustment)'
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Chatbot API connection test failed', [
                'provider_type' => $providerType,
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false, 
                'message' => 'Connection failed. Please check your API key and base URL.',
            ], 500);
        }
    }
}
