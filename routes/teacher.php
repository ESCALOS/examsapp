<?php

use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamReviewController;
use App\Http\Controllers\StudentExamAnswerController;
use Illuminate\Support\Facades\Route;

Route::get('/{year?}', [ExamController::class, 'index'])->name('dashboard');

Route::post('/exams/review', [ExamReviewController::class, 'store'])->name('exams.review');

Route::get('/answers-by-student', [StudentExamAnswerController::class, 'showByStudent'])->name('answers-by-student');
