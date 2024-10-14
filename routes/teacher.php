<?php

use App\Models\AcademicYear;
use App\Models\Teacher;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Teacher/Dashboard', [
        'academicYears' => AcademicYear::all(),
        'teachers' => Teacher::find(Auth::user()->id),
    ]);
})->name('dashboard');
