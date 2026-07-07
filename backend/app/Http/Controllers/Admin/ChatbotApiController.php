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
}
