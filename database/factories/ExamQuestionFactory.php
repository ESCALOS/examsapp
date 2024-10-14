<?php

namespace Database\Factories;

use App\Enums\AlternativeEnum;
use App\Models\Exam;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExamQuestion>
 */
class ExamQuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'exam_id' => Exam::all()->random()->id,
            'question_number' => fake()->numerify('##'),
            'correct_answer' => fake()->randomElement(AlternativeEnum::values()),
        ];
    }
}
