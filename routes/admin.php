<?php

use App\Http\Controllers\AcademicYearController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Admin/Dashboard')->name('dashboard');

Route::inertia('/aulas', 'Admin/Classrooms')->name('classrooms');

Route::post('academic-year', [AcademicYearController::class, 'store'])->name('academic-year.store');
