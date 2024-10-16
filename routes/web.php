<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard', [
//         'academicYears' => AcademicYear::all(),
//         'teachers' => Teacher::all(),
//         'students' => Student::all(),
//     ]);
// })->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/auth.php';
