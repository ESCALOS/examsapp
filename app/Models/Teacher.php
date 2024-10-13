<?php

namespace App\Models;

use App\Enums\GradeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'academic_year_id',
        'grade',
        'section_id',
        'name',
    ];

    protected $casts = [
        'grade' => GradeEnum::class,
    ];

    // Relación con el modelo User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con el modelo AcademicYear
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    // Relación con el modelo Section
    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}
