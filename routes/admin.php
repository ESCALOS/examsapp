<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ExamController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Admin/Dashboard')->name('dashboard');

Route::get('/aulas/{year?}', [ClassroomController::class, 'index'])->name('classrooms');

Route::post('/aulas/agregar-seccion', [ClassroomController::class, 'addSection'])->name('classrooms.add-section');
Route::post('/aulas/actualizar-seccion', [ClassroomController::class, 'updateSection'])->name('classrooms.update-section');
Route::delete('/aulas/eliminar-seccion', [ClassroomController::class, 'deleteSection'])->name('classrooms.delete-section');
Route::post('/aulas/importar-estudiantes', [ClassroomController::class, 'importStudents'])->name('classrooms.import-students');

Route::get('/examenes/{year?}', [ExamController::class, 'index'])->name('exams');
Route::post('/exams/agregar-examen', [ExamController::class, 'store'])->name('exam.add-exam');
Route::post('/exams/actualizar-examen', [ExamController::class, 'update'])->name('exam.update-exam');
Route::delete('/exams/eliminar-examen', [ExamController::class, 'destroy'])->name('exam.delete-exam');

Route::post('academic-year', [AcademicYearController::class, 'store'])->name('academic-year.store');
