@extends('admin.layout')

@section('title', 'Kelola Proyek')

@section('header', 'Galeri Proyek')

@section('content')
<div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <p class="text-gray-400">Tinjau dan kelola pengajuan proyek mahasiswa</p>
        </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5">
        <form method="GET" action="{{ route('admin.projects.index') }}" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <!-- Search -->
                <div class="md:col-span-2">
                    <label for="search" class="block text-sm font-medium text-gray-300 mb-2">Cari</label>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value="{{ request('search') }}"
                        placeholder="Cari berdasarkan nama proyek, nama mahasiswa, atau NPM..."
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
                        <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Menunggu</option>
                        <option value="accepted" {{ request('status') === 'accepted' ? 'selected' : '' }}>Diterima</option>
                        <option value="rejected" {{ request('status') === 'rejected' ? 'selected' : '' }}>Ditolak</option>
                    </select>
                </div>
            </div>

            <div class="flex gap-2">
                <button type="submit" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all">
                    Terapkan Filter
                </button>
                <a href="{{ route('admin.projects.index') }}" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all">
                    Bersihkan
                </a>
            </div>
        </form>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-[#050505] border border-purple-900/20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Total Proyek</p>
            <p class="mt-1 text-2xl font-bold text-white">{{ $total_projects }}</p>
        </div>
        <div class="bg-[#050505] border border-yellow-600/20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Menunggu Tinjauan</p>
            <p class="mt-1 text-2xl font-bold text-yellow-400">{{ $pending_count }}</p>
        </div>
        <div class="bg-[#050505] border border-green-600/20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Diterima</p>
            <p class="mt-1 text-2xl font-bold text-green-400">{{ $accepted_count }}</p>
        </div>
        <div class="bg-[#050505] border border-red-600/20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Ditolak</p>
            <p class="mt-1 text-2xl font-bold text-red-400">{{ $rejected_count }}</p>
        </div>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        @forelse($projects as $project)
        <div class="bg-[#050505] border border-purple-900/20 rounded-xl overflow-hidden shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-all group">
            <!-- Project Image -->
            <div class="relative aspect-video bg-purple-600/20 overflow-hidden">
                @if($project->thumbnail_url)
                <img
                    src="{{ $project->thumbnail_url }}"
                    alt="{{ $project->title }}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                @else
                <div class="w-full h-full flex items-center justify-center">
                    <svg class="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
                @endif

                <!-- Status Badge -->
                <div class="absolute top-3 right-3">
                    @if($project->status === 'pending')
                    <span class="px-3 py-1 bg-yellow-600/90 backdrop-blur-sm text-yellow-100 rounded-full text-xs font-medium">
                        Menunggu
                    </span>
                    @elseif($project->status === 'accepted')
                    <span class="px-3 py-1 bg-green-600/90 backdrop-blur-sm text-green-100 rounded-full text-xs font-medium">
                        Diterima
                    </span>
                    @else
                    <span class="px-3 py-1 bg-red-600/90 backdrop-blur-sm text-red-100 rounded-full text-xs font-medium">
                        Ditolak
                    </span>
                    @endif
                </div>
            </div>

            <!-- Project Info -->
            <div class="p-5">
                <h3 class="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {{ $project->title }}
                </h3>

                <div class="space-y-2 mb-4">
                    <div class="flex items-center gap-2 text-sm text-gray-400">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span class="truncate">{{ $project->creator_name }}</span>
                    </div>

                    <div class="flex items-center gap-2 text-sm text-gray-400">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                        </svg>
                        <span>{{ $project->creator_nim }}</span>
                    </div>

                    <div class="flex items-center gap-2 text-sm text-gray-400">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>{{ $project->created_at->format('d M Y') }}</span>
                    </div>
                </div>

                @if($project->description)
                <p class="text-sm text-gray-400 mb-4 line-clamp-3">
                    {{ $project->description }}
                </p>
                @endif

                <!-- Actions -->
                <div class="flex gap-2 pt-4 border-t border-purple-900/20">
                    <a
                        href="{{ route('admin.projects.show', $project->id) }}"
                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 font-medium rounded-lg transition-all"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        Lihat Detail
                    </a>

                    <form method="POST" action="{{ route('admin.projects.destroy', $project->id) }}" class="inline" onsubmit="return confirm('Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.')">
                        @csrf
                        @method('DELETE')
                        <button
                            type="submit"
                            class="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-all"
                            title="Hapus Proyek"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </form>

                    @if($project->status === 'pending')
                    <div class="flex gap-2">
                        <form method="POST" action="{{ route('admin.projects.accept', $project->id) }}" class="inline">
                            @csrf
                            <button
                                type="submit"
                                class="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 rounded-lg transition-all"
                                title="Terima"
                                onclick="return confirm('Terima pengajuan proyek ini?')"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                            </button>
                        </form>

                        <form method="POST" action="{{ route('admin.projects.reject', $project->id) }}" class="inline">
                            @csrf
                            <button
                                type="submit"
                                class="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-all"
                                title="Tolak"
                                onclick="return confirm('Tolak pengajuan proyek ini?')"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                    @endif
                </div>
            </div>
        </div>
        @empty
        <div class="col-span-full">
            <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-12 text-center">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-400 mb-2">Tidak ada pengajuan proyek ditemukan</h3>
                <p class="text-gray-500">
                    @if(request('search') || request('status'))
                        Coba sesuaikan filter Anda
                    @else
                        Proyek yang diajukan mahasiswa akan muncul di sini
                    @endif
                </p>
            </div>
        </div>
        @endforelse
    </div>

    <!-- Pagination -->
    @if($projects->hasPages())
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6">
        {{ $projects->links() }}
    </div>
    @endif
</div>
@endsection

@push('scripts')
<script nonce="{{ $cspNonce }}">
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
