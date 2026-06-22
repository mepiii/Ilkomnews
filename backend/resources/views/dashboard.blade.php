<x-app-layout>
    <x-slot name="title">Dashboard</x-slot>

    <div class="space-y-8">
        {{-- Header --}}
        <div>
            <h1 class="text-2xl font-bold text-zinc-900">Dashboard</h1>
            <p class="text-sm text-zinc-500">Selamat datang, {{ Auth::user()->name }}</p>
        </div>

        {{-- Stats --}}
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div class="rounded-xl border border-zinc-200 bg-white p-5">
                <p class="text-xs font-medium uppercase tracking-wider text-zinc-400">Total Berita</p>
                <p class="mt-1 text-3xl font-bold text-zinc-900">{{ $stats['total_news'] }}</p>
                <p class="mt-1 text-xs text-zinc-400">{{ $stats['published_news'] }} dipublikasikan</p>
            </div>
            <div class="rounded-xl border border-zinc-200 bg-white p-5">
                <p class="text-xs font-medium uppercase tracking-wider text-zinc-400">Total Views</p>
                <p class="mt-1 text-3xl font-bold text-zinc-900">{{ number_format($stats['total_views']) }}</p>
                <p class="mt-1 text-xs text-zinc-400">semua berita</p>
            </div>
            <div class="rounded-xl border border-zinc-200 bg-white p-5">
                <p class="text-xs font-medium uppercase tracking-wider text-zinc-400">Submissions</p>
                <p class="mt-1 text-3xl font-bold text-zinc-900">{{ $stats['total_submissions'] }}</p>
                <p class="mt-1 text-xs text-zinc-400">{{ $stats['pending_submissions'] }} menunggu review</p>
            </div>
            <div class="rounded-xl border border-zinc-200 bg-white p-5">
                <p class="text-xs font-medium uppercase tracking-wider text-zinc-400">Diterima</p>
                <p class="mt-1 text-3xl font-bold text-zinc-900">{{ $stats['accepted_submissions'] }}</p>
                <p class="mt-1 text-xs text-zinc-400">{{ $stats['rejected_submissions'] }} ditolak</p>
            </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
            {{-- Recent News --}}
            <div class="rounded-xl border border-zinc-200 bg-white">
                <div class="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                    <h2 class="font-semibold text-zinc-900">Berita Terbaru</h2>
                    <a href="{{ route('admin.berita') }}" class="text-xs font-medium text-zinc-500 hover:text-zinc-900">Lihat semua →</a>
                </div>
                <div class="divide-y divide-zinc-100">
                    @forelse ($recentNews as $item)
                        <div class="flex items-center gap-4 px-5 py-3 hover:bg-zinc-50 transition-colors">
                            <div class="h-10 w-10 shrink-0 rounded-lg bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-400">
                                {{ strtoupper(substr($item->category, 0, 2)) }}
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-medium text-zinc-900">{{ $item->title }}</p>
                                <p class="text-xs text-zinc-400">{{ $item->author ?? '—' }} · {{ $item->date->format('d M Y') }}</p>
                            </div>
                            <div class="text-right">
                                <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {{ $item->published ? 'bg-zinc-100 text-zinc-700' : 'bg-zinc-800 text-zinc-200' }}">
                                    {{ $item->published ? 'Publikasi' : 'Draft' }}
                                </span>
                                <p class="mt-0.5 text-xs text-zinc-400">{{ number_format($item->views) }} views</p>
                            </div>
                        </div>
                    @empty
                        <p class="px-5 py-8 text-center text-sm text-zinc-400">Belum ada berita</p>
                    @endforelse
                </div>
            </div>

            {{-- Recent Submissions --}}
            <div class="rounded-xl border border-zinc-200 bg-white">
                <div class="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                    <h2 class="font-semibold text-zinc-900">Submissions Terbaru</h2>
                    <a href="{{ route('admin.gallery') }}" class="text-xs font-medium text-zinc-500 hover:text-zinc-900">Lihat semua →</a>
                </div>
                <div class="divide-y divide-zinc-100">
                    @forelse ($recentSubmissions as $sub)
                        <div class="flex items-center gap-4 px-5 py-3 hover:bg-zinc-50 transition-colors">
                            <div class="h-10 w-10 shrink-0 rounded-lg bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-400 uppercase">
                                {{ strtoupper(substr($sub->category, 0, 3)) }}
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-medium text-zinc-900">{{ $sub->title }}</p>
                                <p class="text-xs text-zinc-400">{{ $sub->creator_name }} · {{ $sub->tracking_id }}</p>
                            </div>
                            <span class="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                                {{ match($sub->status) {
                                    'pending' => 'bg-amber-50 text-amber-700 border border-amber-200',
                                    'accepted' => 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                                    'rejected' => 'bg-red-50 text-red-700 border border-red-200',
                                    default => 'bg-zinc-100 text-zinc-600',
                                } }}">
                                {{ ucfirst($sub->status) }}
                            </span>
                        </div>
                    @empty
                        <p class="px-5 py-8 text-center text-sm text-zinc-400">Belum ada submissions</p>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
