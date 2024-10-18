<?php

namespace App\Models;

use App\Enums\StudentStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'dni',
        'name',
        'teacher_id',
        'status',
    ];

    protected $casts = [
        'status' => StudentStatusEnum::class,
    ];

    public function answer()
    {
        return $this->hasMany(StudentExamAnswer::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
