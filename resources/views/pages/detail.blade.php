@extends('layouts.app')

@section('title', 'IlkomNews | Detail Berita')

@section('content')
@php
    $article = [
        'title' => 'Inovasi Mahasiswa Fasilkom: Aplikasi Pendeteksi Kualitas Udara Berbasis IoT Raih Medali Emas',
        'category' => 'Akademik',
        'author' => 'Ahmad Rizky Pratama',
        'date' => '24 Mei 2024',
        'views' => '1.2k Kali Dibaca',
        'image' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
    ];

    $relatedArticles = [
        [
            'title' => 'Workshop Cybersecurity: Menjaga Keamanan Data di Era Digital',
            'time' => '10 Menit yang lalu',
            'image' => 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=400&q=80',
        ],
        [
            'title' => 'BEM Fasilkom Sukses Gelar Musyawarah Mahasiswa',
            'time' => '2 Jam yang lalu',
            'image' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=400&q=80',
        ],
    ];

    $popularArticles = [
        ['title' => 'Panduan Lengkap Skripsi Fasilkom Unsri 2024', 'readers' => '5.4k Pembaca'],
        ['title' => 'Jadwal UTS Semester Genap Telah Dirilis', 'readers' => '3.1k Pembaca'],
        ['title' => 'Beasiswa Unggulan Mahasiswa Berprestasi', 'readers' => '2.8k Pembaca'],
    ];
@endphp

<div class="mx-auto max-w-[1180px] px-5 py-8 md:py-10">
    <div class="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <a href="{{ route('home') }}" class="transition hover:text-slate-800">Home</a>
        <span>&rsaquo;</span>
        <a href="{{ route('home') }}" class="transition hover:text-slate-800">Berita</a>
        <span>&rsaquo;</span>
        <span class="font-semibold text-slate-900">Inovasi Mahasiswa Fasilkom: Aplikasi Pendeteksi Kualitas Udara Berbasis IoT</span>
    </div>

    <div class="grid gap-10 xl:grid-cols-[minmax(0,1.7fr)_320px]">
        <div>
            <span class="inline-flex rounded-full bg-[#EAF1FD] px-4 py-1 text-sm font-medium text-[#45648F]">
                {{ $article['category'] }}
            </span>

            <h1 class="mt-5 max-w-5xl text-[34px] font-extrabold leading-tight tracking-tight text-slate-950 sm:text-[46px]">
                {{ $article['title'] }}
            </h1>

            <div class="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-600">
                <span class="inline-flex items-center gap-2">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21a8 8 0 0 0-16 0"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {{ $article['author'] }}
                </span>

                <span class="inline-flex items-center gap-2">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                        <path d="M16 2v4"></path>
                        <path d="M8 2v4"></path>
                        <path d="M3 10h18"></path>
                    </svg>
                    {{ $article['date'] }}
                </span>

                <span class="inline-flex items-center gap-2">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M2.05 12a10 10 0 0 1 19.9 0 10 10 0 0 1-19.9 0Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    {{ $article['views'] }}
                </span>
            </div>

            <div class="mt-7 overflow-hidden rounded-[24px] border border-slate-200 bg-white card-soft">
                <img
                    src="{{ $article['image'] }}"
                    alt="{{ $article['title'] }}"
                    class="h-[280px] w-full object-cover sm:h-[420px] lg:h-[500px]"
                    loading="lazy"
                >
            </div>

            <p class="mt-3 text-center text-sm italic text-slate-500">
                Tim pengembang menunjukkan purwarupa alat IoT di Laboratorium Sistem Komputer Fasilkom Unsri.
            </p>

            <div class="mt-6 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-6">
                <span class="mr-2 text-[17px] font-medium text-slate-700">
                    Bagikan:
                </span>

                <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <path d="m8.6 13.5 6.8 4"></path>
                        <path d="m15.4 6.5-6.8 4"></path>
                    </svg>
                </button>

                <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 7h10v10"></path>
                        <path d="M7 17 17 7"></path>
                    </svg>
                </button>

                <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m22 7-10 5L2 7"></path>
                        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    </svg>
                </button>
            </div>

            <article class="article-copy mt-8">
                <p>
                    Mahasiswa Fakultas Ilmu Komputer (Fasilkom) Universitas Sriwijaya kembali menorehkan
                    prestasi membanggakan di tingkat nasional. Kali ini, sebuah tim yang terdiri dari tiga
                    mahasiswa jurusan Teknik Informatika berhasil mengembangkan aplikasi inovatif berbasis
                    Internet of Things (IoT) untuk memantau kualitas udara secara real-time.
                </p>

                <p>
                    Proyek yang diberi nama "AeroGuard" ini menggunakan sensor MQ-135 yang diintegrasikan
                    dengan modul ESP32 untuk mendeteksi kadar polutan seperti CO2, asap, dan gas berbahaya
                    lainnya. Keunggulan utama dari alat ini adalah kemampuannya untuk mengirimkan data
                    langsung ke cloud dan memberikan notifikasi peringatan dini kepada pengguna melalui
                    smartphone jika kualitas udara di sekitar mereka memburuk.
                </p>

                <blockquote>
                    "Kami terinspirasi dari masalah kabut asap tahunan di wilayah Sumatera Selatan.
                    Kami ingin memberikan solusi konkret yang dapat membantu masyarakat menjaga kesehatan
                    paru-paru mereka dengan informasi yang akurat," ujar Ahmad Rizky, ketua tim pengembang.
                </blockquote>

                <p>
                    Selain memenangkan Medali Emas dalam ajang Kompetisi Inovasi Digital Nasional, tim ini
                    juga mendapatkan apresiasi dari beberapa instansi pemerintah daerah. Rencananya,
                    AeroGuard akan dipasang di beberapa titik strategis kampus untuk memberikan data publik
                    yang dapat diakses oleh seluruh civitas akademika melalui portal resmi kampus.
                </p>

                <p>
                    Dekan Fasilkom Unsri menyambut baik pencapaian ini dan menyatakan dukungannya untuk
                    pengembangan lebih lanjut. Pihak fakultas berkomitmen untuk terus memfasilitasi riset-riset
                    mahasiswa yang berorientasi pada penyelesaian masalah nyata di masyarakat.
                </p>
            </article>

            <section class="mt-12 rounded-[24px] border border-slate-200 bg-[#F2F6FD] p-5 sm:p-7">
                <h2 class="text-[32px] font-extrabold tracking-tight text-slate-950">
                    Komentar (3)
                </h2>

                <div class="mt-6 flex gap-4 rounded-2xl bg-white/70 p-4">
                    <div class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B2B63] text-white">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21a8 8 0 0 0-16 0"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>

                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <h3 class="font-semibold text-slate-900">
                                Budi Santoso
                            </h3>
                            <span class="text-sm text-slate-500">
                                2 jam yang lalu
                            </span>
                        </div>

                        <p class="mt-2 text-[17px] leading-7 text-slate-700">
                            Luar biasa! Bangga sekali dengan mahasiswa Fasilkom. Semoga bisa diproduksi massal secepatnya.
                        </p>
                    </div>
                </div>

                <form class="mt-6 space-y-4">
                    <textarea
                        rows="4"
                        placeholder="Tulis komentar Anda..."
                        class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-[15px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0B2B63]"
                    ></textarea>

                    <button
                        type="button"
                        class="inline-flex items-center justify-center rounded-xl bg-[#0B2B63] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08234F]"
                    >
                        Kirim Komentar
                    </button>
                </form>
            </section>
        </div>

        <aside class="space-y-8">
            <div>
                <div class="mb-5 flex items-center gap-3">
                    <span class="h-10 w-1.5 rounded-full bg-[#F7C948]"></span>
                    <h2 class="text-[22px] font-extrabold tracking-tight text-slate-950">
                        Berita Terkait
                    </h2>
                </div>

                <div class="space-y-5">
                    @foreach ($relatedArticles as $item)
                        <article class="flex gap-4">
                            <img
                                src="{{ $item['image'] }}"
                                alt="{{ $item['title'] }}"
                                class="h-[76px] w-[92px] rounded-2xl object-cover"
                                loading="lazy"
                            >

                            <div class="min-w-0">
                                <h3 class="text-[17px] font-medium leading-7 text-slate-900">
                                    {{ $item['title'] }}
                                </h3>

                                <p class="mt-1 text-sm text-slate-500">
                                    {{ $item['time'] }}
                                </p>
                            </div>
                        </article>
                    @endforeach
                </div>
            </div>

            <div class="rounded-[24px] border border-slate-200 bg-[#F2F6FD] p-6">
                <div class="mb-6 flex items-center gap-3">
                    <svg class="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m3 17 6-6 4 4 8-8"></path>
                        <path d="M14 7h7v7"></path>
                    </svg>
                    <h3 class="text-[22px] font-extrabold tracking-tight text-slate-950">
                        Paling Populer
                    </h3>
                </div>

                <div class="space-y-6">
                    @foreach ($popularArticles as $item)
                        <div class="flex gap-4">
                            <span class="w-9 text-[30px] font-bold tracking-tight text-slate-300">
                                0{{ $loop->iteration }}
                            </span>

                            <div>
                                <h4 class="text-[17px] font-medium leading-7 text-slate-900">
                                    {{ $item['title'] }}
                                </h4>

                                <p class="mt-1 text-sm text-slate-500">
                                    {{ $item['readers'] }}
                                </p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="rounded-[24px] bg-[#072551] p-6 text-white card-soft">
                <h3 class="text-[22px] font-extrabold tracking-tight text-[#F7C948]">
                    Punya Tip Berita?
                </h3>

                <p class="mt-4 text-[17px] leading-8 text-slate-200">
                    Bagikan berita menarik di sekitar kampus kepada kami dan jadilah bagian dari perubahan.
                </p>

                <a
                    href="{{ route('contact') }}#kontak-kami"
                    class="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#F7C948] px-5 py-4 text-base font-semibold text-slate-950 transition hover:bg-[#FFD767]"
                >
                    Kirim Tip Berita
                </a>
            </div>
        </aside>
    </div>
</div>
@endsection
