<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'IlkomNews')</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
</head>

<body class="bg-[#F5F7FB] font-[Inter] text-slate-900 antialiased">
    @include('partials.navbar')

    <main class="min-h-screen">
        @yield('content')
    </main>

    @include('partials.footer')
</body>
</html>
