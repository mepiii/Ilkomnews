<x-app-layout>
    <x-slot name="title">Ilkom Gallery</x-slot>

    <div class="space-y-6">
        <div>
            <h1 class="text-2xl font-bold text-zinc-900">Ilkom Gallery</h1>
            <p class="text-sm text-zinc-500">Review dan kelola project submissions dari mahasiswa</p>
        </div>

        {{-- Stats bar --}}
        <div class="flex flex-wrap gap-3" id="stats-bar">
            <button onclick="filterStatus('all')" data-filter="all"
                    class="stat-btn rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-zinc-300 transition-colors">
                Semua <span class="ml-1 text-zinc-400" id="count-all">-</span>
            </button>
            <button onclick="filterStatus('pending')" data-filter="pending"
                    class="stat-btn rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 hover:border-amber-300 transition-colors">
                Pending <span class="ml-1 text-amber-400" id="count-pending">-</span>
            </button>
            <button onclick="filterStatus('accepted')" data-filter="accepted"
                    class="stat-btn rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 hover:border-emerald-300 transition-colors">
                Diterima <span class="ml-1 text-emerald-400" id="count-accepted">-</span>
            </button>
            <button onclick="filterStatus('rejected')" data-filter="rejected"
                    class="stat-btn rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:border-red-300 transition-colors">
                Ditolak <span class="ml-1 text-red-400" id="count-rejected">-</span>
            </button>
        </div>

        {{-- Filters --}}
        <div class="flex flex-wrap gap-3">
            <input type="text" id="search" placeholder="Cari judul, creator, atau tracking ID..."
                   class="w-full sm:w-72 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400">
            <select id="category-filter"
                    class="rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-700 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400">
                <option value="all">Semua Kategori</option>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="uiux">UI/UX</option>
                <option value="game">Game</option>
                <option value="ai">AI</option>
            </select>
        </div>

        {{-- Grid --}}
        <div id="gallery-grid" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div class="col-span-full py-12 text-center text-sm text-zinc-400">Memuat data...</div>
        </div>

        <div id="pagination" class="flex justify-center"></div>
    </div>

    {{-- Reject Modal --}}
    <div id="reject-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-zinc-900/60" onclick="closeRejectModal()"></div>
        <div class="relative w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl mx-4">
            <h3 class="text-lg font-semibold text-zinc-900">Tolak Submission</h3>
            <p class="mt-1 text-sm text-zinc-500">Tracking: <span id="reject-tracking" class="font-mono text-zinc-700"></span></p>
            <p class="text-sm text-zinc-500">Judul: <span id="reject-title" class="font-medium text-zinc-700"></span></p>
            <textarea id="reject-reason" rows="3" placeholder="Alasan penolakan..."
                      class="mt-4 w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"></textarea>
            <div class="mt-4 flex justify-end gap-2">
                <button onclick="closeRejectModal()" class="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50">Batal</button>
                <button onclick="confirmReject()" class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">Tolak</button>
            </div>
        </div>
    </div>

    <script>
        const csrf = document.querySelector('meta[name="csrf-token"]').content;
        let currentFilter = 'all';
        let currentRejectId = null;

        async function loadStats() {
            const res = await fetch('/api/admin/submissions/stats', {
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf }
            });
            const s = await res.json();
            document.getElementById('count-all').textContent = s.total;
            document.getElementById('count-pending').textContent = s.pending;
            document.getElementById('count-accepted').textContent = s.accepted;
            document.getElementById('count-rejected').textContent = s.rejected;
        }

        function filterStatus(status) {
            currentFilter = status;
            document.querySelectorAll('.stat-btn').forEach(b => {
                b.classList.toggle('ring-2', b.dataset.filter === status);
                b.classList.toggle('ring-zinc-900', b.dataset.filter === status);
            });
            loadGallery();
        }

        async function loadGallery(page = 1) {
            const search = document.getElementById('search').value;
            const category = document.getElementById('category-filter').value;
            const params = new URLSearchParams({ page, search, status: currentFilter, category });
            const res = await fetch(`/api/admin/submissions?${params}`, {
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf }
            });
            const data = await res.json();
            renderGrid(data.data);
            renderPagination(data);
        }

        function renderGrid(items) {
            const grid = document.getElementById('gallery-grid');
            if (!items.length) {
                grid.innerHTML = '<div class="col-span-full py-12 text-center text-sm text-zinc-400">Tidak ada data</div>';
                return;
            }
            grid.innerHTML = items.map(s => `
                <div class="rounded-xl border border-zinc-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
                    <div class="aspect-video bg-zinc-100 flex items-center justify-center text-zinc-300">
                        ${s.thumbnail
                            ? `<img src="${esc(s.thumbnail)}" alt="" class="h-full w-full object-cover">`
                            : `<svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" /></svg>`
                        }
                    </div>
                    <div class="p-4">
                        <div class="flex items-start justify-between gap-2">
                            <h3 class="text-sm font-semibold text-zinc-900 truncate">${esc(s.title)}</h3>
                            <span class="shrink-0 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(s.status)}">${esc(s.status)}</span>
                        </div>
                        <p class="mt-1 text-xs text-zinc-500">${esc(s.creator_name)} · ${esc(s.creator_nim)}</p>
                        <p class="mt-0.5 text-xs text-zinc-400">${esc(s.category.toUpperCase())} · ${esc(s.creator_major)} · ${esc(String(s.creator_year))}</p>
                        <p class="mt-1 text-xs font-mono text-zinc-400">${esc(s.tracking_id)}</p>
                        ${s.status === 'pending' ? `
                            <div class="mt-3 flex gap-2 border-t border-zinc-100 pt-3">
                                <button onclick="acceptSubmission(${s.id})"
                                        class="flex-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors">Terima</button>
                                <button onclick="openRejectModal(${s.id}, '${esc(s.tracking_id)}', '${esc(s.title).replace(/'/g,"\\'")}')"
                                        class="flex-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">Tolak</button>
                            </div>
                        ` : ''}
                        ${s.status === 'rejected' && s.rejection_reason ? `<p class="mt-2 text-xs text-red-500 border-t border-zinc-100 pt-2">Alasan: ${esc(s.rejection_reason)}</p>` : ''}
                    </div>
                </div>
            `).join('');
        }

        function statusClass(status) {
            return { pending: 'bg-amber-50 text-amber-700', accepted: 'bg-emerald-50 text-emerald-700', rejected: 'bg-red-50 text-red-700' }[status] || 'bg-zinc-100 text-zinc-600';
        }

        function renderPagination(data) {
            const el = document.getElementById('pagination');
            if (data.last_page <= 1) { el.innerHTML = ''; return; }
            let html = '<div class="flex gap-1">';
            for (let i = 1; i <= data.last_page; i++) {
                html += `<button onclick="loadGallery(${i})" class="h-8 min-w-[2rem] rounded-md text-sm font-medium ${i === data.current_page ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}">${i}</button>`;
            }
            el.innerHTML = html + '</div>';
        }

        async function acceptSubmission(id) {
            if (!confirm('Terima submission ini?')) return;
            await fetch(`/api/admin/submissions/${id}/accept`, {
                method: 'POST', credentials: 'same-origin',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf }
            });
            loadGallery();
            loadStats();
        }

        function openRejectModal(id, tracking, title) {
            currentRejectId = id;
            document.getElementById('reject-tracking').textContent = tracking;
            document.getElementById('reject-title').textContent = title;
            document.getElementById('reject-reason').value = '';
            document.getElementById('reject-modal').classList.remove('hidden');
        }

        function closeRejectModal() {
            document.getElementById('reject-modal').classList.add('hidden');
            currentRejectId = null;
        }

        async function confirmReject() {
            const reason = document.getElementById('reject-reason').value.trim();
            if (!reason) { alert('Alasan penolakan wajib diisi'); return; }
            await fetch(`/api/admin/submissions/${currentRejectId}/reject`, {
                method: 'POST', credentials: 'same-origin',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
                body: JSON.stringify({ rejection_reason: reason })
            });
            closeRejectModal();
            loadGallery();
            loadStats();
        }

        function esc(s) {
            const d = document.createElement('div');
            d.appendChild(document.createTextNode(s || ''));
            return d.innerHTML;
        }

        document.getElementById('search').addEventListener('input', () => loadGallery());
        document.getElementById('category-filter').addEventListener('change', () => loadGallery());

        filterStatus('all');
        loadStats();
    </script>
</x-app-layout>
