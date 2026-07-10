<x-app-layout>
    <x-slot name="title">{{ $submission->title }}</x-slot>

    <div class="max-w-4xl space-y-6">
        <a href="{{ route('admin.projects.index') }}" class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Gallery
        </a>

        <div class="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            {{-- Header --}}
            <div class="border-b border-zinc-100 px-6 py-5">
                <div class="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 class="text-xl font-bold text-zinc-900">{{ $submission->title }}</h1>
                        <p class="mt-1 text-sm text-zinc-500">oleh {{ $submission->creator_name }} ({{ $submission->creator_type === 'dosen' ? $submission->creator_nidn : $submission->creator_nim }})</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold
                            {{ match($submission->status) {
                                'pending' => 'bg-amber-50 text-amber-700 border border-amber-200',
                                'accepted' => 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                                'rejected' => 'bg-red-50 text-red-700 border border-red-200',
                                default => 'bg-zinc-100 text-zinc-600',
                            } }}">
                            {{ ucfirst($submission->status) }}
                        </span>
                        @if($submission->status === 'pending')
                            <button onclick="acceptSubmission()" class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Terima</button>
                            <button onclick="openRejectModal()" class="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Tolak</button>
                        @endif
                        <form method="POST" action="{{ route('admin.projects.destroy', $submission->id) }}" class="inline" onsubmit="return confirm('Hapus proyek ini secara permanen?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Hapus</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="grid gap-6 p-6 lg:grid-cols-3">
                {{-- Main info --}}
                <div class="lg:col-span-2 space-y-5">
                    <div>
                        <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Deskripsi</h3>
                        <p class="text-sm text-zinc-700 whitespace-pre-wrap">{{ $submission->description }}</p>
                    </div>

                    @if($submission->tech_stack)
                    <div>
                        <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Teknologi</h3>
                        <div class="flex flex-wrap gap-1.5">
                            @foreach($submission->tech_stack as $tech)
                                <span class="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">{{ $tech }}</span>
                            @endforeach
                        </div>
                    </div>
                    @endif

                    @if($submission->screenshots)
                    <div>
                        <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Tangkapan Layar</h3>
                        <div class="grid grid-cols-2 gap-2">
                            @foreach($submission->screenshots as $ss)
                                <img src="{{ $ss }}" alt="" class="rounded-lg border border-zinc-100 object-cover w-full h-32">
                            @endforeach
                        </div>
                    </div>
                    @endif
                </div>

                {{-- Sidebar --}}
                <div class="space-y-4">
                    <div class="rounded-lg border border-zinc-200 p-4 space-y-3">
                        <div>
                            <p class="text-xs text-zinc-400">Kategori</p>
                            <p class="text-sm font-medium text-zinc-900 uppercase">{{ $submission->category }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-zinc-400">{{ $submission->creator_type === 'dosen' ? 'NIDN/NIDK' : 'NIM' }}</p>
                            <p class="text-sm text-zinc-700">{{ $submission->creator_type === 'dosen' ? $submission->creator_nidn : $submission->creator_nim }}</p>
                        </div>
                        @if($submission->creator_jabatan)
                        <div>
                            <p class="text-xs text-zinc-400">Jabatan</p>
                            <p class="text-sm text-zinc-700">{{ $submission->creator_jabatan }}</p>
                        </div>
                        @endif
                        <div>
                            <p class="text-xs text-zinc-400">Jurusan</p>
                            <p class="text-sm text-zinc-700">{{ $submission->creator_major }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-zinc-400">Angkatan</p>
                            <p class="text-sm text-zinc-700">{{ $submission->creator_year }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-zinc-400">Tracking ID</p>
                            <p class="text-sm font-mono text-zinc-700">{{ $submission->tracking_id }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-zinc-400">Diajukan</p>
                            <p class="text-sm text-zinc-700">{{ $submission->created_at->format('d M Y, H:i') }}</p>
                        </div>
                    </div>

                    <div class="rounded-lg border border-zinc-200 p-4 space-y-3">
                        <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-400">Tautan</h4>
                        @if($submission->live_demo)
                            <a href="{{ $submission->live_demo }}" target="_blank" class="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900">
                                <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                Demo Langsung
                            </a>
                        @endif
                        @if($submission->github_link)
                            <a href="{{ $submission->github_link }}" target="_blank" class="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900">
                                <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                                GitHub
                            </a>
                        @endif
                        @if($submission->download_link)
                            <a href="{{ $submission->download_link }}" target="_blank" class="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900">
                                <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                Unduh
                            </a>
                        @endif
                        @if($submission->figma_link)
                            <a href="{{ $submission->figma_link }}" target="_blank" class="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900">
                                <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
                                Figma
                            </a>
                        @endif
                    </div>

                    @if($submission->collaborators)
                    <div class="rounded-lg border border-zinc-200 p-4">
                        <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Kolaborator</h4>
                        <ul class="space-y-1">
                            @foreach($submission->collaborators as $collab)
                                <li class="text-sm text-zinc-700">{{ $collab }}</li>
                            @endforeach
                        </ul>
                    </div>
                    @endif

                    @if($submission->status === 'rejected' && $submission->rejection_reason)
                    <div class="rounded-lg border border-red-200 bg-red-50 p-4">
                        <h4 class="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">Alasan Penolakan</h4>
                        <p class="text-sm text-red-700">{{ $submission->rejection_reason }}</p>
                    </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    {{-- Reject Modal --}}
    <div id="reject-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-zinc-900/60" onclick="closeRejectModal()"></div>
        <div class="relative w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl mx-4">
            <h3 class="text-lg font-semibold text-zinc-900">Tolak Submission</h3>
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
        const submissionId = {{ $submission->id }};

        async function acceptSubmission() {
            if (!confirm('Terima submission ini?')) return;
            await fetch(`/api/admin/submissions/${submissionId}/accept`, {
                method: 'POST', credentials: 'same-origin',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf }
            });
            window.location.reload();
        }

        function openRejectModal() {
            document.getElementById('reject-reason').value = '';
            document.getElementById('reject-modal').classList.remove('hidden');
        }

        function closeRejectModal() {
            document.getElementById('reject-modal').classList.add('hidden');
        }

        async function confirmReject() {
            const reason = document.getElementById('reject-reason').value.trim();
            if (!reason) { alert('Alasan penolakan wajib diisi'); return; }
            await fetch(`/api/admin/submissions/${submissionId}/reject`, {
                method: 'POST', credentials: 'same-origin',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
                body: JSON.stringify({ rejection_reason: reason })
            });
            window.location.reload();
        }
    </script>
</x-app-layout>
