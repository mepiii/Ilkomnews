<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('pages.home');
});

Route::get('/berita', function () {
    return view('pages.berita');
});

Route::get('/kategori', function () {
    return view('pages.kategori');
});

Route::get('/tentang', function () {
    return view('pages.tentang');
});

Route::get('/kontak', function () {
    return view('pages.kontak');
});