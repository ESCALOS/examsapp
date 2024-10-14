<?php

namespace Database\Factories;

use App\Enums\GradeEnum;
use App\Enums\SectionEnum;
use App\Models\AcademicYear;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::all()->random()->id,
            'academic_year_id' => AcademicYear::all()->random()->id,
            'grade' => fake()->randomElement(GradeEnum::values()),
            'section' => fake()->randomElement(SectionEnum::values()),
        ];
    }
}
