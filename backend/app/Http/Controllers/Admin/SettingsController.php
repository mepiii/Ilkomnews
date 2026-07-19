<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LlmProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class SettingsController extends Controller
{
    public function index()
    {
        // ponytail: DB down → empty provider list, not a 500.
        try {
            $providers = LlmProvider::orderBy('priority')->get();
        } catch (\Throwable $e) {
            $providers = new Collection();
        }

        return view('admin.settings.index', [
            'providers' => $providers,
        ]);
    }

    public function storeProvider(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider_type' => 'required|in:openai,anthropic',
            'prefix' => ['required', 'string', 'max:50', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'api_type' => 'required|string|in:chat,raw',
            'base_url' => 'required|url|max:500',
            'api_key' => 'required|string',
            'model_id' => 'required|string|max:255',
            'priority' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->has('is_active');

        LlmProvider::create($validated);

        return back()->with('success', 'LLM Provider berhasil ditambahkan.');
    }

    public function updateProvider(Request $request, LlmProvider $provider)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider_type' => 'required|in:openai,anthropic',
            'prefix' => ['sometimes', 'required', 'string', 'max:50', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'api_type' => 'sometimes|required|string|in:chat,raw',
            'base_url' => 'required|url|max:500',
            'api_key' => 'nullable|string',
            'model_id' => 'required|string|max:255',
            'priority' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->has('is_active');

        if (empty($validated['api_key'])) {
            unset($validated['api_key']);
        }

        $provider->update($validated);

        return back()->with('success', 'LLM Provider berhasil diperbarui.');
    }

    public function destroyProvider(LlmProvider $provider)
    {
        $provider->delete();
        return back()->with('success', 'LLM Provider berhasil dihapus.');
    }
}
