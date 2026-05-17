@php
    $newsActive = request()->routeIs('home', 'articles.show');
    $academicActive = request()->routeIs('categories.show');
    $editorialActive = request()->routeIs('editorial', 'about', 'contact');

    $navItems = [
        [
            'label' => 'Berita',
            'href' => route('home'),
            'active' => $newsActive,
        ],
        [
            'label' => 'Akademik',
            'href' => route('categories.show', 'akademik'),
            'active' => $academicActive,
        ],
        [
            'label' => 'Event',
            'href' => '#',
            'active' => false,
        ],
        [
            'label' => 'Opini',
            'href' => '#',
            'active' => false,
        ],
        [
            'label' => 'Redaksi',
            'href' => route('editorial'),
            'active' => $editorialActive,
        ],
    ];
@endphp

<nav class="border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-5 py-4">
        <a href="{{ route('home') }}" class="text-[22px] font-extrabold tracking-tight text-slate-950">
            IlkomNews
        </a>

        <div class="hidden items-center gap-8 md:flex">
            <ul class="flex items-center gap-7 text-[15px] font-medium text-slate-700">
                @foreach ($navItems as $item)
                    <li>
                        <a
                            href="{{ $item['href'] }}"
                            class="{{ $item['active'] ? 'border-[#F4C534] text-slate-950' : 'border-transparent text-slate-700 hover:border-slate-300 hover:text-slate-950' }} inline-flex border-b-2 pb-1.5 transition"
                        >
                            {{ $item['label'] }}
                        </a>
                    </li>
                @endforeach
            </ul>

            <div class="flex items-center gap-4">
                @if ($academicActive)
                    <button
                        type="button"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-800 transition hover:bg-slate-100"
                        aria-label="Cari berita"
                    >
                        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="7"></circle>
                            <path d="m20 20-3.5-3.5"></path>
                        </svg>
                    </button>
                @endif

                <a
                    href="{{ route('contact') }}#kontak-kami"
                    class="inline-flex items-center rounded-xl bg-[#0B2B63] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(11,43,99,0.18)] transition hover:-translate-y-0.5 hover:bg-[#08234F]"
                >
                    Hubungi Kami
                </a>
            </div>
        </div>

        <details class="relative md:hidden">
            <summary class="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 text-slate-800 [&::-webkit-details-marker]:hidden">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 7h16"></path>
                    <path d="M4 12h16"></path>
                    <path d="M4 17h16"></path>
                </svg>
            </summary>

            <div class="absolute right-0 top-14 z-20 w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_50px_rgba(15,23,42,0.14)]">
                <div class="space-y-3 text-sm font-medium text-slate-700">
                    @foreach ($navItems as $item)
                        <a
                            href="{{ $item['href'] }}"
                            class="{{ $item['active'] ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50' }} block rounded-xl px-3 py-2 transition"
                        >
                            {{ $item['label'] }}
                        </a>
                    @endforeach
                </div>

                <a
                    href="{{ route('contact') }}#kontak-kami"
                    class="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#0B2B63] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#08234F]"
                >
                    Hubungi Kami
                </a>
            </div>
        </details>
    </div>
</nav>
