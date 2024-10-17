<?php

use App\Http\Controllers\ExamController;
use Illuminate\Support\Facades\Route;

Route::get('/{year?}', [ExamController::class, 'index'])->name('dashboard');
