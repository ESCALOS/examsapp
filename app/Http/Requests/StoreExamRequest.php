<?php

namespace App\Http\Requests;

use App\Enums\AlternativeEnum;
use App\Enums\GradeEnum;
use App\Enums\RoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreExamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->role === RoleEnum::ADMIN;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'academicYearId' => ['required', 'integer', 'exists:academic_years,id'],
            'grade' => ['required', Rule::enum(GradeEnum::class)],
            // Validar que el campo questions sea un array y que tenga al menos 2 preguntas
            'questions' => ['required', 'array', 'min:2'],

            // Validar cada pregunta dentro del array de questions
            'questions.*.id' => ['required', 'integer'],
            'questions.*.correctAnswer' => ['required', Rule::enum(AlternativeEnum::class)], // Validación con Rule::enum
        ];
    }
}
