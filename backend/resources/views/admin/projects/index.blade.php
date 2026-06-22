@extends('admin.layout')

@section('title', 'Manage Projects')

@section('header', 'Galeri Proyek')

@section('content')
<div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <p class="text-gray-400">Review and manage student project submissions</p>
        </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5">
        <form method="GET" action="{{ route('admin.projects.index') }}" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <!-- Search -->
                <div class="md:col-span-2">
                    <label for="search" class="block text-sm font-medium text-gray-300 mb-2">Search</label>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value="{{ request('search') }}"
                        placeholder="Search by project name, student name, or NPM..."
                        class="w-full px-4 py-2 bg-black border border-purple-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                </div>

                <!-- Status Filter -->
                <div>
                    <label for="status" class="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                        name="status"
                        id="status"
                        class="w-full px-4 py-2 bg-black border border-purple-900/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    >
                        <option value="">All Status</option>
                        <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pending</option>
                        <option value="accepted" {{ request('status') === 'accepted' ? 'selected' : '' }}>Accepted</option>
                        <option value="rejected" {{ request('status') === 'rejected' ? 'selected' : '' }}>Rejected</option>
                    </select>
                </div>
            </div>

            <div class="flex gap-2">
                <button type="submit" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all">
                    Apply Filters
                </button>
                <a href="{{ route('admin.projects.index') }}" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all">
                    Clear
                </a>
            </div>
        </form>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div class="bg-[#050505] border border-purple-900/20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Total Projects</p>
            <p class="mt-1 text-2xl font-bold text-white">{{ $total_projects }}</p>
        </div>
        <div class="bg-[#050505] border border-yellow-600/20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Pending Review</p>
            <p class="mt-1 text-2xl font-bold text-yellow-400">{{ $pending_count }}</p>
        </div>
        <div class="bg-[#050505] border border-green-600/20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Accepted</p>
            <p class="mt-1 text-2xl font-bold text-green-400">{{ $accepted_count }}</p>
        </div>
        <div class="bg-[#050505] border border-red-600/20 rounded-lg p-4">
            <p class="text-sm text-gray-400">Rejected</p>
            <p class="mt-1 text-2xl font-bold text-red-400">{{ $rejected_count }}</p>
        </div>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        @forelse($projects as $project)
        <div class="bg-[#050505] border border-purple-900/20 rounded-xl overflow-hidden shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-all group">
            <!-- Project Image -->
            <div class="relative aspect-video bg-purple-600/20 overflow-hidden">
                @if($project->thumbnail)
                <img
                    src="{{ Storage::url($project->thumbnail) }}"
                    alt="{{ $project->title }}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                >
                @else
                <div class="w-full h-full flex items-center justify-center">
                    <svg class="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
                @endif

                <!-- Status Badge -->
                <div class="absolute top-3 right-3">
                    @if($project->status === 'pending')
                    <span class="px-3 py-1 bg-yellow-600/90 backdrop-blur-sm text-yellow-100 rounded-full text-xs font-medium">
                        Pending
                    </span>
                    @elseif($project->status === 'accepted')
                    <span class="px-3 py-1 bg-green-600/90 backdrop-blur-sm text-green-100 rounded-full text-xs font-medium">
                        Accepted
                    </span>
                    @else
                    <span class="px-3 py-1 bg-red-600/90 backdrop-blur-sm text-red-100 rounded-full text-xs font-medium">
                        Rejected
                    </span>
                    @endif
                </div>
            </div>

            <!-- Project Info -->
            <div class="p-5">
                <h3 class="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {{ $project->title }}
                </h3>

                <div class="space-y-2 mb-4">
                    <div class="flex items-center gap-2 text-sm text-gray-400">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span class="truncate">{{ $project->creator_name }}</span>
                    </div>

                    <div class="flex items-center gap-2 text-sm text-gray-400">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                        </svg>
                        <span>{{ $project->creator_nim }}</span>
                    </div>

                    <div class="flex items-center gap-2 text-sm text-gray-400">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>{{ $project->created_at->format('d M Y') }}</span>
                    </div>
                </div>

                @if($project->description)
                <p class="text-sm text-gray-400 mb-4 line-clamp-3">
                    {{ $project->description }}
                </p>
                @endif

                <!-- Actions -->
                <div class="flex gap-2 pt-4 border-t border-purple-900/20">
                    <a
                        href="{{ route('admin.projects.show', $project->id) }}"
                        class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 font-medium rounded-lg transition-all"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        View Details
                    </a>

                    @if($project->status === 'pending')
                    <div class="flex gap-2">
                        <form method="POST" action="{{ route('admin.projects.accept', $project->id) }}" class="inline">
                            @csrf
                            <button
                                type="submit"
                                class="p-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 rounded-lg transition-all"
                                title="Accept"
                                onclick="return confirm('Accept this project submission?')"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                            </button>
                        </form>

                        <form method="POST" action="{{ route('admin.projects.reject', $project->id) }}" class="inline">
                            @csrf
                            <button
                                type="submit"
                                class="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-all"
                                title="Reject"
                                onclick="return confirm('Reject this project submission?')"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </form>
                    </div>
                    @endif
                </div>
            </div>
        </div>
        @empty
        <div class="col-span-full">
            <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-12 text-center">
                <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-400 mb-2">No project submissions found</h3>
                <p class="text-gray-500">
                    @if(request('search') || request('status'))
                        Try adjusting your filters
                    @else
                        Projects submitted by students will appear here
                    @endif
                </p>
            </div>
        </div>
        @endforelse
    </div>

    <!-- Pagination -->
    @if($projects->hasPages())
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6">
        {{ $projects->links() }}
    </div>
    @endif
</div>
@endsection
