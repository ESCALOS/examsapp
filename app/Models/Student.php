<?php

namespace App\Models;

use App\Enums\GradeEnum;
use App\Enums\SectionEnum;
use App\Enums\StudentStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'dni',
        'name',
        'academic_year_id',
        'grade',
        'section',
        'status',
    ];

    protected $casts = [
        'grade' => GradeEnum::class,
        'section' => SectionEnum::class,
        'status' => StudentStatusEnum::class,
    ];

    // Relación con el modelo AcademicYear
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function answer()
    {
        return $this->hasMany(StudentExamAnswer::class);
    }
}
