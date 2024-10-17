<?php

use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamReviewController;
use Illuminate\Support\Facades\Route;

Route::get('/{year?}', [ExamController::class, 'index'])->name('dashboard');

Route::post('/exams/review', [ExamReviewController::class, 'store'])->name('exams.review');
