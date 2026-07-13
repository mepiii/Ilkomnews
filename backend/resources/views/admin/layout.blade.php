<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin') - {{ config('app.name') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    @stack('styles')

    <style>
        /* Collapsed sidebar styles */
        #sidebar.sidebar-collapsed {
            width: 5rem !important; /* w-20 = 80px */
        }

        #sidebar.sidebar-collapsed .sidebar-text {
            display: none;
        }

        #sidebar.sidebar-collapsed .sidebar-logo-text {
            display: none;
        }

        #sidebar.sidebar-collapsed .sidebar-user-info {
            display: none;
        }

        #sidebar.sidebar-collapsed nav a {
            justify-content: center;
            padding-left: 0.75rem;
            padding-right: 0.75rem;
        }

        /* Main content smoothly adjusts when sidebar collapses */
        #sidebar + div {
            transition: padding-left 0.3s ease;
        }

        @media (min-width: 1024px) {
            #sidebar.sidebar-collapsed + div {
                padding-left: 5rem !important;
            }
        }

        /* Light mode styles */
        html[data-theme="light"] {
            background: #ffffff;
        }

        html[data-theme="light"] body {
            background: #f9fafb;
            color: #111827;
        }

        html[data-theme="light"] #sidebar {
            background: #ffffff;
            border-right-color: rgba(229, 231, 235, 1);
        }

        html[data-theme="light"] header {
            background: rgba(255, 255, 255, 0.8) !important;
            border-bottom-color: rgba(229, 231, 235, 1) !important;
        }

        html[data-theme="light"] .text-white {
            color: #111827 !important;
        }

        html[data-theme="light"] .text-gray-100 {
            color: #1f2937 !important;
        }

        html[data-theme="light"] .text-gray-400 {
            color: #6b7280 !important;
        }

        html[data-theme="light"] .bg-black {
            background-color: #f9fafb !important;
        }

        html[data-theme="light"] .bg-\[#050505\] {
            background-color: #ffffff !important;
        }

        html[data-theme="light"] .border-purple-900\/20 {
            border-color: rgba(229, 231, 235, 1) !important;
        }

        html[data-theme="light"] .backdrop-blur-lg {
            background-color: rgba(255, 255, 255, 0.9) !important;
        }
    </style>
</head>
<body class="h-full bg-black text-gray-100 antialiased">
    <div class="flex h-full">
        <!-- Sidebar -->
        <aside id="sidebar" class="fixed inset-y-0 left-0 z-50 w-56 bg-[#050505] border-r border-purple-900/20 transform -translate-x-full transition-all duration-300 lg:translate-x-0">
            <div class="flex flex-col h-full">
                <!-- Logo -->
                <div class="flex items-center gap-3 px-6 py-6 border-b border-purple-900/20">
                    <img src="{{ asset('BEM.png') }}" alt="BEM FASILKOM" class="h-10 w-10 object-contain">
                    <div class="sidebar-logo-text">
                        <h1 class="text-lg font-bold text-white">BEM FASILKOM</h1>
                        <p class="text-xs text-gray-400">Panel Admin</p>
                    </div>
                </div>

                <!-- Navigation -->
                <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all {{ request()->routeIs('admin.dashboard') ? 'bg-purple-600/20 text-purple-400 shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-purple-600/10 hover:text-purple-300' }}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                        <span class="font-medium sidebar-text">Dashboard</span>
                    </a>

                    <a href="{{ route('admin.news.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all {{ request()->routeIs('admin.news.*') ? 'bg-purple-600/20 text-purple-400 shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-purple-600/10 hover:text-purple-300' }}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                        </svg>
                        <span class="font-medium sidebar-text">Berita</span>
                    </a>

                    <a href="{{ route('admin.projects.index') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all {{ request()->routeIs('admin.projects.*') ? 'bg-purple-600/20 text-purple-400 shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-purple-600/10 hover:text-purple-300' }}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span class="font-medium sidebar-text">Galeri Proyek</span>
                    </a>

                    <div class="pt-6 mt-6 border-t border-purple-900/20">
                        <p class="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sistem</p>

                        <a href="{{ route('admin.security') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all {{ request()->routeIs('admin.security') ? 'bg-purple-600/20 text-purple-400 shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-purple-600/10 hover:text-purple-300' }}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                            <span class="font-medium sidebar-text">Pusat Keamanan</span>
                        </a>

                        <a href="{{ route('admin.chat-stats') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all {{ request()->routeIs('admin.chat-stats') ? 'bg-purple-600/20 text-purple-400 shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-purple-600/10 hover:text-purple-300' }}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                            </svg>
                            <span class="font-medium sidebar-text">Statistik Chat</span>
                        </a>

                        <a href="{{ route('admin.audit-logs') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all {{ request()->routeIs('admin.audit-logs') ? 'bg-purple-600/20 text-purple-400 shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-purple-600/10 hover:text-purple-300' }}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <span class="font-medium sidebar-text">Log Audit</span>
                        </a>

                        <a href="{{ route('admin.settings') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all {{ request()->routeIs('admin.settings*') ? 'bg-purple-600/20 text-purple-400 shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-purple-600/10 hover:text-purple-300' }}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <span class="font-medium sidebar-text">Settings</span>
                        </a>

                        <a href="{{ route('admin.profile.edit') }}" class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all {{ request()->routeIs('admin.profile.edit') ? 'bg-purple-600/20 text-purple-400 shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-purple-600/10 hover:text-purple-300' }}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <span class="font-medium sidebar-text">Profile</span>
                        </a>
                    </div>
                </nav>

                <!-- User Info -->
                <div class="px-4 py-4 border-t border-purple-900/20">
                    <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-600/10">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                                {{ substr(Auth::user()->name, 0, 1) }}
                            </div>
                        </div>
                        <div class="flex-1 min-w-0 sidebar-user-info">
                            <p class="text-sm font-medium text-white truncate">{{ Auth::user()->name }}</p>
                            <p class="text-xs text-gray-400 truncate">{{ Auth::user()->email }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col min-w-0 lg:pl-56" id="main-content">
            <!-- Header -->
            <header class="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-purple-900/20">
                <div class="flex items-center justify-between px-6 py-4">
                    <div class="flex items-center gap-4">
                        <!-- Sidebar Toggle Button -->
                        <button id="sidebar-toggle" class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-600/10 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>

                        <!-- Page Title -->
                        <h2 class="text-xl font-bold text-white">@yield('header', 'Admin Panel')</h2>
                    </div>

                    <div class="flex items-center gap-4">
                        <!-- Theme Toggle Button -->
                        <button id="theme-toggle" class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-600/10 transition-colors">
                            <!-- Moon icon (shown in light mode) -->
                            <svg id="theme-icon-dark" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                            </svg>
                            <!-- Sun icon (shown in dark mode) -->
                            <svg id="theme-icon-light" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                        </button>

                        <!-- Logout Button -->
                        <form method="POST" action="{{ route('admin.logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-purple-600/10 transition-all">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                </svg>
                                <span>Logout</span>
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <!-- Flash Messages -->
            @if (session('success'))
            <div class="mx-6 mt-6 p-4 rounded-lg bg-green-600/20 border border-green-600/30 text-green-400">
                <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <p>{{ session('success') }}</p>
                </div>
            </div>
            @endif

            @if (session('error'))
            <div class="mx-6 mt-6 p-4 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400">
                <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <p>{{ session('error') }}</p>
                </div>
            </div>
            @endif

            @if ($errors->any())
            <div class="mx-6 mt-6 p-4 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400">
                <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                    </svg>
                    <div class="flex-1">
                        <p class="font-medium mb-2">Validation errors:</p>
                        <ul class="list-disc list-inside space-y-1 text-sm">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
            @endif

            <!-- Page Content -->
            <main class="flex-1 px-6 py-6 overflow-y-auto">
                @yield('content')
            </main>
        </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div id="sidebar-overlay" class="hidden fixed inset-0 z-40 bg-black/50 lg:hidden"></div>

    <!-- Sidebar Toggle Script -->
    <script nonce="{{ $cspNonce }}">
        document.addEventListener('DOMContentLoaded', function() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            const toggle = document.getElementById('sidebar-toggle');
            const mainContent = document.getElementById('main-content');

            function isDesktop() {
                return window.innerWidth >= 1024;
            }

            toggle?.addEventListener('click', function() {
                if (!isDesktop()) {
                    // Mobile: slide in/out
                    const isHidden = sidebar.classList.toggle('-translate-x-full');
                    overlay.classList.toggle('hidden', isHidden);
                } else {
                    // Desktop: toggle collapsed class (CSS handles padding adjustment)
                    const collapsed = sidebar.classList.toggle('sidebar-collapsed');
                    localStorage.setItem('sidebarCollapsed', collapsed ? '1' : '0');
                }
            });

            // Restore collapsed state on desktop load only
            if (isDesktop() && localStorage.getItem('sidebarCollapsed') === '1') {
                sidebar.classList.add('sidebar-collapsed');
            }

            overlay?.addEventListener('click', function() {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            });

            // On resize: clean up state between mobile/desktop
            window.addEventListener('resize', function() {
                if (isDesktop()) {
                    // Remove mobile translate, restore desktop state
                    sidebar.classList.remove('-translate-x-full');
                    overlay.classList.add('hidden');
                    if (localStorage.getItem('sidebarCollapsed') === '1') {
                        sidebar.classList.add('sidebar-collapsed');
                    } else {
                        sidebar.classList.remove('sidebar-collapsed');
                    }
                } else {
                    // Remove desktop collapsed on mobile
                    sidebar.classList.remove('sidebar-collapsed');
                    sidebar.classList.add('-translate-x-full');
                    overlay.classList.add('hidden');
                }
            });
        });
    </script>

    <!-- Theme Toggle Script -->
    <script nonce="{{ $cspNonce }}">
        document.addEventListener('DOMContentLoaded', function() {
            const themeToggle = document.getElementById('theme-toggle');
            const iconLight = document.getElementById('theme-icon-light');
            const iconDark = document.getElementById('theme-icon-dark');
            const html = document.documentElement;

            // Load and apply theme
            const currentTheme = localStorage.getItem('theme') || 'dark';
            html.setAttribute('data-theme', currentTheme);

            // Update icon visibility
            if (currentTheme === 'dark') {
                if (iconLight) iconLight.classList.remove('hidden');
                if (iconDark) iconDark.classList.add('hidden');
            } else {
                if (iconLight) iconLight.classList.add('hidden');
                if (iconDark) iconDark.classList.remove('hidden');
            }

            // Toggle theme on click
            themeToggle?.addEventListener('click', function() {
                const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);

                // Update icons
                if (newTheme === 'dark') {
                    if (iconLight) iconLight.classList.remove('hidden');
                    if (iconDark) iconDark.classList.add('hidden');
                } else {
                    if (iconLight) iconLight.classList.add('hidden');
                    if (iconDark) iconDark.classList.remove('hidden');
                }
            });
        });
    </script>

    @stack('scripts')
</body>
</html>
