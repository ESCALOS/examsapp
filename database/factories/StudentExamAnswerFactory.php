<?php

namespace Database\Factories;

use App\Enums\AlternativeEnum;
use App\Models\Exam;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentExamAnswer>
 */
class StudentExamAnswerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => Student::all()->random()->id,
            'exam_id' => Exam::all()->random()->id,
            'question_number' => fake()->numerify('##'),
            'answer' => fake()->randomElement(AlternativeEnum::values()),
        ];
    }
}
