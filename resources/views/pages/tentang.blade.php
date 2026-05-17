@extends('layouts.app')

@section('title', 'IlkomNews | Redaksi')

@section('content')
@php
    $leadTeam = [
        [
            'role' => 'Pimpinan Redaksi',
            'name' => 'Dicky Saputra',
            'quote' => '"Integritas adalah harga mati dalam setiap goresan pena kami."',
            'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
            'wide' => true,
        ],
        [
            'role' => 'Redaktur Pelaksana',
            'name' => 'Sarah Amanda',
            'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
        ],
        [
            'role' => 'Koordinator Liputan',
            'name' => 'Rizky Pratama',
            'image' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
        ],
    ];

    $supportTeam = [
        ['role' => 'Editor Berita', 'name' => 'Nabila Putri', 'image' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80'],
        ['role' => 'Fotografer', 'name' => 'Adi Wijaya', 'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'],
        ['role' => 'Layouter', 'name' => 'Maya Sari', 'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'],
        ['role' => 'Social Media', 'name' => 'Larasati', 'image' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'],
    ];
@endphp

<div class="mx-auto max-w-[1180px] px-5 py-8 md:py-10">
    <section class="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_480px]">
        <div class="pt-2">
            <span class="inline-flex rounded-full bg-[#F7C948] px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950">
                Tentang Kami
            </span>

            <h1 class="mt-5 max-w-3xl text-[42px] font-extrabold leading-tight tracking-tight text-[#0B224B] sm:text-[60px]">
                Suara Mahasiswa, Jendela Aspirasi Fasilkom Unsri.
            </h1>

            <p class="mt-6 max-w-3xl text-[21px] leading-9 text-slate-700">
                IlkomNews adalah platform media resmi di bawah naungan BEM Fasilkom Unsri yang
                berdedikasi menyajikan informasi terkini, edukatif, dan transparan bagi seluruh civitas akademika.
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
                <div class="rounded-[24px] bg-[#EAF1FD] p-5">
                    <h2 class="text-[20px] font-extrabold text-slate-950">
                        Visi
                    </h2>

                    <p class="mt-3 text-[17px] leading-8 text-slate-700">
                        Menjadi pusat informasi digital terdepan yang independen, kredibel, dan inspiratif
                        di lingkungan Fasilkom Unsri.
                    </p>
                </div>

                <div class="rounded-[24px] bg-[#EAF1FD] p-5">
                    <h2 class="text-[20px] font-extrabold text-slate-950">
                        Misi
                    </h2>

                    <ul class="mt-3 space-y-3 text-[17px] leading-8 text-slate-700">
                        <li>&bull; Menyebarkan informasi kegiatan BEM dan kampus.</li>
                        <li>&bull; Memberikan ruang opini bagi mahasiswa.</li>
                        <li>&bull; Membangun literasi digital di lingkungan fakultas.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="relative">
            <div class="overflow-hidden rounded-[28px] border border-slate-200 bg-white card-soft">
                <img
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
                    alt="Ruang redaksi IlkomNews"
                    class="h-full min-h-[420px] w-full object-cover"
                    loading="lazy"
                >
            </div>

            <div class="absolute -bottom-4 left-6 rounded-[20px] bg-[#F7C948] px-5 py-4 shadow-[0_20px_35px_rgba(247,201,72,0.28)]">
                <p class="text-[14px] font-semibold uppercase tracking-[0.2em] text-slate-950">
                    Est. 2024
                </p>
                <p class="mt-1 text-[24px] font-extrabold tracking-tight text-slate-950">
                    Voice of Students
                </p>
            </div>
        </div>
    </section>

    <div class="mt-14 border-t border-slate-200 pt-12 text-center">
        <h2 class="text-[40px] font-extrabold tracking-tight text-slate-950">
            Susunan Redaksi
        </h2>

        <p class="mx-auto mt-4 max-w-3xl text-[18px] leading-8 text-slate-600">
            Tim di balik layar yang berkomitmen menjaga kualitas jurnalisme dan integritas informasi di IlkomNews.
        </p>
    </div>

    <section class="mt-10 grid gap-6 lg:grid-cols-4">
        @foreach ($leadTeam as $member)
            <article class="{{ !empty($member['wide']) ? 'lg:col-span-2' : '' }} rounded-[24px] border border-slate-200 bg-white p-4 card-soft">
                @if (!empty($member['wide']))
                    <div class="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
                        <img
                            src="{{ $member['image'] }}"
                            alt="{{ $member['name'] }}"
                            class="h-[180px] w-full rounded-[20px] object-cover"
                            loading="lazy"
                        >

                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                {{ $member['role'] }}
                            </p>
                            <h3 class="mt-2 text-[34px] font-extrabold tracking-tight text-slate-950">
                                {{ $member['name'] }}
                            </h3>
                            <p class="mt-3 text-[18px] italic leading-8 text-slate-600">
                                {{ $member['quote'] }}
                            </p>
                        </div>
                    </div>
                @else
                    <div class="flex h-full flex-col items-center justify-center px-4 py-6 text-center">
                        <img
                            src="{{ $member['image'] }}"
                            alt="{{ $member['name'] }}"
                            class="h-24 w-24 rounded-full border-4 border-[#F7C948] object-cover"
                            loading="lazy"
                        >

                        <p class="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {{ $member['role'] }}
                        </p>

                        <h3 class="mt-2 text-[34px] font-extrabold tracking-tight text-slate-950">
                            {{ $member['name'] }}
                        </h3>
                    </div>
                @endif
            </article>
        @endforeach

        @foreach ($supportTeam as $member)
            <article class="rounded-[20px] border border-slate-200 bg-white p-4">
                <div class="flex items-center gap-4">
                    <img
                        src="{{ $member['image'] }}"
                        alt="{{ $member['name'] }}"
                        class="h-14 w-14 rounded-full object-cover"
                        loading="lazy"
                    >

                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {{ $member['role'] }}
                        </p>

                        <h3 class="mt-1 text-[24px] font-extrabold tracking-tight text-slate-950">
                            {{ $member['name'] }}
                        </h3>
                    </div>
                </div>
            </article>
        @endforeach
    </section>

    <section id="kontak-kami" class="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div class="rounded-[26px] bg-[#072551] p-8 text-white card-soft">
            <h2 class="text-[44px] font-extrabold tracking-tight text-[#F7C948]">
                Kontak Kami
            </h2>

            <p class="mt-5 max-w-xl text-[20px] leading-9 text-slate-200">
                Ingin mengirimkan tip berita atau menjalin kerjasama? Tim kami siap melayani Anda.
            </p>

            <div class="mt-8 space-y-6">
                <div class="flex gap-4">
                    <span class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#F7C948]">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </span>

                    <div>
                        <h3 class="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                            Sekretariat BEM Fasilkom Unsri
                        </h3>
                        <p class="mt-2 text-[18px] leading-8 text-slate-100">
                            Jl. Raya Palembang-Prabumulih KM. 32, Indralaya, Kabupaten Ogan Ilir, Sumatera Selatan.
                        </p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <span class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#F7C948]">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m22 7-10 5L2 7"></path>
                            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                        </svg>
                    </span>

                    <div>
                        <h3 class="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                            Email Redaksi
                        </h3>
                        <p class="mt-2 text-[18px] leading-8 text-slate-100">
                            redaksi@ilkomnews.unsri.ac.id
                        </p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <span class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#F7C948]">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.9.35 1.78.68 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.24a2 2 0 0 1 2.11-.45c.83.33 1.71.56 2.61.68A2 2 0 0 1 22 16.92Z"></path>
                        </svg>
                    </span>

                    <div>
                        <h3 class="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                            WhatsApp
                        </h3>
                        <p class="mt-2 text-[18px] leading-8 text-slate-100">
                            +62 812-3456-7890
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-10 border-t border-white/12 pt-7">
                <p class="text-[18px] font-medium text-slate-100">
                    Ikuti Kami:
                </p>

                <div class="mt-4 flex items-center gap-4 text-slate-100">
                    <span class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M2 12h20"></path>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"></path>
                        </svg>
                    </span>
                    <span class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="4"></circle>
                            <rect x="2" y="2" width="20" height="20" rx="5"></rect>
                            <path d="M17.5 6.5h.01"></path>
                        </svg>
                    </span>
                    <span class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                            <path d="m10 9 5 3-5 3V9Z"></path>
                        </svg>
                    </span>
                </div>
            </div>
        </div>

        <div class="rounded-[26px] border border-slate-200 bg-white p-8 card-soft">
            <h2 class="text-[40px] font-extrabold tracking-tight text-slate-950">
                Kirim Tip Berita
            </h2>

            <form class="mt-7 space-y-4">
                <div>
                    <label class="mb-2 block text-sm font-semibold text-slate-700">Nama Lengkap</label>
                    <input
                        type="text"
                        placeholder="Masukkan nama Anda"
                        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0B2B63]"
                    >
                </div>

                <div>
                    <label class="mb-2 block text-sm font-semibold text-slate-700">Email Mahasiswa</label>
                    <input
                        type="email"
                        placeholder="example@student.unsri.ac.id"
                        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0B2B63]"
                    >
                </div>

                <div>
                    <label class="mb-2 block text-sm font-semibold text-slate-700">Subjek</label>
                    <select class="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] text-slate-700 outline-none transition focus:border-[#0B2B63]">
                        <option>Tip Berita</option>
                        <option>Kerjasama Media</option>
                        <option>Pengaduan</option>
                    </select>
                </div>

                <div>
                    <label class="mb-2 block text-sm font-semibold text-slate-700">Pesan / Detail Berita</label>
                    <textarea
                        rows="6"
                        placeholder="Tuliskan pesan atau tip berita Anda di sini..."
                        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0B2B63]"
                    ></textarea>
                </div>

                <button
                    type="button"
                    class="inline-flex w-full items-center justify-center rounded-2xl bg-[#F7C948] px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-[#FFD767]"
                >
                    Kirim Sekarang
                </button>
            </form>
        </div>
    </section>
</div>
@endsection
