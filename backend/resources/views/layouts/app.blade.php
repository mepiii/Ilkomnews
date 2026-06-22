<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? config('app.name', 'ILKOM') }} — Admin</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        body { font-family: 'Figtree', sans-serif; }
        [x-cloak] { display: none !important; }
    </style>
</head>
<body class="h-full bg-zinc-50 text-zinc-900 antialiased">
    <div class="flex h-full" x-data="{ sidebarOpen: false }">

        {{-- Mobile overlay --}}
        <div x-show="sidebarOpen" x-cloak
             x-transition:enter="transition-opacity ease-linear duration-300"
             x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100"
             x-transition:leave="transition-opacity ease-linear duration-300"
             x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
             class="fixed inset-0 z-40 bg-zinc-900/80 lg:hidden" @click="sidebarOpen = false">
        </div>

        {{-- Sidebar --}}
        @include('layouts.sidebar')

        {{-- Main content --}}
        <div class="flex flex-1 flex-col lg:pl-64">

            {{-- Top bar --}}
            <header class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-200 bg-white/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
                {{-- Mobile hamburger --}}
                <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-700">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                <div class="flex-1"></div>

                {{-- User dropdown --}}
                <div x-data="{ open: false }" class="relative">
                    <button @click="open = !open" @keydown.escape.window="open = false"
                            class="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
                        <span class="hidden sm:inline">{{ Auth::user()->name }}</span>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    <div x-show="open" x-cloak x-transition
                         class="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
                         @click="open = false">
                        <a href="{{ route('admin.profile.edit') }}" class="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50">Profile</a>
                        <a href="/" target="_blank" class="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50">Lihat Website</a>
                        <hr class="my-1 border-zinc-100">
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50">Keluar</button>
                        </form>
                    </div>
                </div>
            </header>

            {{-- Page content --}}
            <main class="flex-1 p-4 sm:p-6 lg:p-8">
                {{ $slot }}
            </main>
        </div>
    </div>
</body>
</html>
