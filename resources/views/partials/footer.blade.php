@php
    $isHome = request()->routeIs('home');
    $isDetail = request()->routeIs('articles.show');
    $isEditorial = request()->routeIs('editorial', 'about', 'contact');
@endphp

<footer class="mt-20 bg-[#072551] text-white">
    <div class="mx-auto max-w-[1180px] px-5 py-14">
        @if ($isHome)
            <div class="grid gap-10 lg:grid-cols-[1.15fr_0.9fr_1.15fr]">
                <div>
                    <h2 class="text-[42px] font-extrabold tracking-tight text-[#F7C948]">
                        IlkomNews
                    </h2>

                    <p class="mt-4 max-w-md text-[18px] leading-8 text-slate-200">
                        Portal berita resmi Mahasiswa Fakultas Ilmu Komputer Universitas Sriwijaya.
                        Menyajikan informasi terkini seputar akademik, event, dan suara mahasiswa.
                    </p>

                    <div class="mt-7 flex items-center gap-4 text-slate-100">
                        <span class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-4a3.5 3.5 0 0 0-1-2.5c3.5-.4 7-1.7 7-7.5A5.8 5.8 0 0 0 20 4.8 5.4 5.4 0 0 0 19.9 1S18.7.7 16 2.5a13.4 13.4 0 0 0-7 0C6.3.7 5.1 1 5.1 1A5.4 5.4 0 0 0 5 4.8 5.8 5.8 0 0 0 3 8c0 5.8 3.5 7.1 7 7.5A3.5 3.5 0 0 0 9 18v4"></path>
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
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <path d="m8.6 13.5 6.8 4"></path>
                                <path d="m15.4 6.5-6.8 4"></path>
                            </svg>
                        </span>
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Navigasi Cepat
                    </h3>

                    <div class="mt-5 space-y-3 text-[17px] text-slate-100">
                        <a href="{{ route('about') }}" class="block transition hover:text-[#F7C948]">Tentang Kami</a>
                        <a href="{{ route('editorial') }}" class="block transition hover:text-[#F7C948]">Pedoman Media</a>
                        <a href="{{ route('editorial') }}" class="block transition hover:text-[#F7C948]">Kode Etik</a>
                        <a href="{{ route('contact') }}#kontak-kami" class="block transition hover:text-[#F7C948]">Karir</a>
                        <a href="{{ route('contact') }}#kontak-kami" class="block transition hover:text-[#F7C948]">Kontak</a>
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Kontribusi
                    </h3>

                    <p class="mt-5 max-w-md text-[20px] leading-8 text-slate-100">
                        Punya berita atau opini untuk dibagikan? Jadilah bagian dari redaksi IlkomNews.
                    </p>

                    <a
                        href="{{ route('contact') }}#kontak-kami"
                        class="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#F7C948] px-6 py-4 text-lg font-semibold text-slate-950 shadow-[0_18px_35px_rgba(247,201,72,0.18)] transition hover:-translate-y-0.5 hover:bg-[#FFD767]"
                    >
                        Kirim Tip Berita
                    </a>
                </div>
            </div>
        @elseif ($isDetail)
            <div class="grid gap-10 md:grid-cols-[1.15fr_0.9fr_1fr]">
                <div>
                    <h2 class="text-[42px] font-extrabold tracking-tight text-[#F7C948]">
                        IlkomNews
                    </h2>

                    <p class="mt-4 max-w-md text-[18px] leading-8 text-slate-200">
                        Media informasi resmi mahasiswa Fakultas Ilmu Komputer Universitas Sriwijaya. Tajam, akurat, dan terpercaya.
                    </p>
                </div>

                <div>
                    <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Tautan Penting
                    </h3>

                    <div class="mt-5 space-y-3 text-[17px] text-slate-100">
                        <a href="{{ route('about') }}" class="block transition hover:text-[#F7C948]">Tentang Kami</a>
                        <a href="{{ route('editorial') }}" class="block transition hover:text-[#F7C948]">Pedoman Media</a>
                        <a href="{{ route('editorial') }}" class="block transition hover:text-[#F7C948]">Kode Etik</a>
                        <a href="{{ route('contact') }}#kontak-kami" class="block transition hover:text-[#F7C948]">Karir</a>
                        <a href="{{ route('contact') }}#kontak-kami" class="block transition hover:text-[#F7C948]">Kontak</a>
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Ikuti Kami
                    </h3>

                    <div class="mt-5 flex items-center gap-3 text-slate-100">
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
                                <path d="m22 7-10 5L2 7"></path>
                                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        @elseif ($isEditorial)
            <div class="grid gap-10 md:grid-cols-[1.15fr_0.9fr_1.2fr]">
                <div>
                    <h2 class="text-[42px] font-extrabold tracking-tight text-[#F7C948]">
                        IlkomNews
                    </h2>

                    <p class="mt-4 max-w-md text-[18px] leading-8 text-slate-200">
                        Media informasi resmi BEM Fasilkom Unsri. Aktual, tajam, dan mahasiswa.
                    </p>
                </div>

                <div>
                    <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Tautan Penting
                    </h3>

                    <div class="mt-5 space-y-3 text-[17px] text-slate-100">
                        <a href="{{ route('about') }}" class="block transition hover:text-[#F7C948]">Tentang Kami</a>
                        <a href="{{ route('editorial') }}" class="block transition hover:text-[#F7C948]">Pedoman Media</a>
                        <a href="{{ route('editorial') }}" class="block transition hover:text-[#F7C948]">Kode Etik</a>
                        <a href="{{ route('contact') }}#kontak-kami" class="block transition hover:text-[#F7C948]">Karir</a>
                        <a href="{{ route('contact') }}#kontak-kami" class="block transition hover:text-[#F7C948]">Kontak</a>
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Berlangganan Newsletter
                    </h3>

                    <div class="mt-5 flex overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        <input
                            type="email"
                            placeholder="Email Anda"
                            class="w-full bg-transparent px-4 py-4 text-base text-white placeholder:text-slate-300 focus:outline-none"
                        >
                        <button class="bg-[#F7C948] px-6 text-base font-semibold text-slate-950 transition hover:bg-[#FFD767]">
                            Gabung
                        </button>
                    </div>
                </div>
            </div>
        @else
            <div class="grid gap-10 md:grid-cols-[1.15fr_0.9fr_0.8fr_1.15fr]">
                <div>
                    <h2 class="text-[42px] font-extrabold tracking-tight text-[#F7C948]">
                        IlkomNews
                    </h2>

                    <p class="mt-4 max-w-md text-[18px] leading-8 text-slate-200">
                        Platform informasi dan aspirasi resmi mahasiswa Fakultas Ilmu Komputer Universitas Sriwijaya.
                    </p>

                    <div class="mt-7 flex items-center gap-4 text-slate-100">
                        <span class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <path d="m8.6 13.5 6.8 4"></path>
                                <path d="m15.4 6.5-6.8 4"></path>
                            </svg>
                        </span>
                        <span class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m22 7-10 5L2 7"></path>
                                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                            </svg>
                        </span>
                        <span class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 11a9 9 0 0 1 9-9"></path>
                                <path d="M20 13a9 9 0 0 1-9 9"></path>
                                <path d="M5 19 3 21"></path>
                                <path d="M19 5 21 3"></path>
                                <path d="M6.5 6.5 4 4"></path>
                                <path d="M17.5 17.5 20 20"></path>
                            </svg>
                        </span>
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Tautan
                    </h3>

                    <div class="mt-5 space-y-3 text-[17px] text-slate-100">
                        <a href="{{ route('about') }}" class="block transition hover:text-[#F7C948]">Tentang Kami</a>
                        <a href="{{ route('editorial') }}" class="block transition hover:text-[#F7C948]">Pedoman Media</a>
                        <a href="{{ route('editorial') }}" class="block transition hover:text-[#F7C948]">Kode Etik</a>
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Kontribusi
                    </h3>

                    <div class="mt-5 space-y-3 text-[17px] text-slate-100">
                        <a href="{{ route('contact') }}#kontak-kami" class="block transition hover:text-[#F7C948]">Karir</a>
                        <a href="{{ route('contact') }}#kontak-kami" class="block transition hover:text-[#F7C948]">Kontak</a>
                        <a href="{{ route('contact') }}#kontak-kami" class="block transition hover:text-[#F7C948]">Kirim Tip</a>
                    </div>
                </div>

                <div>
                    <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Berlangganan Newsletter
                    </h3>

                    <div class="mt-5 flex overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        <input
                            type="email"
                            placeholder="Email Anda"
                            class="w-full bg-transparent px-4 py-4 text-base text-white placeholder:text-slate-300 focus:outline-none"
                        >
                        <button class="bg-[#F7C948] px-6 text-base font-semibold text-slate-950 transition hover:bg-[#FFD767]">
                            Gabung
                        </button>
                    </div>
                </div>
            </div>
        @endif

        <div class="mt-12 border-t border-white/12 pt-6 text-sm text-slate-300">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <span>&copy; 2024 BEM Fasilkom Unsri. All Rights Reserved.</span>
                <span>IlkomNews</span>
            </div>
        </div>
    </div>
</footer>
