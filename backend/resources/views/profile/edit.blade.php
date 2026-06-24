@extends('admin.layout')

@section('header', 'Profil')

@section('content')
    <div class="max-w-7xl mx-auto space-y-6">
        <div class="p-4 sm:p-8 bg-[#0a0a0a] border border-purple-900/20 shadow-lg shadow-purple-500/5 rounded-lg">
            <div class="max-w-xl">
                @include('profile.partials.update-profile-information-form')
            </div>
        </div>

        <div class="p-4 sm:p-8 bg-[#0a0a0a] border border-purple-900/20 shadow-lg shadow-purple-500/5 rounded-lg">
            <div class="max-w-xl">
                @include('profile.partials.update-password-form')
            </div>
        </div>

        <div class="p-4 sm:p-8 bg-[#0a0a0a] border border-purple-900/20 shadow-lg shadow-purple-500/5 rounded-lg">
            <div class="max-w-xl">
                @include('profile.partials.delete-user-form')
            </div>
        </div>
    </div>
@endsection
