@extends('admin.layout')

@section('title', 'Kelola Berita')

@section('header', 'Kelola Berita')

@section('content')
<div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <p class="text-gray-400">Kelola dan atur artikel berita</p>
        </div>
        <a href="{{ route('admin.news.create') }}" class="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Buat Berita
        </a>
    </div>

    <!-- Search and Filters -->
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5">
        <form method="GET" action="{{ route('admin.news.index') }}" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <!-- Search -->
                <div class="md:col-span-2">
                    <label for="search" class="block text-sm font-medium text-gray-300 mb-2">Cari</label>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value="{{ request('search') }}"
                        placeholder="Cari berdasarkan judul atau konten..."
                        class="w-full px-4 py-2 bg-black border border-purple-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                </div>

                <!-- Status Filter -->
                <div>
                    <label for="status" class="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                        name="status"
                        id="status"
                        class="w-full px-4 py-2 bg-black border border-purple-900/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                        <option value="">Semua Status</option>
                        <option value="published" {{ request('status') === 'published' ? 'selected' : '' }}>Dipublikasi</option>
                        <option value="draft" {{ request('status') === 'draft' ? 'selected' : '' }}>Draf</option>
                    </select>
                </div>
            </div>

            <div class="flex gap-2">
                <button type="submit" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all">
                    Terapkan Filter
                </button>
                <a href="{{ route('admin.news.index') }}" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all">
                    Bersihkan
                </a>
            </div>
        </form>
    </div>

    <!-- News Table -->
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl shadow-lg shadow-purple-500/5 overflow-hidden">
        @if($news->isEmpty())
        <div class="text-center py-12">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-400 mb-2">Tidak ada artikel berita ditemukan</h3>
            <p class="text-gray-500 mb-4">Mulai dengan membuat artikel berita pertama Anda</p>
            <a href="{{ route('admin.news.create') }}" class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Buat Berita
            </a>
        </div>
        @else
        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
            <table class="w-full">
                <thead class="bg-black/50 border-b border-purple-900/20">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Artikel</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Dilihat</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-purple-900/20">
                    @foreach($news as $item)
                    <tr class="hover:bg-purple-600/5 transition-colors">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                @if($item->image)
                                <img src="{{ Storage::url($item->image) }}" alt="{{ $item->title }}" class="w-12 h-12 object-cover rounded-lg flex-shrink-0">
                                @else
                                <div class="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                                    </svg>
                                </div>
                                @endif
                                <div class="min-w-0">
                                    <p class="font-medium text-white truncate">{{ $item->title }}</p>
                                    <p class="text-sm text-gray-400 truncate">{{ Str::limit(strip_tags($item->content), 60) }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm text-gray-400">{{ $item->date->format('d M Y') }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center gap-1 text-sm text-gray-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                                <span>{{ number_format($item->views) }}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            @if($item->published)
                            <span class="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs font-medium">Dipublikasi</span>
                            @else
                            <span class="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs font-medium">Draf</span>
                            @endif
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right">
                            <div class="flex items-center justify-end gap-2">
                                <a href="{{ route('admin.news.edit', $item->id) }}" class="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/10 rounded-lg transition-all" title="Edit">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                </a>
                                <form method="POST" action="{{ route('admin.news.destroy', $item->id) }}" class="inline" onsubmit="return confirm('Apakah Anda yakin ingin menghapus artikel berita ini?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-lg transition-all" title="Hapus">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden divide-y divide-purple-900/20">
            @foreach($news as $item)
            <div class="p-4 hover:bg-purple-600/5 transition-colors">
                <div class="flex items-start gap-3">
                    @if($item->image)
                    <img src="{{ Storage::url($item->image) }}" alt="{{ $item->title }}" class="w-16 h-16 object-cover rounded-lg flex-shrink-0">
                    @else
                    <div class="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                        </svg>
                    </div>
                    @endif
                    <div class="flex-1 min-w-0">
                        <h3 class="font-medium text-white mb-1">{{ $item->title }}</h3>
                        <div class="flex items-center gap-2 text-xs text-gray-400 mb-2">
                            <span>{{ $item->date->format('d M Y') }}</span>
                            <span>•</span>
                            <span class="flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                                {{ number_format($item->views) }}
                            </span>
                            @if($item->published)
                            <span class="px-2 py-0.5 bg-green-600/20 text-green-400 rounded">Dipublikasi</span>
                            @else
                            <span class="px-2 py-0.5 bg-gray-600/20 text-gray-400 rounded">Draf</span>
                            @endif
                        </div>
                        <div class="flex items-center gap-2">
                            <a href="{{ route('admin.news.edit', $item->id) }}" class="flex items-center gap-1 px-3 py-1 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-600/10 rounded transition-all">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                                Edit
                            </a>
                            <form method="POST" action="{{ route('admin.news.destroy', $item->id) }}" class="inline" onsubmit="return confirm('Apakah Anda yakin ingin menghapus artikel berita ini?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="flex items-center gap-1 px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded transition-all">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                    Hapus
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        </div>

        <!-- Pagination -->
        @if($news->hasPages())
        <div class="px-6 py-4 border-t border-purple-900/20">
            {{ $news->links() }}
        </div>
        @endif
        @endif
    </div>

    <!-- Stats Summary -->
    @if(!$news->isEmpty())
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="bg-[#050505] border border-purple-900/20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Total Artikel</p>
            <p class="mt-1 text-2xl font-bold text-white">{{ $news->total() }}</p>
        </div>
        <div class="bg-[#050505] border border-purple-900/20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Menampilkan</p>
            <p class="mt-1 text-2xl font-bold text-white">{{ $news->firstItem() ?? 0 }}-{{ $news->lastItem() ?? 0 }}</p>
        </div>
        <div class="bg-[#050505] border border-purple-900/20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Halaman Saat Ini</p>
            <p class="mt-1 text-2xl font-bold text-white">{{ $news->currentPage() }}</p>
        </div>
    </div>
    @endif
</div>
@endsection

@push('scripts')
<script>
// ponytail: debounce + auto-submit, stdlib only
const searchInput = document.getElementById('search');
const statusSelect = document.getElementById('status');
const searchForm = searchInput?.closest('form');

if (searchForm) {
    let timeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => searchForm.submit(), 400);
    });
    statusSelect.addEventListener('change', () => searchForm.submit());
}
</script>
@endpush
