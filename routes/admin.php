<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Admin/Dashboard')->name('dashboard');

Route::prefix('aulas')->name('classrooms.')->controller(ClassroomController::class)->group(function () {

    Route::get('/{year?}', [ClassroomController::class, 'index'])->name('index');
    Route::post('/agregar-seccion', 'addSection')->name('add-section');
    Route::post('/actualizar-seccion', 'updateSection')->name('update-section');
    Route::delete('/eliminar-seccion', 'deleteSection')->name('delete-section');
    Route::post('/importar-estudiantes', 'importStudents')->name('import-students');
});

// Agrupamos las rutas relacionadas con 'examenes' bajo el prefijo 'examenes' y añadimos un prefijo al nombre de las rutas
Route::prefix('examenes')->name('exams.')->controller(ExamController::class)->group(function () {
    Route::get('/{year?}', 'index')->name('index');
    Route::post('/agregar-examen', 'store')->name('add-exam');
    Route::post('/actualizar-examen', 'update')->name('update-exam');
    Route::delete('/eliminar-examen', 'destroy')->name('delete-exam');
});

Route::prefix('docentes')->name('teachers.')->controller(TeacherController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/agregar-docente', 'store')->name('add-teacher');
    Route::post('/actualizar-docente', 'update')->name('update-teacher');
    Route::delete('/cambiar-estado', 'destroy')->name('toggle-status');
});

Route::post('academic-year', [AcademicYearController::class, 'store'])->name('academic-year.store');
