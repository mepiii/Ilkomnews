<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - Page Not Found</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="h-full bg-black text-gray-100 antialiased flex items-center justify-center p-6">
    <div class="max-w-2xl w-full">
        <!-- 404 Card -->
        <div class="relative overflow-hidden rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 p-12 text-center">
            <!-- Background Glow -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

            <!-- Content -->
            <div class="relative">
                <!-- 404 Text -->
                <div class="mb-8">
                    <h1 class="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 mb-4">
                        404
                    </h1>
                    <div class="h-1 w-32 bg-gradient-to-r from-transparent via-purple-600 to-transparent mx-auto rounded-full"></div>
                </div>

                <!-- Error Icon -->
                <div class="mb-6">
                    <svg class="w-24 h-24 mx-auto text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>

                <!-- Error Message -->
                <h2 class="text-3xl font-bold text-white mb-3">
                    Page Not Found
                </h2>
                <p class="text-lg text-gray-400 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="{{ route('admin.dashboard') }}" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                        </svg>
                        Back to Dashboard
                    </a>

                    <button onclick="history.back()" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        Go Back
                    </button>
                </div>

                <!-- Help Text -->
                <p class="mt-8 text-sm text-gray-500">
                    Need help? Contact your administrator.
                </p>
            </div>
        </div>

        <!-- Footer Links -->
        <div class="mt-8 text-center">
            <div class="flex items-center justify-center gap-6 text-sm text-gray-500">
                <a href="{{ route('admin.dashboard') }}" class="hover:text-purple-400 transition-colors">Dashboard</a>
                <span>•</span>
                <a href="{{ route('admin.news.index') }}" class="hover:text-purple-400 transition-colors">News</a>
                <span>•</span>
                <a href="{{ route('admin.projects.index') }}" class="hover:text-purple-400 transition-colors">Projects</a>
            </div>
        </div>
    </div>
</body>
</html>
