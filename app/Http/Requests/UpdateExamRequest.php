<?php

namespace App\Http\Requests;

use App\Enums\AlternativeEnum;
use App\Enums\GradeEnum;
use App\Enums\RoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateExamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->role === RoleEnum::ADMIN;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'academicYearId' => ['required', 'integer', 'exists:academic_years,id'],
            'grade' => ['required', Rule::enum(GradeEnum::class)],
            'questions' => ['required', 'array', 'min:2'],
            'questions.*.id' => ['required', 'integer'],
            'questions.*.correctAnswer' => ['required', Rule::enum(AlternativeEnum::class)],
        ];
    }
}
