<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LlmProvider;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        $providers = LlmProvider::orderBy('priority')->get();

        return view('admin.settings.index', [
            'providers' => $providers,
        ]);
    }

    public function storeProvider(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider_type' => 'required|in:openai,anthropic',
            'base_url' => 'required|url|max:255',
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
            'base_url' => 'required|url|max:255',
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
