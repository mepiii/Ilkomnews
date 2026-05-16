@extends('layouts.app')

@section('content')

<section class="max-w-7xl mx-auto px-6 py-10">

    <div class="grid lg:grid-cols-3 gap-8">

        <!-- HERO NEWS -->
        <div class="lg:col-span-2 relative">

            <img
                src="/assets/images/hero-news.jpg"
                class="rounded-3xl h-[500px] w-full object-cover"
            >

            <div class="absolute bottom-0 p-10 text-white">

                <span class="bg-secondary text-black px-4 py-2 rounded-full text-sm font-semibold">
                    Berita Utama
                </span>

                <h1 class="text-5xl font-extrabold mt-4">
                    Ilkom Fasilkom Adakan Seminar Teknologi AI
                </h1>

                <p class="mt-4 text-lg text-gray-200">
                    Seminar membahas perkembangan AI
                    dan implementasi di dunia pendidikan.
                </p>

            </div>

        </div>

        <!-- SIDEBAR -->
        <div class="bg-primary rounded-3xl p-8 text-white">

            <h2 class="text-3xl font-bold mb-6">
                Berita Populer
            </h2>

            <div class="space-y-6">

                <div class="border-b pb-4">
                    <p class="text-secondary text-sm">
                        EVENT
                    </p>

                    <h3 class="font-semibold mt-2">
                        Lomba UI/UX Mahasiswa
                    </h3>
                </div>

                <div class="border-b pb-4">
                    <p class="text-secondary text-sm">
                        AKADEMIK
                    </p>

                    <h3 class="font-semibold mt-2">
                        Jadwal UTS Semester Genap
                    </h3>
                </div>

            </div>

        </div>

    </div>

</section>

@endsection