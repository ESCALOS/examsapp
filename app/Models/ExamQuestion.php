<?php

namespace App\Models;

use App\Enums\AlternativeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'question_number',
        'correct_answer',
    ];

    protected $casts = [
        'correct_answer' => AlternativeEnum::class,
    ];

    // Relación con el modelo Exam
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }
}
