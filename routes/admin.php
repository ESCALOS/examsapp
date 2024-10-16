<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\ClassroomController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Admin/Dashboard')->name('dashboard');

Route::get('/aulas/{year?}', [ClassroomController::class, 'index'])->name('classrooms');

Route::post('/aulas/agregar-seccion', [ClassroomController::class, 'addSection'])->name('classrooms.add-section');
Route::post('/aulas/actualizar-seccion', [ClassroomController::class, 'updateSection'])->name('classrooms.update-section');
Route::delete('/aulas/eliminar-seccion', [ClassroomController::class, 'deleteSection'])->name('classrooms.delete-section');

Route::post('academic-year', [AcademicYearController::class, 'store'])->name('academic-year.store');
