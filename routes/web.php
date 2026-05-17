<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'pages.home')->name('home');

Route::redirect('/berita', '/');

Route::get('/berita/{slug}', function (string $slug) {
    return view('pages.detail', [
        'slug' => $slug,
    ]);
})->where('slug', '[A-Za-z0-9\-]+')->name('articles.show');

Route::get('/kategori/{slug?}', function (?string $slug = 'akademik') {
    abort_unless($slug === 'akademik', 404);

    return view('pages.kategori', [
        'slug' => $slug,
    ]);
})->name('categories.show');

Route::view('/redaksi', 'pages.tentang')->name('editorial');
Route::view('/tentang', 'pages.tentang')->name('about');
Route::view('/kontak', 'pages.tentang')->name('contact');
