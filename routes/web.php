<?php

use Illuminate\Support\Facades\Route;

// Página principal del sistema - Landing Page
Route::get('/', function () {
    return view('landing');
});

// Página de inicio
Route::get('/home', function () {
    return view('welcome');
});

// Login
Route::get('/login', function () {
    return view('welcome');
});

// Register
Route::get('/register', function () {
    return view('register');
});

// SPA Routes - All routes return the main view for React Router
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!api|_vite|storage|favicon\.ico).*');