<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LlmProvider;
use App\Services\SafeUrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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
            'prefix'        => ['required', 'string', 'max:50', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'api_type'      => 'required|string|in:chat,raw',
            'base_url'      => 'required|url|max:500',
            'api_key'       => 'nullable|string|max:2000',
            'model_id'      => 'nullable|string|max:100',
            'model'         => 'nullable|string|max:100',
            'provider_type' => 'required|string|max:100',
            'is_active'     => 'boolean',
        ]);

        // Map 'model' (frontend form field) to 'model_id' (DB column).
        // 'model_id' is also accepted directly (Blade admin form).
        if (!empty($validated['model']) && empty($validated['model_id'])) {
            $validated['model_id'] = $validated['model'];
        }
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
            'prefix'        => ['sometimes', 'required', 'string', 'max:50', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'api_type'      => 'sometimes|required|string|in:chat,raw',
            'base_url'      => 'sometimes|required|url|max:500',
            'api_key'       => 'nullable|string|max:2000',
            'model_id'      => 'nullable|string|max:100',
            'model'         => 'nullable|string|max:100',
            'provider_type' => 'sometimes|required|string|max:100',
            'is_active'     => 'boolean',
        ]);

        // Map 'model' (frontend form field) to 'model_id' (DB column).
        if (isset($validated['model'])) {
            if (!empty($validated['model']) && empty($validated['model_id'])) {
                $validated['model_id'] = $validated['model'];
            }
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
            'api_type' => 'nullable|string|in:chat,raw',
        ]);

        $providerType = $validated['provider_type'];
        $apiKey = $validated['api_key'];
        $baseUrl = $validated['base_url'];
        $modelId = $validated['model_id'] ?? null;
        $apiType = $validated['api_type'] ?? 'chat';

        // SSRF guard: an admin-supplied base_url is fetched server-side WITH the
        // API key. Reject private/internal targets before making any request so
        // the key can never be sent to loopback/metadata/private addresses.
        if (!empty($baseUrl) && !SafeUrl::isSafe($baseUrl)) {
            return response()->json([
                'success' => false,
                'message' => 'URL tidak valid atau dilarang (alamat privat/internal).',
            ], 422);
        }

        try {
            $base = $baseUrl ? rtrim($baseUrl, '/') : null;

            if ($providerType === 'anthropic' || $providerType === 'Anthropic') {
                // Anthropic uses the /messages endpoint
                $url = $base ? $base . '/messages' : 'https://api.anthropic.com/v1/messages';

                $response = Http::timeout(20)->withHeaders([
                    'x-api-key' => $apiKey,
                    'anthropic-version' => '2023-06-01',
                    'Content-Type' => 'application/json',
                ])->post($url, [
                    'model' => $modelId ?: 'claude-3-haiku-20240307',
                    'max_tokens' => 5,
                    'messages' => [['role' => 'user', 'content' => 'hi']],
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
            }

            if ($apiType === 'raw') {
                // Raw endpoints: lightweight reachability check. If no model id
                // is known, probe the provider's /models listing instead.
                $url = $modelId
                    ? ($base ?: 'https://api.openai.com/v1')
                    : ($base ? $base . '/models' : 'https://api.openai.com/v1/models');

                $response = Http::timeout(20)->withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ])->get($url);

                if ($response->successful() || $response->status() === 200) {
                    return response()->json(['ok' => true, 'success' => true, 'message' => 'API connection successful!']);
                }

                $error = $response->json();
                $message = $error['error']['message'] ?? 'Connection failed';
                return response()->json([
                    'ok' => false,
                    'success' => false,
                    'error' => $message,
                    'message' => $message,
                ], $response->status() ?: 500);
            }

            // Chat Completions API (default) — standard /v1/chat/completions
            $url = $base ? $base . '/chat/completions' : 'https://api.openai.com/v1/chat/completions';

            $response = Http::timeout(20)->withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post($url, [
                'model' => $modelId ?: 'gpt-4',
                'messages' => [['role' => 'user', 'content' => 'hi']],
                'max_tokens' => 5,
            ]);

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
