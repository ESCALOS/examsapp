<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\ClassroomController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Admin/Dashboard')->name('dashboard');

Route::get('/aulas/{year?}', [ClassroomController::class, 'index'])->name('classrooms');

Route::post('academic-year', [AcademicYearController::class, 'store'])->name('academic-year.store');
