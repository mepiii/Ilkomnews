@extends('admin.layout')

@section('title', 'Pengaturan Chatbot')

@section('header', 'Pengaturan Chatbot & LLM')

@section('content')
<div class="space-y-6">
    <!-- Info Banner -->
    <div class="bg-gradient-to-r from-purple-600/20 to-purple-900/20 border border-purple-600/30 rounded-xl p-6 shadow-lg shadow-purple-500/10">
        <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <div class="flex-1">
                <h3 class="text-lg font-bold text-white mb-2">Multi-LLM Fallback System</h3>
                <p class="text-gray-300 text-sm mb-3">
                    Chatbot Wolfy mendukung multiple LLM providers. Jika provider utama (Prioritas terendah, misal 0) mengalami gangguan (timeout/limit), sistem akan otomatis mencoba provider berikutnya.
                </p>
                <button onclick="document.getElementById('add-provider-modal').classList.remove('hidden')" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-medium text-sm mt-2 inline-flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Provider
                </button>
            </div>
        </div>
    </div>

    <!-- Provider List -->
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl shadow-lg shadow-purple-500/5 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-black/50 border-b border-purple-900/30">
                        <th class="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                        <th class="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Prioritas</th>
                        <th class="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama Provider</th>
                        <th class="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Prefix / API</th>
                        <th class="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Model ID</th>
                        <th class="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-purple-900/20">
                    @forelse($providers as $provider)
                    <tr class="hover:bg-white/[0.02] transition-colors">
                        <td class="py-3 px-4">
                            @if($provider->is_active)
                                <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Aktif</span>
                            @else
                                <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">Nonaktif</span>
                            @endif
                        </td>
                        <td class="py-3 px-4">
                            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600/20 text-purple-400 text-xs font-bold border border-purple-600/30">
                                {{ $provider->priority }}
                            </span>
                        </td>
                        <td class="py-3 px-4">
                            <div class="font-medium text-white">{{ $provider->name }}</div>
                            <div class="text-xs text-gray-500">{{ $provider->provider_type }}</div>
                        </td>
                        <td class="py-3 px-4">
                            <code class="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded">{{ $provider->prefix }}</code>
                            <span class="ml-1 text-xs text-gray-500">{{ $provider->api_type }}</span>
                        </td>
                        <td class="py-3 px-4">
                            <code class="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded">{{ $provider->model_id }}</code>
                        </td>
                        <td class="py-3 px-4">
                            <div class="flex items-center gap-2">
                                <button onclick="editProvider({{ $provider->toJson() }})" class="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors" title="Edit">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                                <form action="{{ route('admin.settings.providers.destroy', $provider) }}" method="POST" class="inline" onsubmit="return confirm('Hapus provider ini?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Hapus">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="py-8 text-center text-gray-500">
                            Belum ada LLM Provider. Klik "Tambah Provider" untuk memulai.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal Tambah/Edit Provider -->
<div id="add-provider-modal" class="fixed inset-0 z-50 hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-[#0a0a0a] border border-purple-900/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-purple-900/30 flex justify-between items-center bg-black/40">
            <h3 id="modal-title" class="text-lg font-bold text-white">Tambah LLM Provider</h3>
            <button type="button" onclick="closeModal()" class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <form id="provider-form" method="POST" action="{{ route('admin.settings.providers.store') }}" class="p-6 space-y-4">
            @csrf
            <input type="hidden" name="_method" id="form-method" value="POST">
            
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Nama Provider</label>
                <input type="text" name="name" id="name" required class="w-full px-3 py-2 bg-black/50 border border-purple-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" placeholder="e.g. OpenAI, GitHub Models">
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Tipe API</label>
                    <select name="provider_type" id="provider_type" class="w-full px-3 py-2 bg-black/50 border border-purple-900/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm">
                        <option value="openai">OpenAI Compatible</option>
                        <option value="anthropic">Anthropic</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Prioritas</label>
                    <input type="number" name="priority" id="priority" required min="0" value="0" class="w-full px-3 py-2 bg-black/50 border border-purple-900/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Base URL</label>
                <input type="url" name="base_url" id="base_url" required class="w-full px-3 py-2 bg-black/50 border border-purple-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" placeholder="https://api.openai.com/v1">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Prefix <span class="text-xs text-gray-500 font-normal">(slug namespacing)</span></label>
                    <input type="text" name="prefix" id="prefix" required class="w-full px-3 py-2 bg-black/50 border border-purple-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" placeholder="e.g. gemini" pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$">
                    <p class="text-xs text-gray-500 mt-1">URL-safe slug used to namespace model IDs (e.g. <code class="text-purple-300">gemini</code> resolves <code class="text-purple-300">gemini/gemini-3.1-pro-preview</code>).</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">API Type</label>
                    <select name="api_type" id="api_type" class="w-full px-3 py-2 bg-black/50 border border-purple-900/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm">
                        <option value="chat">Chat Completions</option>
                        <option value="raw">API (Raw)</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Model ID</label>
                <input type="text" name="model_id" id="model_id" required class="w-full px-3 py-2 bg-black/50 border border-purple-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" placeholder="e.g. gpt-4o-mini, claude-3-haiku-20240307">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">API Key <span id="api-key-hint" class="text-xs text-purple-400 font-normal ml-2 hidden">(Kosongkan jika tidak ingin mengubah)</span></label>
                <input type="password" name="api_key" id="api_key" class="w-full px-3 py-2 bg-black/50 border border-purple-900/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" placeholder="sk-...">
            </div>

            <div class="flex items-center gap-2 mt-2">
                <input type="checkbox" name="is_active" id="is_active" value="1" checked class="w-4 h-4 rounded border-purple-900/30 text-purple-600 focus:ring-purple-600 focus:ring-offset-gray-900 bg-black/50">
                <label for="is_active" class="text-sm text-gray-300">Provider Aktif</label>
            </div>

            <div class="pt-4 border-t border-purple-900/30 flex justify-end gap-3">
                <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Batal</button>
                <button type="submit" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-purple-600/20">Simpan Provider</button>
            </div>
        </form>
    </div>
</div>

<script>
    function closeModal() {
        document.getElementById('add-provider-modal').classList.add('hidden');
        document.getElementById('provider-form').reset();
        document.getElementById('provider-form').action = "{{ route('admin.settings.providers.store') }}";
        document.getElementById('form-method').value = "POST";
        document.getElementById('modal-title').innerText = "Tambah LLM Provider";
        document.getElementById('api_key').required = true;
        document.getElementById('api-key-hint').classList.add('hidden');
    }

    function editProvider(provider) {
        document.getElementById('add-provider-modal').classList.remove('hidden');
        document.getElementById('modal-title').innerText = "Edit LLM Provider";
        
        let updateUrl = "{{ route('admin.settings.providers.update', ':id') }}".replace(':id', provider.id);
        document.getElementById('provider-form').action = updateUrl;
        document.getElementById('form-method').value = "PUT";
        
        document.getElementById('name').value = provider.name;
        document.getElementById('provider_type').value = provider.provider_type;
        document.getElementById('priority').value = provider.priority;
        document.getElementById('base_url').value = provider.base_url;
        document.getElementById('prefix').value = provider.prefix || '';
        document.getElementById('api_type').value = provider.api_type || 'chat';
        document.getElementById('model_id').value = provider.model_id;
        document.getElementById('is_active').checked = provider.is_active;
        
        document.getElementById('api_key').required = false;
        document.getElementById('api-key-hint').classList.remove('hidden');
    }
</script>
@endsection
