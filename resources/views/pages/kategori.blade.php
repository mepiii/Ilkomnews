@extends('layouts.app')

@section('title', 'IlkomNews | Kategori Akademik')

@section('content')
@php
    $featuredArticle = [
        'category' => 'Pengumuman',
        'title' => 'Pedoman Akademik Semester Ganjil 2024/2025 Telah Dirilis',
        'excerpt' => 'Pihak Dekanat Fasilkom Unsri resmi merilis panduan terbaru untuk pengisian KRS dan jadwal perkuliahan tatap muka secara penuh.',
        'date' => '24 Mei 2024',
        'readTime' => '5 Menit Baca',
        'image' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    ];

    $articles = [
        [
            'badge' => 'Beasiswa',
            'title' => 'Pendaftaran Beasiswa Unggulan Dibuka Hingga Akhir Juni',
            'excerpt' => 'Kesempatan emas bagi mahasiswa berprestasi untuk mendapatkan pendanaan penuh biaya kuliah dan pembinaan intensif.',
            'meta' => 'Redaksi Ilkom',
            'date' => '22 Mei 2024',
            'image' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
        ],
        [
            'badge' => 'Riset',
            'title' => 'Tim Robotik Fasilkom Raih Pendanaan Riset Nasional',
            'excerpt' => 'Inovasi robot pemantau lahan gambut karya mahasiswa Teknik Komputer berhasil menarik perhatian tim penilai nasional.',
            'meta' => 'Admin BEM',
            'date' => '20 Mei 2024',
            'image' => 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
        ],
        [
            'badge' => 'Tips',
            'title' => 'Tips Efektif Menghadapi Ujian Akhir Semester',
            'excerpt' => 'Bagaimana membagi waktu belajar dan menjaga kesehatan mental selama pekan ujian yang padat.',
            'meta' => 'Opini Mahasiswa',
            'date' => '18 Mei 2024',
            'image' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
        ],
        [
            'badge' => 'Fasilitas',
            'title' => 'Upgrade Laboratorium Multimedia Rampung Pekan Ini',
            'excerpt' => 'Fasilitas baru dengan workstation spesifikasi tinggi kini siap digunakan untuk menunjang praktikum dan produksi digital.',
            'meta' => 'Berita Kampus',
            'date' => '15 Mei 2024',
            'image' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
        ],
    ];

    $popular = [
        'Cara Cepat Klaim Sertifikat TOEFL Gratis',
        'Jadwal Sidang Skripsi Periode Juni 2024',
        'Panduan Magang MSIB Angkatan 7',
    ];

    $topics = ['#KRS', '#Beasiswa', '#Skripsi', '#Riset', '#Unsri'];
@endphp

<div class="mx-auto max-w-[1180px] px-5 py-8 md:py-10">
    <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <a href="{{ route('home') }}" class="transition hover:text-slate-800">Home</a>
        <span>&rsaquo;</span>
        <span>Kategori</span>
        <span>&rsaquo;</span>
        <span class="font-semibold text-slate-900">Akademik</span>
    </div>

    <section class="mt-8">
        <div class="flex gap-4">
            <span class="mt-2 hidden h-28 w-1 rounded-full bg-[#F7C948] sm:block"></span>

            <div>
                <h1 class="text-[44px] font-extrabold tracking-tight text-[#0B224B] sm:text-[58px]">
                    Akademik
                </h1>

                <p class="mt-4 max-w-4xl text-[20px] leading-9 text-slate-700">
                    Pusat informasi terpercaya seputar perkuliahan, riset mahasiswa, beasiswa, dan
                    kebijakan akademik terbaru di lingkungan Fakultas Ilmu Komputer Universitas Sriwijaya.
                </p>
            </div>
        </div>
    </section>

    <section class="mt-10 grid gap-6 xl:grid-cols-[minmax(0,2fr)_330px]">
        <div class="space-y-6">
            <article class="overflow-hidden rounded-[26px] border border-slate-200 bg-white card-soft md:grid md:grid-cols-[1fr_1fr]">
                <img
                    src="{{ $featuredArticle['image'] }}"
                    alt="{{ $featuredArticle['title'] }}"
                    class="h-[300px] w-full object-cover md:h-full"
                    loading="lazy"
                >

                <div class="flex flex-col justify-center p-6 sm:p-8">
                    <span class="inline-flex w-fit rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-700">
                        {{ strtoupper($featuredArticle['category']) }}
                    </span>

                    <h2 class="mt-5 text-[28px] font-extrabold leading-tight tracking-tight text-slate-950 sm:text-[38px]">
                        {{ $featuredArticle['title'] }}
                    </h2>

                    <p class="mt-4 text-[18px] leading-8 text-slate-600">
                        {{ $featuredArticle['excerpt'] }}
                    </p>

                    <div class="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                        <span class="inline-flex items-center gap-2">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                                <path d="M16 2v4"></path>
                                <path d="M8 2v4"></path>
                                <path d="M3 10h18"></path>
                            </svg>
                            {{ $featuredArticle['date'] }}
                        </span>

                        <span class="inline-flex items-center gap-2">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2.05 12a10 10 0 0 1 19.9 0 10 10 0 0 1-19.9 0Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            {{ $featuredArticle['readTime'] }}
                        </span>
                    </div>
                </div>
            </article>

            <div class="grid gap-6 md:grid-cols-2">
                @foreach ($articles as $article)
                    <article class="overflow-hidden rounded-[24px] border border-slate-200 bg-white card-soft">
                        <div class="relative">
                            <img
                                src="{{ $article['image'] }}"
                                alt="{{ $article['title'] }}"
                                class="h-[215px] w-full object-cover"
                                loading="lazy"
                            >

                            <span class="absolute left-4 top-4 inline-flex rounded-full {{ $loop->first ? 'bg-[#F7C948] text-slate-950' : 'bg-white/90 text-slate-700' }} px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                                {{ $article['badge'] }}
                            </span>
                        </div>

                        <div class="p-5">
                            <h3 class="text-[24px] font-extrabold leading-tight tracking-tight text-slate-950">
                                {{ $article['title'] }}
                            </h3>

                            <p class="mt-3 text-[17px] leading-8 text-slate-600">
                                {{ $article['excerpt'] }}
                            </p>

                            <p class="mt-5 text-sm text-slate-500">
                                {{ $article['meta'] }} &middot; {{ $article['date'] }}
                            </p>
                        </div>
                    </article>
                @endforeach
            </div>

            <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-800">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                </button>

                <button class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B2B63] text-sm font-semibold text-white">1</button>
                <button class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700">2</button>
                <button class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700">3</button>
                <span class="px-2 text-slate-500">...</span>
                <button class="inline-flex h-11 min-w-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700">12</button>

                <button class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-800">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                </button>
            </div>
        </div>

        <aside class="space-y-6">
            <div class="rounded-[24px] border border-slate-200 bg-[#F2F6FD] p-6">
                <div class="mb-5 flex items-center gap-3">
                    <svg class="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m3 17 6-6 4 4 8-8"></path>
                        <path d="M14 7h7v7"></path>
                    </svg>
                    <h2 class="text-[22px] font-extrabold tracking-tight text-slate-950">
                        Populer di Akademik
                    </h2>
                </div>

                <div class="space-y-5">
                    @foreach ($popular as $item)
                        <div class="{{ $loop->last ? '' : 'border-b border-slate-200 pb-5' }}">
                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                0{{ $loop->iteration }}
                            </p>

                            <h3 class="mt-3 text-[17px] font-medium leading-8 text-slate-900">
                                {{ $item }}
                            </h3>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="rounded-[24px] bg-[#0B3974] p-7 text-center text-white card-soft">
                <span class="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#F7C948]">
                    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m3 11 18-5v12L3 13v-2Z"></path>
                        <path d="m11.6 16.8 1.4 4.2"></path>
                        <path d="M6 13v5"></path>
                    </svg>
                </span>

                <h3 class="mt-5 text-[28px] font-extrabold tracking-tight">
                    Punya Tip Berita?
                </h3>

                <p class="mt-4 text-[17px] leading-8 text-slate-200">
                    Bagikan info akademik menarik di sekitarmu kepada tim redaksi kami.
                </p>

                <a
                    href="{{ route('contact') }}#kontak-kami"
                    class="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#F7C948] px-5 py-4 text-base font-semibold text-slate-950 transition hover:bg-[#FFD767]"
                >
                    Kirim Tip Sekarang
                </a>
            </div>

            <div class="rounded-[24px] border border-slate-200 bg-white p-6">
                <h3 class="text-[22px] font-extrabold tracking-tight text-slate-950">
                    Topik Terkait
                </h3>

                <div class="mt-5 flex flex-wrap gap-3">
                    @foreach ($topics as $topic)
                        <span class="inline-flex rounded-xl bg-[#F2F6FD] px-3 py-2 text-sm font-medium text-[#506D92]">
                            {{ $topic }}
                        </span>
                    @endforeach
                </div>
            </div>
        </aside>
    </section>
</div>
@endsection
