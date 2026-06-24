@extends('admin.layout')

@section('title', 'Project Details')

@section('header', 'Project Details')

@section('content')
<div class="max-w-5xl space-y-6">
    <!-- Back Button -->
    <div>
        <a href="{{ route('admin.projects.index') }}" class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Projects
        </a>
    </div>

    <!-- Project Header Card -->
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5">
        <div class="flex flex-col lg:flex-row gap-6">
            <!-- Project Image -->
            <div class="lg:w-1/3">
                @if($project->thumbnail)
                <div class="max-h-[400px] overflow-hidden rounded-lg border border-purple-900/30">
                    <img
                        src="{{ $project->thumbnail_url }}"
                        alt="{{ $project->title }}"
                        class="w-auto max-h-[400px] object-contain mx-auto rounded-xl"
                    >
                </div>
                @else
                <div class="w-full aspect-video bg-purple-600/20 rounded-lg flex items-center justify-center border border-purple-900/30">
                    <svg class="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
                @endif
            </div>

            <!-- Project Info -->
            <div class="lg:w-2/3 space-y-4">
                <div>
                    <div class="flex items-start justify-between gap-4 mb-2">
                        <h1 class="text-2xl font-bold text-white">{{ $project->title }}</h1>
                        @if($project->status === 'pending')
                        <span class="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm font-medium">Pending</span>
                        @elseif($project->status === 'accepted')
                        <span class="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-medium">Accepted</span>
                        @else
                        <span class="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm font-medium">Rejected</span>
                        @endif
                    </div>

                    @if($project->description)
                    <p class="text-gray-400">{{ $project->description }}</p>
                    @endif
                </div>

                <!-- Student Information -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-purple-900/20">
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Student Name</p>
                        <p class="text-white font-medium">{{ $project->creator_name }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">NIM</p>
                        <p class="text-white font-medium">{{ $project->creator_nim }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Submission Date</p>
                        <p class="text-white font-medium">{{ $project->created_at->format('d M Y, H:i') }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 mb-1">Category</p>
                        <p class="text-white font-medium">{{ ucfirst($project->category) }}</p>
                    </div>
                </div>

                <!-- Project URL -->
                @if($project->live_demo)
                <div class="pt-4 border-t border-purple-900/20">
                    <p class="text-sm text-gray-500 mb-2">Live Demo</p>
                    <a
                        href="{{ $project->live_demo }}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        {{ $project->live_demo }}
                    </a>
                </div>
                @endif
            </div>
        </div>
    </div>

    <!-- Actions Card (Only for Pending Projects) -->
    @if($project->status === 'pending')
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5">
        <h2 class="text-lg font-bold text-white mb-4">Review Actions</h2>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- Accept Button -->
            <form method="POST" action="{{ route('admin.projects.accept', $project->id) }}" onsubmit="return confirm('Accept this project submission? This will make it visible in the public gallery.');">
                @csrf
                <button
                    type="submit"
                    class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Accept Project
                </button>
            </form>

            <!-- Reject Button -->
            <form method="POST" action="{{ route('admin.projects.reject', $project->id) }}" onsubmit="return confirm('Reject this project submission? This action can be reversed later.');">
                @csrf
                <button
                    type="submit"
                    class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    Reject Project
                </button>
            </form>
        </div>
    </div>
    @endif

    <!-- Status History (If previously accepted or rejected) -->
    @if($project->status !== 'pending')
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5">
        <h2 class="text-lg font-bold text-white mb-4">Status Information</h2>

        <div class="space-y-3">
            <div class="flex items-start gap-3 p-4 rounded-lg {{ $project->status === 'accepted' ? 'bg-green-600/10 border border-green-600/20' : 'bg-red-600/10 border border-red-600/20' }}">
                <div class="p-2 {{ $project->status === 'accepted' ? 'bg-green-600/20' : 'bg-red-600/20' }} rounded-lg">
                    @if($project->status === 'accepted')
                    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    @else
                    <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    @endif
                </div>
                <div class="flex-1">
                    <p class="font-medium {{ $project->status === 'accepted' ? 'text-green-400' : 'text-red-400' }}">
                        Project {{ ucfirst($project->status) }}
                    </p>
                    <p class="text-sm {{ $project->status === 'accepted' ? 'text-green-400/80' : 'text-red-400/80' }} mt-1">
                        {{ $project->updated_at->format('d M Y, H:i') }}
                    </p>
                </div>
            </div>

            @if($project->status === 'accepted')
            <div class="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <p class="text-sm text-blue-400">
                    <strong>Note:</strong> This project is now visible in the public gallery.
                </p>
            </div>
            @endif
        </div>

        <!-- Change Status Actions -->
        <div class="mt-6 pt-6 border-t border-purple-900/20">
            <p class="text-sm text-gray-400 mb-3">Need to change the status?</p>
            <div class="flex gap-3">
                @if($project->status === 'accepted')
                <form method="POST" action="{{ route('admin.projects.reject', $project->id) }}" class="inline" onsubmit="return confirm('Change status to rejected?');">
                    @csrf
                    <button type="submit" class="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-medium rounded-lg transition-all">
                        Change to Rejected
                    </button>
                </form>
                @else
                <form method="POST" action="{{ route('admin.projects.accept', $project->id) }}" class="inline" onsubmit="return confirm('Change status to accepted?');">
                    @csrf
                    <button type="submit" class="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 font-medium rounded-lg transition-all">
                        Change to Accepted
                    </button>
                </form>
                @endif
            </div>
        </div>
    </div>
    @endif

    <!-- Additional Information -->
    <div class="bg-[#050505] border border-purple-900/20 rounded-xl p-6 shadow-lg shadow-purple-500/5">
        <h2 class="text-lg font-bold text-white mb-4">Submission Details</h2>

        <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-purple-600/5 rounded-lg">
                <span class="text-gray-400">Submission ID</span>
                <span class="text-white font-mono">{{ $project->id }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-purple-600/5 rounded-lg">
                <span class="text-gray-400">Created At</span>
                <span class="text-white">{{ $project->created_at->format('d M Y, H:i:s') }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-purple-600/5 rounded-lg">
                <span class="text-gray-400">Last Updated</span>
                <span class="text-white">{{ $project->updated_at->format('d M Y, H:i:s') }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-purple-600/5 rounded-lg">
                <span class="text-gray-400">Time Since Submission</span>
                <span class="text-white">{{ $project->created_at->diffForHumans() }}</span>
            </div>
        </div>
    </div>
</div>
@endsection
