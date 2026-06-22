@extends('admin.layout')

@section('title', 'Dashboard')

@section('header', 'Dashboard')

@section('content')
<div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-purple-600/20 to-purple-900/20 border border-purple-600/30 rounded-xl p-6 shadow-lg shadow-purple-500/10">
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-2xl font-bold text-white">Welcome back, {{ Auth::user()->name }}!</h3>
                <p class="mt-1 text-gray-400">Here's what's happening with your site today.</p>
            </div>
            <div class="hidden sm:block">
                <div class="flex items-center gap-2 px-4 py-2 bg-purple-600/20 rounded-lg">
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-sm text-gray-300">{{ now()->format('d M Y') }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Statistics Grid -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total News -->
        <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-all">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-400">Total Berita</p>
                    <p class="mt-2 text-3xl font-bold text-white">{{ $stats['total_news'] }}</p>
                </div>
                <div class="p-3 bg-blue-600/20 rounded-lg">
                    <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                    </svg>
                </div>
            </div>
            <div class="mt-4 flex items-center gap-2 text-sm">
                <span class="text-green-400">{{ $stats['published_news'] }} published</span>
                <span class="text-gray-600">•</span>
                <span class="text-gray-400">{{ $stats['draft_news'] }} drafts</span>
            </div>
        </div>

        <!-- Total Views -->
        <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-all">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-400">Total Views</p>
                    <p class="mt-2 text-3xl font-bold text-white">{{ number_format($stats['total_views']) }}</p>
                </div>
                <div class="p-3 bg-green-600/20 rounded-lg">
                    <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                </div>
            </div>
            <div class="mt-4 text-sm text-gray-400">
                Across all published news
            </div>
        </div>

        <!-- Total Projects -->
        <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-all">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-400">Total Proyek</p>
                    <p class="mt-2 text-3xl font-bold text-white">{{ $stats['total_projects'] }}</p>
                </div>
                <div class="p-3 bg-purple-600/20 rounded-lg">
                    <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
            </div>
            <div class="mt-4 flex items-center gap-2 text-sm">
                <span class="text-green-400">{{ $stats['accepted_projects'] }} accepted</span>
                <span class="text-gray-600">•</span>
                <span class="text-red-400">{{ $stats['rejected_projects'] }} rejected</span>
            </div>
        </div>

        <!-- Pending Projects -->
        <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-all">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-400">Pending Review</p>
                    <p class="mt-2 text-3xl font-bold text-white">{{ $stats['pending_projects'] }}</p>
                </div>
                <div class="p-3 bg-yellow-600/20 rounded-lg">
                    <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
            </div>
            <div class="mt-4">
                <a href="{{ route('admin.projects.index') }}" class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    Review pending projects →
                </a>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5">
        <h3 class="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a href="{{ route('admin.news.create') }}" class="flex items-center gap-3 p-4 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-600/20 rounded-lg transition-all group">
                <div class="p-2 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition-all">
                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                </div>
                <div>
                    <p class="font-medium text-white">Create News</p>
                    <p class="text-sm text-gray-400">Publish new article</p>
                </div>
            </a>

            <a href="{{ route('admin.news.index') }}" class="flex items-center gap-3 p-4 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/20 rounded-lg transition-all group">
                <div class="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-all">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </div>
                <div>
                    <p class="font-medium text-white">Manage News</p>
                    <p class="text-sm text-gray-400">Edit or delete articles</p>
                </div>
            </a>

            <a href="{{ route('admin.projects.index') }}" class="flex items-center gap-3 p-4 bg-green-600/10 hover:bg-green-600/20 border border-green-600/20 rounded-lg transition-all group">
                <div class="p-2 bg-green-600/20 rounded-lg group-hover:bg-green-600/30 transition-all">
                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div>
                    <p class="font-medium text-white">Review Projects</p>
                    <p class="text-sm text-gray-400">Accept or reject submissions</p>
                </div>
            </a>
        </div>
    </div>

    <!-- Recent Activity Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Recent News -->
        <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-white">Recent News</h3>
                <a href="{{ route('admin.news.index') }}" class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    View all →
                </a>
            </div>

            @if($recent_news->isEmpty())
            <div class="text-center py-8 text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                </svg>
                <p>No news articles yet</p>
            </div>
            @else
            <div class="space-y-4">
                @foreach($recent_news as $news)
                <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-600/5 transition-all">
                    @if($news->image)
                    <img src="{{ Storage::url($news->image) }}" alt="{{ $news->title }}" class="w-16 h-16 object-cover rounded-lg flex-shrink-0">
                    @else
                    <div class="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                        </svg>
                    </div>
                    @endif
                    <div class="flex-1 min-w-0">
                        <a href="{{ route('admin.news.edit', $news->id) }}" class="font-medium text-white hover:text-purple-400 transition-colors line-clamp-2">
                            {{ $news->title }}
                        </a>
                        <div class="flex items-center gap-2 mt-1 text-sm text-gray-400">
                            <span>{{ $news->date->format('d M Y') }}</span>
                            <span>•</span>
                            <span class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                                {{ $news->views }}
                            </span>
                            @if($news->published)
                            <span class="px-2 py-0.5 bg-green-600/20 text-green-400 rounded text-xs">Published</span>
                            @else
                            <span class="px-2 py-0.5 bg-gray-600/20 text-gray-400 rounded text-xs">Draft</span>
                            @endif
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
            @endif
        </div>

        <!-- Recent Projects -->
        <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-white">Recent Projects</h3>
                <a href="{{ route('admin.projects.index') }}" class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    View all →
                </a>
            </div>

            @if($recent_projects->isEmpty())
            <div class="text-center py-8 text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p>No project submissions yet</p>
            </div>
            @else
            <div class="space-y-4">
                @foreach($recent_projects as $project)
                <div class="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-600/5 transition-all">
                    @if($project->image_url)
                    <img src="{{ Storage::url($project->image_url) }}" alt="{{ $project->project_name }}" class="w-16 h-16 object-cover rounded-lg flex-shrink-0">
                    @else
                    <div class="w-16 h-16 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                    </div>
                    @endif
                    <div class="flex-1 min-w-0">
                        <a href="{{ route('admin.projects.show', $project->id) }}" class="font-medium text-white hover:text-purple-400 transition-colors line-clamp-2">
                            {{ $project->project_name }}
                        </a>
                        <div class="flex items-center gap-2 mt-1 text-sm text-gray-400">
                            <span>{{ $project->student_name }}</span>
                            <span>•</span>
                            <span>{{ $project->created_at->diffForHumans() }}</span>
                            @if($project->status === 'pending')
                            <span class="px-2 py-0.5 bg-yellow-600/20 text-yellow-400 rounded text-xs">Pending</span>
                            @elseif($project->status === 'accepted')
                            <span class="px-2 py-0.5 bg-green-600/20 text-green-400 rounded text-xs">Accepted</span>
                            @else
                            <span class="px-2 py-0.5 bg-red-600/20 text-red-400 rounded text-xs">Rejected</span>
                            @endif
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
            @endif
        </div>
    </div>
</div>
@endsection
