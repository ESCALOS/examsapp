<?php

namespace App\Models;

use App\Enums\GradeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'academic_year_id',
        'grade',
    ];

    protected $casts = [
        'grade' => GradeEnum::class,
    ];

    // Relación con el modelo AcademicYear
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function questions()
    {
        return $this->hasMany(ExamQuestion::class);
    }

    public function answers()
    {
        return $this->hasMany(StudentExamAnswer::class);
    }
}
