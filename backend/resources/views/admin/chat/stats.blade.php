@extends('admin.layout')

@section('title', 'Chat Statistics')
@section('header', 'Chat Statistics')

@section('content')
<div class="space-y-6">
    <!-- Filters -->
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
        <form method="GET" action="{{ route('admin.chat-stats') }}" class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
                <label class="block text-sm font-medium text-gray-400 mb-2">Time Range</label>
                <select name="days" class="w-full bg-black/50 border border-purple-900/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option value="7" {{ request('days', 30) == 7 ? 'selected' : '' }}>Last 7 days</option>
                    <option value="30" {{ request('days', 30) == 30 ? 'selected' : '' }}>Last 30 days</option>
                    <option value="90" {{ request('days') == 90 ? 'selected' : '' }}>Last 90 days</option>
                </select>
            </div>

            <div class="flex items-end">
                <button type="submit" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                    Apply Filter
                </button>
            </div>
        </form>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <!-- Total Queries -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-purple-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-medium text-gray-400">Total</p>
                    <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                    </svg>
                </div>
                <p class="text-2xl font-bold text-white">{{ $stats['total_queries'] ?? 0 }}</p>
            </div>
        </div>

        <!-- Successful -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-green-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-medium text-gray-400">Success</p>
                    <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <p class="text-2xl font-bold text-white">{{ $stats['successful'] ?? 0 }}</p>
            </div>
        </div>

        <!-- Rejected -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-red-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-medium text-gray-400">Rejected</p>
                    <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                    </svg>
                </div>
                <p class="text-2xl font-bold text-white">{{ $stats['rejected'] ?? 0 }}</p>
            </div>
        </div>

        <!-- No Context -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-yellow-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-medium text-gray-400">No Context</p>
                    <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
                <p class="text-2xl font-bold text-white">{{ $stats['no_context'] ?? 0 }}</p>
            </div>
        </div>

        <!-- Rate Limited -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-orange-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-medium text-gray-400">Rate Limited</p>
                    <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <p class="text-2xl font-bold text-white">{{ $stats['rate_limited'] ?? 0 }}</p>
            </div>
        </div>

        <!-- Today -->
        <div class="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 p-6">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-blue-600/20 blur-2xl"></div>
            <div class="relative">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-medium text-gray-400">Today</p>
                    <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
                <p class="text-2xl font-bold text-white">{{ $stats['today'] ?? 0 }}</p>
            </div>
        </div>
    </div>

    <!-- Daily Breakdown -->
    @if(isset($stats['daily_breakdown']) && count($stats['daily_breakdown']) > 0)
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">Daily Breakdown</h3>

        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-purple-900/30">
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                        <th class="text-center py-3 px-4 text-sm font-semibold text-gray-400">Total</th>
                        <th class="text-center py-3 px-4 text-sm font-semibold text-gray-400">Success</th>
                        <th class="text-center py-3 px-4 text-sm font-semibold text-gray-400">Rejected</th>
                        <th class="text-center py-3 px-4 text-sm font-semibold text-gray-400">Success Rate</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($stats['daily_breakdown'] as $day)
                    <tr class="border-b border-purple-900/20 hover:bg-purple-600/5 transition-colors">
                        <td class="py-3 px-4 text-white">{{ \Carbon\Carbon::parse($day->date)->format('M d, Y') }}</td>
                        <td class="py-3 px-4 text-center text-white font-semibold">{{ $day->total }}</td>
                        <td class="py-3 px-4 text-center">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/20 text-green-400">
                                {{ $day->success }}
                            </span>
                        </td>
                        <td class="py-3 px-4 text-center">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600/20 text-red-400">
                                {{ $day->rejected }}
                            </span>
                        </td>
                        <td class="py-3 px-4 text-center text-white">
                            {{ $day->total > 0 ? number_format(($day->success / $day->total) * 100, 1) : 0 }}%
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
    @endif

    <!-- Top IP Addresses -->
    @if(isset($stats['top_ips']) && count($stats['top_ips']) > 0)
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">Top IP Addresses</h3>

        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-purple-900/30">
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Rank</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">IP Address</th>
                        <th class="text-center py-3 px-4 text-sm font-semibold text-gray-400">Query Count</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Activity</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($stats['top_ips'] as $index => $ip)
                    <tr class="border-b border-purple-900/20 hover:bg-purple-600/5 transition-colors">
                        <td class="py-3 px-4">
                            @if($index === 0)
                                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-600/20 text-yellow-400 font-bold">1</span>
                            @elseif($index === 1)
                                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-600/20 text-gray-400 font-bold">2</span>
                            @elseif($index === 2)
                                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-600/20 text-orange-400 font-bold">3</span>
                            @else
                                <span class="inline-flex items-center justify-center w-8 h-8 text-gray-400">{{ $index + 1 }}</span>
                            @endif
                        </td>
                        <td class="py-3 px-4 text-white font-mono">{{ $ip->ip_address }}</td>
                        <td class="py-3 px-4 text-center">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-600/20 text-purple-300">
                                {{ $ip->count }}
                            </span>
                        </td>
                        <td class="py-3 px-4">
                            <div class="flex items-center gap-2">
                                <div class="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all"
                                         style="width: {{ min(($ip->count / ($stats['top_ips'][0]->count ?? 1)) * 100, 100) }}%">
                                    </div>
                                </div>
                                <span class="text-xs text-gray-400 w-12 text-right">
                                    {{ number_format(($ip->count / ($stats['total_queries'] ?? 1)) * 100, 1) }}%
                                </span>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
    @endif

    @if(!isset($stats['daily_breakdown']) || count($stats['daily_breakdown']) === 0)
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <p class="text-gray-400 text-lg">No chat activity found for the selected period</p>
    </div>
    @endif
</div>
@endsection
