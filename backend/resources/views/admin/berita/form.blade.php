<x-app-layout>
    <x-slot name="title">{{ isset($news) ? 'Edit Berita' : 'Tulis Berita' }}</x-slot>

    <div class="max-w-3xl space-y-6">
        <div>
            <a href="{{ route('admin.berita') }}" class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Kembali ke Berita
            </a>
            <h1 class="mt-2 text-2xl font-bold text-zinc-900">{{ isset($news) ? 'Edit Berita' : 'Tulis Berita Baru' }}</h1>
        </div>

        <form id="news-form" class="rounded-xl border border-zinc-200 bg-white p-6 space-y-5">
            @csrf
            <input type="hidden" id="news-id" value="{{ $news->id ?? '' }}">

            <div>
                <label for="title" class="block text-sm font-medium text-zinc-700 mb-1.5">Judul</label>
                <input type="text" id="title" name="title" required
                       value="{{ old('title', $news->title ?? '') }}"
                       class="w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                       placeholder="Judul berita">
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
                <div>
                    <label for="category" class="block text-sm font-medium text-zinc-700 mb-1.5">Kategori</label>
                    <select id="category" name="category" required
                            class="w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-700 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400">
                        @foreach(['Workshop', 'Kompetisi', 'Pelatihan', 'Seminar', 'Umum'] as $cat)
                            <option value="{{ $cat }}" {{ ($news->category ?? '') === $cat ? 'selected' : '' }}>{{ $cat }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label for="date" class="block text-sm font-medium text-zinc-700 mb-1.5">Tanggal</label>
                    <input type="date" id="date" name="date" required
                           value="{{ old('date', isset($news) ? $news->date->format('Y-m-d') : date('Y-m-d')) }}"
                           class="w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400">
                </div>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
                <div>
                    <label for="author" class="block text-sm font-medium text-zinc-700 mb-1.5">Penulis</label>
                    <input type="text" id="author" name="author"
                           value="{{ old('author', $news->author ?? '') }}"
                           class="w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                           placeholder="Nama penulis">
                </div>
                <div>
                    <label for="image" class="block text-sm font-medium text-zinc-700 mb-1.5">URL Gambar</label>
                    <input type="url" id="image" name="image"
                           value="{{ old('image', $news->image ?? '') }}"
                           class="w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                           placeholder="https://...">
                </div>
            </div>

            <div>
                <label for="summary" class="block text-sm font-medium text-zinc-700 mb-1.5">Ringkasan</label>
                <input type="text" id="summary" name="summary"
                       value="{{ old('summary', $news->summary ?? '') }}"
                       class="w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                       placeholder="Ringkasan singkat (opsional)">
            </div>

            <div>
                <label for="content" class="block text-sm font-medium text-zinc-700 mb-1.5">Konten</label>
                <textarea id="content" name="content" rows="12" required
                          class="w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
                          placeholder="Tulis konten berita di sini...">{{ old('content', $news->content ?? '') }}</textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-zinc-700 mb-1.5">Tags (pisahkan koma)</label>
                <input type="text" id="tags" name="tags"
                       value="{{ implode(', ', $news->tags ?? []) }}"
                       class="w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                       placeholder="tech, workshop, unsri">
            </div>

            <div class="flex items-center gap-3 pt-2">
                <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="published" value="1"
                           {{ ($news->published ?? true) ? 'checked' : '' }}
                           class="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400">
                    <span class="text-sm text-zinc-700">Publikasikan</span>
                </label>
            </div>

            <div class="flex items-center gap-3 pt-4 border-t border-zinc-100">
                <button type="submit"
                        class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
                    {{ isset($news) ? 'Simpan Perubahan' : 'Publikasikan' }}
                </button>
                <a href="{{ route('admin.berita') }}" class="text-sm text-zinc-500 hover:text-zinc-900">Batal</a>
            </div>
        </form>
    </div>

    <script>
        const csrf = document.querySelector('meta[name="csrf-token"]').content;
        const form = document.getElementById('news-form');
        const newsId = document.getElementById('news-id').value;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const tagsRaw = document.getElementById('tags').value;
            const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

            const body = {
                title: document.getElementById('title').value,
                summary: document.getElementById('summary').value,
                content: document.getElementById('content').value,
                category: document.getElementById('category').value,
                date: document.getElementById('date').value,
                author: document.getElementById('author').value,
                image: document.getElementById('image').value,
                tags: tags,
                published: document.querySelector('input[name="published"]').checked,
            };

            const url = newsId ? `/api/admin/news/${newsId}` : '/api/admin/news';
            const method = newsId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                window.location.href = '/admin/berita';
            } else {
                const err = await res.json();
                alert(err.message || 'Terjadi kesalahan');
            }
        });
    </script>
</x-app-layout>
