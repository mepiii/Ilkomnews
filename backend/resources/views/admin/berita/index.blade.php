<x-app-layout>
    <x-slot name="title">Berita</x-slot>

    <div class="space-y-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-zinc-900">Berita</h1>
                <p class="text-sm text-zinc-500">Kelola berita dan artikel FASILKOM Unsri</p>
            </div>
            <a href="{{ route('admin.berita.create') }}"
               class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Tulis Berita
            </a>
        </div>

        {{-- Filters --}}
        <div class="flex flex-wrap gap-3">
            <input type="text" id="search" placeholder="Cari judul atau penulis..."
                   class="w-full sm:w-64 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400">
            <select id="status-filter"
                    class="rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-700 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400">
                <option value="all">Semua Status</option>
                <option value="published">Dipublikasikan</option>
                <option value="draft">Draft</option>
            </select>
        </div>

        {{-- Table --}}
        <div class="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <table class="min-w-full divide-y divide-zinc-100">
                <thead class="bg-zinc-50">
                    <tr>
                        <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Judul</th>
                        <th class="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 md:table-cell">Kategori</th>
                        <th class="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 lg:table-cell">Penulis</th>
                        <th class="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 lg:table-cell">Tanggal</th>
                        <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                        <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">Aksi</th>
                    </tr>
                </thead>
                <tbody id="news-body" class="divide-y divide-zinc-100">
                    <tr><td colspan="6" class="px-5 py-12 text-center text-sm text-zinc-400">Memuat data...</td></tr>
                </tbody>
            </table>
        </div>

        <div id="pagination" class="flex justify-center"></div>
    </div>

    <script>
        const csrf = document.querySelector('meta[name="csrf-token"]').content;
        let currentPage = 1;

        async function loadNews(page = 1) {
            const search = document.getElementById('search').value;
            const status = document.getElementById('status-filter').value;
            const params = new URLSearchParams({ page, search, status });
            const res = await fetch(`/api/admin/news?${params}`, {
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf }
            });
            const data = await res.json();
            renderTable(data.data);
            renderPagination(data);
        }

        function renderTable(items) {
            const body = document.getElementById('news-body');
            if (!items.length) {
                body.innerHTML = '<tr><td colspan="6" class="px-5 py-12 text-center text-sm text-zinc-400">Tidak ada berita ditemukan</td></tr>';
                return;
            }
            body.innerHTML = items.map(n => `
                <tr class="hover:bg-zinc-50 transition-colors">
                    <td class="px-5 py-3">
                        <p class="text-sm font-medium text-zinc-900 truncate max-w-xs">${esc(n.title)}</p>
                        <p class="text-xs text-zinc-400 md:hidden">${esc(n.category)}</p>
                    </td>
                    <td class="hidden px-5 py-3 md:table-cell">
                        <span class="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">${esc(n.category)}</span>
                    </td>
                    <td class="hidden px-5 py-3 text-sm text-zinc-500 lg:table-cell">${esc(n.author || '—')}</td>
                    <td class="hidden px-5 py-3 text-sm text-zinc-500 lg:table-cell">${new Date(n.date).toLocaleDateString('id-ID', {day:'numeric',month:'short',year:'numeric'})}</td>
                    <td class="px-5 py-3">
                        <span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${n.published ? 'bg-zinc-100 text-zinc-700' : 'bg-zinc-800 text-zinc-200'}">
                            ${n.published ? 'Publikasi' : 'Draft'}
                        </span>
                    </td>
                    <td class="px-5 py-3">
                        <div class="flex items-center gap-1">
                            <a href="/admin/berita/${n.id}/edit" class="rounded-md px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100">Edit</a>
                            <button onclick="deleteNews(${n.id}, '${esc(n.title).replace(/'/g, "\\'")}')" class="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Hapus</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        function renderPagination(data) {
            const el = document.getElementById('pagination');
            if (data.last_page <= 1) { el.innerHTML = ''; return; }
            let html = '<div class="flex gap-1">';
            for (let i = 1; i <= data.last_page; i++) {
                html += `<button onclick="loadNews(${i})" class="h-8 min-w-[2rem] rounded-md text-sm font-medium ${i === data.current_page ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}">${i}</button>`;
            }
            el.innerHTML = html + '</div>';
        }

        async function deleteNews(id, title) {
            if (!confirm(`Hapus berita "${title}"?`)) return;
            await fetch(`/api/admin/news/${id}`, {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf }
            });
            loadNews(currentPage);
        }

        function esc(s) {
            const d = document.createElement('div');
            d.appendChild(document.createTextNode(s || ''));
            return d.innerHTML;
        }

        document.getElementById('search').addEventListener('input', () => loadNews());
        document.getElementById('status-filter').addEventListener('change', () => loadNews());
        loadNews();
    </script>
</x-app-layout>
