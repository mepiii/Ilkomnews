@extends('admin.layout')

@section('title', isset($news) ? 'Edit Berita' : 'Buat Berita')

@section('header', isset($news) ? 'Edit Berita' : 'Buat Berita')

@section('content')
<div class="max-w-4xl">
    <!-- Form Card -->
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5">
        <form
            method="POST"
            action="{{ isset($news) ? route('admin.news.update', $news->id) : route('admin.news.store') }}"
            enctype="multipart/form-data"
            class="space-y-6"
        >
            @csrf
            @if(isset($news))
                @method('PUT')
            @endif

            <!-- Title -->
            <div>
                <label for="title" class="block text-sm font-medium text-gray-300 mb-2">
                    Judul <span class="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value="{{ old('title', $news->title ?? '') }}"
                    class="w-full px-4 py-3 bg-black border border-purple-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                    placeholder="Masukkan judul berita..."
                >
                @error('title')
                    <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                @enderror
            </div>

            <!-- Content -->
            <div>
                <label for="content" class="block text-sm font-medium text-gray-300 mb-2">
                    Konten <span class="text-red-400">*</span>
                </label>
                <textarea
                    name="content"
                    id="content"
                    required
                    rows="12"
                    class="w-full px-4 py-3 bg-black border border-purple-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-y"
                    placeholder="Tulis konten berita di sini..."
                >{{ old('content', $news->content ?? '') }}</textarea>
                <p class="mt-2 text-sm text-gray-400">Mendukung format HTML dan markdown</p>
                @error('content')
                    <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                @enderror
            </div>

            <!-- Category -->
            <div>
                <label for="category" class="block text-sm font-medium text-gray-300 mb-2">
                    Kategori <span class="text-red-400">*</span>
                </label>
                <select
                    name="category"
                    id="category"
                    required
                    class="w-full px-4 py-3 bg-black border border-purple-900/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                >
                    <option value="">Pilih Kategori</option>
                    <option value="Academic" {{ old('category', $news->category ?? '') === 'Academic' ? 'selected' : '' }}>Akademik</option>
                    <option value="Event" {{ old('category', $news->category ?? '') === 'Event' ? 'selected' : '' }}>Acara</option>
                    <option value="Achievement" {{ old('category', $news->category ?? '') === 'Achievement' ? 'selected' : '' }}>Prestasi</option>
                    <option value="Research" {{ old('category', $news->category ?? '') === 'Research' ? 'selected' : '' }}>Penelitian</option>
                    <option value="Campus Life" {{ old('category', $news->category ?? '') === 'Campus Life' ? 'selected' : '' }}>Kehidupan Kampus</option>
                    <option value="Technology" {{ old('category', $news->category ?? '') === 'Technology' ? 'selected' : '' }}>Teknologi</option>
                    <option value="Announcement" {{ old('category', $news->category ?? '') === 'Announcement' ? 'selected' : '' }}>Pengumuman</option>
                </select>
                @error('category')
                    <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                @enderror
            </div>

            <!-- Date -->
            <div>
                <label for="date" class="block text-sm font-medium text-gray-300 mb-2">
                    Tanggal Publikasi <span class="text-red-400">*</span>
                </label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    value="{{ old('date', isset($news) ? $news->date->format('Y-m-d') : now()->format('Y-m-d')) }}"
                    class="w-full px-4 py-3 bg-black border border-purple-900/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                >
                @error('date')
                    <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                @enderror
            </div>

            <!-- Image Upload -->
            <div>
                <label for="image" class="block text-sm font-medium text-gray-300 mb-2">
                    Gambar Unggulan
                </label>

                @if(isset($news) && $news->image)
                <div class="mb-4" id="current-image-container">
                    <p class="text-sm text-gray-400 mb-2">Gambar Saat Ini:</p>
                    <div class="relative inline-block">
                        <img
                            src="{{ Storage::url($news->image) }}"
                            alt="Current featured image"
                            class="w-48 h-48 object-cover rounded-lg border border-purple-900/30"
                            id="current-image"
                        >
                        <label class="absolute top-2 right-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="remove_image"
                                value="1"
                                class="sr-only peer"
                                onchange="toggleImageRemoval(this)"
                            >
                            <div class="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all peer-checked:bg-red-700">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </div>
                        </label>
                    </div>
                    <p class="mt-2 text-sm text-gray-400">Centang tombol X untuk menghapus gambar ini</p>
                    <p id="removal-notice" class="hidden mt-2 text-sm text-yellow-400">
                        ⚠️ Gambar ini akan dihapus saat Anda menyimpan
                    </p>
                </div>
                @endif

                <div class="relative">
                    <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        class="hidden"
                        onchange="previewImage(this)"
                    >
                    <label
                        for="image"
                        class="flex items-center justify-center gap-3 px-4 py-8 bg-black border-2 border-dashed border-purple-900/30 rounded-lg cursor-pointer hover:border-purple-600/50 transition-all"
                    >
                        <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                        <div class="text-center">
                            <p class="text-sm font-medium text-gray-300">Klik untuk unggah gambar baru</p>
                            <p class="text-xs text-gray-500 mt-1">PNG, JPG, WEBP maksimal 5MB</p>
                        </div>
                    </label>
                </div>

                <!-- Image Preview -->
                <div id="image-preview" class="hidden mt-4">
                    <p class="text-sm text-gray-400 mb-2">Pratinjau Gambar Baru:</p>
                    <div class="relative inline-block">
                        <img
                            id="preview-img"
                            src=""
                            alt="New image preview"
                            class="w-48 h-48 object-cover rounded-lg border border-purple-900/30"
                        >
                        <button
                            type="button"
                            id="clear-preview"
                            onclick="clearImagePreview()"
                            class="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                            title="Hapus pilihan gambar"
                        >
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                @error('image')
                    <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                @enderror
            </div>

            <!-- Published Status -->
            <div>
                <label class="flex items-start gap-3 cursor-pointer group">
                    <div class="relative">
                        <input
                            type="checkbox"
                            name="published"
                            id="published"
                            value="1"
                            {{ old('published', $news->published ?? false) ? 'checked' : '' }}
                            class="sr-only peer"
                        >
                        <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-600/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                            Publikasikan artikel ini
                        </p>
                        <p class="text-xs text-gray-400 mt-1">
                            Jika tidak dicentang, artikel akan disimpan sebagai draf
                        </p>
                    </div>
                </label>
                @error('published')
                    <p class="mt-2 text-sm text-red-400">{{ $message }}</p>
                @enderror
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-4 pt-6 border-t border-purple-900/20">
                <a
                    href="{{ route('admin.news.index') }}"
                    class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all"
                >
                    Batal
                </a>
                <button
                    type="submit"
                    class="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    {{ isset($news) ? 'Perbarui Berita' : 'Buat Berita' }}
                </button>
            </div>
        </form>
    </div>

    <!-- Help Card -->
    <div class="mt-6 bg-blue-600/10 border border-blue-600/20 rounded-xl p-6">
        <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div class="flex-1">
                <h3 class="text-sm font-semibold text-blue-400 mb-2">Tips Menulis</h3>
                <ul class="space-y-1 text-sm text-blue-400/80">
                    <li>• Gunakan judul yang jelas dan menarik perhatian</li>
                    <li>• Sertakan gambar yang relevan untuk meningkatkan daya tarik visual</li>
                    <li>• Bagi konten menjadi paragraf pendek agar mudah dibaca</li>
                    <li>• Simpan sebagai draf terlebih dahulu untuk ditinjau sebelum dipublikasi</li>
                    <li>• Artikel yang dipublikasi akan langsung terlihat oleh pengguna</li>
                </ul>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    // Image preview — URL.createObjectURL is instant, no FileReader needed
    function previewImage(input) {
        const preview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');

        if (input.files && input.files[0]) {
            // Revoke previous object URL to free memory
            if (previewImg.dataset.objectUrl) {
                URL.revokeObjectURL(previewImg.dataset.objectUrl);
            }
            const url = URL.createObjectURL(input.files[0]);
            previewImg.src = url;
            previewImg.dataset.objectUrl = url;
            preview.classList.remove('hidden');
        } else {
            preview.classList.add('hidden');
        }
    }

    // Clear the new image selection and hide preview
    function clearImagePreview() {
        const input = document.getElementById('image');
        const preview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');

        if (previewImg.dataset.objectUrl) {
            URL.revokeObjectURL(previewImg.dataset.objectUrl);
            delete previewImg.dataset.objectUrl;
        }
        input.value = '';
        previewImg.src = '';
        preview.classList.add('hidden');
    }

    // Toggle existing image removal
    function toggleImageRemoval(checkbox) {
        const currentImageContainer = document.getElementById('current-image-container');
        const removalNotice = document.getElementById('removal-notice');

        if (currentImageContainer && removalNotice) {
            if (checkbox.checked) {
                currentImageContainer.style.opacity = '0.5';
                removalNotice.classList.remove('hidden');
            } else {
                currentImageContainer.style.opacity = '1';
                removalNotice.classList.add('hidden');
            }
        }
    }

    // Warn before leaving with unsaved changes
    let formChanged = false;
    const form = document.querySelector('form');
    document.querySelectorAll('#title, #content').forEach(input => {
        input.addEventListener('change', () => { formChanged = true; });
    });
    window.addEventListener('beforeunload', function(e) {
        if (formChanged) { e.preventDefault(); e.returnValue = ''; }
    });
    form.addEventListener('submit', function() { formChanged = false; });
</script>
@endpush
@endsection
