<?php

namespace Database\Factories;

use App\Enums\GradeEnum;
use App\Enums\SectionEnum;
use App\Enums\StudentStatusEnum;
use App\Models\AcademicYear;
use App\Models\StudentInfo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_info_id' => StudentInfo::all()->random()->id,
            'academic_year_id' => AcademicYear::all()->random()->id,
            'grade' => fake()->randomElement(GradeEnum::values()),
            'section' => fake()->randomElement(SectionEnum::values()),
            'status' => fake()->randomElement(StudentStatusEnum::values()),
        ];
    }
}
