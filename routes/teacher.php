<?php

use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamReviewController;
use App\Http\Controllers\StudentExamAnswerController;
use Illuminate\Support\Facades\Route;

Route::get('/{year?}', [ExamController::class, 'index'])->name('dashboard');

Route::post('/examenes/revisar-examen', [ExamReviewController::class, 'store'])->name('exams.review');

Route::get('/examenes/mostrar-estudiantes-evaluados-por-examen/{examId}/{academicYearId}', [ExamController::class, 'getEvaluatedStudentsByExam'])->name('exams.show-evaluated-students-by-exam');

Route::get('/examenes/respuestas-por-estudiante/{examId}/{studentId}', [StudentExamAnswerController::class, 'showAnswersByStudent'])->name('exams.show-answers-by-student');

Route::get('/examenes/obtener-ranking-por-examen-y-seccion/{examId}', [StudentExamAnswerController::class, 'getRankingByExamAndSection'])->name('exams.get-ranking-by-exam-and-section');
