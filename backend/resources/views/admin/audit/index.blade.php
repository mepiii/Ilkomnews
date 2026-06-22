@extends('admin.layout')

@section('title', 'Audit Logs')
@section('header', 'Audit Logs')

@section('content')
<div class="space-y-6">
    <!-- Filters -->
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
        <form method="GET" action="{{ route('admin.audit-logs') }}" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Action</label>
                <select name="action" class="w-full bg-black/50 border border-purple-900/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option value="">All Actions</option>
                    <option value="create" {{ request('action') === 'create' ? 'selected' : '' }}>Create</option>
                    <option value="update" {{ request('action') === 'update' ? 'selected' : '' }}>Update</option>
                    <option value="delete" {{ request('action') === 'delete' ? 'selected' : '' }}>Delete</option>
                    <option value="login" {{ request('action') === 'login' ? 'selected' : '' }}>Login</option>
                    <option value="logout" {{ request('action') === 'logout' ? 'selected' : '' }}>Logout</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Entity Type</label>
                <select name="entity_type" class="w-full bg-black/50 border border-purple-900/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option value="">All Types</option>
                    <option value="news" {{ request('entity_type') === 'news' ? 'selected' : '' }}>News</option>
                    <option value="project" {{ request('entity_type') === 'project' ? 'selected' : '' }}>Project</option>
                    <option value="gallery" {{ request('entity_type') === 'gallery' ? 'selected' : '' }}>Gallery</option>
                    <option value="user" {{ request('entity_type') === 'user' ? 'selected' : '' }}>User</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">From Date</label>
                <input type="date" name="from" value="{{ request('from') }}" class="w-full bg-black/50 border border-purple-900/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">To Date</label>
                <input type="date" name="to" value="{{ request('to') }}" class="w-full bg-black/50 border border-purple-900/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600">
            </div>

            <div class="md:col-span-2 lg:col-span-4 flex gap-3">
                <button type="submit" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                    Apply Filters
                </button>
                <a href="{{ route('admin.audit-logs') }}" class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
                    Clear Filters
                </a>
            </div>
        </form>
    </div>

    <!-- Audit Logs Table -->
    <div class="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-white">Audit Trail</h3>
            <div class="text-sm text-gray-400">
                Total: <span class="text-white font-semibold">{{ $logs->total() }}</span> entries
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-purple-900/30">
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">User</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Action</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Entity</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">IP Address</th>
                        <th class="text-left py-3 px-4 text-sm font-semibold text-gray-400">Time</th>
                        <th class="text-center py-3 px-4 text-sm font-semibold text-gray-400">Details</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($logs as $log)
                    <tr class="border-b border-purple-900/20 hover:bg-purple-600/5 transition-colors">
                        <td class="py-3 px-4">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                                    {{ $log->user ? substr($log->user->name, 0, 1) : '?' }}
                                </div>
                                <div>
                                    <p class="text-white text-sm font-medium">{{ $log->user->name ?? 'Unknown' }}</p>
                                    <p class="text-gray-400 text-xs">{{ $log->user->email ?? '-' }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-3 px-4">
                            @php
                                $actionColors = [
                                    'create' => 'bg-green-600/20 text-green-400',
                                    'update' => 'bg-blue-600/20 text-blue-400',
                                    'delete' => 'bg-red-600/20 text-red-400',
                                    'login' => 'bg-purple-600/20 text-purple-400',
                                    'logout' => 'bg-gray-600/20 text-gray-400',
                                ];
                                $colorClass = $actionColors[$log->action] ?? 'bg-gray-600/20 text-gray-400';
                            @endphp
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $colorClass }}">
                                {{ ucfirst($log->action) }}
                            </span>
                        </td>
                        <td class="py-3 px-4">
                            <div class="text-white text-sm">{{ ucfirst($log->entity_type) }}</div>
                            @if($log->entity_id)
                                <div class="text-gray-400 text-xs">ID: {{ $log->entity_id }}</div>
                            @endif
                        </td>
                        <td class="py-3 px-4 text-gray-300 font-mono text-sm">{{ $log->ip_address ?? '-' }}</td>
                        <td class="py-3 px-4">
                            <div class="text-white text-sm">{{ $log->created_at->format('M d, Y') }}</div>
                            <div class="text-gray-400 text-xs">{{ $log->created_at->format('H:i:s') }}</div>
                        </td>
                        <td class="py-3 px-4 text-center">
                            @if($log->changes || $log->user_agent)
                            <button onclick="showDetails({{ $log->id }})" class="text-purple-400 hover:text-purple-300 transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </button>
                            @else
                            <span class="text-gray-600">-</span>
                            @endif
                        </td>
                    </tr>

                    <!-- Details Row (Hidden by default) -->
                    <tr id="details-{{ $log->id }}" class="hidden border-b border-purple-900/20 bg-black/30">
                        <td colspan="6" class="py-4 px-6">
                            <div class="space-y-3">
                                @if($log->user_agent)
                                <div>
                                    <p class="text-sm font-medium text-gray-400 mb-1">User Agent:</p>
                                    <p class="text-sm text-white font-mono">{{ $log->user_agent }}</p>
                                </div>
                                @endif

                                @if($log->changes)
                                <div>
                                    <p class="text-sm font-medium text-gray-400 mb-2">Changes:</p>
                                    <pre class="text-xs text-white bg-black/50 rounded-lg p-3 overflow-x-auto">{{ json_encode(json_decode($log->changes), JSON_PRETTY_PRINT) }}</pre>
                                </div>
                                @endif
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="py-12 text-center">
                            <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p class="text-gray-400 text-lg">No audit logs found</p>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($logs->hasPages())
        <div class="mt-6 flex items-center justify-between">
            <div class="text-sm text-gray-400">
                Showing {{ $logs->firstItem() }} to {{ $logs->lastItem() }} of {{ $logs->total() }} entries
            </div>

            <div class="flex gap-2">
                @if($logs->onFirstPage())
                    <span class="px-3 py-2 rounded-lg bg-gray-800 text-gray-600 cursor-not-allowed">Previous</span>
                @else
                    <a href="{{ $logs->previousPageUrl() }}" class="px-3 py-2 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors">Previous</a>
                @endif

                @foreach(range(1, $logs->lastPage()) as $page)
                    @if($page == $logs->currentPage())
                        <span class="px-3 py-2 rounded-lg bg-purple-600 text-white">{{ $page }}</span>
                    @elseif($page == 1 || $page == $logs->lastPage() || abs($page - $logs->currentPage()) < 3)
                        <a href="{{ $logs->url($page) }}" class="px-3 py-2 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors">{{ $page }}</a>
                    @elseif(abs($page - $logs->currentPage()) == 3)
                        <span class="px-3 py-2 text-gray-600">...</span>
                    @endif
                @endforeach

                @if($logs->hasMorePages())
                    <a href="{{ $logs->nextPageUrl() }}" class="px-3 py-2 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors">Next</a>
                @else
                    <span class="px-3 py-2 rounded-lg bg-gray-800 text-gray-600 cursor-not-allowed">Next</span>
                @endif
            </div>
        </div>
        @endif
    </div>
</div>

<script>
function showDetails(logId) {
    const detailsRow = document.getElementById('details-' + logId);
    if (detailsRow) {
        detailsRow.classList.toggle('hidden');
    }
}
</script>
@endsection
