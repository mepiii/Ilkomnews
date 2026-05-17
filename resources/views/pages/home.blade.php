@extends('layouts.app')

@section('title', 'IlkomNews | Beranda')

@section('content')
@php
    $headline = [
        'slug' => 'revitalisasi-lab-robotika-fasilkom-unsri-resmi-rampung',
        'title' => 'Revitalisasi Lab Robotika Fasilkom Unsri Resmi Rampung',
        'excerpt' => 'Upaya meningkatkan kualitas riset mahasiswa, BEM Fasilkom mendukung penuh peresmian fasilitas teknologi terbaru yang kini tersedia untuk seluruh mahasiswa.',
        'date' => '24 Mei 2024',
        'author' => 'Redaksi IlkomNews',
        'image' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80',
    ];

    $announcements = [
        [
            'label' => 'Penting',
            'title' => 'Jadwal UTS Semester Genap 2023/2024 Telah Rilis',
        ],
        [
            'label' => 'Akademik',
            'title' => 'Pendaftaran Yudisium Periode Juni Segera Ditutup',
        ],
        [
            'label' => 'Event',
            'title' => 'Open Recruitment Panitia Dinamika Fasilkom 2024',
        ],
    ];

    $popularNews = [
        [
            'title' => 'Mahasiswa Fasilkom Raih Medali Emas di Gemastik 2024',
            'readers' => '15.4k Pembaca',
            'image' => 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=400&q=80',
        ],
        [
            'title' => 'Tips Lulus MSIB Bagi Mahasiswa Semester Akhir',
            'readers' => '12.1k Pembaca',
            'image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
        ],
    ];

    $latestArticles = [
        [
            'slug' => 'ilkom-fest-2024-menjelajahi-batas-inovasi-digital',
            'category' => 'Event',
            'date' => '22 Mei 2024',
            'title' => 'Ilkom Fest 2024: Menjelajahi Batas Inovasi Digital',
            'excerpt' => 'Festival teknologi tahunan Fasilkom Unsri kembali hadir dengan rangkaian workshop AI dan kompetisi koding berskala nasional.',
            'author' => 'Tim Event BEM',
            'image' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
        ],
        [
            'slug' => 'perubahan-skema-konversi-sks-untuk-program-mbkm',
            'category' => 'Akademik',
            'date' => '20 Mei 2024',
            'title' => 'Perubahan Skema Konversi SKS untuk Program MBKM',
            'excerpt' => 'Wakil Dekan I mengumumkan kebijakan baru mengenai penyetaraan nilai mata kuliah untuk program magang dan studi independen.',
            'author' => 'Biro Akademik',
            'image' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
        ],
        [
            'slug' => 'pentingnya-etika-ai-di-kalangan-mahasiswa-it',
            'category' => 'Opini',
            'date' => '19 Mei 2024',
            'title' => 'Pentingnya Etika AI di Kalangan Mahasiswa IT',
            'excerpt' => 'Opini: Menelaah tanggung jawab moral pengembang perangkat lunak di era otomatisasi yang berkembang sangat pesat.',
            'author' => 'Ahmad Faisal',
            'image' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
            'accent' => true,
        ],
    ];

    $sections = [
        [
            'title' => 'Akademik',
            'items' => [
                ['title' => 'Pendaftaran Sidang Skripsi Gelombang III Dibuka', 'date' => '18 Mei 2024'],
                ['title' => 'Daftar Penerima Beasiswa PPA Tahun 2024', 'date' => '16 Mei 2024'],
                ['title' => 'Workshop Penulisan Karya Ilmiah Nasional', 'date' => '14 Mei 2024'],
            ],
        ],
        [
            'title' => 'Kemahasiswaan',
            'items' => [
                ['title' => 'Aksi Sosial BEM Fasilkom untuk Panti Asuhan', 'date' => '17 Mei 2024'],
                ['title' => 'Laporan Triwulan Kinerja Organisasi Mahasiswa', 'date' => '15 Mei 2024'],
                ['title' => 'Pendelegasian Mahasiswa ke Forum Nasional', 'date' => '12 Mei 2024'],
            ],
        ],
        [
            'title' => 'Event',
            'items' => [
                ['title' => 'Fasilkom Fun Run 2024: Sehat Bersama', 'date' => '21 Mei 2024'],
                ['title' => 'Seminar Karir: Strategi Masuk Big Tech Company', 'date' => '19 Mei 2024'],
                ['title' => 'Lomba Desain UI/UX Tingkat Universitas', 'date' => '10 Mei 2024'],
            ],
        ],
    ];
@endphp

<div class="mx-auto max-w-[1180px] px-5 py-7 md:py-10">
    <section class="grid gap-6 xl:grid-cols-[minmax(0,2fr)_320px]">
        <a
            href="{{ route('articles.show', $headline['slug']) }}"
            class="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-900 card-soft"
        >
            <img
                src="{{ $headline['image'] }}"
                alt="{{ $headline['title'] }}"
                class="h-[340px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[440px] lg:h-[520px]"
                loading="lazy"
            >

            <div class="absolute inset-0 bg-gradient-to-t from-[#0B224B]/95 via-[#0B224B]/25 to-transparent"></div>

            <div class="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                <span class="inline-flex rounded-full bg-[#F7C948] px-4 py-1 text-xs font-semibold text-slate-950 shadow-sm">
                    Utama
                </span>

                <h1 class="mt-4 max-w-4xl text-[34px] font-extrabold leading-tight tracking-tight sm:text-[44px] lg:text-[60px]">
                    {{ $headline['title'] }}
                </h1>

                <p class="mt-4 max-w-3xl text-base leading-8 text-slate-100 sm:text-[18px]">
                    {{ $headline['excerpt'] }}
                </p>

                <div class="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-200">
                    <span class="inline-flex items-center gap-2">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                            <path d="M16 2v4"></path>
                            <path d="M8 2v4"></path>
                            <path d="M3 10h18"></path>
                        </svg>
                        {{ $headline['date'] }}
                    </span>

                    <span class="inline-flex items-center gap-2">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21a8 8 0 0 0-16 0"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        {{ $headline['author'] }}
                    </span>
                </div>
            </div>
        </a>

        <div class="space-y-6">
            <div class="rounded-[28px] bg-[#0B3974] p-6 text-white card-soft">
                <div class="mb-5 flex items-center gap-3">
                    <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/12">
                        <svg class="h-5 w-5 text-[#F7C948]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m3 11 18-5v12L3 13v-2Z"></path>
                            <path d="m11.6 16.8 1.4 4.2"></path>
                            <path d="M6 13v5"></path>
                        </svg>
                    </span>

                    <h2 class="text-[20px] font-bold">
                        Pengumuman Penting
                    </h2>
                </div>

                <div class="space-y-5">
                    @foreach ($announcements as $announcement)
                        <div class="{{ $loop->last ? '' : 'border-b border-white/15 pb-5' }}">
                            <p class="text-xs font-semibold uppercase tracking-[0.15em] text-[#F7C948]">
                                {{ $announcement['label'] }}
                            </p>

                            <h3 class="mt-3 text-[18px] leading-8 text-white">
                                {{ $announcement['title'] }}
                            </h3>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="rounded-[28px] border border-slate-200 bg-white p-6 card-soft">
                <h2 class="text-[18px] font-extrabold text-slate-950 sm:text-[20px]">
                    Berita Populer
                </h2>

                <div class="mt-6 space-y-5">
                    @foreach ($popularNews as $item)
                        <div class="flex gap-4">
                            <img
                                src="{{ $item['image'] }}"
                                alt="{{ $item['title'] }}"
                                class="h-20 w-20 rounded-2xl object-cover"
                                loading="lazy"
                            >

                            <div class="min-w-0">
                                <h3 class="text-[17px] font-semibold leading-7 text-slate-900">
                                    {{ $item['title'] }}
                                </h3>

                                <p class="mt-1 text-sm text-slate-500">
                                    {{ $item['readers'] }}
                                </p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </section>

    <section class="mt-12">
        <div class="mb-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <h2 class="text-[34px] font-extrabold tracking-tight text-slate-950 sm:text-[42px]">
                Berita Terbaru
            </h2>

            <a href="{{ route('home') }}" class="inline-flex items-center gap-2 text-[17px] font-medium text-[#8A6A11] transition hover:text-[#6D5100]">
                Lihat Semua
                <span aria-hidden="true">&rarr;</span>
            </a>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
            @foreach ($latestArticles as $article)
                <article class="overflow-hidden rounded-[24px] border border-slate-200 bg-white card-soft">
                    <a href="{{ route('articles.show', $article['slug']) }}" class="group block">
                        <div class="relative overflow-hidden">
                            <img
                                src="{{ $article['image'] }}"
                                alt="{{ $article['title'] }}"
                                class="h-[245px] w-full object-cover transition duration-500 group-hover:scale-105"
                                loading="lazy"
                            >

                            @if (!empty($article['accent']))
                                <span class="absolute right-5 top-1/2 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#F7C948] text-slate-950 shadow-lg">
                                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 20h9"></path>
                                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"></path>
                                    </svg>
                                </span>
                            @endif
                        </div>
                    </a>

                    <div class="p-5">
                        <div class="flex items-center justify-between gap-3 text-sm">
                            <span class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                                {{ $article['category'] }}
                            </span>

                            <span class="text-slate-500">
                                {{ $article['date'] }}
                            </span>
                        </div>

                        <h3 class="mt-4 text-[24px] font-extrabold leading-tight tracking-tight text-slate-950">
                            <a href="{{ route('articles.show', $article['slug']) }}" class="transition hover:text-[#0B3974]">
                                {{ $article['title'] }}
                            </a>
                        </h3>

                        <p class="mt-4 text-[17px] leading-8 text-slate-600">
                            {{ $article['excerpt'] }}
                        </p>

                        <div class="mt-5 flex items-center gap-2 text-sm text-slate-500">
                            <svg class="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21a8 8 0 0 0-16 0"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            {{ $article['author'] }}
                        </div>
                    </div>
                </article>
            @endforeach
        </div>
    </section>

    <section class="mt-10 grid gap-6 lg:grid-cols-3">
        @foreach ($sections as $section)
            <div class="rounded-[24px] border border-slate-200 bg-[#F2F6FD] p-6">
                <div class="mb-6 flex items-center gap-3">
                    <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0B3974] shadow-sm">
                        @if ($loop->first)
                            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m22 10-10-5L2 10l10 5 10-5Z"></path>
                                <path d="M6 12v5c3 2 9 2 12 0v-5"></path>
                            </svg>
                        @elseif ($loop->index === 1)
                            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        @else
                            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                                <path d="M16 2v4"></path>
                                <path d="M8 2v4"></path>
                                <path d="M3 10h18"></path>
                            </svg>
                        @endif
                    </span>

                    <h3 class="text-[20px] font-extrabold text-slate-950">
                        {{ $section['title'] }}
                    </h3>
                </div>

                <div class="space-y-4">
                    @foreach ($section['items'] as $item)
                        <div class="{{ $loop->last ? '' : 'border-b border-slate-200 pb-4' }}">
                            <h4 class="text-[18px] font-medium leading-8 text-slate-900">
                                {{ $item['title'] }}
                            </h4>

                            <p class="mt-1 text-sm text-slate-500">
                                {{ $item['date'] }}
                            </p>
                        </div>
                    @endforeach
                </div>
            </div>
        @endforeach
    </section>
</div>
@endsection
