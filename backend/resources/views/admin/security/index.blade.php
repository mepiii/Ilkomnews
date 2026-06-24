@extends('admin.layout')

@section('title', 'Pusat Keamanan')
@section('header', 'Pusat Keamanan')

@section('content')
<div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Attempts -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-purple-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-400">Total Percobaan</p>
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <p class="text-3xl font-bold text-white">{{ $stats['total_attempts'] ?? 0 }}</p>
            </div>
        </div>

        <!-- Failed Attempts -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-red-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-400">Percobaan Gagal</p>
                    <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </div>
                <p class="text-3xl font-bold text-white">{{ $stats['failed_attempts'] ?? 0 }}</p>
            </div>
        </div>

        <!-- Successful Attempts -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-400">Login Berhasil</p>
                    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <p class="text-3xl font-bold text-white">{{ $stats['successful_attempts'] ?? 0 }}</p>
            </div>
        </div>

        <!-- Lockouts -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-orange-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-400">Pemblokiran</p>
                    <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
                <p class="text-3xl font-bold text-white">{{ $stats['lockouts'] ?? 0 }}</p>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
        <form method="GET" action="{{ route('admin.security') }}" class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-400 mb-2">Rentang Waktu</label>
                <select name="days" class="w-full bg-black/50 border border-purple-900/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option value="7" {{ request('days', 7) == 7 ? 'selected' : '' }}>7 Hari Terakhir</option>
                    <option value="30" {{ request('days') == 30 ? 'selected' : '' }}>30 Hari Terakhir</option>
                    <option value="90" {{ request('days') == 90 ? 'selected' : '' }}>90 Hari Terakhir</option>
                </select>
            </div>

            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select name="success" class="w-full bg-black/50 border border-purple-900/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option value="">Semua</option>
                    <option value="1" {{ request('success') === '1' ? 'selected' : '' }}>Berhasil</option>
                    <option value="0" {{ request('success') === '0' ? 'selected' : '' }}>Gagal</option>
                </select>
            </div>

            <div class="flex items-end">
                <button type="submit" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                    Terapkan Filter
                </button>
            </div>
        </form>
    </div>

    <!-- Suspicious IPs -->
    @if(isset($stats['suspicious_ips']) && count($stats['suspicious_ips']) > 0)
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
        <div class="flex items-center gap-3 mb-4">
            <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h3 class="text-lg font-bold text-white">Alamat IP Mencurigakan</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-purple-900/30">
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Alamat IP</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Percobaan Gagal</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($stats['suspicious_ips'] as $ip)
                    <tr class="border-b border-purple-900/20 hover:bg-purple-600/5 transition-colors">
                        <td class="py-3 px-4 text-white font-mono">{{ $ip->ip_address }}</td>
                        <td class="py-3 px-4 text-white">{{ $ip->failed_count }}</td>
                        <td class="py-3 px-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600/20 text-red-400">
                                Risiko Tinggi
                            </span>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
    @endif

    <!-- Recent Login Attempts -->
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">Percobaan Login Terkini</h3>

        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-purple-900/30">
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Email</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Alamat IP</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Alasan</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Waktu</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($stats['recent'] ?? [] as $attempt)
                    <tr class="border-b border-purple-900/20 hover:bg-purple-600/5 transition-colors">
                        <td class="py-3 px-4 text-white">{{ $attempt->email }}</td>
                        <td class="py-3 px-4 text-gray-300 font-mono">{{ $attempt->ip_address }}</td>
                        <td class="py-3 px-4">
                            @if($attempt->success)
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/20 text-green-400">
                                    Berhasil
                                </span>
                            @else
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600/20 text-red-400">
                                    Gagal
                                </span>
                            @endif
                        </td>
                        <td class="py-3 px-4 text-gray-300">{{ $attempt->reason ?? '-' }}</td>
                        <td class="py-3 px-4 text-gray-400">{{ $attempt->created_at->diffForHumans() }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="py-8 text-center text-gray-400">
                            Tidak ada percobaan login ditemukan
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
