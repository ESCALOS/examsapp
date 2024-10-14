<?php

namespace Database\Factories;

use App\Enums\GradeEnum;
use App\Models\AcademicYear;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Exam>
 */
class ExamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(),
            'academic_year_id' => AcademicYear::all()->random()->id,
            'grade' => fake()->randomElement(GradeEnum::values()),
            'teacher_id' => Teacher::all()->random()->id,
        ];
    }
}
